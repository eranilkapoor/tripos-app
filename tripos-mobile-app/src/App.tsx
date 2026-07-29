import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ApiRecord, MobileSession, createSupportTicket, loadRecords, login, logout } from "./api/triposApi";
import { colors } from "./theme/colors";

type Mode = "customer" | "agent";
type Tab = "home" | "trips" | "documents" | "payments" | "support";

export default function App() {
  const [session, setSession] = useState<MobileSession | null>(null);
  const [mode, setMode] = useState<Mode>("customer");
  const [tab, setTab] = useState<Tab>("home");
  const [records, setRecords] = useState<Record<string, ApiRecord[]>>({});
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
      const endpoints = mode === "customer"
        ? ["bookings", "itineraries", "travel-documents", "vouchers", "payments", "support-tickets"]
        : ["leads", "quotations", "bookings", "payments", "support-tickets"];
      const loaded = await Promise.all(endpoints.map(async (endpoint) => [endpoint, await loadRecords(endpoint, session)] as const));
      setRecords(Object.fromEntries(loaded));
      setStatus("Synced with TripOS");
    } catch {
      setStatus("Offline cache view");
    } finally {
      setLoading(false);
    }
  }

  if (!session) return <LoginView onLogin={setSession} />;

  const bookings = records.bookings ?? [];
  const activeTrip = bookings[0];
  const title = mode === "customer" ? String(activeTrip?.destination ?? "My Trips") : "Agent Workspace";

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.appHeader}>
        <View style={styles.brandMark}><Text style={styles.brandLetter}>T</Text></View>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>{String(session.tenant.name ?? "TripOS")} / {String(session.user.branchId ?? "branch")}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.apiStatus}>{loading ? "Syncing..." : status}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={() => { void logout(session); setSession(null); }}><Text style={styles.logoutText}>Logout</Text></TouchableOpacity>
      </View>

      <View style={styles.segment}>
        <SegmentButton active={mode === "customer"} label="Customer" onPress={() => setMode("customer")} />
        <SegmentButton active={mode === "agent"} label="Agent" onPress={() => setMode("agent")} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {tab === "home" ? <HomeView mode={mode} records={records} onRefresh={refresh} /> : null}
        {tab === "trips" ? <ListView empty="No trips yet" records={mode === "customer" ? bookings : records.leads ?? []} title={mode === "customer" ? "Trips" : "Assigned Leads"} /> : null}
        {tab === "documents" ? <ListView empty="No documents yet" records={[...(records["travel-documents"] ?? []), ...(records.vouchers ?? [])]} title="Documents & Vouchers" /> : null}
        {tab === "payments" ? <ListView empty="No payments yet" records={records.payments ?? []} title="Payments" /> : null}
        {tab === "support" ? <SupportView session={session} activeTrip={activeTrip} onCreated={refresh} /> : null}
      </ScrollView>

      <View style={styles.tabs}>
        <TabButton active={tab === "home"} label="Home" onPress={() => setTab("home")} />
        <TabButton active={tab === "trips"} label={mode === "customer" ? "Trips" : "Leads"} onPress={() => setTab("trips")} />
        <TabButton active={tab === "documents"} label="Docs" onPress={() => setTab("documents")} />
        <TabButton active={tab === "payments"} label="Pay" onPress={() => setTab("payments")} />
        <TabButton active={tab === "support"} label="Help" onPress={() => setTab("support")} />
      </View>
    </SafeAreaView>
  );
}

