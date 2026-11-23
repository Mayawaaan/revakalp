import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Check } from "lucide-react";
import useStore from "../../store/store";

export default function AnnouncementBar() {
  const activeCampaigns = useStore((s) => s.activeCampaigns);
  const trackCampaign = useStore((s) => s.trackCampaign);
  const showToast = useStore((s) => s.showToast);
  const [copied, setCopied] = useState(false);

  const announcement = Array.isArray(activeCampaigns)
    ? activeCampaigns.find((c) => c.slot === "announcement_bar")
    : null;

  useEffect(() => {
    if (announcement?._id) {
      trackCampaign?.(announcement._id, "impression");
    }
  }, [announcement?._id, trackCampaign]);

  const handleCopyCoupon = () => {
    if (!announcement?.couponCode) return;
    navigator.clipboard?.writeText(announcement.couponCode);
    setCopied(true);
    showToast?.(`Coupon ${announcement.couponCode} copied`, "success");
    setTimeout(() => setCopied(false), 1800);
  };

  if (announcement) {
    return (
      <div
        className="bg-[#2B0E17] text-[#F7F1E5] border-b border-[#D4AF63]/25"
        role="region"
        aria-label="Store promotion notice"
      >
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 xl:px-8 min-h-8 py-1.5 flex flex-wrap items-center justify-center sm:justify-between gap-2 text-[9.5px] sm:text-[10.5px] tracking-[0.14em] sm:tracking-[0.2em] uppercase">
          <div className="flex flex-wrap items-center justify-center gap-2 min-w-0">
            {announcement.badgeText && (
              <span className="px-2 py-0.5 rounded-[2px] bg-[#D4AF63] text-[#2B0E17] font-bold tracking-[0.14em]">
                {announcement.badgeText}
              </span>
            )}
            <p className="text-center text-[#F7F1E5]/95 font-medium truncate">
              {announcement.title}
            </p>
            {announcement.couponCode && (
              <button
                type="button"
                onClick={handleCopyCoupon}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] border border-[#D4AF63]/60 text-[#F1D889] hover:bg-[#D4AF63] hover:text-[#2B0E17] transition-colors font-mono cursor-pointer"
                title="Click to copy coupon code"
              >
                {copied ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                <span>{announcement.couponCode}</span>
              </button>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-4 text-[#F1D889]/90 shrink-0">
            {announcement.ctaLabel && (
              <Link
                to={announcement.destinationRoute || "/shop"}
                onClick={() => trackCampaign?.(announcement._id, "click")}
                className="hover:text-[#F7F1E5] underline underline-offset-4 transition-colors"
              >
                {announcement.ctaLabel} →
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-[#2B0E17] text-[#F7F1E5] border-b border-[#D4AF63]/25"
      role="region"
      aria-label="Store notice"
    >
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 xl:px-8 min-h-8 py-1 flex items-center justify-center sm:justify-between text-[9.5px] sm:text-[10px] tracking-[0.16em] sm:tracking-[0.24em] uppercase">
        <p className="text-center text-[#F7F1E5]/90 font-medium truncate">
          Weaving Life Into Time <span className="text-[#D4AF63] mx-2">·</span> Indore
        </p>
        <div className="hidden sm:flex items-center gap-5 text-[#F1D889]/90 shrink-0">
          <Link to="/heritage" className="hover:text-[#F7F1E5] transition-colors">
            Indian Textiles
          </Link>
          <span className="text-[#D4AF63]/35">|</span>
          <Link to="/about" className="hover:text-[#F7F1E5] transition-colors">
            Visit Our Store
          </Link>
        </div>
      </div>
    </div>
  );
}
