# TripOS

TripOS is a multi-tenant Travel Operating System for tour operators, travel agencies, DMCs, B2B travel networks, and B2C holiday brands.

The product goal is to digitize the complete travel business lifecycle:

```text
Marketing -> Lead -> CRM -> Quotation -> Itinerary -> Booking
-> Suppliers -> Operations -> Payments -> Customer Experience -> Repeat Sales
```

TripOS should start as a modular SaaS platform, not as a generic OTA clone. The first commercial value is operational control for travel businesses: faster quotation creation, clean lead tracking, supplier coordination, payment visibility, and trip execution.

## Repository Shape

```text
tripos-app/
  tripos-admin-crm/       Internal CRM, admin, sales, finance, operations console
  tripos-api-server/      NestJS modular monolith backend
  tripos-mobile-app/      React Native mobile app for customers
  tripos-public-website/  Public website, packages, enquiry, SEO, booking engine
  packages/
    api-contract/    OpenAPI snapshot and generated API types
  scripts/           Repository-level automation scripts
  docs/
    product/         PRD, modules, roles, tenant model
    architecture/    Technical architecture, database, APIs, security
    planning/        Roadmap, MVP scope, execution plans
    operations/      Deployment, runbooks, support model
    standards/       Engineering, naming, testing, review standards
```

This intentionally follows the same top-level shape as `mentora-app`: each deployable application sits at the repository root with a product-prefixed folder name.

For v1, B2B agent workflows and DMC operations are modules inside `tripos-admin-crm`, protected by roles and permissions. They should not be separate deployable apps until agent or field-user self-service becomes a proven business need.

## Recommended Stack

- Frontend: Next.js, React, TypeScript
- Mobile: React Native with Expo
- Backend: NestJS, TypeScript, modular monolith
- Primary database: MongoDB
- Cache and queues: Redis, BullMQ
- Object storage: AWS S3 or S3-compatible storage
- Search: MongoDB text indexes first; OpenSearch only if package/search scale requires it
- Deployment: AWS ECS/Fargate first; Kubernetes only if operational scale requires it
- CI/CD: GitHub Actions
- Observability: OpenTelemetry, CloudWatch or managed APM

## Root Convention

Keep environment files, Docker Compose files, and infrastructure definitions inside the application that owns them when they are introduced. The repository root should stay aligned with `mentora-app` and act mainly as an orchestration layer.

## Start Here

1. Read [Product Requirements](docs/product/PRD.md).
2. Review [Technical Architecture](docs/architecture/TECHNICAL-ARCHITECTURE.md).
3. Use [MVP Scope](docs/planning/MVP-SCOPE.md) to avoid building too much too early.
4. Follow [Launch Execution Plan](docs/planning/LAUNCH-EXECUTION-PLAN.md) and [Task Roadmap](docs/planning/ROADMAP.md) for the build-now sequence.

## MVP Apps

### Admin CRM

```bash
npm --prefix tripos-admin-crm install
npm --prefix tripos-admin-crm run dev
```

Runs on `http://localhost:3002`.

### API Server

```bash
npm --prefix tripos-api-server install
npm --prefix tripos-api-server run start:dev
```

Runs on `http://localhost:4000`.

Useful endpoints:

- Production module routes:
  - `GET /api/v1/leads`
  - `POST /api/v1/leads`
  - `GET /api/v1/leads/:id`
  - `PATCH /api/v1/leads/:id/assign`
  - `PATCH /api/v1/leads/:id/stage`
  - `POST /api/v1/public/leads`
  - `GET /api/v1/finance/invoices`
  - `GET /api/v1/finance/invoices/next-number/:series`
  - `POST /api/v1/finance/invoices`
- Compatibility/MVP routes:
- `GET /api/v1/tripos/health`
- `GET /api/v1/tripos/dashboard`
- `GET /api/v1/tripos/leads`
- `GET /api/v1/tripos/quotations`
- `GET /api/v1/tripos/bookings`
- `GET /api/v1/tripos/operations`
- `GET /api/v1/tripos/b2b-agents`
- `GET /api/v1/tripos/finance`
- `POST /api/v1/tripos/demo-leads`
- `GET /api/docs`

Database:

- TripOS uses its own MongoDB database named `tripos`.
- Collections use clean domain names such as `tenants`, `leads`, `quotations`, `bookings`, `invoices`, and `audit_logs`. Product prefixes are not needed inside the dedicated TripOS database.
- Redis is planned for cache, queues, rate limits, locks, and short-lived session acceleration.
- Keep credentials in `tripos-api-server/.env.development`; this file is ignored by git.
- Use `tripos-api-server/.env.example` as the safe template.

Copy older local data from legacy `tripos_*` collections into the clean collection names:

```bash
npm --prefix tripos-api-server run migrate:collection-names
```

This migration is non-destructive. It copies/upserts documents into the clean collections and leaves legacy collections untouched for rollback or manual verification.

Seed the initial CRM demo workspace:

```bash
npm --prefix tripos-api-server run seed
```

The seed is idempotent and creates the `WEBNZA` tenant, Delhi/Dubai/Jaipur branches, an admin login, and realistic travel CRM records across leads, customers, quotations, itineraries, bookings, suppliers, operations, B2B agents, payments, invoices, documents, vouchers, campaigns, storage, saved reports, and audit logs.

Demo CRM login:

- Email: `admin@tripos.test`
- Password: `TripOS@123`
- Tenant code: `WEBNZA`
- Branch: `delhi`

### Mobile App

```bash
npm --prefix tripos-mobile-app install
npm --prefix tripos-mobile-app run start
```

### Public Website

```bash
npm --prefix tripos-public-website install
npm --prefix tripos-public-website run dev
```

Runs on `http://localhost:3001`.

## Verification

```bash
npm run verify
npm --prefix tripos-admin-crm run build
npm --prefix tripos-public-website run build
```
