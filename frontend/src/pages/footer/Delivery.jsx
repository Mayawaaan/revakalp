import React from "react";
import { Package, Truck, Lock, MapPin } from "lucide-react";
import PageHero from "../../components/globalComponents/PageHero";

const Delivery = () => (
  <div className="bg-[#F7F1E5] text-[#1A1718]">
    <PageHero
      label="Shipping"
      title="Delivery & Shipping"
      subtitle="Carefully packed and delivered across India from our Indore retail store."
    />

    <div className="bg-[#2B0E17] py-10 px-4 sm:px-6 border-b border-[#D4AF63]/25">
      <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { value: "3–5", label: "Days Dispatch", icon: Package },
          { value: "Pan-India", label: "Delivery", icon: Truck },
          { value: "Secure", label: "Protective Packaging", icon: Lock },
          { value: "Live", label: "Order Tracking", icon: MapPin },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-2xl bg-[#38131E]/85 border border-[#D4AF63]/35 p-5 text-center"
            >
              <Icon className="w-6 h-6 text-[#F1D889] mx-auto mb-2" />
              <p className="font-serif text-xl sm:text-2xl font-semibold text-[#F1D889]">
                {s.value}
              </p>
              <p className="text-xs text-[#F7F1E5]/75 mt-1">{s.label}</p>
            </div>
          );
        })}
      </div>
    </div>

    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="rk-surface-card p-6 sm:p-10 md:p-12 divide-y divide-[#38131E]/10">
        {[
          {
            title: "Our Delivery Promise",
            content: (
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#1A1718]/80">
                <li>Protective packaging for delicate apparel and textiles</li>
                <li>Reliable Pan-India delivery partners</li>
                <li>Order tracking updates available in your account</li>
                <li>Quality inspection prior to dispatch</li>
              </ul>
            ),
          },
          {
            title: "Dispatch Timeline",
            content: (
              <p className="text-sm text-[#1A1718]/80 leading-relaxed">
                Orders are typically dispatched within{" "}
                <strong className="text-[#38131E]">3–5 business days</strong>.
                Timelines may vary slightly depending on destination and order volume.
                You will receive tracking updates once your order is dispatched.
              </p>
            ),
          },
          {
            title: "Sourcing & Preparation",
            content: (
              <p className="text-sm text-[#1A1718]/80 leading-relaxed">
                Revakalp curates sarees, lehengas, menswear, and contemporary tees from
                trusted suppliers and regional weavers. Each piece is checked, folded,
                and boxed before shipping.
              </p>
            ),
          },
          {
            title: "Care During Transit",
            content: (
              <p className="text-sm text-[#1A1718]/80 leading-relaxed">
                Every parcel is packed using breathable, fabric-safe materials to protect
                garments from moisture, dust, and transit handling.
              </p>
            ),
          },
          {
            title: "Need Help?",
            content: (
              <p className="text-sm text-[#1A1718]/80 leading-relaxed">
                For delivery assistance or tracking queries, contact us at{" "}
                <a
                  href="mailto:contact@revakalp.com"
                  className="text-[#38131E] font-semibold underline"
                >
                  contact@revakalp.com
                </a>{" "}
                or call/WhatsApp{" "}
                <strong className="text-[#38131E]">+91 91096-76562</strong>.
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

export default Delivery;
