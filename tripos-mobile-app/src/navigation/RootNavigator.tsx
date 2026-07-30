import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ApiRecord,
  MobileSession,
  loadRecords,
  logout,
} from "../api/triposApi";
import { SegmentButton } from "../core/components";
import { clearSession, saveSession } from "../core/session/sessionStorage";
import { AppMode, AppScreenProps, TripOSData } from "../core/types";
import {
  AgentHomeScreen,
  AgentLeadsScreen,
  AgentQuotesScreen,
} from "../features/Agent/AgentHomeScreen";
import { LoginScreen } from "../features/Auth/LoginScreen";
import {
  CustomerDocumentsScreen,
  CustomerHomeScreen,
  CustomerTripsScreen,
} from "../features/Customer/CustomerHomeScreen";
import { PaymentsScreen } from "../features/Payments/PaymentsScreen";
import { SupportScreen } from "../features/Support/SupportScreen";
import { colors } from "../theme/colors";

type Tab = "home" | "work" | "documents" | "payments" | "support";

export function RootNavigator({
  initialSession,
}: {
  initialSession: MobileSession | null;
}) {
  const [session, setSession] = useState<MobileSession | null>(initialSession);
  const [mode, setMode] = useState<AppMode>("customer");
  const [tab, setTab] = useState<Tab>("home");
  const [records, setRecords] = useState<TripOSData>({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Ready");

  useEffect(() => {
    if (!session) return;
    void refresh();
  }, [session, mode]);

  async function refresh() {
    if (!session) return;
    setLoading(true);
    try {
      const endpoints =
        mode === "customer"
          ? [
              "bookings",
              "itineraries",
              "travel-documents",
              "vouchers",
              "payments",
              "support-tickets",
            ]
          : ["leads", "quotations", "bookings", "payments", "support-tickets"];
      const loaded = await Promise.all(
        endpoints.map(
          async (endpoint) =>
            [endpoint, await loadRecords(endpoint, session)] as const,
        ),
      );
      setRecords(Object.fromEntries(loaded));
      setStatus("Synced with TripOS");
    } catch {
      setStatus("Offline cache view");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(nextSession: MobileSession) {
    await saveSession(nextSession);
    setSession(nextSession);
  }

  async function handleLogout() {
    if (session) await logout(session);
    await clearSession();
    setSession(null);
    setRecords({});
  }

  if (!session)
    return (
      <LoginScreen onLogin={(nextSession) => void handleLogin(nextSession)} />
    );

  const bookings = records.bookings ?? [];
  const activeTrip = bookings[0];
  const screenProps: AppScreenProps = {
    activeTrip,
    mode,
    onRefresh: refresh,
    records,
    session,
  };
  const title =
    mode === "customer"
      ? String(activeTrip?.destination ?? "My Trips")
      : "Agent Workspace";

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.appHeader}>
        <View style={styles.brandMark}>
          <Text style={styles.brandLetter}>T</Text>
        </View>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>
            {String(session.organization.name ?? "TripOS")} /{" "}
            {String(session.user.branchId ?? "branch")}
          </Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.apiStatus}>
            {loading ? "Syncing..." : status}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => void handleLogout()}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.segment}>
        <SegmentButton
          active={mode === "customer"}
          label="Customer"
          onPress={() => {
            setMode("customer");
            setTab("home");
          }}
        />
        <SegmentButton
          active={mode === "agent"}
          label="Agent"
          onPress={() => {
            setMode("agent");
            setTab("home");
          }}
        />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {tab === "home" &&
          (mode === "customer" ? (
            <CustomerHomeScreen {...screenProps} />
          ) : (
            <AgentHomeScreen {...screenProps} />
          ))}
        {tab === "work" &&
          (mode === "customer" ? (
            <CustomerTripsScreen {...screenProps} />
          ) : (
            <AgentLeadsScreen {...screenProps} />
          ))}
        {tab === "documents" &&
          (mode === "customer" ? (
            <CustomerDocumentsScreen {...screenProps} />
          ) : (
            <AgentQuotesScreen {...screenProps} />
          ))}
        {tab === "payments" ? <PaymentsScreen {...screenProps} /> : null}
        {tab === "support" ? <SupportScreen {...screenProps} /> : null}
      </ScrollView>

      <View style={styles.tabs}>
        <TabButton
          active={tab === "home"}
          label="Home"
          onPress={() => setTab("home")}
        />
        <TabButton
          active={tab === "work"}
          label={mode === "customer" ? "Trips" : "Leads"}
          onPress={() => setTab("work")}
        />
        <TabButton
          active={tab === "documents"}
          label={mode === "customer" ? "Docs" : "Quotes"}
          onPress={() => setTab("documents")}
        />
        <TabButton
          active={tab === "payments"}
          label="Pay"
          onPress={() => setTab("payments")}
        />
        <TabButton
          active={tab === "support"}
          label="Help"
          onPress={() => setTab("support")}
        />
      </View>
    </SafeAreaView>
  );
}

function TabButton({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.tabButton} onPress={onPress}>
      <Text style={[styles.tabText, active && styles.tabTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: colors.background, flex: 1 },
  appHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    padding: 14,
    paddingBottom: 8,
  },
  headerCopy: { flex: 1 },
  brandMark: {
    alignItems: "center",
    backgroundColor: colors.brand,
    borderRadius: 8,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  brandLetter: { color: "#fff", fontSize: 24, fontWeight: "900" },
  eyebrow: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  title: { color: colors.brandDark, fontSize: 22, fontWeight: "900" },
  apiStatus: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 2,
  },
  logoutButton: {
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  logoutText: { color: colors.brand, fontSize: 12, fontWeight: "900" },
  segment: {
    backgroundColor: colors.surface,
    borderBottomColor: colors.line,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 8,
    padding: 12,
  },
  container: { gap: 14, padding: 14, paddingBottom: 92 },
  tabs: {
    backgroundColor: colors.surface,
    borderTopColor: colors.line,
    borderTopWidth: 1,
    bottom: 0,
    flexDirection: "row",
    left: 0,
    padding: 10,
    position: "absolute",
    right: 0,
  },
  tabButton: { alignItems: "center", flex: 1, paddingVertical: 8 },
  tabText: { color: colors.muted, fontSize: 12, fontWeight: "900" },
  tabTextActive: { color: colors.brand },
});
