# Security And Organization Isolation

## Security Baseline

Current code-side controls:

- Global session authentication guard protects non-public API routes.
- Public routes are explicitly marked with the `@Public()` decorator.
- CRM sessions are Mongo-backed and bearer-token based.
- Refresh rotates the bearer token and revokes the previous session.
- Logout revokes the current session.
- CRM users are restricted to platform and organization users; agent/customer access belongs in the mobile experience.
- RBAC guard enforces explicit roles and inferred module permissions.
- Organization and branch context is resolved server-side from the authenticated session.
- Branch switching verifies the user has access to the selected branch.
- `ValidationPipe` runs with transform and whitelist enabled.
- Helmet is enabled.
- CORS origins are environment-configured.
- In-process rate limiting is enabled for `/auth/*` and `/public/*` paths.
- Audit logging captures authenticated mutations and sensitive reads for finance, payments, travel documents, and organizations.

Production environment controls still required outside code:

- HTTPS/TLS termination.
- Secret manager or deployment-level secret injection.
- Strong production CORS allow-list.
- MongoDB network controls, backup policy, and encryption-at-rest configuration.
- S3-compatible private bucket policies and signed URL enforcement.
- Centralized log redaction and retention.
- Dependency scanning and release gates in CI.
- Live provider credentials, webhook signatures, and incident contacts.

## Authentication And Session Flow

1. `POST /auth/login` validates the CRM user and creates a Mongo-backed session.
2. The returned bearer token is sent by Admin CRM and mobile clients.
3. `SessionAuthGuard` validates the token on protected routes through `AuthService.me`.
4. The guard writes the authenticated `organizationId` and selected `branchId` onto request query/body context.
5. `POST /auth/refresh` rotates the token.
6. `POST /auth/logout` revokes the token.
7. `POST /auth/workspace` updates organization/branch context only after server-side access checks.

## Authorization Model

TripOS uses layered authorization:

- Role checks for high-level access, such as `platform_admin` and `organization_admin`.
- Permission checks inferred from module and HTTP method.
- Branch-level access enforced by the session guard.
- Organization-scoped service queries through `organizationScopedQuery`, `organizationScopedBody`, and `scopeFilter`.
- Platform-only organization and pricing plan administration.

Permission inference follows the protected module map in `RbacGuard`. For example:

- `GET /leads` requires `leads:read`.
- `POST /bookings` requires `bookings:create`.
- `PATCH /payments/:id` requires `payments:update`.
- `GET /storage/files` maps to `documents:read`.
- `GET /plans` and `/subscriptions` map to `billing:read`.

## Organization Isolation

Organization is the business isolation boundary. Product language should use Organization, and persisted business documents should use `organizationId`.

Implemented rules:

- Protected request context is derived from the authenticated session, not trusted from login form fields alone.
- Domain controllers call organization scoping helpers for create/list/detail/update/delete paths.
- Shared CRUD utilities apply `organizationId` and optional `branchId` filters.
- Detail/update/delete paths query by both record id and organization context.
- CRM workspace switching is server-confirmed.
- Audit logs record organization, branch, actor, role, method, path, outcome, IP, user agent, and timing metadata.

Compatibility note:

- Admin CRM still sends `x-organization-id` and `x-branch-id` headers. The authentication guard overwrites effective context from the session for protected routes. Headers remain useful for non-auth compatibility and selected-branch hints, but they are not the authority for organization access.

## Organization Storage Modes

- `tripos_cloud`: standard SaaS storage in TripOS-managed MongoDB.
- `customer_managed`: organization stores primary data in its own system; TripOS requires connector APIs and delayed sync.
- `hybrid_sync`: TripOS stores an operational cache and syncs back to customer-owned storage.

Current implementation stores the mode and sync policy on the organization record. Customer-managed and hybrid sync connector execution remains an integration/deployment task.

## Sensitive Data

Sensitive travel records include passports, visas, tickets, invoices, receipts, KYC documents, supplier contracts, and payment references.

Required controls:

- Separate document permissions for view/download/export.
- Private storage paths that include organization identifiers.
- Signed URLs for private documents.
- Expiring customer document links.
- Redaction of sensitive payload fields in logs.
- Retention policies per organization.
- Encryption at rest through MongoDB/storage provider configuration.

Current implementation includes stored file registry fields for visibility, retention, scan result, checksum, upload metadata, and entity references. Actual binary storage hardening depends on the configured storage provider.
