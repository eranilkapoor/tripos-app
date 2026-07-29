# TripOS Task Roadmap

Last reviewed: 2026-07-29

TripOS is being built for launch as soon as the product is code-ready and the production environment is activated. This roadmap does not use 90-day or future-phase timing. Status reflects current code-side readiness in this repository.

Status legend:

- `Product Ready`: dedicated backend/API and frontend/mobile surface exist with tenant scoping, auth, and audit-aware operations where applicable.
- `Workflow Ready`: usable MVP workflow exists, but deeper business rules, exports, provider callbacks, or frontend detail screens still need expansion.
- `Foundation`: schema/module shell exists; needs richer production workflow.
- `External`: blocked by infrastructure, provider credentials, legal/security review, or live deployment setup.

## Production Gates

| Priority | Launch gate | Status |
| --- | --- | --- |
| P0 | Production environment, secrets, MongoDB, Redis, S3-compatible storage, strict CORS, seeder policy | External |
| P0 | API lint/typecheck/build, admin CRM build, public website build, mobile typecheck | Verified locally |
| P0 | Tenant/branch isolation, authenticated protected routes, RBAC, refresh rotation | Product Ready |
| P0 | Audit logging for protected mutations and sensitive reads | Workflow Ready |
| P0 | Provider smoke tests for email, WhatsApp, SMS, payments, storage, maps, analytics, monitoring | External |
| P0 | Desktop/tablet CRM QA, mobile Android/iOS QA, public website SEO/legal QA | Pending QA |
| P0 | Backup/restore, load testing, monitoring alerts, incident runbook | External |

## Current Implementation Status

Completed in the repo:

- Monorepo structure aligned with Mentora-style app boundaries.
- MongoDB-backed `tripos-api-server` modules for leads, customers, quotations, itineraries, bookings, suppliers, operations, B2B agents, payments, destinations, tour packages, travel documents, vouchers, support tickets, campaigns, tenants, auth, finance invoices, and audit logs.
- Admin CRM connected to dedicated production APIs with bearer session handling.
- CRM list pagination, status filtering, server-side search, tenant/branch scoping, detail scoping, and status mutation scoping.
- Tenant, branch, CRM user, login, logout, session restore, refresh rotation, RBAC decorators/guard, and platform-only tenant management.
- Basic audit logging for authenticated mutations and sensitive finance/payment/document/tenant reads.
- Mobile app shell with persisted secure session storage and separate customer/agent navigation foundations.
- Public website lead capture wired to backend public lead endpoint.
- API TypeScript configuration synced with Mentora-style Node16 setup.

## Module Readiness Matrix

| # | Module | API status | Admin CRM status | Mobile/Public status | Remaining production work |
| --- | --- | --- | --- | --- | --- |
| 1 | Authentication and Sessions | Product Ready | Product Ready | Workflow Ready | MFA/SSO provider and email delivery provider |
| 2 | Tenant and Branch Management | Product Ready | Workflow Ready | N/A | Tenant onboarding UI depth, storage/sync adapters |
| 3 | RBAC and Permissions | Workflow Ready | Workflow Ready | Workflow Ready | Fine-grained permission map per action/module |
| 4 | Audit Logs | Workflow Ready | Foundation | N/A | Audit UI, exports, retention policies |
| 5 | Leads | Product Ready | Product Ready | Agent Workflow Ready | Follow-up tasks, duplicate merge, import/export |
| 6 | Customers | Workflow Ready | Product Ready | Customer Workflow Ready | Customer timeline, profile edit depth |
| 7 | Quotations | Workflow Ready | Product Ready | Agent Workflow Ready | PDF rendering/storage, send provider integration |
| 8 | Itineraries | Workflow Ready | Product Ready | Customer Workflow Ready | Rich day/item editor, PDF/share links |
| 9 | Bookings | Workflow Ready | Product Ready | Customer Workflow Ready | Convert-from-quotation, passenger/payment/voucher subflows |
| 10 | Suppliers | Workflow Ready | Product Ready | N/A | Contracts, rates, confirmations |
| 11 | Operations | Workflow Ready | Product Ready | Agent Workflow Ready | SLA dashboards, assignment automation |
| 12 | B2B Agents | Workflow Ready | Product Ready | Agent Workflow Ready | KYC, commissions, credit limits, wallet |
| 13 | Payments | Workflow Ready | Product Ready | Customer Workflow Ready | Gateway callbacks, refunds, reconciliation |
| 14 | Finance Invoices | Workflow Ready | Product Ready | N/A | PDF generation, accounting export, tax validation |
| 15 | Destinations and Packages | Workflow Ready | Product Ready | Public Workflow Ready | CMS depth, SEO publishing workflow |
| 16 | Travel Documents | Workflow Ready | Product Ready | Customer Workflow Ready | File upload/storage, verification workflow |
| 17 | Vouchers | Workflow Ready | Product Ready | Customer Workflow Ready | Supplier confirmation linkage, PDF storage |
| 18 | Support Tickets | Workflow Ready | Product Ready | Customer Workflow Ready | SLA, assignment, communication provider hooks |
| 19 | Campaigns and Marketing | Workflow Ready | Product Ready | Public Workflow Ready | Email/WhatsApp automation providers |
| 20 | Public Website | Workflow Ready | N/A | Workflow Ready | Production domain, analytics consent, SEO QA |
| 21 | Mobile Customer/Agent App | Workflow Ready | N/A | Workflow Ready | Release builds, offline sync, role-specific API depth |
| 22 | Integrations | Foundation | Foundation | N/A | Provider adapters and webhook verification |
| 23 | Reporting and Analytics | Foundation | Foundation | N/A | Saved reports, export jobs, dashboards |
| 24 | AI Travel Assistant | Foundation | Foundation | N/A | Provider gateway, usage metering, audit prompts |

## Immediate Build-Now Backlog

| Priority | Status | Task |
| --- | --- | --- |
| P0 | Done | Protect CRM routes with bearer auth by default. |
| P0 | Done | Enforce tenant/branch scope for list, create, detail, and status mutation paths. |
| P0 | Done | Add RBAC decorators/guard and platform-only tenant management. |
| P0 | Done | Add refresh-session rotation. |
| P0 | Done | Add basic backend audit logging. |
| P0 | Done | Sync TripOS API `tsconfig.json` with Mentora Node16 setup. |
| P0 | In Progress | Complete deep workflow endpoints for leads, quotations, itineraries, bookings, finance, and documents. |
| P0 | Done | Add password reset and user invitation backend flows. |
| P0 | Todo | Add file storage abstraction for passports, vouchers, tickets, contracts, receipts, and generated PDFs. |
| P0 | Todo | Add fine-grained module permission map and admin UI permission management. |
| P0 | Todo | Add audit-log list/export APIs and admin CRM audit screens. |
| P1 | Todo | Add production provider adapters for email, WhatsApp, SMS, payments, maps, storage, and monitoring. |
| P1 | Todo | Add backup/restore runbook, index audit, load testing, and staging smoke scripts. |

## Module Completion Focus

The next code-side completion order is:

1. Booking conversion and passenger/payment/voucher subflows.
2. File storage and document/voucher/quotation PDF workflows.
3. Finance receivables, payables, refunds, profitability, and reconciliation.
4. Supplier contracts/rates/confirmations.
5. B2B agent KYC, credit limits, commissions, wallet, and agent invoices.
6. Operations SLA, assignment, escalations, and activity timeline.
7. Reporting exports and audit-log UI.
8. Provider integrations and production webhooks.
