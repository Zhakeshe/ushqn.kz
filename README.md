# USHQN

**Твои цели. Твой путь. Твоя платформа. / From Spark to Success**

A multilingual student growth platform built with React, TypeScript, Vite and Supabase. The current product follows the five-module MVP in the USHQN startup pitch.

| Module | Current behavior |
| --- | --- |
| Portfolio & achievements | Existing authentication, onboarding, profiles, projects/links, uploaded evidence and staff-reviewed achievements. |
| Rankings | Existing category scores, real student leaderboard and points history. The sample school battle is removed from the active UI. |
| Online olympiads | Staff create timed multiple-choice competitions. Students have one resumable attempt, server-saved answers and server-graded results. Organizers can see their participant results. Requires the new migration. |
| Career guidance | Interest selection, suggested directions and a session-local checklist. Rules-based suggestions; no connected LLM or predictive admission claims. |
| Skills marketplace | Existing service listings, image uploads, search and direct chat. Goods and vacancy listings are removed from this UI. No platform payments or escrow. |

The public landing uses a dark, minimal visual direction with large typography, lime actions, module tabs and a FAQ. The journey dashboard and desktop/mobile navigation use this scope in Russian, Kazakh and English. Messages, notifications, settings and staff moderation support the core modules.

Wallet/Apple Wallet, RPG labs, grants demos, standalone jobs, communities, people search and calendar are no longer product routes. Historical source files and database tables remain for compatibility; this change does not delete user data. `/showcase` and `/jobs` redirect to `/marketplace`.

## Local setup

Requirements: Bun 1.2+, Node.js 22+ (database tests), and a Supabase project.

```bash
bun install --frozen-lockfile
cp .env.example .env
bun run dev
```

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Browser-prefixed variables must never contain a service-role key or other server secrets. Without Supabase configuration the public landing/auth forms render, but authenticated data flows cannot be exercised.

## Database and rollout

Ordered files in `supabase/migrations/` are the canonical history. Read [supabase/README.md](supabase/README.md) before applying changes. Do not combine legacy `MASTER_MIGRATION.sql` / `DELTA_MIGRATION.sql` snapshots with ordered migrations.

Before shipping the new frontend, apply `20261021010000_pitch_olympiads.sql` to a disposable/staging Supabase project and exercise the full signed-in path. It adds three tables and four RPCs; it does not alter existing scores or delete data. Correct answers are stored in a table without client access. Only the existing staff role can create competitions. Selecting “teacher” during registration does not confer organizer privileges.

Test scores remain separate from the overall rating. Competition editing/deletion, automatic diplomas, code judging, cheating detection, paid competitions and live leaderboards are not implemented in this MVP.

The repository includes manual TypeScript definitions for the new table/RPC contract. Regenerate types against the staging schema before production deployment. Database tests use a minimal fixture for the pre-existing profiles/auth helpers, not the complete migration history.

## Quality checks

```bash
bun run lint
bun run test
bun run test:db
bun run build
bun run test:e2e
```

`test:db` uses disposable embedded PostgreSQL (PGlite) to test RPC authorization, RLS, answer-key privacy, attempt resumption, grading and deadlines. It never connects to production.

Authenticated E2E tests need `E2E_EMAIL` / `E2E_PASSWORD` for an already-onboarded staging user and the configured Supabase project. Without those credentials only public smoke tests run.

## Remaining pitch roadmap

Connected AI mentoring, parent insight reports, university/admissions navigation, course video delivery, platform checkout, subscriptions, marketplace commissions and official diploma generation require separate integrations. They are not represented as live services in the current UI. Completing the five core routes does not mean the full pitch roadmap is implemented.

## Architecture

- `src/pages/` — lazily loaded route screens.
- `src/product/` — focused product navigation, localized copy helper and landing styles.
- `src/components/`, `src/hooks/`, `src/lib/` — shared UI, data access and utilities.
- `supabase/migrations/`, `supabase/tests/` — schema/RLS/RPCs and database integration tests.
- `e2e/` — public and authenticated Playwright checks.

Frontend route guards are UX controls. Authorization is enforced in Supabase RLS and RPCs.

## Authentication deployment configuration

- Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the deployment build environment. Missing configuration now disables sign-in/sign-up actions and displays a service-unavailable notice instead of calling a mock endpoint.
- Leave `VITE_APP_URL` blank to use the current origin, or set the canonical public origin. A copied localhost value is ignored on a non-local site. Rebuild after changing Vite variables.
- In Supabase Authentication URL Configuration, set the Site URL to the real deployed origin and allow `<origin>/auth/callback` and `<origin>/reset-password`. Add the exact staging origin separately.
- Google sign-in, signup confirmations and resent signup emails now use `/auth/callback`. That route waits for the SDK to process the session, shows expired-link errors and navigates to the guarded dashboard. Legacy root callbacks are also routed to the callback screen.
- Signed-in visitors to `/login` and `/register` go to the dashboard. New accounts are routed to onboarding; completing it updates and refetches the route-guard cache before navigation. Profile-query failures render an explicit retry screen.
- `src/routes/authFlow.test.tsx` tests the routing with a mocked authenticated SDK and a real React Query cache; it does not replace a live Supabase signup/email/Google test.
