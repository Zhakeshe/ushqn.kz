# RLS audit

Last reviewed: 2026-08-26. The effective policies include
`20260826010000_trust_security_hardening.sql`; older migration files remain
immutable history and must not be read in isolation.

| Area | Read | Write | Security boundary |
| --- | --- | --- | --- |
| Profiles | self, staff, or public profile | owner; privileged flags require admin | `profile_public` is enforced by RLS |
| Achievements | owner, staff, or public profile | owner content; review fields are staff-only | points are awarded only by `review_achievement` |
| Notifications | owner | owner may mark/delete; insert is trigger/RPC-only | client `INSERT` privilege revoked |
| Messages | conversation participants | participant may send as self; sender may delete own | reply target and rate-limit triggers apply |
| Jobs | authenticated users | owner; feature flags protected; admin override | application status is employer/admin-only |
| Applications | applicant and job owner/admin | applicant submits; owner/admin reviews | applicant cannot self-accept or move ownership |
| Student links | linked student/guardian | student creates/deletes; secure invite RPC accepts | invite RPC validates role, expiry, and caller |
| Teacher groups | owner and active members | owner, plus scoped join/leave RPCs | join codes are handled by authenticated RPCs |
| Storage `uploads` | public URL (avatars, chat, listings) | only first folder matching `auth.uid()` | 10 MB and MIME allowlist at bucket level |
| Storage `evidence` | owner and staff via 10-minute signed URL | owner folder only | private bucket, 10 MB, MIME allowlist |
| Admin/moderation | staff only | policies call `current_is_admin/current_is_staff` | sensitive changes are audit logged |

The `uploads` bucket remains public only for profile, chat, and listing media.
Achievement evidence uses the private `evidence` bucket.

All client-facing RPCs have anonymous/PUBLIC execution revoked. New SQL
functions must follow the same pattern: explicit `search_path`, explicit grants,
and an authorization check for every `SECURITY DEFINER` entry point.
