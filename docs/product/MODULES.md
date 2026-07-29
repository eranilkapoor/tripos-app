# TripOS Modules

## Phase 1 Foundation

### Identity and Access

- Email/password login
- Mobile OTP login later
- JWT sessions
- Roles and permissions
- Branch and department access
- User invitations
- Password reset
- Audit logs

### Tenant and Organization

- Tenant onboarding
- Organization profile
- Branches
- Departments
- Teams
- Tenant settings
- White-label branding
- Subscription plan metadata

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
- Drag and reorder later
- Activity details
- Hotel details
- Transfers
- Meals
- Images
- Notes
- PDF and shareable web view

### Booking

- Convert accepted quotation to booking
- Passenger list
- Booking items
- Booking documents
- Payment schedule
- Vouchers
- Booking statuses

## Phase 2 Commercial Depth

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
- Hotel confirmations
- Transfer assignments
- Driver assignments
- Guide assignments
- Activity tickets
- Issue tracking
- Trip monitoring

Operations lives inside `tripos-admin-crm` for v1.

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

## Phase 3 Expansion

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

B2B lives inside `tripos-admin-crm` for v1 as restricted role-based views. A separate partner portal can be extracted later if agent self-service becomes a major growth channel.

### B2C Website and CMS

- Destination pages
- Package pages
- Custom trip forms
- Blog
- Offers
- Reviews
- SEO fields
- Landing pages
- Tenant website themes

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
