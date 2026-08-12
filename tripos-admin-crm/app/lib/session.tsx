"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { CrmSession } from "../components/crmTypes";
import { apiPost } from "./apiClient";

type SessionContextValue = {
  session: CrmSession | null;
  authReady: boolean;
  login: (nextSession: CrmSession) => void;
  logout: () => Promise<void>;
  updateWorkspace: (
    field: "organizationCode" | "branchId",
    value: string,
  ) => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<CrmSession | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    setAuthReady(true);
  }, []);

  function login(nextSession: CrmSession) {
    setSession(nextSession);
  }

  async function logout() {
    if (session?.token) {
      await apiPost("auth/logout", undefined, { session }).catch(
        () => undefined,
      );
    }
    setSession(null);
  }

  async function updateWorkspace(
    field: "organizationCode" | "branchId",
    value: string,
  ) {
    if (!session) return;
    const nextSession = await apiPost<CrmSession>(
      "auth/workspace",
      field === "organizationCode"
        ? { organizationCode: value }
        : { branchId: value },
      {
        session,
        errorMessage: "Workspace access denied.",
      },
    );
    setSession(nextSession);
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
