"use client";

import { useEffect, useState } from "react";

const CONSENT_KEY = "tripos-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(window.localStorage.getItem(CONSENT_KEY) !== "accepted");
  }, []);

  function accept() {
    window.localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="cookie-consent" role="status">
      <p>
        TripOS uses essential cookies to run this site. We do not load
        analytics or marketing cookies until you accept.
      </p>
      <button className="button primary" onClick={accept} type="button">
        Accept
      </button>
    </div>
  );
}
