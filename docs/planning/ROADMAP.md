# TripOS Task Roadmap

Last reviewed: 2026-08-12

TripOS is being built for launch as soon as the product is code-ready and the production environment is activated. This roadmap does not use 90-day or future-phase timing. Status reflects current code-side readiness in this repository.

An independent code-level review (not just documentation claims) was completed on 2026-08-12 across all four apps and repo-level CI/tooling. See "Independent Engineering Review — 2026-08-12" below before trusting the "Product Ready" labels elsewhere in this document. The launch-blocking review rows called out there have now been closed in code.

Status legend:

- `Product Ready`: dedicated backend/API and frontend/mobile surface exist with organization scoping, auth, and audit-aware operations where applicable.
- `Workflow Ready`: usable MVP workflow exists, but provider callbacks, production evidence, or advanced QA still need expansion.
- `Foundation`: schema/module shell exists; needs richer production workflow.
- `External`: blocked by infrastructure, provider credentials, legal/security review, or live deployment setup.

## Production Gates

| Priority | Launch gate                                                                                        | Status           |
| -------- | -------------------------------------------------------------------------------------------------- | ---------------- |
| P0       | Production environment, secrets, MongoDB, Redis, S3-compatible storage, strict CORS, seeder policy | External         |
| P0       | API lint/typecheck/build, admin CRM build, public website build, mobile typecheck                  | Verified locally |
| P0       | Organization/branch isolation, authenticated protected routes, RBAC, refresh rotation              | Product Ready    |
| P0       | Audit logging, scoped audit list API, and CSV export payloads                                      | Product Ready    |
| P0       | Provider smoke tests for email, WhatsApp, SMS, payments, storage, maps, analytics, monitoring      | External         |
| P0       | Desktop/tablet CRM QA, mobile Android/iOS QA, public website SEO/legal QA                          | Pending QA       |
| P0       | Backup/restore, load testing, monitoring alerts, incident runbook                                  | External         |

## Independent Engineering Review — 2026-08-12

Scope: `tripos-api-server`, `tripos-admin-crm`, `tripos-mobile-app`, `tripos-public-website`, and repo-level CI/tooling, read directly from code rather than from prior status docs.

### What is genuinely solid

- Backend module boundaries under `tripos-api-server/src/modules/*` are clean and match the documented domain-module shape; no dead modules found.
- Core organization scoping is real, not cosmetic: `SessionAuthGuard` overwrites `organizationId`/`branchId` on every authenticated request from the server-side session (not client input), and repository helpers thread that value into queries consistently, backed by compound `organizationId`-first indexes.
- Session-based auth (opaque token, SHA-256 hashed, Mongo TTL expiry, rotate-and-revoke on refresh) is a defensible, secure design, even though it does not match the "JWT claims" story described elsewhere in these docs. `.env.example` still defines unused `JWT_SECRET`/`JWT_REFRESH_SECRET` values, which should be removed so nobody assumes JWT verification exists.
- Password hashing uses scrypt with a per-user random salt and constant-time comparison.
- Audit logging is real (global interceptor, actor/org/branch/ip/outcome/duration captured on every mutation and sensitive read) and does not log request bodies, so it avoids leaking secrets/PII into the audit trail. It does not yet capture before/after field diffs.
- A global `ValidationPipe` with `class-validator` DTOs is applied API-wide.
- Swagger/OpenAPI is genuinely wired up and served at `/api/docs`, matching the docs.
- The mobile app correctly uses `expo-secure-store` for token storage (not AsyncStorage), and its screens are genuinely API-backed rather than static/mock data — more mature than the "shell only" framing in this roadmap suggests.
- The admin CRM has more accessibility and responsive groundwork than expected (aria attributes, dark-mode media queries, tablet/mobile breakpoints), ahead of where "QA pending" implied.

### Closed Critical Risks

1. **Public lead organization injection closed.** `POST /api/v1/public/leads` now ignores client-supplied organization/branch fields and derives them from server-side public intake configuration guarded by `x-public-intake-token`.
2. **RBAC enforcement coverage closed.** `RbacGuard` now infers module/action permissions for protected domain controllers when explicit decorators are absent, so the existing permission catalog is enforced centrally.
3. **Demo admin bootstrap gated.** `admin@tripos.test` is only auto-created when `TRIPOS_ENABLE_DEMO_ADMIN=true` outside production.
4. **Auth/public rate limiting added.** API bootstrap now applies a rate limiter to authentication and public endpoints.
5. **Money precision baseline added.** Payments and invoices now persist integer minor-unit fields (`amountMinor`, `totalsMinor`) and invoice tax/total regression tests cover rounding behavior.
6. **CI gates fixed.** GitHub Verify now installs and checks all four apps with lint/typecheck/build/test gates, and CodeQL runs on PR/push.
7. **Automated tests added.** Focused API tests now cover money precision, permission enforcement, public lead scoping, and organization scope override behavior.
8. **Admin CRM session/XSS risk reduced.** Bearer session state is in-memory only, baseline security headers are configured, and invoice export HTML escapes user-influenced text before `document.write`.
9. **Workspace switcher server-confirmed.** Organization/branch context changes call `auth/me` with the candidate context and are accepted only after backend confirmation.

