"use client";

import { useState } from "react";
import { apiPatch, apiPost } from "../lib/apiClient";
import { useSession } from "../lib/session";

type Props = {
  mode: "profile" | "password";
  onNotify: (message: string) => void;
};

export default function AccountPanel({ mode, onNotify }: Props) {
  const { session, login } = useSession();
  const user = session?.user ?? {};
  const [name, setName] = useState(String(user.name ?? ""));
  const [phone, setPhone] = useState(String(user.phone ?? ""));
  const [timezone, setTimezone] = useState(
    String(user.timezone ?? "Asia/Kolkata"),
  );
  const [locale, setLocale] = useState(String(user.locale ?? "en"));
  const [preferences, setPreferences] = useState(
    JSON.stringify(user.notificationPreferences ?? {}, null, 2),
  );
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  async function saveProfile() {
    if (!session) return;
    setSaving(true);
    try {
      const nextSession = await apiPatch<typeof session>(
        "auth/me",
        {
          name,
          phone,
          timezone,
          locale,
          notificationPreferences: parseJson(preferences),
        },
        { session, errorMessage: "Could not update profile." },
      );
      login(nextSession);
      onNotify("Profile updated.");
    } catch (error) {
      onNotify(
        error instanceof Error ? error.message : "Profile update failed.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function changePassword() {
    if (!session) return;
    if (newPassword !== confirmPassword) {
      onNotify("New password and confirmation do not match.");
      return;
    }
    setSaving(true);
    try {
      await apiPost(
        "auth/change-password",
        { currentPassword, newPassword },
        { session, errorMessage: "Could not change password." },
      );
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onNotify("Password changed.");
    } catch (error) {
      onNotify(
        error instanceof Error ? error.message : "Password change failed.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (mode === "password") {
    return (
      <section className="account-panel">
        <div className="account-grid">
          <label className="formrow">
            <span>Current Password</span>
            <input
              autoComplete="current-password"
              onChange={(event) => setCurrentPassword(event.target.value)}
              type="password"
              value={currentPassword}
            />
          </label>
          <label className="formrow">
            <span>New Password</span>
            <input
              autoComplete="new-password"
              onChange={(event) => setNewPassword(event.target.value)}
              type="password"
              value={newPassword}
            />
          </label>
          <label className="formrow">
            <span>Confirm Password</span>
            <input
              autoComplete="new-password"
              onChange={(event) => setConfirmPassword(event.target.value)}
              type="password"
              value={confirmPassword}
            />
          </label>
        </div>
        <div className="account-actions">
          <button
            disabled={saving}
            onClick={() => void changePassword()}
            type="button"
          >
            {saving ? "Saving..." : "Change Password"}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="account-panel">
      <div className="account-grid">
        <label className="formrow">
          <span>Name</span>
          <input
            onChange={(event) => setName(event.target.value)}
            value={name}
          />
        </label>
        <label className="formrow">
          <span>Email</span>
          <input readOnly value={String(user.email ?? "")} />
        </label>
        <label className="formrow">
          <span>Phone</span>
          <input
            onChange={(event) => setPhone(event.target.value)}
            value={phone}
          />
        </label>
        <label className="formrow">
          <span>Timezone</span>
          <input
            onChange={(event) => setTimezone(event.target.value)}
            value={timezone}
          />
        </label>
        <label className="formrow">
          <span>Locale</span>
          <input
            onChange={(event) => setLocale(event.target.value)}
            value={locale}
          />
        </label>
        <label className="formrow wide">
          <span>Notification Preferences</span>
          <textarea
            onChange={(event) => setPreferences(event.target.value)}
            value={preferences}
          />
        </label>
      </div>
      <div className="account-actions">
        <button
          disabled={saving}
          onClick={() => void saveProfile()}
          type="button"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </section>
  );
}

function parseJson(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return {};
  try {
    return JSON.parse(trimmed) as Record<string, unknown>;
  } catch {
    return { raw: value };
  }
}
