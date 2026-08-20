# TripOS Task Roadmap

Last reviewed: 2026-08-20

TripOS is being built for launch as soon as the product is code-ready and the production environment is activated. Status reflects current code-side readiness in this repository.

An independent code-level review was completed on 2026-08-12 across all four apps and repo-level CI/tooling. The launch-blocking code-side risks found in that review are now closed; remaining work is external deployment evidence, live credentials, and final QA sign-off.

Status legend:

- `Product Ready`: code-side module is implemented with API/UI coverage, organization scoping, auth/RBAC, validation, audit-aware behavior where applicable, and local/sandbox provider readiness.
- `External Evidence`: production credentials, deployment proof, legal/security sign-off, or live infrastructure evidence that must be supplied outside the repository.

## Production Gates

| Priority | Launch gate                                                                                                                   | Status            |
| -------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| P0       | Production environment, secrets, MongoDB, S3-compatible storage, strict CORS, seeder policy, optional Redis/queues if enabled | External Evidence |
| P0       | API lint/typecheck/build, admin CRM build, public website build, mobile typecheck                                             | Verified locally  |
| P0       | Organization/branch isolation, authenticated protected routes, RBAC, refresh rotation                                         | Product Ready     |
| P0       | Audit logging, scoped audit list API, and CSV export payloads                                                                 | Product Ready     |
| P0       | Provider smoke tests for email, WhatsApp, SMS, payments, storage, maps, analytics, monitoring                                 | Sandbox Ready     |
| P0       | Desktop/tablet CRM QA, mobile Android/iOS QA, public website SEO/legal QA                                                     | QA Ready          |
| P0       | Backup/restore, load testing, monitoring alerts, incident runbook                                                             | External Evidence |

## Engineering Review Closure

The 2026-08-12 engineering review is closed in code. The resolved items are:

- Public lead organization injection fixed with server-side intake token and configured organization/branch ownership.
- Central permission enforcement added for domain modules through `RbacGuard`.
- Demo admin bootstrap gated by environment and disabled for production.
- Auth/public rate limiting added.
- Payments and invoices now store integer minor-unit money fields.
- API tests cover money precision, permission enforcement, public lead scoping, and organization scope override behavior.
- CI now runs real lint/typecheck/build/test gates across apps and CodeQL on PR/push.
- Admin CRM session/XSS risk reduced through in-memory bearer session state, security headers, server-confirmed workspace switching, and escaped invoice export HTML.
- CRM modularization, form validation, query caching, OpenAPI contract generation, frontend lint/typecheck scripts, and app-level `.env.example` files are complete.

## Current Implementation Status

Completed in the repo:

- Monorepo structure uses product-specific app boundaries for API, CRM, mobile, public website, packages, scripts, and documentation.
- MongoDB-backed `tripos-api-server` modules for leads, contacts, activities, follow-ups, customers, quotations, itineraries, bookings, suppliers, operations, B2B agents, payments, destinations, tour packages, travel documents, vouchers, support tickets, campaigns, communications, workflows, feature flags, import/export jobs, organizations, settings, tags, tasks, auth, finance invoices, and audit logs.
- Admin CRM connected to dedicated production APIs with bearer session handling.
- CRM list pagination, status filtering, server-side search, organization/branch-scoped create/detail/update/delete, and status mutation scoping.
- Organization, branch, department, team, CRM user, role, permission, user-role, and role-permission CRUD; email/password CRM login, post-login workspace switching, logout, session restore, refresh rotation, RBAC decorators/guard, and platform-only organization management.
- Basic audit logging for authenticated mutations and sensitive finance/payment/document/organization reads, with scoped list and CSV export APIs.
- Local/log provider configuration for email, SMS, WhatsApp, payments, maps, AI, monitoring, and local/S3-style file storage.
- File upload-intent registry for passports, vouchers, tickets, contracts, receipts, and generated document references.
- Backend permission catalog and scoped CRM user detail/update/delete APIs.
- Booking conversion from quotation, passenger capture, payment schedule, and voucher subflows.
- Finance receivables, payables, refunds, booking profitability, and reconciliation endpoints.
- Organization-current aliases, reporting overview/funnel/operations/finance APIs, and local/provider-ready AI travel assistant endpoints.
- Admin CRM navigation and live API screens for users/permissions, settings, tags, tasks, audit logs, storage files, integrations, and reporting.
- Admin CRM schema-driven create/edit forms, detail drawer edit action, import/export, search, sorting, pagination, and status mutation flows are wired to module APIs.
- Platform pricing plans, organization subscriptions, CRM My Profile, change password, settings, and notifications are API/CRM backed.
- Shared SaaS/CRM modules for contacts, activities, follow-ups, meetings, notes, service catalog, custom fields, call center, field force, content, and analytics are API/CRM backed through organization-scoped CRUD.
- Supplier contracts/rates/confirmations, B2B KYC/credit/commission/wallet/invoice actions, operations SLA/escalations/timeline, and saved report templates are API-backed.
- Mobile app shell with persisted secure session storage and separate customer/agent navigation foundations.
- Public website lead capture wired to backend public lead endpoint.
- API TypeScript configuration uses Node16 module/moduleResolution settings for production NestJS builds.

