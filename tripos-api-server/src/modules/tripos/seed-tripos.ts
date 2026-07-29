import "reflect-metadata";
import { config } from "dotenv";
import mongoose from "mongoose";
import { TriposRecordSchema } from "./tripos-record.schema";

config({ path: ".env.development" });
config();

const seedRecords = [
  ["leads", "Sharma Family", "requirement", { destination: "Dubai", source: "Website", owner: "Ritika" }],
  ["leads", "Mehta Group", "quotation_sent", { destination: "Singapore", source: "B2B Agent", owner: "Aman" }],
  ["quotations", "Q-1029 Dubai Family", "sent", { customer: "Sharma Family", sellingPrice: 129500 }],
  ["quotations", "Q-1030 Singapore Group", "draft", { customer: "Mehta Group", sellingPrice: 864000 }],
  ["itineraries", "Dubai Family 5N", "ready", { days: 6, destination: "Dubai" }],
  ["bookings", "BKG-2081 Sharma Family", "confirmed", { destination: "Dubai", travelDates: "25 Dec - 30 Dec" }],
  ["operations", "OPS-551 Airport Pickup", "assigned", { supplier: "DXB Prime Cars", due: "25 Dec 08:30" }],
  ["b2b-agents", "Skyline Travels", "active", { market: "Delhi", creditLimit: 1000000 }],
  ["suppliers", "Hotel ABC", "active", { type: "Hotel", destination: "Dubai", rating: 4.6 }],
  ["finance", "BKG-2081 Profit Snapshot", "healthy", { sellingPrice: 129500, supplierCost: 100000, netProfit: 25000 }],
  ["marketing", "Dubai December Campaign", "active", { channel: "Google Ads", leads: 100, roi: "5.0x" }],
] as const;

async function main() {
  const uri = process.env.MONGO_URI ?? "mongodb://localhost:27017/tripos";
  await mongoose.connect(uri);
  const RecordModel = mongoose.model("TriposRecord", TriposRecordSchema);
  for (const [moduleKey, title, status, payload] of seedRecords) {
    await RecordModel.updateOne(
      { moduleKey, title },
      { $set: { moduleKey, title, status, priority: "medium", payload } },
      { upsert: true },
    );
  }
  await mongoose.disconnect();
  console.log(`Seeded ${seedRecords.length} TripOS records.`);
}

void main().catch((error) => {
  console.error(error);
  process.exit(1);
});
