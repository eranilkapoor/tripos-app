# TripOS Launch Execution Plan

TripOS is not planned as a 90-day build. The target is to complete code-side production readiness as fast as possible, then launch after production infrastructure, secrets, QA, and provider checks are complete.

## Build-Now Order

| Priority | Workstream             | Target                                                                                                                                                                        |
| -------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P0       | Provider activation    | Enter sandbox/live credentials and run integration smoke tests for email, SMS, WhatsApp, payments, storage, maps, AI, document renderer, accounting export, and monitoring.   |
| P0       | Production environment | Configure MongoDB, S3-compatible storage, secrets, strict CORS, monitoring, backups, deployment runbooks, and Redis/queue services only if enabled for the chosen deployment. |
| P0       | QA evidence            | Execute CRM desktop/tablet QA, mobile Android/iOS QA, public website QA, role-policy QA, backup/restore drill, and load testing.                                              |
| P0       | Release sign-off       | Confirm legal/privacy/refund/cancellation/retention pages, production domains, analytics consent, rollback owner, and incident contacts.                                      |

## Launch Gates

TripOS can be marked production-live only after:

- `npm run verify` passes from a clean checkout.
- API, CRM, mobile, and public website production builds pass.
- Production environment uses live MongoDB, S3-compatible storage, strict CORS, no demo secrets, and Redis/queue services only if enabled.
- Organization admin, branch manager, sales, operations, finance, B2B agent, and customer roles pass access-control QA.
- Provider smoke tests pass or the provider-backed feature is explicitly disabled.
- Backup/restore and monitoring alerts are tested.
- Legal, privacy, refund, cancellation, and data-retention pages are published.
- Pricing/subscription purchase flow is smoke-tested with sandbox provider mode or explicitly marked manual invoice/assisted sales.
