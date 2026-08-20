# TripOS API Specification

## API Style

- REST APIs under `/api/v1`.
- JSON request and response bodies.
- OpenAPI documentation is generated from NestJS decorators.
- List endpoints use `page`, `limit`, `search`, and `status` where applicable.
- Organization and branch context is derived from authenticated user claims and the selected workspace headers/session.
- Organization-scoped modules use the standard CRUD contract unless noted:
  - `POST /module`
  - `GET /module`
  - `GET /module/:id`
  - `PATCH /module/:id`
  - `PATCH /module/:id/status`
  - `DELETE /module/:id`

## Base Routes

```text
/api/v1/auth
/api/v1/organizations
/api/v1/identity
/api/v1/leads
/api/v1/customers
/api/v1/quotations
/api/v1/itineraries
/api/v1/bookings
/api/v1/suppliers
/api/v1/operations
/api/v1/b2b-agents
/api/v1/payments
/api/v1/finance
/api/v1/destinations
/api/v1/tour-packages
/api/v1/travel-documents
/api/v1/vouchers
/api/v1/support-tickets
/api/v1/notifications
/api/v1/campaigns
/api/v1/plans
/api/v1/subscriptions
/api/v1/settings
/api/v1/tags
/api/v1/tasks
/api/v1/workflows
/api/v1/communications
/api/v1/feature-flags
/api/v1/imports-exports
/api/v1/operating-records/:moduleKey
/api/v1/storage/files
/api/v1/reporting
/api/v1/saved-reports
/api/v1/batch-jobs
/api/v1/integrations
/api/v1/ai
```

## Auth And Account

- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh`
- `GET /auth/me`
- `PATCH /auth/me`
- `POST /auth/change-password`
- `POST /auth/workspace`
- `POST /auth/register-crm-user`
- `POST /auth/password/forgot`
- `POST /auth/password/reset`
- `POST /auth/invitations`
- `POST /auth/invitations/accept`
- `GET /auth/users`
- `GET /auth/users/:id`
- `PATCH /auth/users/:id`
- `PATCH /auth/users/:id/permissions`
- `DELETE /auth/users/:id`
- `GET /auth/permissions/catalog`

CRM users include profile, phone, locale, timezone, branch access, department/team access, permissions, notification preferences, and session security fields.

## Organizations

- `POST /organizations` - platform admin
- `GET /organizations` - platform admin
- `GET /organizations/current`
- `PATCH /organizations/current`
- `GET /organizations/:id` - platform admin
- `PATCH /organizations/:id` - platform admin
- `PATCH /organizations/:id/status` - platform admin
- `DELETE /organizations/:id` - inactive status transition

Organization records include billing profile, subscription snapshot, branding, compliance, security policy, integrations, data hosting mode, branches, and sync policy.

## Identity And Access

The following identity modules support list/search, create, detail, update, status update, and delete/inactive or revoke behavior:

- `identity/branches`
- `identity/departments`
- `identity/teams`
- `identity/roles`
- `identity/permissions`
- `identity/user-roles`
- `identity/role-permissions`
- `identity/invitations`

Permissions are platform-managed. Role, user-role, and role-permission records are organization scoped.

## Travel CRM Modules

These modules support the standard CRUD contract and are wired to Admin CRM forms, listings, search, sorting, import/export, detail, edit, and status controls:

- `leads`
- `customers`
- `quotations`
- `itineraries`
- `bookings`
- `suppliers`
- `operations`
- `b2b-agents`
- `payments`
- `destinations`
- `tour-packages`
- `travel-documents`
- `vouchers`
- `support-tickets`
- `notifications`
- `campaigns`
- `settings`
- `tags`
- `tasks`
- `saved-reports`
- `workflows`
- `communications`
- `feature-flags`
- `imports-exports`

The Admin CRM module configs expose the enterprise schema fields used by the DTOs, including owner/team/department references, external references, tags, metadata, commercial fields, costing, compliance, document references, tax/bank profiles, delivery data, consent, and reporting schedules.

The shared operating modules use `/operating-records/:moduleKey` with the standard CRUD contract. Supported module keys are `contacts`, `activities`, `follow-ups`, `meetings`, `notes`, `service-catalog`, `custom-fields`, `call-center`, `field-force`, `content`, and `analytics`.

## Finance And Documents

- `POST /finance/invoices`
- `GET /finance/invoices`
- `GET /finance/invoices/:id`
- `PATCH /finance/invoices/:id`
- `DELETE /finance/invoices/:id`
- `GET /finance/invoices/next-number/:series`
- `POST /finance/invoices/:id/pdf`
- `GET /finance/receivables`
- `GET /finance/payables`
- `GET /finance/bookings/:bookingId/profitability`
- `POST /finance/refunds`
- `GET /payments/summary`
- `GET /storage/files`
- `POST /storage/files/upload-intent`
- `GET /storage/files/:id`
- `PATCH /storage/files/:id`
- `DELETE /storage/files/:id`

The CRM invoice builder can save invoices and download document payloads as PDF, Doc, and Excel-compatible files from the browser-side utility.

## SaaS Pricing And Subscriptions

- `POST /plans` - platform admin
- `GET /plans`
- `GET /plans/:id`
- `PATCH /plans/:id` - platform admin
- `PATCH /plans/:id/status` - platform admin
- `DELETE /plans/:id` - platform admin
- `GET /subscriptions`
- `GET /subscriptions/current`
- `POST /subscriptions`
- `GET /subscriptions/:id`
- `PATCH /subscriptions/:id`
- `PATCH /subscriptions/:id/status`
- `POST /subscriptions/:id/cancel`
- `DELETE /subscriptions/:id` - platform admin

Plans define audience, billing cycle, currency, price minor units, setup fee, trial days, seats, features, limits, provider price references, and terms. Subscriptions are organization scoped and store plan snapshots, seats, renewal state, provider references, billing profile, and cancellation state.

## Deep Workflow Endpoints

- `PATCH /leads/:id/assign`
- `PATCH /leads/:id/stage`
- `GET /leads/:id/activities`
- `POST /leads/:id/notes`
- `POST /leads/:id/activities`
- `POST /quotations/:id/calculate`
- `POST /quotations/:id/send`
- `POST /quotations/:id/accept`
- `POST /quotations/:id/pdf`
- `POST /itineraries/:id/days`
- `PATCH /itineraries/:id/days/:dayId`
- `POST /itineraries/:id/items`
- `POST /itineraries/:id/pdf`
- `POST /bookings/from-quotation/:quotationId`
- `POST /bookings/:id/passengers`
- `POST /bookings/:id/payments`
- `POST /bookings/:id/vouchers`
- `POST /vouchers/:id/pdf`
- `POST /suppliers/:id/contracts`
- `POST /suppliers/:id/rates`
- `POST /suppliers/:id/confirmations`
- `POST /b2b-agents/:id/kyc-documents`
- `PATCH /b2b-agents/:id/credit-limit`
- `POST /b2b-agents/:id/commissions`
- `POST /b2b-agents/:id/wallet`
- `POST /b2b-agents/:id/invoices`
- `PATCH /operations/:id/assign`
- `PATCH /operations/:id/sla`
- `POST /operations/:id/escalations`
- `POST /operations/:id/timeline`

Document/PDF endpoints currently return renderer-ready HTML/template payloads. Binary renderer/live provider credentials remain deployment configuration.

## Reporting, Audit, Jobs, Integrations, AI

- `GET /audit-logs`
- `GET /audit-logs/export.csv`
- `GET /reporting/overview`
- `GET /reporting/sales-funnel`
- `GET /reporting/operations`
- `GET /reporting/finance`
- `POST /saved-reports/run-due`
- `POST /saved-reports/:id/run`
- `GET /batch-jobs`
- `POST /batch-jobs/run`
- `POST /batch-jobs/:name/run`
- `GET /integrations/health`
- `POST /integrations/smoke-tests`
- `POST /ai/itinerary-drafts`
- `POST /ai/quotation-assist`
- `POST /ai/sales-reply`

## CRM Contract

Admin CRM modules use the same `endpoint`, `fields`, `columns`, `rowMap`, and `statusOptions` configuration to keep the UI aligned with backend DTOs and schemas.

- Add forms submit `POST`.
- Edit forms submit `PATCH /:id`.
- Status dropdowns submit `PATCH /:id/status`, except leads stage updates, which use `PATCH /leads/:id/stage`.
- Listings support client-side sorting/pagination and API-backed search.
- Import uses module fields/row maps to submit JSON/CSV records through the same create API.
- Export supports CSV and JSON from the current filtered listing.
