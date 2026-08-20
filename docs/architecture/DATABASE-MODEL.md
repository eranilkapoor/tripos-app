# TripOS Database Model

## Current Database Stack

TripOS currently uses MongoDB as the source of truth for business data. Mongoose schemas create ObjectId-backed documents with timestamps. Redis is reserved in the architecture for cache, locks, rate limits, and queues, but the current API code does not depend on Redis at runtime.

The current implementation uses document collections with embedded arrays/objects for related operational details such as passengers, itinerary days, supplier rates, KYC documents, payment schedules, settings, metadata, and line items. Separate child collections should be introduced only when volume, reporting, or lifecycle rules justify them.

## Core Collections

These collection names are implemented in `tripos-api-server/src/common/constants/collection-names.constants.ts`.

### Identity And Organization

- organizations
- branches
- departments
- teams
- crm_users
- user_sessions
- roles
- permissions
- user_roles
- role_permissions
- invitations
- audit_logs
- settings
- tags
- tasks

### CRM, Sales, And Operations

- leads
- lead_activities
- customers
- quotations
- itineraries
- bookings
- suppliers
- operation_tasks
- b2b_agents
- payments
- invoices
- destinations
- tour_packages
- travel_documents
- vouchers
- support_tickets
- notifications
- campaigns

### Platform, Reporting, And Files

- pricing_plans
- subscriptions
- stored_files
- saved_reports

## Organization Boundary

TripOS uses Organization as the business isolation boundary.

Rules:

- Every organization-owned business collection stores `organizationId`.
- Branch-level modules also store `branchId` where branch access applies.
- CRM users can be assigned to multiple branches, departments, and teams.
- Platform-level collections, such as global pricing plans and permissions, may be unscoped or platform-managed.
- Session/auth logic resolves the effective organization and branch before domain controllers create, list, update, or delete records.

## Modeling Rules

- Use MongoDB ObjectId as the primary identifier unless an external provider requires another stable identifier.
- Use clear business identifiers in addition to ObjectId where needed, such as `bookingNo`, `quoteNo`, `voucherNo`, `ticketNo`, `supplierCode`, `agentCode`, and `campaignCode`.
- Store money as integer minor units plus a currency code for finance-critical fields.
- Use embedded arrays for bounded operational details, such as itinerary days, passengers, line items, KYC documents, contract summaries, payment schedules, and delivery history.
- Promote embedded records into separate collections when they need independent permissions, high-volume search, reporting, or lifecycle workflows.
- Use structured JSON objects for flexible enterprise fields such as `metadata`, `customFields`, `commercial`, `supplierCosting`, `taxProfile`, `bankDetails`, `billingProfile`, and `compliance`.
- Avoid putting organization isolation only in UI filters; queries must include organization context at API/service level.

## Implemented Index Patterns

Implemented schemas include targeted indexes for high-value access paths, including:

- audit logs by organization, actor, path, and entity reference
- CRM users by organization/email and organization/role/status
- user sessions by token/user/session state
- organizations by code
- subscription records by organization/status and organization/plan/status
- pricing plans by status/audience/price
- many business modules by organization/status/updated time through standard query filters

Recommended continuing pattern:

- `organizationId + status + updatedAt`
- `organizationId + branchId + status`
- `organizationId + ownerId + status`
- `organizationId + businessNumber`
- `organizationId + externalReference`

## Future Extraction Candidates

These are not separate implemented collections today. They are enterprise upgrade candidates if scale or reporting requires it:

- quotation_versions
- quotation_items
- quotation_pricing
- booking_status_history
- supplier_booking_requests
- supplier_confirmations
- agent_wallet_transactions
- agent_commissions
- payment_schedules
- receipts
- payables
- receivables
- message_events
- email_logs
- whatsapp_logs
- sms_logs
- ai_requests
- ai_usage_meters
