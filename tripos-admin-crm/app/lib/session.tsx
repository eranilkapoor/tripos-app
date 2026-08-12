"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { CrmSession } from "../components/crmTypes";
import { apiGet, apiPost } from "./apiClient";

const SESSION_STORAGE_KEY = "tripos-crm-session";

type SessionContextValue = {
  session: CrmSession | null;
  authReady: boolean;
  login: (nextSession: CrmSession) => void;
  logout: () => Promise<void>;
  updateWorkspace: (
    field: "organizationCode" | "branchId",
    value: string,
  ) => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<CrmSession | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      setAuthReady(true);
      return;
    }
    try {
      const stored = JSON.parse(raw) as CrmSession;
      setSession(stored);
      void apiGet<Record<string, unknown>>("auth/me", {
        session: stored,
        errorMessage: "Session expired",
      })
        .then((nextSession) => setSession({ ...stored, ...nextSession }))
        .catch(() => {
          window.localStorage.removeItem(SESSION_STORAGE_KEY);
          setSession(null);
        })
        .finally(() => setAuthReady(true));
    } catch {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
      setAuthReady(true);
    }
  }, []);

  function login(nextSession: CrmSession) {
    window.localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify(nextSession),
    );
    setSession(nextSession);
  }

  async function logout() {
    if (session?.token) {
      await apiPost("auth/logout", undefined, { session }).catch(
        () => undefined,
      );
    }
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    setSession(null);
  }

  function updateWorkspace(
    field: "organizationCode" | "branchId",
    value: string,
  ) {
    if (!session) return;
    const nextSession: CrmSession = {
      ...session,
      organization:
        field === "organizationCode"
          ? { ...session.organization, code: value }
          : session.organization,
      user: { ...session.user, [field]: value },
    };
    setSession(nextSession);
    window.localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify(nextSession),
    );
  }

  return (
    <SessionContext.Provider
      value={{ session, authReady, login, logout, updateWorkspace }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context)
    throw new Error("useSession must be used within a SessionProvider");
  return context;
}
