import { Text, TouchableOpacity, View } from "react-native";
import { ListScreen, Metric, sharedStyles } from "../../core/components";
import { AppScreenProps } from "../../core/types";
import { styles } from "./customerStyles";

export function CustomerHomeScreen({ onRefresh, records }: AppScreenProps) {
  return (
    <>
      <View style={styles.heroCard}>
        <Text style={styles.cardLabel}>Customer Workspace</Text>
        <Text style={styles.heroTitle}>Travel command center</Text>
        <Text style={sharedStyles.body}>Track itinerary, documents, payments, vouchers, and support from one app.</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={() => void onRefresh()}><Text style={styles.primaryButtonText}>Refresh</Text></TouchableOpacity>
      </View>
      <View style={styles.grid}>
        <Metric label="Trips" value={String(records.bookings?.length ?? 0)} />
        <Metric label="Docs" value={String((records["travel-documents"]?.length ?? 0) + (records.vouchers?.length ?? 0))} />
        <Metric label="Payments" value={String(records.payments?.length ?? 0)} />
      </View>
    </>
  );
}

export function CustomerTripsScreen({ records }: AppScreenProps) {
  return <ListScreen empty="No trips yet" records={records.bookings ?? []} title="Trips" />;
}

export function CustomerDocumentsScreen({ records }: AppScreenProps) {
  return <ListScreen empty="No documents yet" records={[...(records["travel-documents"] ?? []), ...(records.vouchers ?? [])]} title="Documents & Vouchers" />;
}
