import React from "react";
import { Truck, RefreshCw, ShieldCheck, Store } from "lucide-react";
import useStore from "../../store/store";

const OurPolicy = () => {
  const settings = useStore((s) => s.settings);
  const threshold = settings?.freeShippingThreshold;
  const currency = settings?.currencySymbol || "₹";

  const cards = [
    {
      icon: Truck,
      title: "Pan-India Delivery",
      desc:
        Number.isFinite(Number(threshold)) && Number(threshold) > 0
          ? `Free delivery in Indore and on orders above ${currency}${Number(threshold).toLocaleString("en-IN")}.`
          : "Carefully packed and shipped across India from Indore.",
    },
    {
      icon: RefreshCw,
      title: "7-Day Returns",
      desc: "Return or exchange eligible within 7 days of delivery with continuous unboxing video.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Checkout",
      desc: "Protected server-verified online payments and Cash on Delivery where enabled.",
    },
    {
      icon: Store,
      title: "Indore Retail Store",
      desc: "Curated ethnic wear & everyday apparel, backed by our physical store in Indore.",
    },
  ];

  return (
    <section
      aria-label="Store Service Highlights"
      className="py-12 sm:py-16 bg-[#F7F1E5] border-b border-[#38131E]/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-6 rounded-2xl bg-white/90 border border-[#38131E]/12 flex items-start gap-4"
              >
                <div className="w-11 h-11 rounded-full bg-[#38131E]/8 border border-[#D4AF63]/40 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#38131E]" strokeWidth={1.6} />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#38131E] leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-[#1A1718]/70 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OurPolicy;
