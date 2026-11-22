import React, { useState } from "react";
import { Plus } from "lucide-react";
import PageHero from "../../components/globalComponents/PageHero";
import EditorialButton from "../../components/ui/EditorialButton";

const FAQS = [
  {
    q: "Are Revakalp sarees and apparel quality-checked?",
    a: "Yes. Every item curated for Revakalp is sourced from trusted suppliers and weavers across India and inspected for fabric, finish, and condition before listing.",
  },
  {
    q: "Do you carry handloom and regional sarees?",
    a: "Yes. We carry a curated selection of regional sarees such as Chanderi, Maheshwari, and Banarasi styles alongside contemporary drapes. Individual listings specify fabric and style details.",
  },
  {
    q: "How long does delivery take?",
    a: "Orders are usually dispatched within 3–5 business days. Delivery timelines vary based on your destination and can be tracked in your account once shipped.",
  },
  {
    q: "Can I return or exchange an order?",
    a: "Yes. We accept return or exchange requests within 7 days of delivery, provided the product is unused, unwashed, with original tags intact, and supported by a continuous unboxing video.",
  },
  {
    q: "Do product colors match the images?",
    a: "We make every effort to display accurate photographs. Minor variations may occur due to lighting, screen calibration, or textile weave characteristics.",
  },
  {
    q: "Is Cash on Delivery available?",
    a: "Cash on Delivery availability depends on active store settings at checkout.",
  },
  {
    q: "How do I choose my size?",
    a: "Sarees are free-size. Products requiring size selection display available sizes directly on the product detail page.",
  },
  {
    q: "How can I contact customer support?",
    a: "Reach us at contact@revakalp.com or call/WhatsApp +91 91096-76562 during store hours.",
  },
];

const FAQ = () => {
  const [open, setOpen] = useState(null);

  return (
    <div className="bg-[#F7F1E5] text-[#1A1718]">
      <PageHero
        label="Support"
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about shopping with Revakalp."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
        <div className="space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className={`rk-surface-card overflow-hidden transition-colors ${
                  isOpen ? "border-[#38131E]" : ""
                }`}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-serif text-lg sm:text-xl text-[#38131E]">
                    {item.q}
                  </span>
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? "bg-[#38131E] text-[#F1D889] rotate-45"
                        : "bg-[#F7F1E5] text-[#38131E]"
                    }`}
                  >
                    <Plus size={16} />
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-2 border-t border-[#38131E]/10">
                    <p className="text-sm text-[#1A1718]/80 leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="rounded-3xl bg-[#2B0E17] text-[#F7F1E5] p-8 sm:p-12 text-center border border-[#D4AF63]/35">
          <h2 className="font-serif text-2xl sm:text-3xl mb-2">Still have a question?</h2>
          <p className="text-sm text-[#F7F1E5]/75 mb-6">
            Write to us at <strong>contact@revakalp.com</strong> and our team will assist you.
          </p>
          <EditorialButton to="/contact" variant="gold">
            Contact Us
          </EditorialButton>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
