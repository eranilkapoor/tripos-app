import { StatusBar } from "expo-status-bar";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "./theme/colors";

const itinerary = [
  ["Day 1", "Dubai arrival, airport pickup, hotel check-in"],
  ["Day 2", "City tour, Burj Khalifa tickets, dinner cruise"],
  ["Day 3", "Desert safari, transfers, BBQ dinner"],
  ["Day 4", "Leisure day and shopping assistance"],
  ["Day 5", "Departure transfer and feedback request"],
];

const documents = ["Hotel Voucher", "Transfer Voucher", "Activity Tickets", "Payment Receipt"];

export default function App() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.brandMark}>
            <Text style={styles.brandLetter}>T</Text>
          </View>
          <View>
            <Text style={styles.eyebrow}>TripOS Customer</Text>
            <Text style={styles.title}>Dubai Family Holiday</Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.cardLabel}>Upcoming Trip</Text>
          <Text style={styles.heroTitle}>25 Dec - 30 Dec</Text>
          <Text style={styles.body}>Your itinerary, vouchers, payments, and support are ready in one place.</Text>
          <View style={styles.statusRow}>
            <Text style={styles.statusPill}>Confirmed</Text>
            <Text style={styles.statusPillAlt}>Advance paid</Text>
          </View>
        </View>

        <View style={styles.grid}>
          <Metric label="Travellers" value="3" />
          <Metric label="Balance Due" value="INR 50K" />
          <Metric label="Support SLA" value="24x7" />
        </View>

        <Section title="Itinerary">
          {itinerary.map(([day, detail]) => (
            <View style={styles.timelineItem} key={day}>
              <Text style={styles.timelineDay}>{day}</Text>
              <Text style={styles.timelineText}>{detail}</Text>
            </View>
          ))}
        </Section>

        <Section title="Documents">
          <View style={styles.documentGrid}>
            {documents.map((document) => (
              <TouchableOpacity style={styles.documentButton} key={document}>
                <Text style={styles.documentText}>{document}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Section>

        <Section title="Trip Support">
          <Text style={styles.body}>Need help during travel? Contact your TripOS operations desk for pickup, hotel, activity, or emergency support.</Text>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

function Section({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: colors.background,
    flex: 1,
  },
  container: {
    gap: 16,
    padding: 18,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    marginTop: 6,
  },
  brandMark: {
    alignItems: "center",
    backgroundColor: colors.brand,
    borderRadius: 8,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  brandLetter: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  title: {
    color: colors.brandDark,
    fontSize: 24,
    fontWeight: "900",
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    padding: 18,
  },
  cardLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  heroTitle: {
    color: colors.brand,
    fontSize: 32,
    fontWeight: "900",
    marginTop: 6,
  },
  body: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },
  statusPill: {
    backgroundColor: "#e5f7ef",
    borderRadius: 999,
    color: colors.good,
    fontSize: 12,
    fontWeight: "900",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusPillAlt: {
    backgroundColor: colors.accentSoft,
    borderRadius: 999,
    color: colors.accent,
    fontSize: 12,
    fontWeight: "900",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  grid: {
    flexDirection: "row",
    gap: 10,
  },
  metric: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    padding: 12,
  },
  metricLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  metricValue: {
    color: colors.brand,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 6,
  },
  section: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  sectionTitle: {
    color: colors.brandDark,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 12,
  },
  timelineItem: {
    borderBottomColor: colors.line,
    borderBottomWidth: 1,
    gap: 4,
    paddingVertical: 10,
  },
  timelineDay: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  timelineText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  documentGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  documentButton: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  documentText: {
    color: colors.brand,
    fontSize: 13,
    fontWeight: "900",
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: colors.brand,
    borderRadius: 8,
    marginTop: 14,
    padding: 13,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "900",
  },
});

