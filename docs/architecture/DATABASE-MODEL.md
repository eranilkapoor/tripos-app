# TripOS Database Model

## Core Tables

### Identity and Tenant

- organizations
- branches
- departments
- teams
- users
- roles
- permissions
- user_roles
- role_permissions
- invitations
- audit_logs

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
- Every tenant-owned business table includes `organization_id`.
- Use soft delete only for tenant-facing business records that users may need to restore.
- Use append-only history tables for financial and status-critical changes.
- Use JSONB for controlled flexible fields, not as a replacement for relational modeling.
- Store money as integer minor units plus currency code.
- Store timezone-aware timestamps.

## Tenant Indexing Pattern

Most high-volume tables should have composite indexes beginning with `organization_id`.

Examples:

- `leads(organization_id, assigned_to, status, created_at)`
- `quotations(organization_id, lead_id, status, created_at)`
- `bookings(organization_id, travel_start_date, status)`
- `payments(organization_id, booking_id, status, due_date)`

