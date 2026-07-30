# Engineering Standards

## Code Organization

- Prefer domain modules over technical folders.
- Keep organization enforcement close to repositories and query builders.
- Keep business rules in domain/application services, not controllers.
- Keep controllers thin.
- Use shared validation schemas where frontend and backend both need contracts.

## TypeScript

- Use strict TypeScript.
- Avoid `any` unless there is a documented boundary.
- Use explicit DTOs for API input and output.
- Use enums or union types for stable business statuses.

## Testing

- Unit test pricing, permissions, booking conversion, payment state, and organization scoping.
- Integration test API flows.
- Add end-to-end tests for core demo workflows.
- Regression tests are required for finance and access-control bugs.

## Review Checklist

- Is every business query organization-scoped?
- Are permissions checked server-side?
- Are money values stored safely?
- Are status transitions valid?
- Are audit logs created for sensitive actions?
- Are external calls retried safely?
- Are background jobs idempotent?
- Are uploaded documents private by default?

