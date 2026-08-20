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

const SESSION_TOKEN_KEY = "tripos-crm-session-token";

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
    let mounted = true;
    const token = window.localStorage.getItem(SESSION_TOKEN_KEY);
    if (!token) {
      setAuthReady(true);
      return () => {
        mounted = false;
      };
    }
    apiGet<Omit<CrmSession, "token">>("auth/me", {
      session: { token, user: {} },
      errorMessage: "Stored session expired.",
    })
      .then((restoredSession) => {
        if (!mounted) return;
        setSession({ ...restoredSession, token });
      })
      .catch(() => {
        window.localStorage.removeItem(SESSION_TOKEN_KEY);
      })
      .finally(() => {
        if (mounted) setAuthReady(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  function login(nextSession: CrmSession) {
    const normalizedSession =
      nextSession.token || !session
        ? nextSession
        : { ...nextSession, token: session.token };
    setSession(normalizedSession);
    if (normalizedSession.token) {
      window.localStorage.setItem(SESSION_TOKEN_KEY, normalizedSession.token);
    }
  }

  async function logout() {
    if (session?.token) {
      await apiPost("auth/logout", undefined, { session }).catch(
        () => undefined,
      );
    }
    window.localStorage.removeItem(SESSION_TOKEN_KEY);
    setSession(null);
  }

  async function updateWorkspace(
    field: "organizationCode" | "branchId",
    value: string,
  ) {
    if (!session) return;
    const nextSession = await apiPost<Omit<CrmSession, "token">>(
      "auth/workspace",
      field === "organizationCode"
        ? { organizationCode: value }
        : { branchId: value },
      {
        session,
        errorMessage: "Workspace access denied.",
      },
    );
    setSession({ ...nextSession, token: session.token });
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
