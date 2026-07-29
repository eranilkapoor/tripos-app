# TripOS Backup And Restore Runbook

Last reviewed: 2026-07-29

TripOS uses MongoDB as the system of record and Redis for cache, queues, locks, and short-lived runtime state. PostgreSQL is not part of the current TripOS stack.

## Local Development

- MongoDB database: `tripos`
- Redis: local Redis instance or Docker Compose service
- File storage: local `tripos-api-server/storage` when `STORAGE_DRIVER=local`

## Production Requirements

- Automated MongoDB backups with point-in-time recovery where supported.
- Daily full backup retention for 30 days and monthly retention for 12 months.
- Redis persistence only for operational continuity; MongoDB remains authoritative.
- S3-compatible storage bucket versioning for uploaded passports, vouchers, tickets, contracts, receipts, and generated PDFs.
- Restore test before launch and after every infrastructure change.

## Restore Drill

1. Create a temporary restore database.
2. Restore the latest MongoDB backup into the temporary database.
3. Point a staging API instance at the temporary database.
4. Verify login, tenant scoping, leads, quotations, bookings, payments, documents, and audit logs.
5. Verify storage object access for a known uploaded file reference.
6. Record backup timestamp, restore duration, data checks, API build version, and operator name.

## Launch Evidence

Production launch requires a completed restore drill, storage object access check, monitoring alert check, and rollback owner assignment.
