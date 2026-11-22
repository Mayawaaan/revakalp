import React, { useState } from "react";
import { Plus } from "lucide-react";
import PageHero from "../../components/globalComponents/PageHero";
import EditorialButton from "../../components/ui/EditorialButton";

const FAQS = [
  {
    q: "How are Revakalp garments checked before shipping?",
    a: "Every piece is looked over by hand in our Indore store for fabric condition, finish, and stitching before it is packed and listed.",
  },
  {
    q: "Do you carry regional Indian sarees like Maheshwari or Banarasi?",
    a: "Yes. We keep a changing mix of regional styles — such as Chanderi, Maheshwari, and Banarasi drapes — alongside lighter everyday sarees. Check the Fabric & Care section on each page for specifics.",
  },
  {
    q: "How long does delivery usually take?",
    a: "We usually pack and hand over orders within 3–5 business days. Once shipped, you can follow delivery updates anytime in My Orders.",
  },
  {
    q: "Can I return or exchange something if it isn't right?",
    a: "Yes. You can request a return or exchange within 7 days of delivery as long as the item is unworn with original tags still attached and you share a continuous unboxing video.",
  },
  {
    q: "Will colors match what I see on my screen?",
    a: "We photograph pieces as faithfully as possible, though small differences in warmth or tone can happen depending on lighting and screen settings.",
  },
  {
    q: "Can I pay Cash on Delivery?",
    a: "When Cash on Delivery is active for your order, you'll see it available as a choice right at checkout.",
  },
  {
    q: "How do sizes work across sarees and stitched pieces?",
    a: "Sarees come standard free-size. Garments that require sizing — like lehengas, Indo-Western pieces, or printed tees — let you pick your size right on the product page.",
  },
  {
    q: "What's the quickest way to reach your team?",
    a: "Write to us at contact@revakalp.com or call/WhatsApp +91 91096-76562 Monday through Saturday during store hours.",
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
                    className={`w-8 h-8 rounded-[2px] flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? "bg-[#38131E] text-[#F1D889] rotate-45"
                        : "bg-[#EFE6D5] text-[#38131E]"
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

        <div className="rounded-[2px] bg-[#2B0E17] text-[#F7F1E5] p-8 sm:p-12 text-center border border-[#D4AF63]/35">
          <h2 className="font-serif text-2xl sm:text-3xl mb-2">Still have a question?</h2>
          <p className="text-sm text-[#F7F1E5]/75 mb-6">
            Drop us a note at <strong>contact@revakalp.com</strong> and we&apos;ll be glad to help.
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
