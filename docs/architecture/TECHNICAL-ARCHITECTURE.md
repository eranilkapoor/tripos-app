# TripOS Technical Architecture

## Architecture Decision

TripOS v1 is a modular monolith with clean domain boundaries.

This keeps the product fast to build and launch while preserving a future path to extract high-volume modules, such as integrations, document rendering, notifications, or reporting, when commercial usage justifies it.

## Repository Layout

```text
tripos-app/
  tripos-api-server/       NestJS API
  tripos-admin-crm/        Next.js Admin CRM
  tripos-mobile-app/       Expo/React Native customer and agent app
  tripos-public-website/   Next.js public website
  packages/                Shared packages and contracts
  scripts/                 Repo automation
  docs/                    Product, architecture, operations, launch docs
```

There is no root Docker Compose or infrastructure folder in the current repository. Local and production infrastructure should be managed through deployment-specific configuration until the project needs checked-in IaC.

## Logical Architecture

```text
Public Website       Admin CRM        Mobile App
      \                 |                 /
                 REST API / BFF
                       |
             NestJS Modular Monolith
                       |
  -------------------------------------------------
  Auth  Organizations  Identity  CRM  Sales
  Itineraries  Bookings  Suppliers  Operations
  B2B Agents  Finance  Marketing  Files  Reporting
  Notifications  Integrations  AI  Settings
  -------------------------------------------------
                       |
       MongoDB      Local/S3-compatible storage
                       |
       Email/SMS/WhatsApp/Payments/Maps/AI providers
```

## Frontend Applications

- `tripos-admin-crm`: admin, organization management, Users, roles/permissions, sales, quotations, bookings, suppliers, operations, B2B agents, finance, invoices, reports, notifications, settings, pricing plans, and subscriptions.
- `tripos-public-website`: public destination/package/enquiry experience.
- `tripos-mobile-app`: customer and agent mobile experience for trips, documents, vouchers, payments, support, and role-specific work queues.

B2B and operations remain inside `tripos-admin-crm` for v1. Separate portals should be extracted only after partner or field-user volume makes that product split worthwhile.

## Backend Application

- `tripos-api-server` is a NestJS modular monolith.
- MongoDB/Mongoose provides persistence.
- Global guards provide session authentication and RBAC.
- Global validation uses `ValidationPipe` with transform and whitelist.
- Helmet and configurable CORS are enabled.
- Graceful shutdown marks readiness unavailable, drains traffic, and then closes the app.
- Swagger/OpenAPI is generated from decorators and served at `/api/docs`.

Implemented module families:

- Auth and sessions
- Organizations
- Identity and access
- Leads and customers
- Quotations
- Itineraries
- Bookings
- Suppliers
- Operations
- B2B agents
- Payments and invoices
- Destinations and tour packages
- Travel documents and vouchers
- Support tickets
- Notifications and campaigns
- Pricing plans and subscriptions
- Storage registry
- Reporting and saved reports
- Batch job runner
- Integrations health/smoke tests
- AI assistant endpoints
- Settings, tags, tasks

## Data Architecture

- MongoDB is the source of truth.
- MongoDB ObjectId is the primary identifier.
- Business-friendly numbers/codes are stored separately where needed.
- Organization-owned records include `organizationId`.
- Branch-scoped records include `branchId`.
- Mongoose timestamps provide `createdAt` and `updatedAt`.
- Money is stored as integer minor units plus currency code for finance-critical fields.
- Local storage is supported for development; S3-compatible configuration exists for production providers.

Redis and queue workers are part of the target architecture for cache, locks, queues, rate limits, and scheduled jobs. They are not currently runtime dependencies in the API package. Current batch jobs run through the Nest module/service layer.

## Multi-Organization Architecture

TripOS uses a shared MongoDB database with organization isolation for v1.

Enforcement happens in:

- Session-authenticated request claims
- Branch access checks in the session guard
- Organization-scoped controller helpers
- Shared CRUD query utilities
- RBAC module/action inference
- Audit logs

Enterprise upgrade path:

- Shared MongoDB database for standard organizations
- Dedicated MongoDB database for high-value enterprise organizations
- Customer-managed or hybrid sync connectors for strict data residency and on-premise requirements
- Dedicated infrastructure only for strict compliance, scale, or contract requirements

## CRM UI Architecture

Admin CRM uses schema-driven module configuration:

- `endpoint` decides API route.
- `fields` drives create/edit forms.
- `columns` and `rowMap` drive listings.
- `statusOptions` drives status dropdown mutation.
- Generic hooks handle list, create, update, status changes, import, export, refresh, and search.
- Custom panels exist where generic CRUD is not enough, such as My Profile, Change Password, Dashboard, and Invoice Builder.

## Event And Job Model

Current state:

- Batch jobs are implemented as API-triggerable Nest services.
- Audit events are captured through a Nest interceptor.
- Integrations expose health and smoke-test endpoints.
- Document endpoints return renderer-ready payloads.

Target upgrade path:

- Add Redis/BullMQ for durable background jobs.
- Add provider webhook consumers for payments, WhatsApp, SMS, email, and document rendering.
- Add outbox-style event persistence for financial and booking-critical events.
- Add dedicated worker processes when processing volume grows.

Important domain events for future extraction:

- LeadCreated
- LeadAssigned
- QuotationCreated
- QuotationSent
- QuotationAccepted
- BookingCreated
- BookingConfirmed
- PaymentReceived
- SupplierConfirmationRequested
- SupplierConfirmed
- TripStarted
- TripCompleted
- FeedbackReceived

## External Integrations

Provider categories:

- Email
- SMS
- WhatsApp Business
- Payment gateways
- Maps
- S3-compatible storage
- Document renderer
- Accounting exports
- AI providers
- Monitoring

The API exposes integration health and smoke-test endpoints so local, sandbox, configured, and missing-credential states are visible before launch. Live credentials and webhook hardening remain deployment tasks.

## AI Architecture

Current AI endpoints provide provider-ready/local responses for:

- itinerary drafts
- quotation assist
- sales replies

Target AI gateway responsibilities:

- Prompt templates
- Model routing
- Tool/function calling
- Organization-specific settings
- Usage metering
- Prompt and response audit logs
- Safety checks
- Retrieval over organization destinations, packages, suppliers, and policies

