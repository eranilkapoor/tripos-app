# Security and Organization Isolation

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
- CRM users, sessions, organizations, branches, storage mode, and sync policy are Mongo-backed.
- Admin CRM sends bearer token plus organization and branch headers. The `x-organization-id` header remains a compatibility alias for the selected organization.
- Route protection, RBAC guards, and refresh token rotation are implemented.
- Basic audit logging for authenticated mutations and sensitive reads is implemented.
- Password reset and invitation backend flows are implemented.
- Email, SMS, WhatsApp, payments, storage, maps, AI, document renderer, accounting export, and monitoring are provider-configurable with local/sandbox health checks. Live credentials and retention-policy sign-off remain production environment tasks.

## Authorization Model

Use layered authorization:

- Role-based access control for broad job responsibilities.
- Permission-based access control for specific actions.
- Branch-level access for operational and sales boundaries.
- Ownership filters for sales executives and agent users.
- Data-level checks for financial reports and sensitive documents.

## Organization Isolation

Organization isolation must be part of the data access layer, not left to UI filters. In TripOS, Organization is the business isolation boundary; use Organization in product language and `organizationId` in persisted business data.

Rules:

- All business queries must scope by `organizationId`.
- Middleware should resolve organization context from the authenticated session.
- Repositories must require organization context.
- Background jobs must carry organization context explicitly.
- Object storage paths must include organization identifiers.
- Audit logs must record organization, actor, action, entity, and IP/device context.

TripOS organization storage modes:

- `tripos_cloud`: standard SaaS storage in TripOS-managed MongoDB.
- `customer_managed`: organization stores data in its own system; TripOS needs connector APIs and delayed sync.
- `hybrid_sync`: TripOS stores operational cache and syncs back to customer-owned storage.

Current implementation status:

- Bearer session validation, organization/branch context, RBAC guard enforcement, refresh rotation, and scoped create/list/detail/update/delete behavior are implemented for protected CRM/domain modules.

## Sensitive Data

Sensitive travel documents may include passports, visas, tickets, invoices, payment receipts, and identity documents.

Controls:

- Signed URLs for private document access.
- Expiring links for customer documents.
- Separate permission for document download.
- Redaction in logs.
- Encryption at rest.
- Retention policies per organization.