## Module Readiness Matrix

| #   | Module                             | API status    | Admin CRM status | Mobile/Public status | Remaining production work                                              |
| --- | ---------------------------------- | ------------- | ---------------- | -------------------- | ---------------------------------------------------------------------- |
| 1   | Authentication and Sessions        | Product Ready | Product Ready    | Product Ready        | Optional MFA/SSO depends on selected provider credentials              |
| 2   | Organization and Branch Management | Product Ready | Product Ready    | N/A                  | Customer-managed storage/sync requires deployment target               |
| 3   | Departments and Teams              | Product Ready | Product Ready    | N/A                  | Final role policy sign-off during QA                                   |
| 4   | RBAC and Permissions               | Product Ready | Product Ready    | Product Ready        | Final role policy sign-off during QA                                   |
| 5   | Audit Logs                         | Product Ready | Product Ready    | N/A                  | Retention policies and production export review                        |
| 6   | Leads                              | Product Ready | Product Ready    | Product Ready        | Import/export and follow-up actions are API/UI-backed                  |
| 7   | Customers                          | Product Ready | Product Ready    | Product Ready        | Timeline data is available through related module activity             |
| 8   | Quotations                         | Product Ready | Product Ready    | Product Ready        | Renderer-ready document output; binary renderer selected by deployment |
| 9   | Itineraries                        | Product Ready | Product Ready    | Product Ready        | Renderer-ready document output; share links use storage provider       |
| 10  | Bookings                           | Product Ready | Product Ready    | Product Ready        | Passenger/payment/voucher subflows are API-backed                      |
| 11  | Suppliers                          | Product Ready | Product Ready    | N/A                  | Production supplier contract QA                                        |
| 12  | Operations                         | Product Ready | Product Ready    | Product Ready        | Escalation policies are QA configurable                                |
| 13  | B2B Agents                         | Product Ready | Product Ready    | Product Ready        | KYC policy sign-off during onboarding QA                               |
| 14  | Payments                           | Product Ready | Product Ready    | Product Ready        | Gateway callbacks require selected sandbox/live provider credentials   |
| 15  | Finance Invoices                   | Product Ready | Product Ready    | N/A                  | Renderer-ready output and minor-unit tax totals are implemented        |
| 16  | Destinations and Packages          | Product Ready | Product Ready    | Product Ready        | SEO publishing is ready; production domain is external                 |
| 17  | Travel Documents                   | Product Ready | Product Ready    | Product Ready        | Storage provider can run local, sandbox, or S3-compatible              |
| 18  | Vouchers                           | Product Ready | Product Ready    | Product Ready        | Renderer-ready output and supplier linkage are API-backed              |
| 19  | Support Tickets                    | Product Ready | Product Ready    | Product Ready        | Communication hooks are sandbox/provider-ready                         |
| 20  | Campaigns and Marketing            | Product Ready | Product Ready    | Product Ready        | Email/WhatsApp providers are sandbox/config driven                     |
| 21  | Public Website                     | Product Ready | N/A              | Product Ready        | Production domain and analytics property are external                  |
| 22  | Mobile Customer/Agent App          | Product Ready | N/A              | Product Ready        | Store release builds and offline conflict QA are external release work |
| 23  | Integrations                       | Product Ready | Product Ready    | N/A                  | Sandbox smoke endpoint added; live credentials remain external         |
| 24  | Reporting and Analytics            | Product Ready | Product Ready    | N/A                  | Dashboard QA and production delivery provider for scheduled exports    |
| 25  | AI Travel Assistant                | Product Ready | Product Ready    | N/A                  | Local assist and provider-ready mode implemented                       |
| 26  | Settings                           | Product Ready | Product Ready    | N/A                  | Final organization defaults sign-off during QA                         |
| 27  | Tags                               | Product Ready | Product Ready    | N/A                  | Taxonomy naming sign-off during onboarding QA                          |
| 28  | Tasks and Follow-ups               | Product Ready | Product Ready    | N/A                  | SLA and ownership policy sign-off during QA                            |
| 29  | Batch Jobs                         | Product Ready | Product Ready    | N/A                  | Production scheduler cadence and alert thresholds are environment QA   |
| 30  | SaaS Pricing Plans                 | Product Ready | Product Ready    | N/A                  | Sandbox/live payment provider selection and commercial sign-off        |
| 31  | Organization Subscriptions         | Product Ready | Product Ready    | N/A                  | Provider webhook/live billing evidence or manual invoice policy        |
| 32  | CRM Account Profile/Password       | Product Ready | Product Ready    | N/A                  | Optional MFA/SSO provider selection                                    |
| 33  | Contacts and Activities            | Product Ready | Product Ready    | N/A                  | Final activity taxonomy sign-off during QA                             |
| 34  | Meetings and Notes                 | Product Ready | Product Ready    | N/A                  | Calendar provider selection remains external                           |
| 35  | Service Catalog                    | Product Ready | Product Ready    | N/A                  | Supplier/service taxonomy sign-off during onboarding QA                |
| 36  | Custom Fields and Feature Flags    | Product Ready | Product Ready    | N/A                  | Production rollout policy sign-off                                     |
| 37  | Communications                     | Product Ready | Product Ready    | N/A                  | Live provider credentials remain external                              |
| 38  | Import/Export Jobs                 | Product Ready | Product Ready    | N/A                  | Large-file storage limits depend on deployment target                  |
| 39  | Call Center and Field Force        | Product Ready | Product Ready    | N/A                  | Telephony/map live credentials remain external                         |

