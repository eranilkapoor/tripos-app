import 'reflect-metadata';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { COLLECTION_NAMES } from '../../common/constants/collection-names.constants';

dotenv.config({ path: '.env.development' });
dotenv.config();

const LEGACY_COLLECTIONS: Array<[legacy: string, current: string]> = [
  ['tripos_leads', COLLECTION_NAMES.LEAD],
  ['tripos_lead_activities', COLLECTION_NAMES.LEAD_ACTIVITY],
  ['tripos_invoices', COLLECTION_NAMES.INVOICE],
  ['tripos_records', COLLECTION_NAMES.MODULE_RECORD],
  ['tripos_quotations', COLLECTION_NAMES.QUOTATION],
  ['tripos_itineraries', COLLECTION_NAMES.ITINERARY],
  ['tripos_bookings', COLLECTION_NAMES.BOOKING],
  ['tripos_suppliers', COLLECTION_NAMES.SUPPLIER],
  ['tripos_operation_tasks', COLLECTION_NAMES.OPERATION_TASK],
  ['tripos_b2b_agents', COLLECTION_NAMES.B2B_AGENT],
  ['tripos_payments', COLLECTION_NAMES.PAYMENT],
  ['tripos_customers', COLLECTION_NAMES.CUSTOMER],
  ['tripos_destinations', COLLECTION_NAMES.DESTINATION],
  ['tripos_tour_packages', COLLECTION_NAMES.TOUR_PACKAGE],
  ['tripos_travel_documents', COLLECTION_NAMES.TRAVEL_DOCUMENT],
  ['tripos_vouchers', COLLECTION_NAMES.VOUCHER],
  ['tripos_support_tickets', COLLECTION_NAMES.SUPPORT_TICKET],
  ['tripos_campaigns', COLLECTION_NAMES.CAMPAIGN],
  ['tripos_tenants', COLLECTION_NAMES.TENANT],
  ['tripos_crm_users', COLLECTION_NAMES.CRM_USER],
  ['tripos_user_sessions', COLLECTION_NAMES.USER_SESSION],
  ['tripos_audit_logs', COLLECTION_NAMES.AUDIT_LOG],
  ['tripos_stored_files', COLLECTION_NAMES.STORED_FILE],
  ['tripos_saved_reports', COLLECTION_NAMES.SAVED_REPORT],
];

async function copyCollection(legacyName: string, currentName: string) {
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('MongoDB connection is not ready.');
  }

  const collections = await db.listCollections().toArray();
  const hasLegacy = collections.some(
    (collection) => collection.name === legacyName,
  );

  if (!hasLegacy) {
    return { legacyName, currentName, copied: 0, skipped: true };
  }

  const legacy = db.collection(legacyName);
  const current = db.collection(currentName);
  const docs = await legacy.find().toArray();

  if (docs.length === 0) {
    return { legacyName, currentName, copied: 0, skipped: false };
  }

  const operations = docs.map((doc) => ({
    replaceOne: {
      filter: { _id: doc._id },
      replacement: doc,
      upsert: true,
    },
  }));

  const result = await current.bulkWrite(operations, { ordered: false });

  return {
    legacyName,
    currentName,
    copied: result.upsertedCount + result.modifiedCount,
    skipped: false,
  };
}

async function migrate() {
  const uri = process.env.MONGO_URI ?? 'mongodb://localhost:27017/tripos';
  await mongoose.connect(uri);

  for (const [legacyName, currentName] of LEGACY_COLLECTIONS) {
    const result = await copyCollection(legacyName, currentName);
    const status = result.skipped
      ? 'missing legacy collection'
      : `${result.copied} document(s) copied/upserted`;
    console.log(`${legacyName} -> ${currentName}: ${status}`);
  }

  await mongoose.disconnect();
}

migrate().catch(async (error: unknown) => {
  console.error(
    error instanceof Error ? (error.stack ?? error.message) : String(error),
  );
  await mongoose.disconnect();
  process.exit(1);
});
