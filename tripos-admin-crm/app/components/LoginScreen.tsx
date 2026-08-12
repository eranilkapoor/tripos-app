"use client";

import { useState } from "react";
import type { CrmSession } from "./crmTypes";
import type { CrmTheme } from "./ThemeSwitcher";
import { apiPost } from "../lib/apiClient";

export default function LoginScreen({
  onLogin,
  theme,
}: {
  onLogin: (session: CrmSession) => void;
  theme: CrmTheme;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    setLoading(true);
    setError("");
    try {
      const session = await apiPost<CrmSession>(
        "auth/login",
        {
          email,
          password,
        },
        { errorMessage: "Invalid login or API unavailable" },
      );
      onLogin(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`auth-screen theme-${theme}`}>
      <section className="auth-card">
        <div className="auth-card-head">
          <span className="brand-mark">T</span>
          <strong>Secure Workspace</strong>
        </div>
        <h1>TripOS Admin CRM</h1>
        <p>
          Secure travel operations workspace for CRM, sales, finance, suppliers,
          and branch teams.
        </p>
        <label>
          Email
          <input
            placeholder="admin@tripos.test"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        {error ? <div className="form-error">{error}</div> : null}
        <button disabled={loading} onClick={() => void login()} type="button">
          {loading ? "Signing in" : "Login"}
        </button>
      </section>
    </div>
  );
}
