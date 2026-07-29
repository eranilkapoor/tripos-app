import { ListScreen } from "../../core/components";
import { AppScreenProps } from "../../core/types";

export function PaymentsScreen({ records }: AppScreenProps) {
  return <ListScreen empty="No payments yet" records={records.payments ?? []} title="Payments" />;
}
