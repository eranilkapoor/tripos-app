export type MobileSession = {
  token: string;
  user: Record<string, unknown>;
  organization: Record<string, unknown>;
};

export type ApiRecord = Record<string, unknown> & {
  _id?: string;
  status?: string;
  stage?: string;
};

const apiBaseUrl =
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export type SessionRefreshedHandler = (session: MobileSession) => void;

export async function login(
  email: string,
  password: string,
  organizationCode: string,
  branchId: string,
) {
  const response = await fetch(`${apiBaseUrl}/auth/login`, {
    body: JSON.stringify({ email, password, organizationCode, branchId }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
  if (!response.ok) throw new Error("Login failed");
  return response.json() as Promise<MobileSession>;
}

export async function refreshSession(session: MobileSession) {
  const response = await fetch(`${apiBaseUrl}/auth/refresh`, {
    headers: sessionHeaders(session),
    method: "POST",
  });
  if (!response.ok) throw new Error("Session refresh failed");
  return response.json() as Promise<MobileSession>;
}

// Coalesces concurrent 401s (e.g. a Promise.all fan-out across endpoints)
// into a single refresh call so the second caller doesn't retry with a
// token the first caller has already rotated and revoked server-side.
let pendingRefresh: Promise<MobileSession> | null = null;

function getOrRefreshSession(session: MobileSession) {
  if (!pendingRefresh) {
    pendingRefresh = refreshSession(session).finally(() => {
      pendingRefresh = null;
    });
  }
  return pendingRefresh;
}

async function authorizedFetch(
  session: MobileSession,
  input: string,
  init: RequestInit,
  onSessionRefreshed?: SessionRefreshedHandler,
) {
  const attempt = (activeSession: MobileSession) =>
    fetch(input, {
      ...init,
      headers: { ...init.headers, ...sessionHeaders(activeSession) },
    });

  let response = await attempt(session);
  if (response.status === 401) {
    const refreshed = await getOrRefreshSession(session);
    onSessionRefreshed?.(refreshed);
    response = await attempt(refreshed);
  }
  return response;
}

export async function loadRecords(
  endpoint: string,
  session: MobileSession,
  search = "",
  onSessionRefreshed?: SessionRefreshedHandler,
) {
  const params = new URLSearchParams({ limit: "20" });
  if (search.trim()) params.set("search", search.trim());
  const response = await authorizedFetch(
    session,
    `${apiBaseUrl}/${endpoint}?${params.toString()}`,
    {},
    onSessionRefreshed,
  );
  if (!response.ok) throw new Error(`${endpoint} unavailable`);
  const payload = await response.json();
  if (Array.isArray(payload)) return payload as ApiRecord[];
  if (Array.isArray(payload.items)) return payload.items as ApiRecord[];
  if (Array.isArray(payload.data)) return payload.data as ApiRecord[];
  return [] as ApiRecord[];
}

export async function createSupportTicket(
  session: MobileSession,
  subject: string,
  description: string,
  customerName: string,
  bookingId?: string,
  onSessionRefreshed?: SessionRefreshedHandler,
) {
  const response = await authorizedFetch(
    session,
    `${apiBaseUrl}/support-tickets`,
    {
      body: JSON.stringify({
        subject,
        description,
        customerName,
        bookingId,
        channel: "mobile",
        priority: "medium",
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    },
    onSessionRefreshed,
  );
  if (!response.ok) throw new Error("Support ticket failed");
  return response.json() as Promise<ApiRecord>;
}

export async function logout(session: MobileSession) {
  await fetch(`${apiBaseUrl}/auth/logout`, {
    headers: sessionHeaders(session),
    method: "POST",
  }).catch(() => undefined);
}

function sessionHeaders(session: MobileSession) {
  return {
    Authorization: `Bearer ${session.token}`,
    "x-organization-id": String(session.user.organizationId ?? ""),
    "x-branch-id": String(session.user.branchId ?? ""),
  };
}