## Immediate Build-Now Backlog

Rows added from the 2026-08-12 independent review are retained as an audit trail. All P0/P1 code-side review rows are now marked `Done`; external provider/deployment evidence remains tracked separately.

| Priority | Status | Task                                                                                                                                                                                                                                              |
| -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P0       | Done   | Fix public lead organization injection: derive `organizationId` server-side from a public intake/campaign token on `/api/v1/public/leads`, never trust a client-supplied `organizationId`.                                                        |
| P0       | Done   | Add central permission enforcement to all mutating and sensitive-read endpoints so the existing permission catalog is actually enforced.                                                                                                          |
| P0       | Done   | Remove or strictly `NODE_ENV`-gate the auto-created demo admin account (`admin@tripos.test`) so it cannot materialize in staging or production.                                                                                                   |
| P0       | Done   | Add rate limiting to authentication endpoints and all public/unauthenticated endpoints.                                                                                                                                                           |
| P0       | Done   | Migrate financial fields (invoice totals, payment amounts) to integer minor units plus currency code, matching the database model standard, and add regression tests for tax/total math.                                                          |
| P0       | Done   | Fix CI: replace the non-existent `docs:check` step with real lint/typecheck/build/test gates that run on every PR and push across all four apps; enable CodeQL on PR/push instead of manual dispatch only.                                        |
| P0       | Done   | Add unit/integration test coverage for pricing, permissions, payment state, and organization scoping, per the Engineering Standards doc, starting with the areas above.                                                                           |
| P1       | Done   | Move admin CRM session storage off `localStorage` and add baseline security headers (CSP, X-Frame-Options, HSTS) in `next.config.ts`.                                                                                                             |
| P1       | Done   | Escape/sanitize user-influenced text before it reaches `document.write` in the admin CRM invoice document builder.                                                                                                                                |
| P1       | Done   | Require server-side confirmation of organization/branch membership when the admin CRM workspace switcher changes context, not just a client-side header swap.                                                                                     |
| P1       | Done   | Decompose the admin CRM's single-file `CrmShell.tsx` into per-module screens and shared hooks; add a real API client layer, `react-hook-form`/`zod` validation, and `@tanstack/react-query` for server state.                                     |
| P1       | Done   | Add mobile token refresh handling with a defined session-expiry recovery path.                                                                                                                                                                    |
| P1       | Done   | Scope `CrmUser.email` uniqueness per organization instead of globally.                                                                                                                                                                            |
| P2       | Done   | Build out public website legal pages, SEO scaffolding (sitemap, robots.txt, JSON-LD, per-page metadata), cookie consent, and honeypot/rate-limit protection on the public lead form. Destination/package/blog content routes remain future scope. |
| P2       | Done   | Wire `packages/api-contract` into a real generated OpenAPI spec (`tripos-api-server` boots its Nest app context to produce it); `contracts:generate`/`contracts:check` now operate on real output.                                                |
| P1       | Done   | Add `.env.example` and a real ESLint config (`lint` running ESLint, `typecheck` running `tsc --noEmit`) to `tripos-admin-crm`, `tripos-mobile-app`, and `tripos-public-website`. Turborepo/Nx intentionally not introduced.                       |
| P0       | Done   | Protect CRM routes with bearer auth by default.                                                                                                                                                                                                   |
| P0       | Done   | Enforce organization/branch scope for create, list, detail, update, delete, and status mutation paths.                                                                                                                                            |
| P0       | Done   | Add RBAC decorators/guard and platform-only organization management.                                                                                                                                                                              |
| P0       | Done   | Add refresh-session rotation.                                                                                                                                                                                                                     |
| P0       | Done   | Add basic backend audit logging.                                                                                                                                                                                                                  |
| P0       | Done   | Sync TripOS API `tsconfig.json` with Node16 module/moduleResolution settings for production NestJS builds.                                                                                                                                        |
| P0       | Done   | Complete deep workflow endpoints for leads, quotations, itineraries, bookings, finance, and documents.                                                                                                                                            |
| P0       | Done   | Add password reset and user invitation backend flows.                                                                                                                                                                                             |
| P0       | Done   | Add file storage abstraction for passports, vouchers, tickets, contracts, receipts, and generated PDFs.                                                                                                                                           |
| P0       | Done   | Add fine-grained module permission map and admin UI permission management.                                                                                                                                                                        |
| P0       | Done   | Add audit-log list/export APIs and admin CRM audit screens.                                                                                                                                                                                       |
| P1       | Done   | Add production provider adapters for email, WhatsApp, SMS, payments, maps, storage, and monitoring. Sandbox/local health and smoke-test adapters are code-ready; live credentials remain external.                                                |
| P1       | Done   | Add backup/restore runbook, index audit, load testing, and staging smoke scripts. Runbook and repo-side hooks are documented; execution evidence remains external.                                                                                |
| P1       | Done   | Add scheduled saved-report execution endpoint with next-run tracking and run result metadata.                                                                                                                                                     |
| P1       | Done   | Add generated HTML document templates for quotations, itineraries, invoices, and vouchers as renderer-ready payloads.                                                                                                                             |
| P1       | Done   | Add platform pricing plans, organization subscriptions, seeded launch plans, and CRM subscription management screens.                                                                                                                             |
| P1       | Done   | Add CRM user My Profile, change password, notification preferences, and schema-driven edit forms for module records.                                                                                                                              |
| P1       | Done   | Align product, planning, database, security, technical architecture, and API documents with the current implementation.                                                                                                                           |

## Module Completion Focus

The next code-side completion order, updated after the 2026-08-12 independent review, is:

1. Enter real provider credentials and run sandbox/live smoke tests from `/api/v1/integrations/smoke-tests`.
2. Deploy staging/production and attach QA, backup/restore, load-test, and monitoring evidence.
3. Produce store release builds for mobile after final branding/legal review.

Step 1 is ordered first because live provider credentials and deployment evidence cannot be completed purely inside the repository.
