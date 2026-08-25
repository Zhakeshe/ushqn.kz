-- P0 trust and security hardening.
-- Achievements no longer award points before a staff review.

alter table public.achievements
  add column if not exists verification_status text not null default 'pending',
  add column if not exists verified_by uuid references public.profiles(id) on delete set null,
  add column if not exists verified_at timestamptz,
  add column if not exists rejection_reason text,
  add column if not exists file_bucket text;

-- Files created before this migration live in the legacy public bucket.
update public.achievements set file_bucket = 'uploads' where file_path is not null and file_bucket is null;
update public.achievements set file_bucket = 'evidence' where file_bucket is null;
alter table public.achievements alter column file_bucket set default 'evidence';
alter table public.achievements alter column file_bucket set not null;
alter table public.achievements drop constraint if exists achievements_file_bucket_check;
alter table public.achievements add constraint achievements_file_bucket_check
  check (file_bucket in ('uploads', 'evidence'));

alter table public.achievements
  drop constraint if exists achievements_verification_status_check;
alter table public.achievements
  add constraint achievements_verification_status_check
  check (verification_status in ('pending', 'verified', 'rejected'));

create index if not exists achievements_verification_queue_idx
  on public.achievements (verification_status, created_at desc);

-- Existing rows were never reviewed, so remove their automatically awarded points.
update public.user_category_scores scores
set points = greatest(0, scores.points - totals.points)
from (
  select user_id, category_id, sum(points_awarded)::integer as points
  from public.achievements
  group by user_id, category_id
) totals
where scores.user_id = totals.user_id
  and scores.category_id = totals.category_id;

update public.achievements
set points_awarded = 0,
    verification_status = 'pending',
    verified_by = null,
    verified_at = null,
    rejection_reason = null;

drop trigger if exists achievement_after_insert_trigger on public.achievements;

create or replace function public.achievement_set_points()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.points_awarded = 0;
  new.verification_status = 'pending';
  new.verified_by = null;
  new.verified_at = null;
  new.rejection_reason = null;
  return new;
end;
$$;

create or replace function public.protect_achievement_review_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.current_is_staff() then
    return new;
  end if;

  if new.points_awarded is distinct from old.points_awarded
     or new.verification_status is distinct from old.verification_status
     or new.verified_by is distinct from old.verified_by
     or new.verified_at is distinct from old.verified_at
     or new.rejection_reason is distinct from old.rejection_reason then
    raise exception 'Achievement review fields can only be changed by staff';
  end if;

  -- Editing evidence invalidates a previous review.
  if old.verification_status = 'verified'
     and (new.title is distinct from old.title
       or new.description is distinct from old.description
       or new.category_id is distinct from old.category_id
       or new.file_path is distinct from old.file_path
       or new.file_bucket is distinct from old.file_bucket) then
    update public.user_category_scores
    set points = greatest(0, points - old.points_awarded)
    where user_id = old.user_id and category_id = old.category_id;
    new.points_awarded = 0;
    new.verification_status = 'pending';
    new.verified_by = null;
    new.verified_at = null;
    new.rejection_reason = null;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_achievement_review_fields_trigger on public.achievements;
create trigger protect_achievement_review_fields_trigger
  before update on public.achievements
  for each row execute function public.protect_achievement_review_fields();

create or replace function public.review_achievement(
  p_achievement_id uuid,
  p_status text,
  p_points integer default null,
  p_reason text default null
)
returns public.achievements
language plpgsql
security definer
set search_path = public
as $$
declare
  achievement_row public.achievements;
  awarded_points integer;
begin
  if auth.uid() is null or not public.current_is_staff() then
    raise exception 'Staff access required';
  end if;
  if p_status not in ('verified', 'rejected') then
    raise exception 'Invalid review status';
  end if;

  select * into achievement_row
  from public.achievements
  where id = p_achievement_id
  for update;
  if not found then
    raise exception 'Achievement not found';
  end if;

  if achievement_row.verification_status = 'verified' and achievement_row.points_awarded > 0 then
    update public.user_category_scores
    set points = greatest(0, points - achievement_row.points_awarded)
    where user_id = achievement_row.user_id
      and category_id = achievement_row.category_id;
  end if;

  if p_status = 'verified' then
    awarded_points := coalesce(
      p_points,
      (select default_points from public.achievement_categories where id = achievement_row.category_id),
      0
    );
    if awarded_points < 0 or awarded_points > 10000 then
      raise exception 'Points must be between 0 and 10000';
    end if;

    insert into public.user_category_scores (user_id, category_id, points)
    values (achievement_row.user_id, achievement_row.category_id, awarded_points)
    on conflict (user_id, category_id)
    do update set points = public.user_category_scores.points + excluded.points;

    update public.achievements
    set verification_status = 'verified', points_awarded = awarded_points,
        verified_by = auth.uid(), verified_at = now(), rejection_reason = null
    where id = p_achievement_id
    returning * into achievement_row;
  else
    update public.achievements
    set verification_status = 'rejected', points_awarded = 0,
        verified_by = auth.uid(), verified_at = now(),
        rejection_reason = nullif(trim(coalesce(p_reason, '')), '')
    where id = p_achievement_id
    returning * into achievement_row;
  end if;

  insert into public.notifications (user_id, actor_id, kind, title, body, link)
  values (
    achievement_row.user_id,
    auth.uid(),
    'achievement_review',
    case when p_status = 'verified' then 'Жетістік расталды' else 'Жетістік қабылданбады' end,
    case when p_status = 'verified'
      then format('%s XP берілді: %s', achievement_row.points_awarded, achievement_row.title)
      else coalesce(achievement_row.rejection_reason, achievement_row.title)
    end,
    '/achievements'
  );

  insert into public.audit_log (actor_id, action, entity_type, entity_id, metadata)
  values (
    auth.uid(), 'achievements.reviewed', 'achievement', achievement_row.id,
    jsonb_build_object('status', p_status, 'points', achievement_row.points_awarded)
  );
  return achievement_row;
