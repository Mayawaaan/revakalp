import React from "react";
import useStore from "../../store/store";

const OurPolicy = () => {
  const settings = useStore((s) => s.settings);
  const threshold = settings?.freeShippingThreshold;
  const currency = settings?.currencySymbol || "₹";

  const cards = [
    {
      title: "Delivered Across India",
      desc:
        Number.isFinite(Number(threshold)) && Number(threshold) > 0
          ? `Free delivery in Indore and over ${currency}${Number(threshold).toLocaleString("en-IN")} across India.`
          : "Free delivery in Indore and on eligible pan-India orders.",
    },
    {
      title: "7-Day Returns & Exchanges",
      desc: "7-day returns with original tags and an unboxing video.",
    },
    {
      title: "Safe, Simple Checkout",
      desc: "Secure Razorpay payments or Cash on Delivery.",
    },
    {
      title: "Visit Us in Indore",
      desc: "Shop online or visit our Rajendra Nagar, Indore store.",
    },
  ];

  return (
    <section
      aria-label="Store Service Highlights"
      className="bg-[#EFE6D5] border-b border-[#38131E]/14"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#38131E]/12">
          {cards.map((item) => (
            <div
              key={item.title}
              data-reveal="card"
              className="py-5 sm:py-7 sm:px-6 first:sm:pl-0 last:sm:pr-0"
            >
              <h3 className="font-serif text-lg text-[#38131E] leading-snug mb-1.5">
                {item.title}
              </h3>
              <p className="text-xs text-[#1A1718]/72 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurPolicy;
