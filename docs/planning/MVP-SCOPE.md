# TripOS Launch Scope

## Launch Goal

Build a sellable internal travel CRM and quotation operating system for small and mid-size travel businesses.

The launch build should prove that TripOS can manage:

```text
Organization -> Users -> Leads -> Customers -> Quotations -> Itineraries -> Bookings -> Payments -> Basic Operations
```

## Must Have

- Organization onboarding - backend organization model completed
- User login/logout - completed for CRM session foundation
- User invitation - backend flow implemented with provider-configurable delivery
- Roles and permissions - RBAC guard/decorators and admin permission UI implemented
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
- Platform pricing plans and organization subscriptions
- CRM user profile, password, settings, and notifications

## Should Have

- Lead import
- Quotation templates
- Itinerary templates
- Package templates
- File uploads
- Payment reminders
- Basic audit logs
- Basic AI itinerary draft

## Not Launch Scope

- Full OTA live booking engine
- Flight GDS integration
- Complete accounting replacement
- Dedicated supplier portal
- Standalone B2B agent portal outside the CRM/mobile app
- App store release builds before final mobile publishing
- Kubernetes
- Kafka
- Multi-database organization isolation

## First Demo Script

1. Create an organization for a travel agency.
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
- Multi-organization and branch data model with storage and sync policy fields.
- Pricing plans, organization subscriptions, profile, password, settings, notifications, and CRM edit forms are implemented.
- Mobile app has persisted secure session storage, customer/agent navigation, API-backed records, and offline fallback messaging.

Remaining before production:

- Enter live provider credentials and run integration smoke tests.
- Deploy staging/production infrastructure with MongoDB, storage, monitoring, backups, secrets, strict CORS, and optional Redis/queue services if enabled for the deployment.
- Complete desktop/tablet/mobile QA, role-policy sign-off, backup/restore drill, load-test evidence, and app store release builds.
