import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  Landmark,
  Loader2,
  Lock,
  ShieldCheck,
  Smartphone,
  X,
  XCircle,
} from "lucide-react";
import useBodyScrollLock from "../../hooks/useBodyScrollLock";

const BANKS = ["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank"];

export default function DemoPaymentModal({
  isOpen,
  session,
  storeName = "REVAKALP",
  customer = {},
  currencySymbol = "₹",
  onSuccess,
  onFailure,
  onCancel,
}) {
  useBodyScrollLock(isOpen);

  const defaultTab = session?.paymentMethod === "upi" ? "upi" : "card";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [upiId, setUpiId] = useState("demo@upi");
  const [selectedBank, setSelectedBank] = useState(BANKS[0]);
  const [processingState, setProcessingState] = useState(null); // null | "success" | "failed"

  useEffect(() => {
    if (isOpen) {
      setActiveTab(session?.paymentMethod === "upi" ? "upi" : "card");
      setProcessingState(null);
    }
  }, [isOpen, session?.paymentMethod]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape" && !processingState) {
        onCancel?.();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, processingState, onCancel]);

  if (!isOpen || !session) return null;

  const amountRupees =
    session.expectedTotal ?? Math.round((Number(session.order?.amount) || 0) / 100);

  const handleSimulateSuccess = () => {
    if (processingState) return;
    setProcessingState("success");
    const fakePayId = `demo_pay_${Date.now().toString(36)}${Math.random()
      .toString(36)
      .slice(2, 7)}`;

    setTimeout(() => {
      onSuccess?.({
        razorpay_order_id: session.order?.id,
        razorpay_payment_id: fakePayId,
        razorpay_signature: "demo_verified_signature",
        internalOrderId: session.internalOrderId,
      });
    }, 650);
  };

  const handleSimulateFailure = () => {
    if (processingState) return;
    setProcessingState("failed");
    setTimeout(() => {
      onFailure?.({
        razorpay_order_id: session.order?.id,
        razorpay_payment_id: `demo_fail_${Date.now().toString(36)}`,
        razorpay_signature: "demo_failed_signature",
        internalOrderId: session.internalOrderId,
        demoOutcome: "failed",
      });
    }, 450);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Demo Payment Checkout"
      className="fixed inset-0 z-[130] flex items-center justify-center p-4"
    >
      <div
        className="fixed inset-0 bg-[#1A1718]/70 backdrop-blur-xs"
        onClick={() => {
          if (!processingState) onCancel?.();
        }}
      />

      <div className="relative z-10 w-full max-w-md rounded-[4px] overflow-hidden bg-[#FBF7EE] border border-[#D4AF63]/60 shadow-2xl flex flex-col max-h-[90dvh]">
        {/* Header */}
        <div className="bg-[#2B0E17] text-[#F7F1E5] px-5 py-4 border-b border-[#D4AF63]/30 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-[#D4AF63] text-[#2B0E17] text-[10px] font-bold uppercase tracking-[0.18em]">
                <ShieldCheck className="w-3 h-3" /> Demo Payment · No Real Charge
              </span>
              <h3 className="font-serif text-xl text-[#F7F1E5] mt-2">{storeName}</h3>
              <p className="text-[11px] text-[#F7F1E5]/70">
                Order {session.orderNumber}
                {customer?.name ? ` · ${customer.name}` : ""}
              </p>
            </div>

            <button
              type="button"
              disabled={Boolean(processingState)}
              onClick={onCancel}
              aria-label="Close demo payment modal"
              className="w-8 h-8 rounded-[2px] flex items-center justify-center text-[#F7F1E5]/75 hover:text-[#F1D889] hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-40"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-white/12 flex items-baseline justify-between">
            <span className="text-xs uppercase tracking-[0.16em] text-[#F1D889]/85">
              Payable Total
            </span>
            <span className="text-2xl font-serif font-semibold text-[#F1D889]">
              {currencySymbol}
              {Number(amountRupees).toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Scrollable Body */}
        <div
          data-lenis-prevent=""
          data-lenis-prevent-wheel=""
          data-lenis-prevent-touch=""
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain rk-filter-scroll p-5 space-y-4"
        >
          {/* Mode Tabs */}
          <div className="grid grid-cols-3 gap-2" role="tablist" aria-label="Demo payment method">
            {[
              { id: "upi", label: "UPI", icon: Smartphone },
              { id: "card", label: "Card", icon: CreditCard },
              { id: "netbanking", label: "Netbanking", icon: Landmark },
            ].map((tab) => {
              const Icon = tab.icon;
              const selected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  disabled={Boolean(processingState)}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-[2px] border text-xs font-medium transition-colors cursor-pointer ${
                    selected
                      ? "bg-[#38131E] text-[#F1D889] border-[#38131E]"
                      : "bg-white text-[#38131E] border-[#38131E]/20 hover:border-[#38131E]/50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Method Preview Content */}
          {activeTab === "upi" && (
            <div className="p-4 rounded-[2px] bg-white border border-[#38131E]/14 space-y-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#38131E]/70 font-semibold">
                Test UPI ID / QR
              </p>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                disabled={Boolean(processingState)}
                placeholder="demo@upi"
                aria-label="Test UPI ID"
                className="w-full px-3 py-2 rounded-[2px] border border-[#38131E]/20 bg-[#FBF7EE] text-sm text-[#1A1718] focus:outline-none focus:ring-1 focus:ring-[#D4AF63]"
              />
              <div className="flex flex-wrap gap-1.5">
                {["success@razorpay", "demo@upi", "revakalp@okaxis"].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    disabled={Boolean(processingState)}
                    onClick={() => setUpiId(preset)}
                    className="px-2.5 py-1 rounded-[2px] border border-[#38131E]/18 bg-[#F7F1E5] text-[11px] text-[#38131E] hover:border-[#38131E] cursor-pointer"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "card" && (
            <div className="p-4 rounded-[2px] bg-white border border-[#38131E]/14 space-y-2.5 text-xs">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#38131E]/70 font-semibold">
                Test Card Prefilled
              </p>
              <div className="p-3 rounded-[2px] bg-[#F7F1E5] border border-[#38131E]/14 space-y-1">
                <p className="font-mono text-sm text-[#38131E] font-semibold">
                  4111 •••• •••• 1111
                </p>
                <p className="text-[#1A1718]/70">
                  Exp: 12/29 · CVV: 123 · {customer?.name || "Demo Customer"}
                </p>
              </div>
            </div>
          )}

          {activeTab === "netbanking" && (
            <div className="p-4 rounded-[2px] bg-white border border-[#38131E]/14 space-y-2.5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#38131E]/70 font-semibold">
                Select Test Bank
              </p>
              <div className="grid grid-cols-2 gap-2">
                {BANKS.map((bank) => {
                  const chosen = selectedBank === bank;
                  return (
                    <button
                      key={bank}
                      type="button"
                      disabled={Boolean(processingState)}
                      onClick={() => setSelectedBank(bank)}
                      className={`px-3 py-2 rounded-[2px] border text-xs text-left transition-colors cursor-pointer ${
                        chosen
                          ? "border-[#38131E] bg-[#38131E]/8 text-[#38131E] font-semibold"
                          : "border-[#38131E]/18 bg-[#FBF7EE] text-[#1A1718]/80 hover:border-[#38131E]/45"
                      }`}
                    >
                      {bank}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <p className="flex items-center gap-1.5 text-[11px] text-[#1A1718]/65">
            <Lock className="w-3.5 h-3.5 text-[#38131E] shrink-0" />
            Simulated checkout reserves stock, verifies order totals, and creates a real
            order record without charging a card or UPI account.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-[#F7F1E5] border-t border-[#38131E]/12 space-y-2 shrink-0">
          <button
            type="button"
            disabled={Boolean(processingState)}
            onClick={handleSimulateSuccess}
            className="w-full min-h-[44px] px-4 py-2.5 rounded-[2px] bg-[#38131E] hover:bg-[#2B0E17] text-[#F1D889] text-xs uppercase tracking-[0.18em] font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-70"
          >
            {processingState === "success" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Confirming Payment…
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" /> Pay {currencySymbol}
                {Number(amountRupees).toLocaleString("en-IN")} (Simulate Success)
              </>
            )}
          </button>

          <button
            type="button"
            disabled={Boolean(processingState)}
            onClick={handleSimulateFailure}
            className="w-full min-h-[38px] px-4 py-2 rounded-[2px] border border-red-300 bg-white hover:bg-red-50 text-red-700 text-[11px] uppercase tracking-[0.15em] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            {processingState === "failed" ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Simulating Failure…
              </>
            ) : (
              <>
                <XCircle className="w-3.5 h-3.5" /> Simulate Failed Payment
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
