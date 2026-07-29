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
- Primary database: PostgreSQL
- Cache and queues: Redis, BullMQ
- Object storage: AWS S3 or S3-compatible storage
- Search: PostgreSQL full-text first, OpenSearch later
- Deployment: AWS ECS/Fargate first, Kubernetes later if needed
- CI/CD: GitHub Actions
- Observability: OpenTelemetry, CloudWatch or managed APM

## Root Convention

Keep environment files, Docker Compose files, and infrastructure definitions inside the application that owns them when they are introduced. The repository root should stay aligned with `mentora-app` and act mainly as an orchestration layer.

## Start Here

1. Read [Product Requirements](docs/product/PRD.md).
2. Review [Technical Architecture](docs/architecture/TECHNICAL-ARCHITECTURE.md).
3. Use [MVP Scope](docs/planning/MVP-SCOPE.md) to avoid building too much too early.
4. Follow [90-Day Plan](docs/planning/90-DAY-PLAN.md) for the first execution cycle.

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
- Keep credentials in `tripos-api-server/.env.development`; this file is ignored by git.
- Use `tripos-api-server/.env.example` as the safe template.

Seed the MVP module records:

```bash
npm --prefix tripos-api-server run seed
```

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
