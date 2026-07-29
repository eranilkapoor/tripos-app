# TripOS Task Roadmap

Last reviewed: 2026-07-29

TripOS is being built for launch as soon as the product is code-ready and the production environment is activated. This roadmap does not use 90-day or future-phase timing. Status reflects current code-side readiness in this repository.

Status legend:

- `Product Ready`: dedicated backend/API and frontend/mobile surface exist with tenant scoping, auth, and audit-aware operations where applicable.
- `Workflow Ready`: usable MVP workflow exists, but provider callbacks, production evidence, or advanced QA still need expansion.
- `Foundation`: schema/module shell exists; needs richer production workflow.
- `External`: blocked by infrastructure, provider credentials, legal/security review, or live deployment setup.

## Production Gates

| Priority | Launch gate                                                                                        | Status           |
| -------- | -------------------------------------------------------------------------------------------------- | ---------------- |
| P0       | Production environment, secrets, MongoDB, Redis, S3-compatible storage, strict CORS, seeder policy | External         |
| P0       | API lint/typecheck/build, admin CRM build, public website build, mobile typecheck                  | Verified locally |
| P0       | Tenant/branch isolation, authenticated protected routes, RBAC, refresh rotation                    | Product Ready    |
| P0       | Audit logging, scoped audit list API, and CSV export payloads                                      | Product Ready    |
| P0       | Provider smoke tests for email, WhatsApp, SMS, payments, storage, maps, analytics, monitoring      | External         |
| P0       | Desktop/tablet CRM QA, mobile Android/iOS QA, public website SEO/legal QA                          | Pending QA       |
| P0       | Backup/restore, load testing, monitoring alerts, incident runbook                                  | External         |

## Current Implementation Status

Completed in the repo:

- Monorepo structure uses product-specific app boundaries for API, CRM, mobile, public website, packages, scripts, and documentation.
- MongoDB-backed `tripos-api-server` modules for leads, customers, quotations, itineraries, bookings, suppliers, operations, B2B agents, payments, destinations, tour packages, travel documents, vouchers, support tickets, campaigns, tenants, auth, finance invoices, and audit logs.
- Admin CRM connected to dedicated production APIs with bearer session handling.
- CRM list pagination, status filtering, server-side search, tenant/branch-scoped create/detail/update/delete, and status mutation scoping.
- Tenant, branch, CRM user CRUD, login, logout, session restore, refresh rotation, RBAC decorators/guard, and platform-only tenant management.
- Basic audit logging for authenticated mutations and sensitive finance/payment/document/tenant reads, with scoped list and CSV export APIs.
- Local/log provider configuration for email, SMS, WhatsApp, payments, maps, AI, monitoring, and local/S3-style file storage.
- File upload-intent registry for passports, vouchers, tickets, contracts, receipts, and generated document references.
- Backend permission catalog and scoped CRM user detail/update/delete APIs.
- Booking conversion from quotation, passenger capture, payment schedule, and voucher subflows.
- Finance receivables, payables, refunds, booking profitability, and reconciliation endpoints.
- Organization-current aliases, reporting overview/funnel/operations/finance APIs, and local/provider-ready AI travel assistant endpoints.
- Admin CRM navigation and live API screens for users/permissions, audit logs, storage files, integrations, and reporting.
- Supplier contracts/rates/confirmations, B2B KYC/credit/commission/wallet/invoice actions, operations SLA/escalations/timeline, and saved report templates are API-backed.
- Mobile app shell with persisted secure session storage and separate customer/agent navigation foundations.
- Public website lead capture wired to backend public lead endpoint.
- API TypeScript configuration uses Node16 module/moduleResolution settings for production NestJS builds.

## Module Readiness Matrix

