# Test Credentials

These credentials are for local development and sandbox demos only. Do not use them in production.

## Admin CRM Login

Use this account after running the API seed script:

| Field             | Value                      |
| ----------------- | -------------------------- |
| CRM URL           | `http://localhost:3002`    |
| API URL           | `http://localhost:4000`    |
| Email             | `admin@tripos.test`        |
| Password          | `TripOS@123`               |
| Role              | `Organization Admin`       |
| Organization Code | `WEBNZA`                   |
| Default Branch    | `delhi`                    |
| Branch Access     | `delhi`, `dubai`, `jaipur` |

The CRM login screen only needs email and password. Organization and branch switching happens after login inside the dashboard header.

## Seed Data

From `tripos-api-server`:

```bash
npm run seed
```

The seed creates:

- Demo organization: `Webnza Travels Demo`
- Organization code: `WEBNZA`
- Branches: `Delhi HQ`, `Dubai Desk`, `Jaipur Sales`
- CRM admin user: `admin@tripos.test`
- Travel demo records across leads, customers, quotations, itineraries, bookings, suppliers, operations, agents, payments, invoices, documents, vouchers, campaigns, tasks, tags, reports, notifications, and audit logs

## API Login Payload

```json
{
  "email": "admin@tripos.test",
  "password": "TripOS@123"
}
```

Endpoint:

```http
POST /api/v1/auth/login
```

## Optional Workspace Payload

After login, use the returned bearer token to switch organization or branch:

```json
{
  "organizationId": "<returned organization _id>",
  "branchId": "delhi"
}
```

Endpoint:

```http
POST /api/v1/auth/workspace
```

## Login Troubleshooting

- Confirm `tripos-api-server/.env.development` has `TRIPOS_ENABLE_DEMO_ADMIN=true` for local development.
- Confirm the API is running on `http://localhost:4000`.
- Confirm the CRM `NEXT_PUBLIC_API_BASE_URL` points to `http://localhost:4000/api/v1`.
- Run `npm run seed` again if the demo database was reset.
- In production, demo admin auto-creation is disabled and real users must be created by platform or organization administrators.
