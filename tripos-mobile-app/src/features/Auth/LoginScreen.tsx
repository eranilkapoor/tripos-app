import { useState } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MobileSession, login } from "../../api/triposApi";
import { Field, sharedStyles } from "../../core/components";
import { colors } from "../../theme/colors";

export function LoginScreen({ onLogin }: { onLogin: (session: MobileSession) => void }) {
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
          <Text style={sharedStyles.body}>Customer and agent travel workspace for trips, vouchers, payments, leads, and support.</Text>
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

const styles = StyleSheet.create({
  safe: { backgroundColor: colors.background, flex: 1 },
  loginScreen: { flex: 1, justifyContent: "center", padding: 18 },
  loginCard: { backgroundColor: colors.surface, borderColor: colors.line, borderRadius: 8, borderWidth: 1, gap: 12, padding: 18 },
  brandMark: { alignItems: "center", backgroundColor: colors.brand, borderRadius: 8, height: 42, justifyContent: "center", width: 42 },
  brandLetter: { color: "#fff", fontSize: 24, fontWeight: "900" },
  title: { color: colors.brandDark, fontSize: 22, fontWeight: "900" },
  primaryButton: { alignItems: "center", backgroundColor: colors.brand, borderRadius: 8, marginTop: 12, minHeight: 42, justifyContent: "center", padding: 12 },
  primaryButtonText: { color: "#fff", fontSize: 14, fontWeight: "900" },
  error: { color: "#b42318", fontSize: 13, fontWeight: "800" },
});
