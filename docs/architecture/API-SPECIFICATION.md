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
- `POST /auth/refresh` - pending
- `POST /auth/password/forgot` - pending
- `POST /auth/password/reset` - pending

### Organizations

- `POST /tenants` - implemented
- `GET /tenants` - implemented
- `GET /tenants/:id` - implemented
- `GET /organizations/current` - pending alias
- `PATCH /organizations/current` - pending
- `POST /organizations/invitations`
- `GET /organizations/users`
- `PATCH /organizations/users/:id`

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

All main list endpoints support `page`, `limit`, `search`, and `status` where applicable.

### Pending Deep Workflow Endpoints

- `POST /crm/leads/:id/tasks`
- `POST /crm/leads/:id/notes`
- `POST /crm/leads/:id/activities`
- `POST /crm/leads/:id/convert-to-customer`
- `POST /sales/quotations/:id/calculate`
- `POST /sales/quotations/:id/send`
- `POST /sales/quotations/:id/accept`
- `POST /sales/quotations/:id/pdf`
- `POST /itineraries/:id/days`
- `PATCH /itineraries/:id/days/:dayId`
- `POST /itineraries/:id/items`
- `PATCH /itineraries/:id/items/:itemId`
- `POST /bookings/from-quotation/:quotationId`
- `POST /bookings/:id/passengers`
- `POST /bookings/:id/payments`
- `POST /bookings/:id/vouchers`
- `GET /finance/receivables`
- `GET /finance/payables`
- `GET /finance/bookings/:bookingId/profitability`
- `POST /finance/refunds`

### AI

- `POST /ai/itinerary-drafts`
- `POST /ai/quotation-assist`
- `POST /ai/sales-reply`
