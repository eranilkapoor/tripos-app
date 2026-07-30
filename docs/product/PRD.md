# TripOS Product Requirements Document

## Vision

TripOS is a white-label, multi-organization SaaS platform that helps travel agencies, DMCs, tour operators, and travel networks run their business from first enquiry to completed trip.

The core promise:

> One platform to manage leads, quotations, itineraries, bookings, suppliers, operations, payments, commissions, marketing, and customer experience.

## Target Customers

- Small and mid-size travel agencies
- Destination Management Companies
- Tour operators
- B2B travel wholesalers
- Corporate travel desks
- White-label travel brands

## Primary Personas

- Platform Super Admin: manages TripOS SaaS organizations, plans, billing, and system settings.
- Organization Owner: owns a travel business organization.
- Admin: configures branches, users, permissions, destinations, suppliers, and workflows.
- Sales Manager: manages pipeline, performance, and quotation quality.
- Sales Executive: handles leads, follow-ups, quotations, and customer communication.
- Operations Manager: coordinates suppliers, drivers, guides, hotels, vouchers, and trip execution.
- Finance Manager: tracks customer receivables, supplier payables, commissions, refunds, taxes, and profitability.
- Marketing Manager: tracks campaigns, lead sources, ROI, templates, and automation.
- B2B Agent: submits enquiries, confirms bookings, downloads vouchers, checks commission and credit.
- Supplier User: confirms services, uploads invoices, manages rates and availability.
- Customer: views itinerary, quotations, payments, vouchers, and support.
- Driver or Guide: views assigned operations and marks service progress.

## Product Principles

- Solve travel business operations first; OTA-style live inventory is a separate integration track after core operations are stable.
- Build multi-organization isolation from day one.
- Make quotation and itinerary creation extremely fast.
- Keep finance focused on travel profitability, not full accounting replacement.
- Use a modular monolith initially, with service extraction only after real scale.
- Design every module for white-label branding and organization-specific workflows.

## Core Workflows

### Lead to Booking

```text
Lead Created
-> Assigned
-> Requirement Collected
-> Quotation Prepared
-> Quotation Sent
-> Negotiation
-> Quotation Accepted
-> Advance Payment
-> Booking Created
```

### Booking to Trip Completion

```text
Booking Created
-> Supplier Requests
-> Services Confirmed
-> Voucher Generated
-> Customer Documents Shared
-> Trip Started
-> Operations Monitoring
-> Trip Completed
-> Feedback Requested
```

### B2B Agent Flow

```text
Agent Registered
-> KYC Approved
-> Credit Limit Assigned
-> Enquiry Submitted
-> Quotation Received
-> Booking Confirmed
-> Commission Calculated
-> Voucher Downloaded
```

## Success Metrics

- Quotation creation time reduced by 60 percent.
- Every lead has an owner, next action, and status.
- Booking profitability visible before trip completion.
- Operations team can see today's hotels, transfers, activities, and exceptions.
- Marketing team can connect campaign spend to bookings and revenue.
- B2B agents can self-serve enquiry, booking, commission, payment, and voucher status.
