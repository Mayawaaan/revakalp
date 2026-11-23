import React, { useEffect, useState } from "react";
import { ArrowRight, Check, Copy } from "lucide-react";
import useStore from "../../store/store";
import EditorialButton from "../ui/EditorialButton";

export default function CampaignAdBanner({
  slot = "promo_banner",
  compact = false,
}) {
  const activeCampaigns = useStore((s) => s.activeCampaigns);
  const trackCampaign = useStore((s) => s.trackCampaign);
  const showToast = useStore((s) => s.showToast);
  const [copied, setCopied] = useState(false);

  const campaign = Array.isArray(activeCampaigns)
    ? activeCampaigns.find((c) => c.slot === slot)
    : null;

  useEffect(() => {
    if (campaign?._id) {
      trackCampaign?.(campaign._id, "impression");
    }
  }, [campaign?._id, trackCampaign]);

  if (!campaign) return null;

  const handleCopy = () => {
    if (!campaign.couponCode) return;
    navigator.clipboard?.writeText(campaign.couponCode);
    setCopied(true);
    showToast?.(`Coupon ${campaign.couponCode} copied`, "success");
    setTimeout(() => setCopied(false), 1800);
  };

  if (compact) {
    return (
      <section aria-label={campaign.title} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="rounded-[2px] bg-[#2B0E17] text-[#F7F1E5] border border-[#D4AF63]/40 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {campaign.badgeText && (
                <span className="px-2 py-0.5 rounded-[2px] bg-[#D4AF63] text-[#2B0E17] text-[10px] font-bold uppercase tracking-[0.16em]">
                  {campaign.badgeText}
                </span>
              )}
              <h2 className="font-serif text-lg sm:text-xl text-[#F7F1E5]">
                {campaign.title}
              </h2>
            </div>
            {campaign.subtitle && (
              <p className="text-xs text-[#F7F1E5]/78">{campaign.subtitle}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {campaign.couponCode && (
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[2px] border border-[#D4AF63]/55 text-[#F1D889] text-xs font-mono uppercase tracking-wider hover:bg-[#D4AF63] hover:text-[#2B0E17] transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{campaign.couponCode}</span>
              </button>
            )}

            <EditorialButton
              to={campaign.destinationRoute || "/shop"}
              onClick={() => trackCampaign?.(campaign._id, "click")}
              variant="gold"
            >
              <span>{campaign.ctaLabel || "Explore"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </EditorialButton>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-label={campaign.title}
      className="bg-[#F7F1E5] py-8 sm:py-12 border-b border-[#38131E]/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2px] bg-[#2B0E17] text-[#F7F1E5] border border-[#D4AF63]/45 grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center space-y-4">
            {campaign.badgeText && (
              <span className="w-fit px-2.5 py-1 rounded-[2px] bg-[#D4AF63] text-[#2B0E17] text-[10px] font-bold uppercase tracking-[0.2em]">
                {campaign.badgeText}
              </span>
            )}
            <h2 className="font-serif text-2xl sm:text-4xl text-[#F7F1E5] leading-tight">
              {campaign.title}
            </h2>
            {campaign.subtitle && (
              <p className="text-sm sm:text-base text-[#F7F1E5]/82 max-w-xl leading-relaxed">
                {campaign.subtitle}
              </p>
            )}

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <EditorialButton
                to={campaign.destinationRoute || "/shop"}
                onClick={() => trackCampaign?.(campaign._id, "click")}
                variant="gold"
              >
                <span>{campaign.ctaLabel || "Shop Campaign"}</span>
                <ArrowRight className="w-4 h-4" />
              </EditorialButton>

              {campaign.couponCode && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-[2px] border border-[#D4AF63]/55 text-[#F1D889] text-xs font-mono uppercase tracking-[0.16em] hover:bg-[#D4AF63] hover:text-[#2B0E17] transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>Code: {campaign.couponCode}</span>
                </button>
              )}
            </div>
          </div>

          {campaign.desktopImage && (
            <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-[280px] overflow-hidden">
              <img
                src={campaign.desktopImage}
                alt={campaign.altText || campaign.title}
                className="w-full h-full object-cover"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, var(--rk-primary-deep, #2B0E17) 0%, transparent 45%)",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
