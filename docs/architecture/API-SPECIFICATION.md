# TripOS API Specification

## API Style

- REST APIs for v1.
- OpenAPI documentation generated from backend decorators.
- JSON request and response bodies.
- Cursor pagination for large lists.
- Idempotency keys for payments, booking conversion, and supplier confirmations.
- Tenant context derived from authenticated user claims and selected organization.

## Base Route Pattern

```text
/api/v1/auth
/api/v1/organizations
/api/v1/crm
/api/v1/sales
/api/v1/itineraries
/api/v1/bookings
/api/v1/suppliers
/api/v1/operations
/api/v1/finance
/api/v1/b2b
/api/v1/cms
/api/v1/marketing
/api/v1/communications
/api/v1/ai
```

## MVP Endpoints

### Auth

- `POST /auth/login` - implemented
- `POST /auth/logout` - implemented
- `GET /auth/me` - implemented
- `POST /auth/register-crm-user` - implemented for CRM bootstrap/admin use
- `POST /auth/refresh` - implemented
- `POST /auth/password/forgot` - implemented
- `POST /auth/password/reset` - implemented
- `POST /auth/invitations` - implemented
- `POST /auth/invitations/accept` - implemented

### Organizations

- `POST /tenants` - implemented
- `GET /tenants` - implemented
- `GET /tenants/:id` - implemented
- `PATCH /tenants/:id` - implemented
- `DELETE /tenants/:id` - implemented as inactive status transition
- `GET /organizations/current` - implemented
- `PATCH /organizations/current` - implemented
- `POST /auth/invitations` - implemented
- `GET /auth/users` - implemented
- `GET /auth/users/:id` - implemented
- `PATCH /auth/users/:id` - implemented
- `PATCH /auth/users/:id/permissions` - implemented
- `DELETE /auth/users/:id` - implemented as inactive status transition and session revocation
- `GET /auth/permissions/catalog` - implemented

### Implemented Travel CRM Modules

- `POST /leads`
- `GET /leads`
- `GET /leads/:id`
- `PATCH /leads/:id/assign`
- `PATCH /leads/:id/stage`
- `POST /customers`
- `GET /customers`
- `GET /customers/:id`
- `PATCH /customers/:id/status`
- `POST /quotations`
- `GET /quotations`
- `GET /quotations/:id`
- `PATCH /quotations/:id/status`
- `POST /itineraries`
- `GET /itineraries`
- `GET /itineraries/:id`
- `PATCH /itineraries/:id/status`
- `POST /bookings`
- `GET /bookings`
- `GET /bookings/:id`
- `PATCH /bookings/:id/status`
- `POST /suppliers`
- `GET /suppliers`
- `POST /operations`
- `GET /operations`
- `POST /b2b-agents`
- `GET /b2b-agents`
- `POST /payments`
- `GET /payments`
- `GET /payments/summary`
- `POST /destinations`
- `GET /destinations`
- `POST /tour-packages`
- `GET /tour-packages`
- `POST /travel-documents`
- `GET /travel-documents`
- `POST /vouchers`
- `GET /vouchers`
- `POST /support-tickets`
- `GET /support-tickets`
- `POST /campaigns`
- `GET /campaigns`
- `POST /finance/invoices`
- `GET /finance/invoices`
- `GET /finance/invoices/next-number/:series`
- `POST /finance/invoices/:id/pdf`

All main list endpoints support `page`, `limit`, `search`, and `status` where applicable. Tenant-scoped domain modules expose enterprise CRUD with `POST /module`, `GET /module`, `GET /module/:id`, `PATCH /module/:id`, `PATCH /module/:id/status` where status applies, and `DELETE /module/:id`.

### Deep Workflow Endpoints

- `POST /leads/:id/notes` - implemented
- `GET /leads/:id/activities` - implemented
- `POST /leads/:id/activities` - implemented
- `POST /crm/leads/:id/convert-to-customer` - not required for launch; customer creation and lead won stage are API-backed
- `POST /quotations/:id/calculate` - implemented
- `POST /quotations/:id/send` - implemented
- `POST /quotations/:id/accept` - implemented
- `POST /quotations/:id/pdf` - implemented as generated HTML template payload; binary renderer/storage adapter pending
- `POST /itineraries/:id/days` - implemented
- `PATCH /itineraries/:id/days/:dayId` - implemented
- `POST /itineraries/:id/items` - implemented
- `POST /itineraries/:id/pdf` - implemented as generated HTML template payload; binary renderer/storage adapter pending
- `PATCH /itineraries/:id/items/:itemId` - not required for launch; day updates and item append are API-backed
- `POST /bookings/from-quotation/:quotationId` - implemented
- `POST /bookings/:id/passengers` - implemented
- `POST /bookings/:id/payments` - implemented
- `POST /bookings/:id/vouchers` - implemented
- `POST /vouchers/:id/pdf` - implemented as generated HTML template payload; binary renderer/storage adapter pending
- `GET /finance/receivables` - implemented
- `GET /finance/payables` - implemented
- `GET /finance/bookings/:bookingId/profitability` - implemented
- `POST /finance/refunds` - implemented
- `GET /audit-logs` - implemented
- `GET /audit-logs/export.csv` - implemented
- `GET /storage/files` - implemented
- `POST /storage/files/upload-intent` - implemented
- `GET /storage/files/:id` - implemented
- `PATCH /storage/files/:id` - implemented
- `DELETE /storage/files/:id` - implemented
- `GET /integrations/health` - implemented
- `GET /reporting/overview` - implemented
- `GET /reporting/sales-funnel` - implemented
- `GET /reporting/operations` - implemented
- `GET /reporting/finance` - implemented
- `POST /saved-reports` - implemented
- `GET /saved-reports` - implemented
- `POST /saved-reports/run-due` - implemented
- `POST /saved-reports/:id/run` - implemented
- `PATCH /saved-reports/:id/status` - implemented

### AI

- `POST /ai/itinerary-drafts` - implemented with local/provider-ready response
- `POST /ai/quotation-assist` - implemented with local/provider-ready response
- `POST /ai/sales-reply` - implemented with local/provider-ready response
