import React from "react";

const NewsletterBox = () => {
  return (
    <section
      aria-label="Community & Return Notice"
      className="py-16 sm:py-24 bg-[#F7F1E5]"
    >
      <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center" data-reveal="card">
        <p className="text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-[#38131E]/75 font-medium mb-4">
          Stay in Touch
        </p>

        <h2
          data-reveal="heading"
          className="font-serif text-[clamp(2rem,4vw,3.1rem)] text-[#38131E] leading-tight"
        >
          Join our WhatsApp group
        </h2>

        <p className="mt-4 text-sm sm:text-base text-[#1A1718]/75 leading-relaxed max-w-xl mx-auto">
          Hear first when new pieces arrive in store.
        </p>

        <div className="mt-8 flex justify-center">
          <a
            href="https://chat.whatsapp.com/BofeilrtYMs3XaTWIG1PJN"
            target="_blank"
            rel="noopener noreferrer"
            className="rk-btn-primary"
          >
            <span>Join on WhatsApp</span>
          </a>
        </div>

        <p className="mt-10 text-xs text-[#1A1718]/70 max-w-2xl mx-auto leading-relaxed bg-[#FBF7EE] border border-[#38131E]/14 rounded-[2px] p-5">
          <span className="font-semibold text-[#38131E]">Return note:</span>{" "}
          Please record a continuous unboxing video when opening your parcel for return or
          exchange claims.
        </p>
      </div>
    </section>
  );
};

export default NewsletterBox;