### High-priority gaps

All nine items below were closed on 2026-08-12 (see the corresponding `Done` rows in the Immediate Build-Now Backlog). Left in place as a record of what was wrong and why; not a current-state description.

- ~~The admin CRM is architecturally a single ~2,800-line file (`CrmShell.tsx`) generating every screen from one config array via three generic components. Several modules (dashboard, invoices, all reports) have empty form configs, meaning no create/edit UI exists for them at all yet. This will not scale past the current module count without becoming unmaintainable.~~ Resolved: decomposed into `lib/`, `hooks/`, `modules/config/*`, `validation/`, and one component per screen; `navGroups` is now derived from module config instead of hand-maintained, which also fixed 8 modules that had silently gone missing from the sidebar.
- ~~No client-side form validation library (no zod/yup/react-hook-form) anywhere in the CRM; validation is "is this field non-empty."~~ Resolved: `RecordForm` and `InvoiceBuilder` now use `react-hook-form` + `zod` with real per-field error messages.
- ~~No server-state library (React Query/SWR) despite the README recommending one; every navigation and search keystroke re-fetches from scratch with no caching, retry, or dedup.~~ Resolved: module list/dashboard reads and create/status/import mutations moved to `@tanstack/react-query`.
- ~~The mobile app has no token refresh logic — sessions simply start failing once the token expires, with no recovery path — and carries unused `@react-navigation` dependencies in place of a real router.~~ Resolved: added a coalescing refresh-and-retry wrapper around authenticated requests, and removed the three unused `@react-navigation/*` packages.
- ~~The public website is far behind its own MVP scope: ... no sitemap/robots.txt/JSON-LD/per-page metadata, no legal pages ... no captcha/honeypot/rate limiting on the public lead form. `app/api/demo-request/route.ts` is dead code that never forwards to the backend.~~ Resolved: added `sitemap.ts`/`robots.ts`, Open Graph/JSON-LD metadata, real privacy/terms/refund-policy pages, a cookie consent banner, and turned the dead API route into a real server-side proxy with a honeypot field and per-IP rate limiting. Destination/package/blog content routes remain out of scope (tracked separately, not a gap in this list).
- ~~`packages/api-contract` is pure scaffolding ... there is no enforced shared contract between the backend and any frontend.~~ Resolved: added `tripos-api-server/src/modules/tripos/generate-openapi.ts`, which boots the Nest app context and writes a real spec; `scripts/snapshot-openapi.mjs` now calls it instead of logging a placeholder.
- ~~There is no real monorepo tooling ... Only `tripos-api-server` has a real ESLint config; the three frontend apps' `lint` scripts just run `tsc --noEmit`.~~ Partially resolved: all three frontend apps now have real ESLint configs (`eslint-config-next` / `eslint-config-expo`) with `lint` running ESLint and a separate `typecheck` script for the type check. Turborepo/Nx was deliberately not introduced given current team size.
- ~~`.env.example` exists only for `tripos-api-server`; the three frontend apps have none ... no secrets-manager integration path defined for production.~~ Resolved for the example files (all four apps now have one). The secrets-manager integration path itself remains documentation-only (AWS Secrets Manager per the deployment plan) since no target credentials exist yet to integrate against.
- ~~`CrmUser.email` is globally unique across the whole platform rather than scoped per organization ...~~ Resolved: uniqueness is now enforced as a compound `(organizationId, email)` index; login now requires `organizationCode` to resolve the account, and invitation upserts are organization-scoped.

### What this means for sequencing

The critical risks above were resolved before further feature work. Remaining launch work is now focused on external provider credentials, production deployment evidence, and QA sign-off.

## Current Implementation Status

Completed in the repo:

- Monorepo structure uses product-specific app boundaries for API, CRM, mobile, public website, packages, scripts, and documentation.
- MongoDB-backed `tripos-api-server` modules for leads, customers, quotations, itineraries, bookings, suppliers, operations, B2B agents, payments, destinations, tour packages, travel documents, vouchers, support tickets, campaigns, organizations, auth, finance invoices, and audit logs.
- Admin CRM connected to dedicated production APIs with bearer session handling.
- CRM list pagination, status filtering, server-side search, organization/branch-scoped create/detail/update/delete, and status mutation scoping.
- Organization, branch, department, team, CRM user, role, permission, user-role, and role-permission CRUD; login, logout, session restore, refresh rotation, RBAC decorators/guard, and platform-only organization management.
- Basic audit logging for authenticated mutations and sensitive finance/payment/document/organization reads, with scoped list and CSV export APIs.
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

