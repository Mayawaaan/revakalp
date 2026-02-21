import React from "react";
import { Link } from "react-router-dom";
import useWindowSize from "../../hooks/useWindowSize";

const Landing = () => {
  const { width } = useWindowSize();

  // Hide hero on mobile
  if (width < 768) {
    return null;
  }

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <img
        src="/hero.png"
        alt="Revakalp Ethnic Wear Collection"
        className="absolute inset-0 w-full h-full object-cover object-top brightness-75"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-black/50 via-black/40 to-black/20"></div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-left text-left px-14">
        {/* Micro branding */}
        <p className="uppercase tracking-[0.35em] text-xs text-pink-200 mb-6">
          Curated • Authentic • Timeless
        </p>

        {/* Headline */}
        <h1 className="font-serif text-5xl md:text-6xl lg:text-6xl text-white leading-tight max-w-4xl">
          Rooted in Heritage
          <span className="block text-pink-200">
            Curated for the Modern Woman
          </span>
        </h1>

        {/* Subtext */}
        <p className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl leading-relaxed">
          Explore a thoughtfully selected range of ethnic wear inspired by
          India’s rich textile traditions — chosen for quality, elegance, and
          everyday sophistication.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row gap-6">
          <Link
            to="/shop"
            className="bg-[#c9487c] hover:bg-[#9c2756] text-white px-10 py-4 rounded-full font-medium shadow-xl transition"
          >
            Explore Collection
          </Link>

          <Link
            to="/about"
            className="border border-white/70 text-white px-10 py-4 rounded-full font-medium hover:bg-white hover:text-black transition"
          >
            Our Store
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Landing;