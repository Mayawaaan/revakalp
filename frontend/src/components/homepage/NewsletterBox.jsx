import React from "react";

const NewsletterBox = () => {
  return (
    <section
      className="relative isolate overflow-hidden py-36"
      style={{
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 12%, black 30%, black 70%, rgba(0,0,0,0.6) 88%, transparent 100%)",
        maskImage:
          "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 12%, black 30%, black 70%, rgba(0,0,0,0.6) 88%, transparent 100%)",
      }}
    >
      {/* Soft ambient wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#fff4f8] to-transparent" />

      {/* Diffused glows (pushed downward) */}
      <div className="absolute top-1/3 left-1/4 w-[560px] h-[560px] bg-rose-200/35 rounded-full blur-[160px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[620px] h-[620px] bg-pink-300/30 rounded-full blur-[180px]" />

      {/* Content */}
      <div className="relative mx-auto max-w-3xl px-6 text-center">

        <p className="mb-6 text-xs tracking-[0.3em] uppercase text-pink-500">
          Stay Connected
        </p>

        <h2 className="font-serif text-4xl md:text-5xl text-pink-900 leading-tight">
          Join the Revakalp Circle
        </h2>

        <p className="mt-6 text-lg text-pink-700/90 leading-relaxed">
          Discover new collections, quiet launches, and stories woven from
          India’s timeless textile traditions.
        </p>

        {/* Floating form */}
        <div className="mt-16">
          <form className="mx-auto flex max-w-xl flex-col sm:flex-row items-center gap-3 rounded-2xl bg-white/65 backdrop-blur-2xl px-4 py-4 shadow-[0_40px_90px_-35px_rgba(200,72,124,0.35)] ring-1 ring-pink-200/40">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className="flex-1 w-full bg-transparent px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-br from-[#c9487c] to-[#a83261] px-8 py-3 text-white font-medium shadow-lg hover:shadow-xl transition-all"
            >
              Subscribe
            </button>
          </form>
        </div>

        <p className="mt-10 text-xs text-pink-600/80">
          No spam. Only thoughtful updates and timeless inspiration.
        </p>
      </div>
    </section>
  );
};

export default NewsletterBox;
