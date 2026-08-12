import { ReactNode } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ApiRecord } from "../api/triposApi";
import { colors } from "../theme/colors";

export function Field({
  label,
  onChange,
  placeholder,
  secure,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  secure?: boolean;
  value: string;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        secureTextEntry={secure}
        style={styles.input}
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
}

export function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

export function Section({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

export function RecordCard({ record }: { record: ApiRecord }) {
  const title = String(
    record.customerName ??
      record.name ??
      record.title ??
      record.subject ??
      record.agencyName ??
      record.destination ??
      "TripOS Record",
  );
  const subtitle = String(
    record.destination ??
      record.stage ??
      record.status ??
      record.type ??
      record.channel ??
      "",
  );
  return (
    <View style={styles.recordCard}>
      <Text style={styles.recordTitle}>{title}</Text>
      {subtitle ? <Text style={styles.body}>{subtitle}</Text> : null}
    </View>
  );
}

export function ListScreen({
  empty,
  records,
  title,
}: {
  empty: string;
  records: ApiRecord[];
  title: string;
}) {
  return (
    <Section title={title}>
      {records.length ? (
        records.map((record) => (
          <RecordCard
            key={String(record._id ?? JSON.stringify(record))}
            record={record}
          />
        ))
      ) : (
        <Text style={styles.body}>{empty}</Text>
      )}
    </Section>
  );
}

export function SegmentButton({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.segmentButton, active && styles.segmentButtonActive]}
      onPress={onPress}
    >
      <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  body: { color: colors.muted, fontSize: 14, lineHeight: 21, marginTop: 6 },
  field: { gap: 6 },
  fieldLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  input: {
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.text,
    minHeight: 40,
    paddingHorizontal: 10,
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
    gap: 10,
    padding: 16,
  },
  sectionTitle: { color: colors.brandDark, fontSize: 20, fontWeight: "900" },
  recordCard: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  recordTitle: { color: colors.text, fontSize: 15, fontWeight: "900" },
  segmentButton: {
    alignItems: "center",
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    padding: 10,
  },
  segmentButtonActive: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  segmentText: { color: colors.brand, fontWeight: "900" },
  segmentTextActive: { color: "#fff" },
});

export const sharedStyles = styles;
