/**
 * Revakalp Consent-Aware Storefront Analytics Dictionary (DPDPA 2023 Opt-In)
 * Never transmits passwords, addresses, phone numbers, raw search strings, or tokens.
 */

const CONSENT_KEY = "revakalp_analytics_consent";
const CONSENT_META_KEY = "revakalp_consent_meta";
const CONSENT_VERSION = "2025-dpdpa-v1";
const SESSION_KEY = "rk_anon_sid";

const ALLOWED_EVENTS = new Set([
  "view_item_list",
  "select_item",
  "view_item",
  "search",
  "add_to_wishlist",
  "add_to_cart",
  "remove_from_cart",
  "begin_checkout",
  "add_shipping_info",
  "add_payment_info",
  "purchase",
  "refund",
  "stock_unavailable",
  "shop_sale_recorded",
  "lead_contact_started",
]);

function getAnonymousSessionId() {
  if (typeof window === "undefined") return "";
  try {
    let sid = window.sessionStorage?.getItem(SESSION_KEY);
    if (!sid) {
      let rand = "";
      if (window.crypto?.getRandomValues) {
        const bytes = new Uint8Array(8);
        window.crypto.getRandomValues(bytes);
        rand = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
      } else {
        rand = `${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
      }
      sid = `rk_${rand}`.slice(0, 48);
      window.sessionStorage?.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return "";
  }
}

export function getConsentState() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage?.getItem(CONSENT_META_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        version: parsed.version || CONSENT_VERSION,
        essential: true,
        analytics: Boolean(parsed.analytics),
        updatedAt: parsed.updatedAt || null,
      };
    }
    const legacy = window.localStorage?.getItem(CONSENT_KEY);
    if (legacy === "granted" || legacy === "denied") {
      return {
        version: CONSENT_VERSION,
        essential: true,
        analytics: legacy === "granted",
        updatedAt: null,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function setConsentState({ analytics }) {
  if (typeof window === "undefined") return;
  const granted = Boolean(analytics);
  const meta = {
    version: CONSENT_VERSION,
    essential: true,
    analytics: granted,
    updatedAt: new Date().toISOString(),
  };
  try {
    window.localStorage?.setItem(CONSENT_KEY, granted ? "granted" : "denied");
    window.localStorage?.setItem(CONSENT_META_KEY, JSON.stringify(meta));
    window.dispatchEvent(
      new CustomEvent("rk-consent-updated", { detail: meta })
    );
  } catch {
    // Ignore storage restriction errors
  }
}

function hasAnalyticsConsent() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage?.getItem(CONSENT_KEY) === "granted";
  } catch {
    return false;
  }
}

export function trackEvent(eventName, payload = {}) {
  if (!ALLOWED_EVENTS.has(eventName) || !hasAnalyticsConsent()) return;

  const eventRecord = {
    eventId: `${eventName}_${Date.now()}`,
    event: eventName,
    timestamp: new Date().toISOString(),
    ...payload,
  };

  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(eventRecord);
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, payload);
    }

    const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
    const numericVal = Number(payload.value ?? payload.price ?? 0);
    const body = {
      eventName,
      sessionId: getAnonymousSessionId(),
      itemId: String(payload.itemId || payload.productId || "").slice(0, 64),
      category: String(payload.category || payload.subCategory || "").slice(0, 64),
      value: Number.isFinite(numericVal) && numericVal >= 0 ? numericVal : 0,
      channel: "web",
    };

    try {
      fetch(`${baseUrl}/api/analytics/event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        keepalive: true,
      }).catch(() => {});
    } catch {
      // Non-blocking telemetry failure must never disrupt shopping
    }
  }
}
