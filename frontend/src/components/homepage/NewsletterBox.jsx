import React from "react";

const NewsletterBox = () => {
  return (
    <section className="relative bg-gradient-to-br from-[#fffafc] via-[#fff1f4] to-[#ffe6ee] py-28 overflow-hidden">

      {/* Soft background glow */}
      <div className="absolute -top-32 left-24 w-[420px] h-[420px] bg-pink-200 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute -bottom-40 right-24 w-[520px] h-[520px] bg-rose-300 rounded-full blur-3xl opacity-30"></div>

      <div className="relative max-w-3xl mx-auto px-8 text-center">

        {/* Micro heading */}
        <p className="uppercase tracking-[0.35em] text-xs text-pink-600 mb-4">
          Stay Connected
        </p>

        {/* Main heading */}
        <h2 className="font-serif text-4xl md:text-5xl text-pink-900">
          Join the Revakalp Circle
        </h2>

        {/* Subtext */}
        <p className="mt-6 text-pink-700 text-lg leading-relaxed">
          Be the first to discover new collections, exclusive previews,
          and stories from India’s weaving traditions.
        </p>

        {/* Form */}
        <form className="mt-10 flex flex-col sm:flex-row items-center gap-4 bg-white/80 backdrop-blur-xl p-4 rounded-full shadow-xl">
          <input
            type="email"
            required
            placeholder="Enter your email address"
            className="flex-1 px-6 py-4 rounded-full outline-none text-gray-700 placeholder-gray-400"
          />
          <button
            type="submit"
            className="bg-[#c9487c] hover:bg-[#9c2756] text-white px-10 py-4 rounded-full font-medium shadow-lg transition"
          >
            Subscribe
          </button>
        </form>

        {/* Trust note */}
        <p className="mt-6 text-xs text-pink-600">
          No spam. Only thoughtful updates and timeless inspiration.
        </p>
      </div>
    </section>
  );
};

export default NewsletterBox;
