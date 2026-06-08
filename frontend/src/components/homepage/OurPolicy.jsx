import React from "react";
import { Truck, RefreshCw, ShieldCheck } from "lucide-react";

const OurPolicy = () => {
  return (
    <section className="relative bg-gradient-to-br from-[#fffafc] via-[#fff1f4] to-[#ffe6ee] py-28 overflow-hidden">

      {/* Soft background glow */}
      <div className="absolute -top-32 left-20 w-[420px] h-[420px] bg-pink-200 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute -bottom-40 right-20 w-[520px] h-[520px] bg-rose-300 rounded-full blur-3xl opacity-30"></div>

      <div className="relative max-w-7xl mx-auto px-8">

        {/* Section header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <p className="uppercase tracking-[0.35em] text-xs text-pink-600 mb-4">
            Our Promise
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-pink-900">
            Shopping with Confidence
          </h2>
          <p className="mt-6 text-pink-700 text-lg leading-relaxed">
            Every Revakalp experience is designed to be effortless, secure,
            and reassuring — from the moment you browse to the day your saree
            arrives.
          </p>
        </div>

        {/* Policy Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">

          {/* Shipping */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-10 text-center shadow-xl hover:shadow-2xl transition">
            <Truck className="mx-auto h-12 w-12 text-[#c9487c]" />
            <h3 className="font-serif text-2xl text-pink-900 mt-6">
              Complimentary Shipping
            </h3>
            <p className="text-pink-700 mt-3 leading-relaxed">
              Enjoy free delivery in Indore, and on all orders above ₹5000 elsewhere — carefully packed
              and delivered with care.
            </p>
          </div>

          {/* Returns */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-10 text-center shadow-xl hover:shadow-2xl transition">
            <RefreshCw className="mx-auto h-12 w-12 text-[#c9487c]" />
            <h3 className="font-serif text-2xl text-pink-900 mt-6">
              Easy Returns
            </h3>
            <p className="text-pink-700 mt-3 leading-relaxed">
              Thoughtful 7-day return policy to ensure you shop with complete
              peace of mind.
            </p>
          </div>

          {/* Payments */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-10 text-center shadow-xl hover:shadow-2xl transition">
            <ShieldCheck className="mx-auto h-12 w-12 text-[#c9487c]" />
            <h3 className="font-serif text-2xl text-pink-900 mt-6">
              Secure Payments
            </h3>
            <p className="text-pink-700 mt-3 leading-relaxed">
              Every transaction is protected with industry-standard security,
              ensuring your information stays safe.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

export default OurPolicy;
