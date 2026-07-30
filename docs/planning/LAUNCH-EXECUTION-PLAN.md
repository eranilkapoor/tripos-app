# TripOS Launch Execution Plan

TripOS is not planned as a 90-day build. The target is to complete code-side production readiness as fast as possible, then launch after production infrastructure, secrets, QA, and provider checks are complete.

## Build-Now Order

| Priority | Workstream | Target |
| --- | --- | --- |
| P0 | Backend workflow depth | Complete booking, quotation, itinerary, finance, supplier, document, and B2B agent subflows. |
| P0 | Admin CRM production UX | Replace remaining dummy/detail-only states with real forms, actions, validation, and error handling. |
| P0 | Mobile production UX | Complete role-specific customer and agent flows with real APIs, offline cache, and token refresh. |
| P0 | Public website conversion | Complete SEO package/destination pages and production lead capture. |
| P0 | Security | Finish invitations, password reset, permission matrix, audit UI/export, and storage policies. |
| P0 | Infrastructure | Configure production MongoDB, Redis, S3-compatible storage, secrets, monitoring, backups, and deployment runbooks. |

## Launch Gates

TripOS can be marked production-live only after:

- `npm run verify` passes from a clean checkout.
- API, CRM, mobile, and public website production builds pass.
- Production environment uses live MongoDB, Redis, S3-compatible storage, strict CORS, and no demo secrets.
- Organization admin, branch manager, sales, operations, finance, B2B agent, and customer roles pass access-control QA.
- Provider smoke tests pass or the provider-backed feature is explicitly disabled.
- Backup/restore and monitoring alerts are tested.
- Legal, privacy, refund, cancellation, and data-retention pages are published.
