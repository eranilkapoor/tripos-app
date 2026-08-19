# TripOS API Server

NestJS modular monolith backend.

Implemented modules:

- auth
- organization
- users
- crm
- quotations
- itineraries
- bookings
- suppliers
- operations
- finance
- communications
- reporting
- ai
- integrations
- audit logs
- storage files
- saved reports
- settings
- tags
- tasks

Useful commands:

```bash
npm install
npm run start:dev
npm run seed
npm run lint
npm run test -- --runInBand
npm run build
```

Private local overrides are loaded from `.env.local` before `.env.development`.
Use `.env.local` for your real MongoDB/Redis/provider credentials because it is
ignored by Git.

Local CRM test login after seeding:

- Email: `admin@tripos.test`
- Password: `TripOS@123`
- Organization code: `WEBNZA`
- Default branch: `delhi`

Recommended internal module shape:

```text
module-name/
  presentation/
  application/
  domain/
  infrastructure/
  database/
```
