# Security and Multi-Tenancy

## Security Baseline

- Enforce HTTPS everywhere.
- Store password hashes with a modern password hashing algorithm.
- Use short-lived access tokens and refresh token rotation.
- Keep secrets in a secret manager, never in source control.
- Enable audit logs for authentication, permissions, financial records, bookings, and supplier confirmations.
- Validate all inputs with shared schemas.
- Rate-limit authentication, public forms, and AI endpoints.
- Scan dependencies in CI.

Current repo status:

- CRM login/logout/session restore is implemented.
- CRM users, sessions, tenants, branches, storage mode, and sync policy are Mongo-backed.
- Admin CRM sends bearer token plus tenant and branch headers.
- Route protection, RBAC guards, and refresh token rotation are implemented.
- Basic audit logging for authenticated mutations and sensitive reads is implemented.
- Password reset, invitation flows, audit-log UI/reporting, and retention policies are still pending.

## Authorization Model

Use layered authorization:

- Role-based access control for broad job responsibilities.
- Permission-based access control for specific actions.
- Branch-level access for operational and sales boundaries.
- Ownership filters for sales executives and agent users.
- Data-level checks for financial reports and sensitive documents.

## Tenant Isolation

Tenant isolation must be part of the data access layer, not left to UI filters.

Rules:

- All business queries must scope by `organization_id`.
- Middleware should resolve tenant context from the authenticated session.
- Repositories must require tenant context.
- Background jobs must carry tenant context explicitly.
- Object storage paths must include tenant identifiers.
- Audit logs must record tenant, actor, action, entity, and IP/device context.

TripOS tenant storage modes:

- `tripos_cloud`: standard SaaS storage in TripOS-managed MongoDB.
- `customer_managed`: tenant stores data in its own system; TripOS needs connector APIs and delayed sync.
- `hybrid_sync`: TripOS stores operational cache and syncs back to customer-owned storage.

Next implementation step:

- Add a request context resolver that validates the bearer session and exposes `tenantId`, `branchId`, `role`, and `permissions`.
- Apply this context to every module service so list/create/update operations cannot cross tenants or branches.

## Sensitive Data

Sensitive travel documents may include passports, visas, tickets, invoices, payment receipts, and identity documents.

Controls:

- Signed URLs for private document access.
- Expiring links for customer documents.
- Separate permission for document download.
- Redaction in logs.
- Encryption at rest.
- Retention policies per tenant.
