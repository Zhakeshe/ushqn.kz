# Supabase schema workflow

`migrations/` is the single source of truth for new and existing environments. Migration filenames are timestamped and must be applied in ascending order.

## Safe rules

1. Create every schema or RLS change as a new timestamped migration.
2. Never edit a migration that has already reached a shared environment.
3. Test migrations against a disposable Supabase project before production.
4. Keep authorization in RLS or audited RPCs; a React route guard is not authorization.
5. Security-definer functions must set an explicit `search_path`, validate `auth.uid()` and expose execution only to the intended roles.
6. Regenerate `src/types/database.ts` after a schema change.
7. Never expose the service-role key through a `VITE_` variable.

## Legacy snapshots

- `MASTER_MIGRATION.sql` is a legacy full-schema snapshot.
- `DELTA_MIGRATION.sql` is a legacy upgrade snapshot.

They are retained for deployments that were originally created from those snapshots. Do not combine either snapshot with the ordered migration chain on a fresh database.

## Release checklist

- Apply pending migrations in staging.
- Exercise authentication, profile update, job apply, chat send/delete and admin moderation.
- Verify anonymous and authenticated RLS behavior separately.
- Regenerate database types.
- Take a database backup before applying production migrations.
