import { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { MobileSession } from "./api/triposApi";
import { readSession } from "./core/session/sessionStorage";
import { RootNavigator } from "./navigation/RootNavigator";
import { colors } from "./theme/colors";

export default function App() {
  const [initialSession, setInitialSession] = useState<MobileSession | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    void readSession()
      .then(setInitialSession)
      .catch(() => setInitialSession(null))
      .finally(() => setIsReady(true));
  }, []);

  if (!isReady) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loading}>
          <ActivityIndicator color={colors.brand} />
          <Text style={styles.loadingText}>Loading TripOS workspace</Text>
        </View>
      </SafeAreaView>
    );
  }

  return <RootNavigator initialSession={initialSession} />;
}

const styles = StyleSheet.create({
  safe: { backgroundColor: colors.background, flex: 1 },
  loading: { alignItems: "center", flex: 1, gap: 10, justifyContent: "center" },
  loadingText: { color: colors.muted, fontSize: 13, fontWeight: "800" },
});
