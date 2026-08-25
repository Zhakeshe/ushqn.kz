# USHQN

USHQN is a multilingual student growth platform built with React, TypeScript, Vite and Supabase. The production-backed core currently includes authentication, onboarding, profiles, achievements, jobs, chat, communities, events, notifications and moderation.

Roadmap AI, payment/wallet, automated certificate verification, grant offers and several gamification modules are product prototypes. The UI labels these areas as **Demo**; they must not be presented as real AI, payment or official verification services until server integrations exist.

## Requirements

- Bun 1.2+
- A Supabase project
- Node.js 22+ only if your tooling requires Node

## Local setup

```bash
bun install --frozen-lockfile
cp .env.example .env
bun run dev
```

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`. Values prefixed with `VITE_` are bundled into the browser: never place a Supabase service-role key or another server secret there.

## Database

The ordered files under `supabase/migrations/` are the canonical database history. Apply them in filename order with your Supabase migration workflow. See [`supabase/README.md`](supabase/README.md) before modifying the schema.

Do not run `MASTER_MIGRATION.sql`, `DELTA_MIGRATION.sql` and the ordered migrations on the same database. The first two files are legacy snapshots retained for existing deployments.

## Quality checks

```bash
bun run lint
bun run test
bun run build
bun run test:e2e
```

The authenticated E2E path additionally needs `E2E_EMAIL` and `E2E_PASSWORD`. Without them, only public smoke tests run.

## Architecture

- `src/pages/` — route-level screens, loaded on demand.
- `src/components/` — reusable UI and prototype modules.
- `src/hooks/` — shared client data access and state.
- `src/lib/` — Supabase client, validation, analytics and utilities.
- `supabase/migrations/` — schema, RLS policies and RPCs.
- `e2e/` — Playwright public smoke and authenticated critical-path tests.

Frontend route guards improve UX but are not security boundaries. Authorization must remain enforced by Supabase RLS policies and security-definer RPC checks.