end;
$$;

revoke all on function public.review_achievement(uuid, text, integer, text) from public, anon;
grant execute on function public.review_achievement(uuid, text, integer, text) to authenticated;

-- Clients may read/update/delete their notifications, but may not forge new ones.
drop policy if exists "system can insert notifications" on public.notifications;
revoke insert on table public.notifications from anon, authenticated;

-- Respect profile visibility instead of exposing every profile and achievement
-- to every signed-in account.
drop policy if exists profiles_select_authenticated on public.profiles;
create policy profiles_select_visible on public.profiles
  for select to authenticated using (
    id = auth.uid()
    or public.current_is_staff()
    or coalesce(
      (select settings.profile_public from public.user_settings settings where settings.user_id = profiles.id),
      true
    )
  );

drop policy if exists achievements_select on public.achievements;
create policy achievements_select_visible on public.achievements
  for select to authenticated using (
    user_id = auth.uid()
    or public.current_is_staff()
    or coalesce(
      (select settings.profile_public from public.user_settings settings where settings.user_id = achievements.user_id),
      true
    )
  );

-- A legacy all-command policy let applicants update their own status to
-- "accepted". Keep applicant insert/read and employer/admin update separated.
drop policy if exists "own applications" on public.job_applications;
drop policy if exists "job owners see applications" on public.job_applications;

create or replace function public.protect_job_application_ownership()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    if new.applicant_id is distinct from auth.uid() or new.status::text <> 'submitted' then
      raise exception 'Applications must be submitted by the applicant';
    end if;
    return new;
  end if;
  if new.job_id is distinct from old.job_id
     or new.applicant_id is distinct from old.applicant_id then
    raise exception 'Application ownership fields are immutable';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_job_application_ownership_trigger on public.job_applications;
create trigger protect_job_application_ownership_trigger
  before insert or update on public.job_applications
  for each row execute function public.protect_job_application_ownership();

-- Storage server-side limits complement client validation and owner-folder RLS.
update storage.buckets
set file_size_limit = 10485760,
    allowed_mime_types = array[
      'image/jpeg', 'image/png', 'image/webp', 'image/gif',
      'application/pdf', 'text/plain'
    ]
where id = 'uploads';

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'evidence', 'evidence', false, 10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf', 'text/plain']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists evidence_select_owner_or_staff on storage.objects;
create policy evidence_select_owner_or_staff on storage.objects
  for select to authenticated using (
    bucket_id = 'evidence'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.current_is_staff())
  );

drop policy if exists evidence_insert_owner on storage.objects;
create policy evidence_insert_owner on storage.objects
  for insert to authenticated with check (
    bucket_id = 'evidence' and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists evidence_update_owner on storage.objects;
create policy evidence_update_owner on storage.objects
  for update to authenticated using (
    bucket_id = 'evidence' and (storage.foldername(name))[1] = auth.uid()::text
  ) with check (
    bucket_id = 'evidence' and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists evidence_delete_owner on storage.objects;
create policy evidence_delete_owner on storage.objects
  for delete to authenticated using (
    bucket_id = 'evidence' and (storage.foldername(name))[1] = auth.uid()::text
  );

-- SECURITY DEFINER helpers are not callable unless explicitly granted.
revoke execute on function public.achievement_set_points() from public, anon, authenticated;
revoke execute on function public.protect_achievement_review_fields() from public, anon, authenticated;
revoke execute on function public.protect_job_application_ownership() from public, anon, authenticated;

-- PostgreSQL grants EXECUTE on new functions to PUBLIC by default. Remove that
-- implicit anonymous access from client-facing RPCs; their authenticated grants
-- from earlier migrations remain in force.
revoke execute on function public.get_or_create_dm(uuid) from public, anon;
revoke execute on function public.create_group_conversation(text, uuid[]) from public, anon;
revoke execute on function public.get_or_create_community_chat(uuid) from public, anon;
revoke execute on function public.my_chat_sidebar() from public, anon;
revoke execute on function public.get_conversation_members(uuid) from public, anon;
revoke execute on function public.claim_onboarding_bonus() from public, anon;
revoke execute on function public.touch_activity_streak() from public, anon;
revoke execute on function public.leaderboard_totals(text, text, uuid) from public, anon;
revoke execute on function public.create_student_invite(text) from public, anon;
revoke execute on function public.accept_student_invite(text) from public, anon;
revoke execute on function public.join_teacher_group(text) from public, anon;
revoke execute on function public.switch_student_teacher(uuid, uuid) from public, anon;
revoke execute on function public.regenerate_teacher_group_join_code(uuid) from public, anon;
revoke execute on function public.leave_teacher_group(uuid) from public, anon;
revoke execute on function public.remove_teacher_group_member(uuid, uuid) from public, anon;
revoke execute on function public.create_public_channel(text, text, uuid[]) from public, anon;
revoke execute on function public.join_public_channel(text) from public, anon;
revoke execute on function public.rename_group_conversation(uuid, text) from public, anon;
