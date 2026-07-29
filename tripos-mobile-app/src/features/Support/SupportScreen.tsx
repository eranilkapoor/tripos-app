import { useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { createSupportTicket } from "../../api/triposApi";
import { Field, Section, sharedStyles } from "../../core/components";
import { AppScreenProps } from "../../core/types";
import { styles } from "./supportStyles";

export function SupportScreen({ activeTrip, onRefresh, session }: AppScreenProps) {
  const [subject, setSubject] = useState("Need travel support");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  async function submit() {
    try {
      await createSupportTicket(session, subject, description || "Mobile support request", String(activeTrip?.customerName ?? session.user.name ?? "Mobile User"), String(activeTrip?._id ?? ""));
      setStatus("Support ticket created");
      setDescription("");
      await onRefresh();
    } catch {
      setStatus("Could not create ticket");
    }
  }

  return (
    <Section title="Trip Support">
      <Field label="Subject" value={subject} onChange={setSubject} />
      <Field label="Details" value={description} onChange={setDescription} />
      {status ? <Text style={sharedStyles.body}>{status}</Text> : null}
      <TouchableOpacity style={styles.primaryButton} onPress={() => void submit()}><Text style={styles.primaryButtonText}>Create Ticket</Text></TouchableOpacity>
    </Section>
  );
}
