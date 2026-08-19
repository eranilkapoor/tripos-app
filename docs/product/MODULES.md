# TripOS Modules

TripOS modules are grouped by launch ownership, not by slow delivery phases. The goal is to complete code-side readiness as quickly as possible and keep external/provider blockers separate.

## Platform Foundation

### Identity and Access

- Email/password login
- Session restore, logout, and refresh rotation
- Roles and permissions
- Branch and department access
- User invitations
- Password reset
- Audit logs
- Settings
- Tags
- Cross-module tasks and follow-ups
- Optional mobile OTP/SSO when providers are selected

### Organization Management

- Organization onboarding
- Organization profile
- Branches
- Departments
- Teams
- Organization settings
- Branch-level settings
- White-label branding
- Subscription plan metadata
- Storage mode: TripOS cloud, customer-managed, or hybrid sync

## CRM and Sales

### CRM and Leads

- Lead capture
- Lead source
- Lead assignment
- Pipeline statuses
- Tasks and follow-ups
- Notes and activities
- Customer profile
- Travel requirement capture
- Lost lead reasons
- Sales conversion reports

### Quotation and Pricing

- Multiple quotations per lead
- Service line items
- Hotels, transfers, activities, flights, visa, insurance, meals, guide
- Supplier cost
- Markup
- Discount
- Tax
- Final price
- PDF quotation
- Email and WhatsApp send events

### Itinerary Builder

- Day-wise itinerary
- Day and item editing
- Activity details
- Hotel details
- Transfers
- Meals
- Images
- Notes
- PDF and shareable web view
- Drag/reorder after the stable day/item model is complete

### Booking

- Convert accepted quotation to booking
- Passenger list
- Booking items
- Booking documents
- Payment schedule
- Vouchers
- Booking statuses

## Operations and Finance

### Supplier Management

- Supplier directory
- Supplier categories
- Contracts
- Rate plans
- Seasonal rates
- Service confirmations
- Supplier payable tracking
- Performance rating

### Operations

- Daily operations dashboard
- Cross-module tasks and follow-ups
- Hotel confirmations
- Transfer assignments
- Driver assignments
- Guide assignments
- Activity tickets
- Issue tracking
- Trip monitoring

Operations lives inside `tripos-admin-crm` as role-based views for launch.

### Finance

- Customer receivables
- Supplier payables
- Agent receivables
- Commissions
- Refunds
- Payment gateway fees
- Marketing cost per booking
- Booking profitability

### Communication

- WhatsApp templates
- Email templates
- SMS templates
- Conversation timeline
- Automated triggers
- Payment reminders
- Trip reminders
- Feedback messages

## Market and Growth

### B2B Agent Management

- Agent registration
- KYC
- Credit limit
- Agent pricing
- Wallet
- Commission
- Agent invoices
- Booking status
- Voucher download

B2B lives inside `tripos-admin-crm` as restricted role-based views for launch. A separate partner portal is an extraction decision only if agent self-service becomes a major product requirement.

### B2C Website and CMS

- Destination pages
- Package pages
- Custom trip forms
- Blog
- Offers
- Reviews
- SEO fields
- Landing pages
- Organization website themes

### Marketing Automation

- Campaigns
- Lead source analytics
- Funnel reports
- ROI reports
- Broadcasts
- Segment-based automation

### AI Platform

- AI itinerary generator
- AI quotation assistant
- AI sales assistant
- AI support assistant
- AI content generator
- LLM gateway and prompt logs