function LoginView({ onLogin }: { onLogin: (session: MobileSession) => void }) {
  const [email, setEmail] = useState("admin@tripos.test");
  const [password, setPassword] = useState("TripOS@123");
  const [tenantCode, setTenantCode] = useState("WEBNZA");
  const [branchId, setBranchId] = useState("delhi");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit() {
    setLoading(true);
    setError("");
    try {
      onLogin(await login(email, password, tenantCode, branchId));
    } catch {
      setError("Could not login. Check API server and credentials.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.loginScreen}>
        <View style={styles.loginCard}>
          <View style={styles.brandMark}><Text style={styles.brandLetter}>T</Text></View>
          <Text style={styles.title}>TripOS Mobile</Text>
          <Text style={styles.body}>Customer and agent travel workspace for trips, vouchers, payments, leads, and support.</Text>
          <Field label="Email" value={email} onChange={setEmail} />
          <Field label="Password" secure value={password} onChange={setPassword} />
          <Field label="Tenant" value={tenantCode} onChange={setTenantCode} />
          <Field label="Branch" value={branchId} onChange={setBranchId} />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TouchableOpacity disabled={loading} style={styles.primaryButton} onPress={() => void submit()}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Login</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

function HomeView({ mode, onRefresh, records }: { mode: Mode; onRefresh: () => Promise<void>; records: Record<string, ApiRecord[]> }) {
  const metrics = useMemo(() => mode === "customer"
    ? [["Trips", records.bookings?.length ?? 0], ["Docs", (records["travel-documents"]?.length ?? 0) + (records.vouchers?.length ?? 0)], ["Payments", records.payments?.length ?? 0]]
    : [["Leads", records.leads?.length ?? 0], ["Quotes", records.quotations?.length ?? 0], ["Bookings", records.bookings?.length ?? 0]], [mode, records]);
  return (
    <>
      <View style={styles.heroCard}>
        <Text style={styles.cardLabel}>{mode === "customer" ? "Customer Workspace" : "Agent Workspace"}</Text>
        <Text style={styles.heroTitle}>{mode === "customer" ? "Travel command center" : "Sales and service desk"}</Text>
        <Text style={styles.body}>{mode === "customer" ? "Track itinerary, documents, payments, vouchers, and support from one app." : "Follow up leads, quotes, bookings, payments, and customer support work."}</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={() => void onRefresh()}><Text style={styles.primaryButtonText}>Refresh</Text></TouchableOpacity>
      </View>
      <View style={styles.grid}>{metrics.map(([label, value]) => <Metric key={label} label={String(label)} value={String(value)} />)}</View>
    </>
  );
}

function ListView({ empty, records, title }: { empty: string; records: ApiRecord[]; title: string }) {
  return (
    <Section title={title}>
      {records.length ? records.map((record) => <RecordCard key={String(record._id ?? JSON.stringify(record))} record={record} />) : <Text style={styles.body}>{empty}</Text>}
    </Section>
  );
}

function SupportView({ activeTrip, onCreated, session }: { activeTrip?: ApiRecord; onCreated: () => Promise<void>; session: MobileSession }) {
  const [subject, setSubject] = useState("Need travel support");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  async function submit() {
    try {
      await createSupportTicket(session, subject, description || "Mobile support request", String(activeTrip?.customerName ?? session.user.name ?? "Mobile User"), String(activeTrip?._id ?? ""));
      setStatus("Support ticket created");
      setDescription("");
      await onCreated();
    } catch {
      setStatus("Could not create ticket");
    }
  }
  return (
    <Section title="Trip Support">
      <Field label="Subject" value={subject} onChange={setSubject} />
      <Field label="Details" value={description} onChange={setDescription} />
      {status ? <Text style={styles.apiStatus}>{status}</Text> : null}
      <TouchableOpacity style={styles.primaryButton} onPress={() => void submit()}><Text style={styles.primaryButtonText}>Create Ticket</Text></TouchableOpacity>
    </Section>
  );
}

function RecordCard({ record }: { record: ApiRecord }) {
  const title = String(record.customerName ?? record.name ?? record.title ?? record.subject ?? record.agencyName ?? record.destination ?? "TripOS Record");
  const subtitle = String(record.destination ?? record.stage ?? record.status ?? record.type ?? record.channel ?? "");
  return <View style={styles.recordCard}><Text style={styles.recordTitle}>{title}</Text>{subtitle ? <Text style={styles.body}>{subtitle}</Text> : null}</View>;
}

function Field({ label, onChange, secure, value }: { label: string; onChange: (value: string) => void; secure?: boolean; value: string }) {
  return <View style={styles.field}><Text style={styles.fieldLabel}>{label}</Text><TextInput secureTextEntry={secure} style={styles.input} value={value} onChangeText={onChange} /></View>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <View style={styles.metric}><Text style={styles.metricLabel}>{label}</Text><Text style={styles.metricValue}>{value}</Text></View>;
}

function Section({ children, title }: { children: React.ReactNode; title: string }) {
  return <View style={styles.section}><Text style={styles.sectionTitle}>{title}</Text>{children}</View>;
}

function SegmentButton({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return <TouchableOpacity style={[styles.segmentButton, active && styles.segmentButtonActive]} onPress={onPress}><Text style={[styles.segmentText, active && styles.segmentTextActive]}>{label}</Text></TouchableOpacity>;
}

function TabButton({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return <TouchableOpacity style={styles.tabButton} onPress={onPress}><Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text></TouchableOpacity>;
}

const styles = StyleSheet.create({
  safe: { backgroundColor: colors.background, flex: 1 },
  appHeader: { alignItems: "center", flexDirection: "row", gap: 10, padding: 14, paddingBottom: 8 },
  headerCopy: { flex: 1 },
  brandMark: { alignItems: "center", backgroundColor: colors.brand, borderRadius: 8, height: 42, justifyContent: "center", width: 42 },
  brandLetter: { color: "#fff", fontSize: 24, fontWeight: "900" },
  eyebrow: { color: colors.accent, fontSize: 11, fontWeight: "900", textTransform: "uppercase" },
  title: { color: colors.brandDark, fontSize: 22, fontWeight: "900" },
  apiStatus: { color: colors.muted, fontSize: 12, fontWeight: "800", marginTop: 2 },
  logoutButton: { borderColor: colors.line, borderRadius: 8, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 8 },
  logoutText: { color: colors.brand, fontSize: 12, fontWeight: "900" },
  container: { gap: 14, padding: 14, paddingBottom: 92 },
  loginScreen: { flex: 1, justifyContent: "center", padding: 18 },
  loginCard: { backgroundColor: colors.surface, borderColor: colors.line, borderRadius: 8, borderWidth: 1, gap: 12, padding: 18 },
  heroCard: { backgroundColor: colors.surface, borderColor: colors.line, borderRadius: 8, borderWidth: 1, padding: 16 },
  cardLabel: { color: colors.muted, fontSize: 12, fontWeight: "900", textTransform: "uppercase" },
  heroTitle: { color: colors.brand, fontSize: 28, fontWeight: "900", marginTop: 6 },
  body: { color: colors.muted, fontSize: 14, lineHeight: 21, marginTop: 6 },
  primaryButton: { alignItems: "center", backgroundColor: colors.brand, borderRadius: 8, marginTop: 12, minHeight: 42, justifyContent: "center", padding: 12 },
  primaryButtonText: { color: "#fff", fontSize: 14, fontWeight: "900" },
  grid: { flexDirection: "row", gap: 10 },
  metric: { backgroundColor: colors.surface, borderColor: colors.line, borderRadius: 8, borderWidth: 1, flex: 1, padding: 12 },
  metricLabel: { color: colors.muted, fontSize: 11, fontWeight: "900", textTransform: "uppercase" },
  metricValue: { color: colors.brand, fontSize: 18, fontWeight: "900", marginTop: 6 },
  section: { backgroundColor: colors.surface, borderColor: colors.line, borderRadius: 8, borderWidth: 1, gap: 10, padding: 16 },
  sectionTitle: { color: colors.brandDark, fontSize: 20, fontWeight: "900" },
  recordCard: { backgroundColor: colors.surfaceAlt, borderColor: colors.line, borderRadius: 8, borderWidth: 1, padding: 12 },
  recordTitle: { color: colors.text, fontSize: 15, fontWeight: "900" },
  field: { gap: 6 },
  fieldLabel: { color: colors.muted, fontSize: 11, fontWeight: "900", textTransform: "uppercase" },
  input: { borderColor: colors.line, borderRadius: 8, borderWidth: 1, color: colors.text, minHeight: 40, paddingHorizontal: 10 },
  error: { color: "#b42318", fontSize: 13, fontWeight: "800" },
  segment: { backgroundColor: colors.surface, borderBottomColor: colors.line, borderBottomWidth: 1, flexDirection: "row", gap: 8, padding: 12 },
  segmentButton: { alignItems: "center", borderColor: colors.line, borderRadius: 8, borderWidth: 1, flex: 1, padding: 10 },
  segmentButtonActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  segmentText: { color: colors.brand, fontWeight: "900" },
  segmentTextActive: { color: "#fff" },
  tabs: { backgroundColor: colors.surface, borderTopColor: colors.line, borderTopWidth: 1, bottom: 0, flexDirection: "row", left: 0, padding: 10, position: "absolute", right: 0 },
  tabButton: { alignItems: "center", flex: 1, paddingVertical: 8 },
  tabText: { color: colors.muted, fontSize: 12, fontWeight: "900" },
  tabTextActive: { color: colors.brand },
});
