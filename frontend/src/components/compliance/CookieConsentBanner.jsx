import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { getConsentState, setConsentState } from "../../utils/analytics";

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    const existing = getConsentState();
    if (!existing) {
      setVisible(true);
    } else {
      setAnalyticsEnabled(Boolean(existing.analytics));
    }

    const handleOpenSettings = () => {
      const current = getConsentState();
      setAnalyticsEnabled(Boolean(current?.analytics));
      setShowPrefs(true);
      setVisible(true);
    };

    window.addEventListener("rk-open-cookie-settings", handleOpenSettings);
    return () =>
      window.removeEventListener("rk-open-cookie-settings", handleOpenSettings);
  }, []);

  if (!visible) return null;

  const saveAndClose = (analytics) => {
    setConsentState({ analytics });
    setAnalyticsEnabled(Boolean(analytics));
    setShowPrefs(false);
    setVisible(false);
  };

  return (
    <aside
      role="dialog"
      aria-label="Cookie and privacy consent"
      className="fixed bottom-4 inset-x-4 sm:left-6 sm:right-auto sm:max-w-lg z-[95] bg-[#2B0E17] text-[#F7F1E5] border border-[#D4AF63]/50 rounded-[2px] shadow-2xl p-5 sm:p-6 space-y-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.26em] text-[#F1D889] font-medium">
            Privacy &amp; Cookies
          </p>
          <h2 className="font-serif text-xl text-[#F7F1E5]">
            Your privacy preferences
          </h2>
        </div>
        <button
          type="button"
          onClick={() => saveAndClose(analyticsEnabled)}
          aria-label="Close privacy preferences"
          className="w-8 h-8 rounded-[2px] flex items-center justify-center text-[#F7F1E5]/70 hover:text-[#F1D889] hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs sm:text-sm text-[#F7F1E5]/82 leading-relaxed">
        We use essential cookies to keep you signed in and protect your bag, and optional
        analytics only with your consent. Read our{" "}
        <Link to="/privacy-policy" className="text-[#F1D889] underline">
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link to="/cookie-policy" className="text-[#F1D889] underline">
          Cookie Policy
        </Link>
        .
      </p>

      {showPrefs && (
        <div className="rounded-[2px] bg-[#38131E] border border-[#D4AF63]/30 p-3.5 space-y-2.5 text-xs">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-[#F7F1E5]">Strictly Necessary Cookies</p>
              <p className="text-[#F7F1E5]/65">Required for login sessions, bag &amp; security</p>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-[#F1D889] font-semibold">
              Always Active
            </span>
          </div>

          <label className="flex items-center justify-between gap-3 pt-2 border-t border-[#D4AF63]/20 cursor-pointer">
            <div>
              <p className="font-semibold text-[#F7F1E5]">Storefront Analytics</p>
              <p className="text-[#F7F1E5]/65">Helps us improve browsing without sharing contacts</p>
            </div>
            <input
              type="checkbox"
              checked={analyticsEnabled}
              onChange={(e) => setAnalyticsEnabled(e.target.checked)}
              className="w-4 h-4 accent-[#D4AF63] cursor-pointer"
            />
          </label>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        <button
          type="button"
          onClick={() => saveAndClose(false)}
          className="px-4 py-2 rounded-[2px] border border-[#D4AF63]/55 text-[#F7F1E5] hover:bg-white/10 text-[11px] uppercase tracking-[0.16em] font-medium transition-colors cursor-pointer"
        >
          Essential Only
        </button>

        {showPrefs ? (
          <button
            type="button"
            onClick={() => saveAndClose(analyticsEnabled)}
            className="px-4 py-2 rounded-[2px] bg-[#D4AF63] text-[#2B0E17] hover:bg-[#F1D889] text-[11px] uppercase tracking-[0.16em] font-semibold transition-colors cursor-pointer"
          >
            Save Preferences
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowPrefs(true)}
            className="px-4 py-2 rounded-[2px] text-[#F1D889] hover:text-[#F7F1E5] text-[11px] uppercase tracking-[0.16em] font-medium underline underline-offset-4 cursor-pointer"
          >
            Preferences
          </button>
        )}

        <button
          type="button"
          onClick={() => saveAndClose(true)}
          className="ml-auto px-4 py-2 rounded-[2px] bg-[#D4AF63] text-[#2B0E17] hover:bg-[#F1D889] text-[11px] uppercase tracking-[0.16em] font-semibold transition-colors cursor-pointer"
        >
          Accept All
        </button>
      </div>
    </aside>
  );
}
