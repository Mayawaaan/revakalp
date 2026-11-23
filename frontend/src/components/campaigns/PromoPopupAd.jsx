import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { X, ArrowRight, Copy, Check } from "lucide-react";
import useStore from "../../store/store";
import EditorialButton from "../ui/EditorialButton";

export default function PromoPopupAd() {
  const { pathname } = useLocation();
  const activeCampaigns = useStore((s) => s.activeCampaigns);
  const trackCampaign = useStore((s) => s.trackCampaign);
  const showToast = useStore((s) => s.showToast);

  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const popup = Array.isArray(activeCampaigns)
    ? activeCampaigns.find((c) => c.slot === "promo_popup")
    : null;

  const isAdminOrAuth =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup");

  const storageKey = popup
    ? `rk-popup-${popup._id}-v${popup.version || 1}`
    : "";

  useEffect(() => {
    if (!popup || isAdminOrAuth) {
      setVisible(false);
      return undefined;
    }

    try {
      if (window.sessionStorage.getItem(storageKey)) {
        return undefined;
      }
    } catch {
      // ignore storage access issues
    }

    const timer = window.setTimeout(() => {
      setVisible(true);
      trackCampaign?.(popup._id, "impression");
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [popup, isAdminOrAuth, storageKey, trackCampaign]);

  const handleClose = () => {
    setVisible(false);
    if (storageKey) {
      try {
        window.sessionStorage.setItem(storageKey, "1");
      } catch {
        // ignore storage errors
      }
    }
  };

  useEffect(() => {
    if (!visible) return undefined;
    const onEsc = (e) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  });

  if (!visible || !popup || isAdminOrAuth) return null;

  const handleCopy = () => {
    if (!popup.couponCode) return;
    navigator.clipboard?.writeText(popup.couponCode);
    setCopied(true);
    showToast?.(`Coupon ${popup.couponCode} copied`, "success");
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={popup.title}
      className="fixed inset-0 z-[110] bg-[#1A1718]/65 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="relative w-full max-w-lg rounded-[2px] bg-[#FBF7EE] border border-[#D4AF63]/60 shadow-2xl overflow-hidden text-[#1A1718]">
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close promotional offer"
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-[2px] bg-[#2B0E17]/85 text-[#F1D889] hover:bg-[#2B0E17] flex items-center justify-center cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {popup.desktopImage && (
          <div className="aspect-[16/9] bg-[#2B0E17] overflow-hidden">
            <img
              src={popup.desktopImage}
              alt={popup.altText || popup.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-4">
          {popup.badgeText && (
            <span className="inline-block px-2.5 py-0.5 rounded-[2px] bg-[#38131E] text-[#F1D889] text-[10px] font-semibold uppercase tracking-[0.2em]">
              {popup.badgeText}
            </span>
          )}

          <h2 className="font-serif text-2xl sm:text-3xl text-[#38131E] leading-tight">
            {popup.title}
          </h2>

          {popup.subtitle && (
            <p className="text-sm text-[#1A1718]/80 leading-relaxed">
              {popup.subtitle}
            </p>
          )}

          {popup.couponCode && (
            <button
              type="button"
              onClick={handleCopy}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-[2px] bg-[#EFE6D5] border border-[#D4AF63]/60 text-xs font-mono text-[#38131E] cursor-pointer"
            >
              <span>Use code: <strong>{popup.couponCode}</strong></span>
              <span className="inline-flex items-center gap-1 font-sans uppercase tracking-wider font-semibold">
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy"}
              </span>
            </button>
          )}

          <div className="pt-1 flex flex-col sm:flex-row gap-3">
            <EditorialButton
              to={popup.destinationRoute || "/shop"}
              onClick={() => {
                trackCampaign?.(popup._id, "click");
                handleClose();
              }}
              variant="primary"
              className="flex-1"
            >
              <span>{popup.ctaLabel || "Explore Offer"}</span>
              <ArrowRight className="w-4 h-4" />
            </EditorialButton>

            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 text-xs uppercase tracking-[0.16em] text-[#38131E]/70 hover:text-[#38131E] cursor-pointer"
            >
              No thanks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