| #   | Module                             | API status     | Admin CRM status | Mobile/Public status    | Remaining production work                                              |
| --- | ---------------------------------- | -------------- | ---------------- | ----------------------- | ---------------------------------------------------------------------- |
| 1   | Authentication and Sessions        | Product Ready  | Product Ready    | Workflow Ready          | MFA/SSO provider and email delivery provider                           |
| 2   | Organization and Branch Management | Product Ready  | Product Ready    | N/A                     | Organization onboarding polish, storage/sync adapters                  |
| 3   | Departments and Teams              | Product Ready  | Product Ready    | N/A                     | Manager/member selection UX and role QA                                |
| 4   | RBAC and Permissions               | Product Ready  | Product Ready    | Workflow Ready          | Role QA and production admin policy sign-off                           |
| 5   | Audit Logs                         | Product Ready  | Product Ready    | N/A                     | Retention policies and production export review                        |
| 6   | Leads                              | Product Ready  | Product Ready    | Agent Workflow Ready    | Follow-up tasks, duplicate merge, import/export                        |
| 7   | Customers                          | Workflow Ready | Product Ready    | Customer Workflow Ready | Customer timeline, profile edit depth                                  |
| 8   | Quotations                         | Workflow Ready | Product Ready    | Agent Workflow Ready    | Binary PDF renderer/storage, send provider integration                 |
| 9   | Itineraries                        | Workflow Ready | Product Ready    | Customer Workflow Ready | Rich day/item editor, binary PDF renderer/storage, share links         |
| 10  | Bookings                           | Product Ready  | Product Ready    | Customer Workflow Ready | CRM UX polish for passenger/payment/voucher subflows                   |
| 11  | Suppliers                          | Product Ready  | Product Ready    | N/A                     | Production supplier contract QA                                        |
| 12  | Operations                         | Product Ready  | Product Ready    | Agent Workflow Ready    | Assignment automation QA and escalation policy sign-off                |
| 13  | B2B Agents                         | Product Ready  | Product Ready    | Agent Workflow Ready    | KYC policy sign-off and live finance reconciliation                    |
| 14  | Payments                           | Product Ready  | Product Ready    | Customer Workflow Ready | Gateway callbacks and bank reconciliation provider hooks               |
| 15  | Finance Invoices                   | Workflow Ready | Product Ready    | N/A                     | Binary PDF renderer/storage, accounting export, tax validation         |
| 16  | Destinations and Packages          | Workflow Ready | Product Ready    | Public Workflow Ready   | CMS depth, SEO publishing workflow                                     |
| 17  | Travel Documents                   | Workflow Ready | Product Ready    | Customer Workflow Ready | Verification UI depth and production storage credentials               |
| 18  | Vouchers                           | Workflow Ready | Product Ready    | Customer Workflow Ready | Supplier confirmation linkage and binary PDF renderer/storage          |
| 19  | Support Tickets                    | Workflow Ready | Product Ready    | Customer Workflow Ready | SLA, assignment, communication provider hooks                          |
| 20  | Campaigns and Marketing            | Workflow Ready | Product Ready    | Public Workflow Ready   | Email/WhatsApp automation providers                                    |
| 21  | Public Website                     | Workflow Ready | N/A              | Workflow Ready          | Production domain, analytics consent, SEO QA                           |
| 22  | Mobile Customer/Agent App          | Workflow Ready | N/A              | Workflow Ready          | Release builds, offline sync, role-specific API depth                  |
| 23  | Integrations                       | Workflow Ready | Workflow Ready   | N/A                     | Live provider credentials, callbacks, and webhook verification         |
| 24  | Reporting and Analytics            | Product Ready  | Product Ready    | N/A                     | Dashboard QA and production delivery provider for scheduled exports    |
| 25  | AI Travel Assistant                | Workflow Ready | Foundation       | N/A                     | Live provider gateway credentials, usage metering, prompt audit policy |

## Immediate Build-Now Backlog

Rows added from the 2026-08-12 independent review are retained as an audit trail. All P0/P1 code-side review rows are now marked `Done`; external provider/deployment evidence remains tracked separately.

