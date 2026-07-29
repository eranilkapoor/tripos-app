import { ApiRecord, MobileSession } from "../api/triposApi";

export type AppMode = "customer" | "agent";

export type TripOSData = Record<string, ApiRecord[]>;

export type AppScreenProps = {
  activeTrip?: ApiRecord;
  mode: AppMode;
  onRefresh: () => Promise<void>;
  records: TripOSData;
  session: MobileSession;
};
