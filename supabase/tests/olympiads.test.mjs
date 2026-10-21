import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { PGlite } from '@electric-sql/pglite'

const staff = '11111111-1111-4111-8111-111111111111'
const pupil = '22222222-2222-4222-8222-222222222222'
const other = '33333333-3333-4333-8333-333333333333'
const db = new PGlite()

await db.exec(`
  create role anon; create role authenticated;
  create schema auth;
  create function auth.uid() returns uuid language sql stable as
    $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
  grant usage on schema public,auth to authenticated,anon;
  grant execute on function auth.uid() to authenticated,anon;
  create table public.profiles(id uuid primary key, is_admin boolean default false, is_banned boolean default false);
  create function public.current_is_staff() returns boolean language sql security definer set search_path=public as
    $$ select coalesce((select is_admin from profiles where id=auth.uid()),false) $$;
  insert into profiles(id,is_admin) values ('${staff}',true),('${pupil}',false),('${other}',false);
`)
await db.exec(await readFile(new URL('../migrations/20261021010000_pitch_olympiads.sql', import.meta.url), 'utf8'))

async function asUser(user, sql, args = []) {
  await db.exec('reset role')
  await db.query("select set_config('request.jwt.claim.sub',$1,false)", [user])
  await db.exec(`set role ${user ? 'authenticated' : 'anon'}`)
  return db.query(sql, args)
}
const questions = [
  { prompt: '2 + 2?', options: ['1', '2', '3', '4'], correct_index: 3 },
  { prompt: '3 + 3?', options: ['6', '3', '9', '0'], correct_index: 0 },
]
async function createCompetition() {
  const r = await asUser(staff, `select public.create_olympiad('Math Cup','Math','Test',30,now()-interval '1 minute',now()+interval '1 hour',$1::jsonb) as id`, [JSON.stringify(questions)])
  return r.rows[0].id
}
async function start(user, olympiad) {
  const r = await asUser(user, 'select public.start_olympiad($1) as session', [olympiad])
  return r.rows[0].session
}

await test('olympiad authorization, grading, deadlines and RLS', async t => {
  const olympiad = await createCompetition()
  let session
  await t.test('only staff create competitions; anonymous cannot list them', async () => {
    await assert.rejects(() => asUser(pupil, `select public.create_olympiad('Invalid','Math','',1,now(),now()+interval '1 hour',$1::jsonb)`, [JSON.stringify(questions)]), /Staff access required/)
    await assert.rejects(() => asUser('', 'select * from public.olympiads'), /permission denied/)
  })
  await t.test('question keys remain private, including through the RPC', async () => {
    session = await start(pupil, olympiad)
    assert.equal(session.questions.length, 2)
    assert.equal('correct_index' in session.questions[0], false)
    await assert.rejects(() => asUser(pupil, 'select * from public.olympiad_questions'), /permission denied/)
    await assert.rejects(() => asUser(pupil, "update public.olympiad_attempts set score=100"), /permission denied/)
  })
  await t.test('refresh resumes the same attempt and persisted answers', async () => {
    const id = session.questions[0].id
    await asUser(pupil, 'select public.save_olympiad_answers($1,$2::jsonb)', [session.attempt.id, JSON.stringify({ [id]: 3 })])
    const resumed = await start(pupil, olympiad)
    assert.equal(resumed.attempt.id, session.attempt.id)
    assert.equal(resumed.attempt.deadline, session.attempt.deadline)
    assert.equal(resumed.attempt.answers[id], 3)
  })
  await t.test('rejects foreign question IDs and invalid option indices', async () => {
    for (const answers of [{ '99999999-9999-4999-8999-999999999999': 0 }, { [session.questions[1].id]: 9 }]) {
      await assert.rejects(() => asUser(pupil, 'select public.save_olympiad_answers($1,$2::jsonb)', [session.attempt.id, JSON.stringify(answers)]), /Invalid answer/)
    }
  })
  await t.test('another pupil cannot modify or read the attempt', async () => {
    await assert.rejects(() => asUser(other, 'select public.submit_olympiad($1,$2::jsonb)', [session.attempt.id, '{}']), /Attempt not found/)
    const rows = await asUser(other, 'select * from public.olympiad_attempts where id=$1', [session.attempt.id])
    assert.equal(rows.rows.length, 0)
  })
  await t.test('grades on server and repeated submission cannot change result', async () => {
    const a = { [session.questions[1].id]: 0 }
    const first = await asUser(pupil, 'select public.submit_olympiad($1,$2::jsonb) as result', [session.attempt.id, JSON.stringify(a)])
    assert.equal(first.rows[0].result.score, 2)
    const repeat = await asUser(pupil, 'select public.submit_olympiad($1,$2::jsonb) as result', [session.attempt.id, JSON.stringify({ [session.questions[0].id]: 0 })])
    assert.deepEqual(repeat.rows[0].result, first.rows[0].result)
    const result = await asUser(staff, 'select * from public.olympiad_attempts where olympiad_id=$1', [olympiad])
    assert.equal(result.rows[0].score, 2)
  })
  await t.test('late submissions grade only answers saved before the deadline', async () => {
    const late = await start(other, olympiad)
    await asUser(other, 'select public.save_olympiad_answers($1,$2::jsonb)', [late.attempt.id, JSON.stringify({ [late.questions[0].id]: 3 })])
    await db.exec('reset role')
    await db.query("update public.olympiad_attempts set deadline=now()-interval '1 second' where id=$1", [late.attempt.id])
    const result = await asUser(other, 'select public.submit_olympiad($1,$2::jsonb) as result', [late.attempt.id, JSON.stringify({ [late.questions[1].id]: 0 })])
    assert.equal(result.rows[0].result.score, 1)
  })
  await t.test('upcoming competitions cannot be started early', async () => {
    const r = await asUser(staff, `select public.create_olympiad('Future Cup','Math','',30,now()+interval '1 day',now()+interval '2 days',$1::jsonb) as id`, [JSON.stringify(questions)])
    await assert.rejects(() => start(pupil, r.rows[0].id), /not open/)
  })
})
await db.close()