| Priority | Status  | Task                                                                                                                                                                                                                                              |
| -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P0       | Done    | Fix public lead organization injection: derive `organizationId` server-side from a public intake/campaign token on `/api/v1/public/leads`, never trust a client-supplied `organizationId`.                                                        |
| P0       | Done    | Add central permission enforcement to all mutating and sensitive-read endpoints so the existing permission catalog is actually enforced.                                                                                                          |
| P0       | Done    | Remove or strictly `NODE_ENV`-gate the auto-created demo admin account (`admin@tripos.test`) so it cannot materialize in staging or production.                                                                                                   |
| P0       | Done    | Add rate limiting to authentication endpoints and all public/unauthenticated endpoints.                                                                                                                                                           |
| P0       | Done    | Migrate financial fields (invoice totals, payment amounts) to integer minor units plus currency code, matching the database model standard, and add regression tests for tax/total math.                                                          |
| P0       | Done    | Fix CI: replace the non-existent `docs:check` step with real lint/typecheck/build/test gates that run on every PR and push across all four apps; enable CodeQL on PR/push instead of manual dispatch only.                                        |
| P0       | Done    | Add unit/integration test coverage for pricing, permissions, payment state, and organization scoping, per the Engineering Standards doc, starting with the areas above.                                                                           |
| P1       | Done    | Move admin CRM session storage off `localStorage` and add baseline security headers (CSP, X-Frame-Options, HSTS) in `next.config.ts`.                                                                                                             |
| P1       | Done    | Escape/sanitize user-influenced text before it reaches `document.write` in the admin CRM invoice document builder.                                                                                                                                |
| P1       | Done    | Require server-side confirmation of organization/branch membership when the admin CRM workspace switcher changes context, not just a client-side header swap.                                                                                     |
| P1       | Done    | Decompose the admin CRM's single-file `CrmShell.tsx` into per-module screens and shared hooks; add a real API client layer, `react-hook-form`/`zod` validation, and `@tanstack/react-query` for server state.                                     |
| P1       | Done    | Add mobile token refresh handling with a defined session-expiry recovery path.                                                                                                                                                                    |
| P1       | Done    | Scope `CrmUser.email` uniqueness per organization instead of globally.                                                                                                                                                                            |
| P2       | Done    | Build out public website legal pages, SEO scaffolding (sitemap, robots.txt, JSON-LD, per-page metadata), cookie consent, and honeypot/rate-limit protection on the public lead form. Destination/package/blog content routes remain future scope. |
| P2       | Done    | Wire `packages/api-contract` into a real generated OpenAPI spec (`tripos-api-server` boots its Nest app context to produce it); `contracts:generate`/`contracts:check` now operate on real output.                                                |
| P1       | Done    | Add `.env.example` and a real ESLint config (`lint` running ESLint, `typecheck` running `tsc --noEmit`) to `tripos-admin-crm`, `tripos-mobile-app`, and `tripos-public-website`. Turborepo/Nx intentionally not introduced.                       |
| P0       | Done    | Protect CRM routes with bearer auth by default.                                                                                                                                                                                                   |
| P0       | Done    | Enforce organization/branch scope for create, list, detail, update, delete, and status mutation paths.                                                                                                                                            |
| P0       | Done    | Add RBAC decorators/guard and platform-only organization management.                                                                                                                                                                              |
| P0       | Done    | Add refresh-session rotation.                                                                                                                                                                                                                     |
| P0       | Done    | Add basic backend audit logging.                                                                                                                                                                                                                  |
| P0       | Done    | Sync TripOS API `tsconfig.json` with Node16 module/moduleResolution settings for production NestJS builds.                                                                                                                                        |
| P0       | Done    | Complete deep workflow endpoints for leads, quotations, itineraries, bookings, finance, and documents.                                                                                                                                            |
| P0       | Done    | Add password reset and user invitation backend flows.                                                                                                                                                                                             |
| P0       | Done    | Add file storage abstraction for passports, vouchers, tickets, contracts, receipts, and generated PDFs.                                                                                                                                           |
| P0       | Done    | Add fine-grained module permission map and admin UI permission management.                                                                                                                                                                        |
| P0       | Done    | Add audit-log list/export APIs and admin CRM audit screens.                                                                                                                                                                                       |
| P1       | Partial | Add production provider adapters for email, WhatsApp, SMS, payments, maps, storage, and monitoring. Local/log health adapters are done; live credentials/webhooks remain external.                                                                |
| P1       | Partial | Add backup/restore runbook, index audit, load testing, and staging smoke scripts. Runbook is documented; execution evidence remains external.                                                                                                     |
| P1       | Done    | Add scheduled saved-report execution endpoint with next-run tracking and run result metadata.                                                                                                                                                     |
| P1       | Done    | Add generated HTML document templates for quotations, itineraries, invoices, and vouchers as renderer-ready payloads.                                                                                                                             |

## Module Completion Focus

The next code-side completion order, updated after the 2026-08-12 independent review, is:

1. Complete external provider credentials, production webhooks, and deployment smoke evidence.
2. Connect generated document templates to a binary PDF renderer and storage adapter.
3. Mobile customer/agent screen depth and offline cache conflict QA.

Step 1 is ordered first because live provider credentials and deployment evidence cannot be completed purely inside the repository.
