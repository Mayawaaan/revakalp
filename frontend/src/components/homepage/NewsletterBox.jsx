import React from "react";
import { MessageCircle } from "lucide-react";

const NewsletterBox = () => {
  return (
    <section
      aria-label="Community & Return Notice"
      className="py-16 sm:py-24 bg-[#F7F1E5] border-t border-[#38131E]/10"
    >
      <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <span className="h-px w-6 bg-[#D4AF63]" aria-hidden="true" />
          <p className="text-[11px] tracking-[0.28em] uppercase text-[#38131E]/75 font-medium">
            Stay Connected
          </p>
          <span className="h-px w-6 bg-[#D4AF63]" aria-hidden="true" />
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#38131E] leading-tight">
          Join Revakalp on WhatsApp
        </h2>

        <p className="mt-4 text-sm sm:text-base text-[#1A1718]/75 leading-relaxed max-w-xl mx-auto">
          Receive direct updates on fresh retail arrivals, festive edits, and
          collection availability through our official WhatsApp community.
        </p>

        <div className="mt-8 flex justify-center">
          <a
            href="https://chat.whatsapp.com/BofeilrtYMs3XaTWIG1PJN"
            target="_blank"
            rel="noopener noreferrer"
            className="rk-btn-primary"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Join WhatsApp Community</span>
          </a>
        </div>

        <p className="mt-8 text-xs text-[#1A1718]/65 max-w-2xl mx-auto leading-relaxed bg-white/80 border border-[#38131E]/10 rounded-2xl p-4">
          <span className="font-semibold text-[#38131E]">Important Return Policy:</span>{" "}
          A clear, continuous unboxing video is mandatory for all return or replacement requests.
          This video serves as definitive proof of the product&apos;s condition upon arrival. Still
          images are insufficient for claim processing.
        </p>
      </div>
    </section>
  );
};

export default NewsletterBox;
