import { ApiRecord, MobileSession, SessionRefreshedHandler } from "../api/triposApi";

export type AppMode = "customer" | "agent";

export type TripOSData = Record<string, ApiRecord[]>;

export type AppScreenProps = {
  activeTrip?: ApiRecord;
  mode: AppMode;
  onRefresh: () => Promise<void>;
  onSessionRefreshed: SessionRefreshedHandler;
  records: TripOSData;
  session: MobileSession;
};
