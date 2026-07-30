# TripOS Database Model

## Core Tables

### Identity and Organization

TripOS uses `Organization` as the business isolation boundary. Every organization can have multiple branches, departments, teams, users, roles, and permission assignments. Organization-owned MongoDB documents use `organizationId`; branch-scoped documents use `branchId`.

- organizations
- branches
- departments
- teams
- crm_users
- roles
- permissions
- user_roles
- role_permissions
- invitations
- audit_logs

TripOS uses MongoDB as the primary database. Redis is reserved for cache, queues, locks, rate limits, and short-lived session acceleration; PostgreSQL is not part of the current TripOS stack.

### CRM

- customers
- customer_contacts
- leads
- lead_requirements
- lead_sources
- campaigns
- pipeline_stages
- activities
- tasks
- follow_ups
- notes
- conversations

### Sales and Quotation

- quotations
- quotation_versions
- quotation_items
- quotation_pricing
- quotation_taxes
- quotation_discounts
- quotation_documents
- pricing_rules

### Itinerary

- itineraries
- itinerary_days
- itinerary_items
- itinerary_media
- itinerary_templates

### Booking

- bookings
- booking_items
- booking_passengers
- booking_documents
- booking_status_history
- cancellations
- refunds
- vouchers

### Suppliers

- suppliers
- supplier_contacts
- supplier_contracts
- supplier_rate_plans
- supplier_rates
- supplier_booking_requests
- supplier_confirmations
- supplier_invoices
- supplier_payments

### Operations

- operation_tasks
- service_assignments
- drivers
- guides
- vehicles
- transfers
- activity_tickets
- operation_issues

### B2B

- agents
- agent_users
- agent_kyc_documents
- agent_credit_limits
- agent_wallet_transactions
- agent_commissions
- agent_invoices

### Finance

- payment_schedules
- payments
- receipts
- payables
- receivables
- expenses
- taxes
- profit_snapshots

### CMS and Marketing

- destinations
- packages
- package_prices
- blogs
- landing_pages
- offers
- testimonials
- forms
- form_submissions
- marketing_campaigns

### Communication and Notifications

- message_templates
- message_events
- notification_events
- notification_preferences
- email_logs
- whatsapp_logs
- sms_logs

### AI

- ai_requests
- ai_prompt_templates
- ai_generated_itineraries
- ai_generated_content
- ai_usage_meters

## Key Modeling Rules

- Prefer UUID primary keys.
- Every organization-owned business collection includes `organizationId`.
- Use soft delete only for organization-facing business records that users may need to restore.
- Use append-only history tables for financial and status-critical changes.
- Use JSONB for controlled flexible fields, not as a replacement for relational modeling.
- Store money as integer minor units plus currency code.
- Store timezone-aware timestamps.

## Organization Indexing Pattern

Most high-volume collections should have composite indexes beginning with `organizationId`.

Examples:

- `leads(organizationId, assignedTo, status, createdAt)`
- `quotations(organizationId, destination, status)`
- `bookings(organizationId, destination, status, createdAt)`
- `payments(organizationId, type, status, dueDate)`
