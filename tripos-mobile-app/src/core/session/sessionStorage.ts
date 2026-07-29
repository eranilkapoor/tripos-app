import * as SecureStore from "expo-secure-store";
import { MobileSession } from "../../api/triposApi";

const SESSION_KEY = "tripos-mobile-session";

export async function saveSession(session: MobileSession) {
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
}

export async function readSession() {
  const raw = await SecureStore.getItemAsync(SESSION_KEY);
  if (!raw) return null;
  return JSON.parse(raw) as MobileSession;
}

export async function clearSession() {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}
