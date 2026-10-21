-- Test-based olympiad MVP. Answers are never readable through the client tables.
create table public.olympiads (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid not null references public.profiles(id),
  title text not null check (length(trim(title)) between 3 and 160),
  subject text not null check (length(trim(subject)) between 1 and 80),
  description text not null default '' check (length(description) <= 4000),
  duration_minutes integer not null check (duration_minutes between 1 and 180),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);
create table public.olympiad_questions (
  id uuid primary key default gen_random_uuid(),
  olympiad_id uuid not null references public.olympiads(id) on delete cascade,
  position integer not null,
  prompt text not null check (length(trim(prompt)) between 1 and 2000),
  options text[] not null check (cardinality(options) = 4),
  correct_index integer not null check (correct_index between 0 and 3),
  unique (olympiad_id, position)
);
create table public.olympiad_attempts (
  id uuid primary key default gen_random_uuid(),
  olympiad_id uuid not null references public.olympiads(id),
  user_id uuid not null references public.profiles(id),
  started_at timestamptz not null default now(),
  deadline timestamptz not null,
  submitted_at timestamptz,
  answers jsonb not null default '{}'::jsonb,
  score integer,
  total integer not null,
  unique (olympiad_id, user_id)
);
create index olympiad_attempts_user on public.olympiad_attempts(user_id);
alter table public.olympiads enable row level security;
alter table public.olympiad_questions enable row level security;
alter table public.olympiad_attempts enable row level security;
create policy olympiads_read on public.olympiads for select to authenticated using (true);
-- No policies or client grants on question/answer-key rows.
create policy olympiad_attempts_read on public.olympiad_attempts for select to authenticated
  using (user_id = auth.uid() or exists (select 1 from public.olympiads o where o.id = olympiad_id and o.organizer_id = auth.uid()));
revoke all on public.olympiads, public.olympiad_questions, public.olympiad_attempts from anon, authenticated;
grant select on public.olympiads, public.olympiad_attempts to authenticated;

create function public.create_olympiad(p_title text, p_subject text, p_description text,
  p_duration integer, p_starts timestamptz, p_ends timestamptz, p_questions jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare oid uuid; q jsonb; pos integer := 0; opts text[];
begin
  if auth.uid() is null or not public.current_is_staff() or exists(select 1 from public.profiles where id=auth.uid() and is_banned) then raise exception 'Staff access required'; end if;
  if jsonb_typeof(p_questions) is distinct from 'array' then raise exception 'Questions must be an array'; end if;
  if jsonb_array_length(p_questions) not between 1 and 50 then raise exception 'Use 1 to 50 questions'; end if;
  if p_ends <= now() then raise exception 'End time must be in the future'; end if;
  insert into public.olympiads(organizer_id,title,subject,description,duration_minutes,starts_at,ends_at)
    values(auth.uid(),trim(p_title),trim(p_subject),p_description,p_duration,p_starts,p_ends) returning id into oid;
  for q in select value from jsonb_array_elements(p_questions) loop
    if jsonb_typeof(q->'options') is distinct from 'array' or jsonb_typeof(q->'correct_index') is distinct from 'number' then raise exception 'Invalid question'; end if;
    select array_agg(value order by ord) into opts from jsonb_array_elements_text(q->'options') with ordinality as x(value,ord);
    if exists(select 1 from unnest(opts) v where v is null or length(trim(v)) not between 1 and 500) then raise exception 'Invalid option'; end if;
    insert into public.olympiad_questions(olympiad_id,position,prompt,options,correct_index)
      values(oid,pos,q->>'prompt',opts,(q->>'correct_index')::integer);
    pos := pos + 1;
  end loop;
  return oid;
end; $$;

create function public.start_olympiad(p_olympiad_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare o public.olympiads; a public.olympiad_attempts; questions jsonb;
begin
  if auth.uid() is null or exists(select 1 from public.profiles where id=auth.uid() and is_banned) then raise exception 'Access denied'; end if;
  select * into o from public.olympiads where id=p_olympiad_id;
  if not found then raise exception 'Competition not found'; end if;
  select * into a from public.olympiad_attempts where olympiad_id=o.id and user_id=auth.uid();
  if a.id is null then
    if now() < o.starts_at or now() >= o.ends_at then raise exception 'Competition is not open'; end if;
    insert into public.olympiad_attempts(olympiad_id,user_id,deadline,total)
      values(o.id,auth.uid(),least(now()+make_interval(mins=>o.duration_minutes),o.ends_at),
        (select count(*) from public.olympiad_questions where olympiad_id=o.id))
      on conflict (olympiad_id,user_id) do nothing;
    select * into a from public.olympiad_attempts where olympiad_id=o.id and user_id=auth.uid();
  end if;
  select jsonb_agg(jsonb_build_object('id',id,'prompt',prompt,'options',options) order by position)
    into questions from public.olympiad_questions where olympiad_id=o.id;
  return jsonb_build_object('attempt',to_jsonb(a),'questions',questions,'server_now',now());
end; $$;

create function public.save_olympiad_answers(p_attempt_id uuid, p_answers jsonb)
returns boolean language plpgsql security definer set search_path = public as $$
declare a public.olympiad_attempts;
begin
  if auth.uid() is null or exists(select 1 from public.profiles where id=auth.uid() and is_banned) or jsonb_typeof(p_answers) is distinct from 'object' then raise exception 'Invalid request'; end if;
  select * into a from public.olympiad_attempts where id=p_attempt_id and user_id=auth.uid() for update;
  if not found then raise exception 'Attempt not found'; end if;
  if a.submitted_at is not null or clock_timestamp() >= a.deadline then return false; end if;
  -- Only valid question IDs and integer option indexes are persisted.
  if exists(select 1 from jsonb_each(p_answers) e where
    not exists(select 1 from public.olympiad_questions q where q.olympiad_id=a.olympiad_id and q.id::text=e.key)
    or e.value::text not in ('0','1','2','3')) then raise exception 'Invalid answer'; end if;
  update public.olympiad_attempts set answers=answers || p_answers where id=a.id;
  return true;
end; $$;

create function public.submit_olympiad(p_attempt_id uuid, p_answers jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare a public.olympiad_attempts; result_score integer;
begin
  if auth.uid() is null or exists(select 1 from public.profiles where id=auth.uid() and is_banned) then raise exception 'Access denied'; end if;
  select * into a from public.olympiad_attempts where id=p_attempt_id and user_id=auth.uid() for update;
  if not found then raise exception 'Attempt not found'; end if;
  if a.submitted_at is not null then return to_jsonb(a); end if;
  perform public.save_olympiad_answers(a.id,p_answers);
  select * into a from public.olympiad_attempts where id=a.id;
  select count(*) into result_score from public.olympiad_questions q
    where q.olympiad_id=a.olympiad_id and a.answers->>q.id::text = q.correct_index::text;
  update public.olympiad_attempts set score=result_score,submitted_at=clock_timestamp() where id=a.id returning * into a;
  return to_jsonb(a);
end; $$;

revoke execute on function public.create_olympiad(text,text,text,integer,timestamptz,timestamptz,jsonb),
 public.start_olympiad(uuid), public.save_olympiad_answers(uuid,jsonb), public.submit_olympiad(uuid,jsonb) from public,anon;
grant execute on function public.create_olympiad(text,text,text,integer,timestamptz,timestamptz,jsonb),
 public.start_olympiad(uuid), public.save_olympiad_answers(uuid,jsonb), public.submit_olympiad(uuid,jsonb) to authenticated;
