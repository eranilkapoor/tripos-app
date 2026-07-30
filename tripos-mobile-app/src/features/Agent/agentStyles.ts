import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  cardLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  heroTitle: {
    color: colors.brand,
    fontSize: 28,
    fontWeight: "900",
    marginTop: 6,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: colors.brand,
    borderRadius: 8,
    marginTop: 12,
    minHeight: 42,
    justifyContent: "center",
    padding: 12,
  },
  primaryButtonText: { color: "#fff", fontSize: 14, fontWeight: "900" },
  grid: { flexDirection: "row", gap: 10 },
});
