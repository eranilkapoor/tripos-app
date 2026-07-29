# TripOS Product Roadmap

## Current Implementation Status

Completed in the repo:

- Monorepo structure aligned with Mentora-style app boundaries.
- Mongo-backed `tripos-api-server` modules for leads, customers, quotations, itineraries, bookings, suppliers, operations, B2B agents, payments, destinations, tour packages, travel documents, vouchers, support tickets, campaigns, and finance invoices.
- Admin CRM connected to dedicated production APIs instead of generic demo records.
- CRM list pagination, status filtering, and server-side search.
- Tenant, branch, CRM user, login, session restore, and logout foundation.
- Tenant records support multiple branches and storage modes: TripOS cloud, customer-managed, and hybrid sync.
- Admin CRM sends bearer session, tenant, and branch context headers.

Still required for production readiness:

- Enforce tenant and branch scoping in every backend query and create path.
- Add guards/interceptors for authenticated routes, RBAC, and permissions.
- Add audit logs for auth, financial changes, booking changes, supplier confirmations, and document access.
- Add edit/delete APIs and UI flows with soft-delete where appropriate.
- Add refresh tokens/password reset/user invitation flows.
- Add file upload/storage abstraction for passports, vouchers, tickets, contracts, and receipts.
- Add customer/agent mobile authentication and role-specific API contracts.
- Add offline/customer-managed storage sync queues for hybrid tenants.
- Add automated tests around tenant isolation, auth sessions, pricing, payments, and booking workflow.

## Phase 0: Discovery

Duration: 2-3 weeks

- Customer interviews
- Workflow analysis
- MVP validation
- Pricing validation
- Sample documents collection

## Phase 1: Platform Foundation

Duration: 4-6 weeks

- Authentication - initial session login/logout completed; refresh/password reset/invitation pending
- Tenant management - initial tenant/branch model completed; scoped enforcement pending
- Roles and permissions
- Branches and departments
- Audit logs
- File storage
- Notifications foundation

## Phase 2: CRM and Sales

Duration: 6-8 weeks

- Leads
- Customers
- Contacts
- Tasks and follow-ups
- Activities
- Sales pipeline
- Quotation builder
- Pricing engine
- PDF quotation
- Email and WhatsApp tracking

## Phase 3: Itinerary and Booking

Duration: 6-8 weeks

- Itinerary builder
- Package templates
- Booking conversion
- Passengers
- Vouchers
- Payment schedule
- Basic finance reports

## Phase 3A: Mobile Customer and Agent App

Duration: 4-6 weeks

- Shared mobile login/session restore
- Customer mode: trips, itinerary, vouchers, travel documents, payments, support, feedback
- Agent mode: assigned leads, quotations, bookings, customer documents, payment follow-ups, support tickets
- Tenant/branch-aware API headers
- Offline cache for current trip and pending support/document actions
- Role-specific navigation and permissions

## Phase 4: Supplier and Operations

Duration: 8-10 weeks

- Supplier directory
- Contracts and rates
- Supplier confirmations
- Drivers and guides
- Transfers
- Operations dashboard
- Issue tracking

## Phase 5: B2B Agent Workflows Inside Admin CRM

Duration: 6-8 weeks

- Agent onboarding
- KYC
- Credit limit
- Agent enquiries
- Agent bookings
- Wallet
- Commission
- Agent invoices
- Voucher download

Keep these workflows inside `tripos-admin-crm` for v1. Consider a separate partner portal only after real agent usage proves the need.

## Phase 6: B2C Website and CMS

Duration: 6-8 weeks

- Destination pages
- Packages
- Blog
- Offers
- Reviews
- Lead forms
- SEO metadata
- Customer portal

## Phase 7: Marketing Automation

Duration: 4-6 weeks

- Campaign tracking
- Lead source analytics
- WhatsApp automation
- Email automation
- Funnel reporting
- ROI dashboards

## Phase 8: AI Platform

Duration: continuous

- AI itinerary generator
- AI quotation assistant
- AI sales assistant
- AI support assistant
- AI content generation
- AI analytics
