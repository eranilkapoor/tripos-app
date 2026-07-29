# TripOS MVP Scope

## MVP Goal

Build a sellable internal travel CRM and quotation operating system for small and mid-size travel businesses.

The MVP should prove that TripOS can manage:

```text
Tenant -> Users -> Leads -> Customers -> Quotations -> Itineraries -> Bookings -> Payments -> Basic Operations
```

## Must Have

- Tenant onboarding - backend tenant model completed
- User login/logout - completed for CRM session foundation
- User invitation - backend flow implemented; email delivery provider pending
- Roles and permissions - RBAC guard/decorators implemented; admin permission UI pending
- Lead management - completed API and CRM surface
- Customer profiles - completed API and CRM surface
- Tasks and follow-ups
- Sales pipeline
- Quotation builder
- Pricing calculation
- Day-wise itinerary builder
- PDF quotation
- Booking conversion
- Payment tracking
- Basic supplier records
- Basic operations checklist
- WhatsApp and email send logging
- Sales and finance dashboards

## Should Have

- Lead import
- Quotation templates
- Itinerary templates
- Package templates
- File uploads
- Payment reminders
- Basic audit logs
- Basic AI itinerary draft

## Not MVP

- Full OTA live booking engine
- Flight GDS integration
- Complete accounting replacement
- Dedicated supplier portal
- Full B2B agent wallet
- Full native mobile production release
- Kubernetes
- Kafka
- Multi-database tenancy

## First Demo Script

1. Create a tenant for a travel agency.
2. Invite sales and operations users.
3. Create a Dubai family holiday lead.
4. Assign lead to a sales executive.
5. Capture requirement, budget, dates, and travellers.
6. Create quotation with hotel, transfer, activity, markup, tax, and discount.
7. Generate day-wise itinerary.
8. Export quotation PDF.
9. Mark quotation accepted.
10. Create booking.
11. Add passengers and payment schedule.
12. Mark advance payment received.
13. Create basic operations tasks.
14. Show sales, payment, and operations dashboard.

## Current Build Notes

Built:

- Admin CRM login/logout with demo CRM admin.
- Dedicated APIs for core travel CRM, operations, finance, support, and marketing modules.
- Multi-tenant tenant/branch data model with storage and sync policy fields.
- Mobile app scaffold exists and is now promoted into the MVP track for customer and B2B agent views.

Remaining before production:

- Enforce authenticated tenant/branch scoping across all module queries.
- Add RBAC guards and permission checks.
- Add password reset, invitations, refresh/session rotation, and audit logging.
- Replace mobile static data with authenticated API-backed customer/agent dashboards.
- Add upload/download for documents, vouchers, tickets, receipts, and supplier contracts.
