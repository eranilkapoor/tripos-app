import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const styles = StyleSheet.create({
  primaryButton: { alignItems: "center", backgroundColor: colors.brand, borderRadius: 8, marginTop: 12, minHeight: 42, justifyContent: "center", padding: 12 },
  primaryButtonText: { color: "#fff", fontSize: 14, fontWeight: "900" },
});
