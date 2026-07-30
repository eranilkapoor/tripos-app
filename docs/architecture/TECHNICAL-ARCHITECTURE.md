# TripOS Technical Architecture

## Architecture Decision

TripOS v1 should be a modular monolith with clean domain boundaries.

This gives the team speed for the first commercial product while keeping future service extraction possible. The first version should not begin with 20 microservices, Kafka, Kubernetes, and separate databases per module unless a paying enterprise contract requires it.

## Logical Architecture

```text
B2C Web        Admin CRM        Mobile App
    \              |              /
              API / BFF Layer
                    |
          NestJS Modular Monolith
                    |
  ------------------------------------------------
  Auth  Organization  CRM  Sales  Itinerary  Booking
  Supplier  Operations  Finance  Marketing  AI
  Communication  CMS  Reporting  Integrations
  ------------------------------------------------
                    |
      MongoDB   Redis/BullMQ  S3  Email/WhatsApp
```

## Frontend Applications

- `tripos-admin-crm`: internal CRM, admin, sales, operations, finance, marketing, reporting, supplier management, and restricted B2B agent workflows.
- `tripos-public-website`: public website, destination pages, package pages, enquiry and booking entry points.
- `tripos-mobile-app`: customer itinerary, documents, payments, support, feedback.

B2B and operations should remain inside `tripos-admin-crm` for v1. Extract them only when the product has enough partner or field-user activity to justify independent portals.

## Backend Application

- `tripos-api-server`: NestJS modular monolith.
- Module boundaries follow business domains.
- Each module should contain presentation, application, domain, infrastructure, and database layers where useful.

Example:

```text
quotation/
  presentation/
  application/
  domain/
  infrastructure/
  database/
```

## Data Architecture

- MongoDB is the source of truth for TripOS business data.
- Redis is used for cache, rate limits, queues, locks, and short-lived session acceleration.
- BullMQ handles asynchronous jobs in v1.
- S3-compatible storage holds PDFs, passports, images, invoices, vouchers, tickets, and uploaded documents.
- MongoDB text indexes are enough for v1 search.
- OpenSearch is optional and should be introduced only when MongoDB text indexes are not enough for destination, hotel, activity, supplier, and package search.

## Multi-Organization Architecture

Use shared database with organization isolation for v1.

Every organization-owned business document must include:

- `organizationId`
- `branchId` where branch-level access applies
- `createdBy`
- `updatedBy`
- `createdAt`
- `updatedAt`

Organization enforcement should happen in:

- Authentication claims
- API guards
- Repository/query layer
- Database indexes
- Audit logs

Enterprise upgrade path:

- Shared MongoDB database for standard organizations
- Dedicated database for high-value enterprise organizations
- Dedicated infrastructure only for strict compliance or scale requirements

## Event Model

Start with in-process domain events plus BullMQ jobs.

Important events:

- `LeadCreated`
- `LeadAssigned`
- `QuotationCreated`
- `QuotationSent`
- `QuotationAccepted`
- `BookingCreated`
- `BookingConfirmed`
- `PaymentReceived`
- `SupplierConfirmationRequested`
- `SupplierConfirmed`
- `TripStarted`
- `TripCompleted`
- `FeedbackReceived`

Later, Kafka can replace or complement BullMQ when integration volume and service count justify it.

## External Integrations

- WhatsApp Business API
- Email provider
- SMS provider
- Payment gateways
- Google Maps
- Hotel, flight, activity, visa, and insurance APIs
- Accounting export integrations
- CRM/web form importers

Each integration should be wrapped behind an internal provider interface to avoid vendor lock-in.

## AI Architecture

Create a centralized AI gateway instead of scattering AI calls across modules.

AI gateway responsibilities:

- Prompt templates
- Model routing
- Tool/function calling
- Organization-specific settings
- Usage metering
- Prompt and response audit logs
- Safety checks
- RAG over TripOS inventory and organization content

Initial AI use cases:

- Itinerary draft generation
- Quotation assistant
- Sales response suggestions
- Destination and package content generation
- Customer support draft replies
