export type MobileSession = {
  token: string;
  user: Record<string, unknown>;
  tenant: Record<string, unknown>;
};

export type ApiRecord = Record<string, unknown> & {
  _id?: string;
  status?: string;
  stage?: string;
};

const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export async function login(email: string, password: string, tenantCode: string, branchId: string) {
  const response = await fetch(`${apiBaseUrl}/auth/login`, {
    body: JSON.stringify({ email, password, tenantCode, branchId }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
  if (!response.ok) throw new Error("Login failed");
  return response.json() as Promise<MobileSession>;
}

export async function loadRecords(endpoint: string, session: MobileSession, search = "") {
  const params = new URLSearchParams({ limit: "20" });
  if (search.trim()) params.set("search", search.trim());
  const response = await fetch(`${apiBaseUrl}/${endpoint}?${params.toString()}`, {
    headers: sessionHeaders(session),
  });
  if (!response.ok) throw new Error(`${endpoint} unavailable`);
  const payload = await response.json();
  if (Array.isArray(payload)) return payload as ApiRecord[];
  if (Array.isArray(payload.items)) return payload.items as ApiRecord[];
  if (Array.isArray(payload.data)) return payload.data as ApiRecord[];
  return [] as ApiRecord[];
}

export async function createSupportTicket(session: MobileSession, subject: string, description: string, customerName: string, bookingId?: string) {
  const response = await fetch(`${apiBaseUrl}/support-tickets`, {
    body: JSON.stringify({ subject, description, customerName, bookingId, channel: "mobile", priority: "medium" }),
    headers: { "Content-Type": "application/json", ...sessionHeaders(session) },
    method: "POST",
  });
  if (!response.ok) throw new Error("Support ticket failed");
  return response.json() as Promise<ApiRecord>;
}

export async function logout(session: MobileSession) {
  await fetch(`${apiBaseUrl}/auth/logout`, { headers: sessionHeaders(session), method: "POST" }).catch(() => undefined);
}

function sessionHeaders(session: MobileSession) {
  return {
    Authorization: `Bearer ${session.token}`,
    "x-tenant-id": String(session.user.tenantId ?? ""),
    "x-branch-id": String(session.user.branchId ?? ""),
  };
}
