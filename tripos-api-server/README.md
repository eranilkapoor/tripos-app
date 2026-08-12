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

Useful commands:

```bash
npm install
npm run start:dev
npm run seed
npm run lint
npm run test -- --runInBand
npm run build
```

Recommended internal module shape:

```text
module-name/
  presentation/
  application/
  domain/
  infrastructure/
  database/
```
