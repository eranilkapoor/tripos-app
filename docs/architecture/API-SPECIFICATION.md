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

- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh`
- `POST /auth/password/forgot`
- `POST /auth/password/reset`
- `GET /auth/me`

### Organizations

- `POST /organizations`
- `GET /organizations/current`
- `PATCH /organizations/current`
- `POST /organizations/invitations`
- `GET /organizations/users`
- `PATCH /organizations/users/:id`

### CRM

- `POST /crm/leads`
- `GET /crm/leads`
- `GET /crm/leads/:id`
- `PATCH /crm/leads/:id`
- `POST /crm/leads/:id/assign`
- `POST /crm/leads/:id/tasks`
- `POST /crm/leads/:id/notes`
- `POST /crm/leads/:id/activities`
- `POST /crm/leads/:id/convert-to-customer`
- `GET /crm/customers`
- `GET /crm/customers/:id`

### Quotations

- `POST /sales/quotations`
- `GET /sales/quotations`
- `GET /sales/quotations/:id`
- `PATCH /sales/quotations/:id`
- `POST /sales/quotations/:id/calculate`
- `POST /sales/quotations/:id/send`
- `POST /sales/quotations/:id/accept`
- `POST /sales/quotations/:id/pdf`

### Itineraries

- `POST /itineraries`
- `GET /itineraries/:id`
- `PATCH /itineraries/:id`
- `POST /itineraries/:id/days`
- `PATCH /itineraries/:id/days/:dayId`
- `POST /itineraries/:id/items`
- `PATCH /itineraries/:id/items/:itemId`

### Bookings

- `POST /bookings/from-quotation/:quotationId`
- `GET /bookings`
- `GET /bookings/:id`
- `PATCH /bookings/:id/status`
- `POST /bookings/:id/passengers`
- `POST /bookings/:id/payments`
- `POST /bookings/:id/vouchers`

### Finance

- `GET /finance/receivables`
- `GET /finance/payables`
- `GET /finance/bookings/:bookingId/profitability`
- `POST /finance/payments`
- `POST /finance/refunds`

### AI

- `POST /ai/itinerary-drafts`
- `POST /ai/quotation-assist`
- `POST /ai/sales-reply`

