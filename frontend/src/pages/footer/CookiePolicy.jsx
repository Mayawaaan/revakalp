import React, { useEffect, useState } from "react";
import PageHero from "../../components/globalComponents/PageHero";
import { getConsentState } from "../../utils/analytics";
import { useSeoMeta } from "../../utils/seo";

const CookiePolicy = () => {
  const [consent, setConsent] = useState(() => getConsentState());

  useEffect(() => {
    const sync = () => setConsent(getConsentState());
    window.addEventListener("rk-consent-updated", sync);
    return () => window.removeEventListener("rk-consent-updated", sync);
  }, []);

  useSeoMeta({
    title: "Cookie Policy",
    description:
      "Details on strictly necessary authentication cookies and opt-in storefront analytics storage used on Revakalp.",
    canonicalPath: "/cookie-policy",
  });

  return (
    <div className="bg-[#F7F1E5] text-[#1A1718]">
      <PageHero
        label="Transparency"
        title="Cookie Policy"
        subtitle="How Revakalp uses essential session cookies and optional analytics storage."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
        <div className="rk-surface-card p-6 sm:p-10 space-y-6">
          <div className="space-y-2">
            <h2 className="font-serif text-2xl text-[#38131E]">
              Managing Your Preferences
            </h2>
            <p className="text-sm text-[#1A1718]/80 leading-relaxed">
              Essential cookies keep your login session secure and cannot be switched off when
              signing in. Optional storefront analytics are off by default until you grant
              consent.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() =>
                  window.dispatchEvent(new Event("rk-open-cookie-settings"))
                }
                className="rk-btn-primary"
              >
                Manage Cookie Preferences
              </button>
              <span className="text-xs text-[#38131E]/75">
                Current analytics setting:{" "}
                <strong className="text-[#38131E]">
                  {consent?.analytics ? "Enabled" : "Essential Only"}
                </strong>
              </span>
            </div>
          </div>

          <div className="overflow-x-auto pt-4 border-t border-[#38131E]/10">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#38131E]/18 text-[#38131E] uppercase tracking-wider text-[11px]">
                  <th className="py-3 pr-4">Name</th>
                  <th className="py-3 pr-4">Category</th>
                  <th className="py-3 pr-4">Purpose</th>
                  <th className="py-3">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#38131E]/10 text-[#1A1718]/80">
                <tr>
                  <td className="py-3 pr-4 font-mono text-xs text-[#38131E]">
                    refreshToken
                  </td>
                  <td className="py-3 pr-4 font-medium">Essential (httpOnly)</td>
                  <td className="py-3 pr-4">
                    Maintains authenticated sessions securely with token rotation.
                  </td>
                  <td className="py-3">4 days</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-xs text-[#38131E]">
                    revakalp_analytics_consent
                  </td>
                  <td className="py-3 pr-4 font-medium">Preference</td>
                  <td className="py-3 pr-4">
                    Remembers whether optional analytics events are granted or denied.
                  </td>
                  <td className="py-3">Local Storage</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-xs text-[#38131E]">
                    revakalp_consent_meta
                  </td>
                  <td className="py-3 pr-4 font-medium">Preference</td>
                  <td className="py-3 pr-4">
                    Stores DPDPA consent version and timestamp of your last choice.
                  </td>
                  <td className="py-3">Local Storage</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