| #   | Module                       | API status     | Admin CRM status | Mobile/Public status    | Remaining production work                                              |
| --- | ---------------------------- | -------------- | ---------------- | ----------------------- | ---------------------------------------------------------------------- |
| 1   | Authentication and Sessions  | Product Ready  | Product Ready    | Workflow Ready          | MFA/SSO provider and email delivery provider                           |
| 2   | Tenant and Branch Management | Product Ready  | Workflow Ready   | N/A                     | Tenant onboarding UI depth, storage/sync adapters                      |
| 3   | RBAC and Permissions         | Product Ready  | Product Ready    | Workflow Ready          | Role QA and production admin policy sign-off                           |
| 4   | Audit Logs                   | Product Ready  | Product Ready    | N/A                     | Retention policies and production export review                        |
| 5   | Leads                        | Product Ready  | Product Ready    | Agent Workflow Ready    | Follow-up tasks, duplicate merge, import/export                        |
| 6   | Customers                    | Workflow Ready | Product Ready    | Customer Workflow Ready | Customer timeline, profile edit depth                                  |
| 7   | Quotations                   | Workflow Ready | Product Ready    | Agent Workflow Ready    | Binary PDF renderer/storage, send provider integration                 |
| 8   | Itineraries                  | Workflow Ready | Product Ready    | Customer Workflow Ready | Rich day/item editor, binary PDF renderer/storage, share links         |
| 9   | Bookings                     | Product Ready  | Product Ready    | Customer Workflow Ready | CRM UX polish for passenger/payment/voucher subflows                   |
| 10  | Suppliers                    | Product Ready  | Product Ready    | N/A                     | Production supplier contract QA                                        |
| 11  | Operations                   | Product Ready  | Product Ready    | Agent Workflow Ready    | Assignment automation QA and escalation policy sign-off                |
| 12  | B2B Agents                   | Product Ready  | Product Ready    | Agent Workflow Ready    | KYC policy sign-off and live finance reconciliation                    |
| 13  | Payments                     | Product Ready  | Product Ready    | Customer Workflow Ready | Gateway callbacks and bank reconciliation provider hooks               |
| 14  | Finance Invoices             | Workflow Ready | Product Ready    | N/A                     | Binary PDF renderer/storage, accounting export, tax validation         |
| 15  | Destinations and Packages    | Workflow Ready | Product Ready    | Public Workflow Ready   | CMS depth, SEO publishing workflow                                     |
| 16  | Travel Documents             | Workflow Ready | Product Ready    | Customer Workflow Ready | Verification UI depth and production storage credentials               |
| 17  | Vouchers                     | Workflow Ready | Product Ready    | Customer Workflow Ready | Supplier confirmation linkage and binary PDF renderer/storage          |
| 18  | Support Tickets              | Workflow Ready | Product Ready    | Customer Workflow Ready | SLA, assignment, communication provider hooks                          |
| 19  | Campaigns and Marketing      | Workflow Ready | Product Ready    | Public Workflow Ready   | Email/WhatsApp automation providers                                    |
| 20  | Public Website               | Workflow Ready | N/A              | Workflow Ready          | Production domain, analytics consent, SEO QA                           |
| 21  | Mobile Customer/Agent App    | Workflow Ready | N/A              | Workflow Ready          | Release builds, offline sync, role-specific API depth                  |
| 22  | Integrations                 | Workflow Ready | Workflow Ready   | N/A                     | Live provider credentials, callbacks, and webhook verification         |
| 23  | Reporting and Analytics      | Product Ready  | Product Ready    | N/A                     | Dashboard QA and production delivery provider for scheduled exports     |
| 24  | AI Travel Assistant          | Workflow Ready | Foundation       | N/A                     | Live provider gateway credentials, usage metering, prompt audit policy |

## Immediate Build-Now Backlog

| Priority | Status  | Task                                                                                                                                                                               |
| -------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P0       | Done    | Protect CRM routes with bearer auth by default.                                                                                                                                    |
| P0       | Done    | Enforce tenant/branch scope for create, list, detail, update, delete, and status mutation paths.                                                                                   |
| P0       | Done    | Add RBAC decorators/guard and platform-only tenant management.                                                                                                                     |
| P0       | Done    | Add refresh-session rotation.                                                                                                                                                      |
| P0       | Done    | Add basic backend audit logging.                                                                                                                                                   |
| P0       | Done    | Sync TripOS API `tsconfig.json` with Node16 module/moduleResolution settings for production NestJS builds.                                                                         |
| P0       | Done    | Complete deep workflow endpoints for leads, quotations, itineraries, bookings, finance, and documents.                                                                             |
| P0       | Done    | Add password reset and user invitation backend flows.                                                                                                                              |
| P0       | Done    | Add file storage abstraction for passports, vouchers, tickets, contracts, receipts, and generated PDFs.                                                                            |
| P0       | Done    | Add fine-grained module permission map and admin UI permission management.                                                                                                         |
| P0       | Done    | Add audit-log list/export APIs and admin CRM audit screens.                                                                                                                        |
| P1       | Partial | Add production provider adapters for email, WhatsApp, SMS, payments, maps, storage, and monitoring. Local/log health adapters are done; live credentials/webhooks remain external. |
| P1       | Partial | Add backup/restore runbook, index audit, load testing, and staging smoke scripts. Runbook is documented; execution evidence remains external.                                      |
| P1       | Done    | Add scheduled saved-report execution endpoint with next-run tracking and run result metadata.                                                                                       |
| P1       | Done    | Add generated HTML document templates for quotations, itineraries, invoices, and vouchers as renderer-ready payloads.                                                               |

## Module Completion Focus

The next code-side completion order is:

1. Connect generated document templates to a binary PDF renderer and storage adapter.
2. Mobile customer/agent screen depth and offline cache conflict QA.
3. Provider credentials, production webhooks, and deployment smoke evidence.
