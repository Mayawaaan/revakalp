import React from "react";
import useStore from "../../store/store";
import PageHero from "../../components/globalComponents/PageHero";
import { useSeoMeta } from "../../utils/seo";

const Delivery = () => {
  const settings = useStore((s) => s.settings);
  const currency = settings?.currencySymbol || "₹";
  const threshold = Number(settings?.freeShippingThreshold ?? 500);
  const deliveryFee = Number(settings?.deliveryFee ?? 50);
  const supportEmail = settings?.supportEmail?.trim() || "contact@revakalp.com";
  const phone = settings?.phone?.trim() || "+91 91096-76562";
  const address =
    settings?.address?.trim() ||
    "231-231, Shop No. 2, Dhanwantri Nagar, Rajendra Nagar, Indore, Madhya Pradesh – 452012";

  useSeoMeta({
    title: "Delivery & Shipping Policy",
    description:
      "Dispatch timelines, Indore local delivery waiver, pan-India shipping fees, and GST tax invoice information from Revakalp.",
    canonicalPath: "/delivery-information",
  });

  return (
    <div className="bg-[#F7F1E5] text-[#1A1718]">
      <PageHero
        label="Shipping Policy"
        title="Delivery & Shipping"
        subtitle="Carefully packed and dispatched across India from our Indore store."
      />

      <div className="bg-[#2B0E17] py-10 px-4 sm:px-6 border-b border-[#D4AF63]/25">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { value: "3–5 Days", label: "Typical Dispatch" },
            { value: "Across India", label: "Delivery Reach" },
            {
              value:
                threshold > 0
                  ? `Free ${currency}${threshold}+`
                  : "Free in Indore",
              label: "Shipping Waiver",
            },
            { value: "Track Anytime", label: "In Your Account" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-[2px] bg-[#38131E]/85 border border-[#D4AF63]/35 p-5 text-center"
            >
              <p className="font-serif text-xl sm:text-2xl font-semibold text-[#F1D889]">
                {s.value}
              </p>
              <p className="text-xs text-[#F7F1E5]/75 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="rk-surface-card p-6 sm:p-10 md:p-12 divide-y divide-[#38131E]/10">
          {[
            {
              title: "Shipping Charges & Indore Free Delivery",
              content: (
                <p className="text-sm text-[#1A1718]/80 leading-relaxed">
                  Orders delivered within Indore qualify for free delivery. For deliveries
                  elsewhere in India, shipping is free on orders above{" "}
                  <strong className="text-[#38131E]">
                    {currency}
                    {threshold.toLocaleString("en-IN")}
                  </strong>{" "}
                  and otherwise calculated at checkout (currently{" "}
                  <strong className="text-[#38131E]">
                    {currency}
                    {deliveryFee.toLocaleString("en-IN")}
                  </strong>
                  ).
                </p>
              ),
            },
            {
              title: "When Orders Go Out",
              content: (
                <p className="text-sm text-[#1A1718]/80 leading-relaxed">
                  Every garment is inspected by hand and packed cleanly at {address}. Most orders
                  leave within <strong className="text-[#38131E]">3–5 business days</strong>.
                  Once dispatched, you can track progress anytime under My Orders.
                </p>
              ),
            },
            {
              title: "Tax Invoices & Address Accuracy",
              content: (
                <p className="text-sm text-[#1A1718]/80 leading-relaxed">
                  Every order includes a tax invoice available for download in your account. If
                  a parcel returns to us due to an incorrect address or repeated missed delivery
                  attempts, our team will contact you to arrange re-dispatch.
                </p>
              ),
            },
            {
              title: "Questions About an Order?",
              content: (
                <p className="text-sm text-[#1A1718]/80 leading-relaxed">
                  If you&apos;d like help checking on a shipment, email{" "}
                  <a
                    href={`mailto:${supportEmail}`}
                    className="text-[#38131E] font-semibold underline"
                  >
                    {supportEmail}
                  </a>{" "}
                  or call/WhatsApp <strong className="text-[#38131E]">{phone}</strong>.
                </p>
              ),
            },
          ].map((item) => (
            <div key={item.title} className="py-6 first:pt-0 last:pb-0">
              <h2 className="font-serif text-2xl text-[#38131E] mb-3">{item.title}</h2>
              {item.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Delivery;
