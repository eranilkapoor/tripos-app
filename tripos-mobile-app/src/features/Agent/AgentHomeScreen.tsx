import { Text, TouchableOpacity, View } from "react-native";
import { ListScreen, Metric, sharedStyles } from "../../core/components";
import { AppScreenProps } from "../../core/types";
import { styles } from "./agentStyles";

export function AgentHomeScreen({ onRefresh, records }: AppScreenProps) {
  return (
    <>
      <View style={styles.heroCard}>
        <Text style={styles.cardLabel}>Agent Workspace</Text>
        <Text style={styles.heroTitle}>Sales and service desk</Text>
        <Text style={sharedStyles.body}>
          Follow up leads, quotes, bookings, payments, and customer support
          work.
        </Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => void onRefresh()}
        >
          <Text style={styles.primaryButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.grid}>
        <Metric label="Leads" value={String(records.leads?.length ?? 0)} />
        <Metric
          label="Quotes"
          value={String(records.quotations?.length ?? 0)}
        />
        <Metric
          label="Bookings"
          value={String(records.bookings?.length ?? 0)}
        />
      </View>
    </>
  );
}

export function AgentLeadsScreen({ records }: AppScreenProps) {
  return (
    <ListScreen
      empty="No assigned leads yet"
      records={records.leads ?? []}
      title="Assigned Leads"
    />
  );
}

export function AgentQuotesScreen({ records }: AppScreenProps) {
  return (
    <ListScreen
      empty="No quotations yet"
      records={records.quotations ?? []}
      title="Quotations"
    />
  );
}
