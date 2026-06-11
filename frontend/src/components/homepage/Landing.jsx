import React from "react";
import { Link } from "react-router-dom";
import useWindowSize from "../../hooks/useWindowSize";
import New3D from "../3d_Components/New3D";

const Landing = () => {
  const { width } = useWindowSize();

  // Hide hero on mobile
  if (width < 768) {
    return null;
  }

  return (
    <section className="relative h-screen w-full overflow-hidden flex bg-gradient-to-br from-[#1a0010] via-[#2d001a] to-[#4a0429]">

      {/* Decorative soft blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#c9487c]/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/3 w-[400px] h-[400px] rounded-full bg-[#7a1045]/20 blur-3xl" />

      {/* ── FULLSCREEN 3D Scene ── */}
      <div className="absolute inset-0 z-0">
        <New3D />
      </div>

      {/* ── LEFT — Content ── */}
      <div className="relative z-10 h-full w-1/2 flex flex-col justify-center items-start text-left px-10 lg:px-16 pointer-events-none">
        <div className="pointer-events-auto">

        {/* Micro branding */}
        <p className="uppercase tracking-[0.3em] text-xs text-[#f9a8d4] mb-3">
          Premium Lenghas • Handloom Sarees
        </p>

        {/* Headline */}
        <h1 className="font-serif text-5xl md:text-[3.25rem] text-white leading-snug">
          Discover Exquisite Lenghas
          <span className="block text-[#f9a8d4]">
            & Authentic Handloom Sarees
          </span>
        </h1>

        {/* Subtext */}
        <p className="mt-3 text-sm md:text-base text-pink-100/80 max-w-md leading-relaxed">
          Your premier destination for stunning designer lenghas and traditional handloom sarees. 
          Whether you shop our exclusive online boutique or visit our retail outlet, 
          find the perfect breathtaking ensemble for your next celebration.
        </p>

        {/* CTAs */}
        <div className="mt-6 flex flex-row gap-3">
          <Link
            to="/shop"
            className="bg-[#c9487c] hover:bg-[#f9a8d4] hover:text-[#3d0030] text-white px-8 py-3 rounded-full text-sm font-medium shadow-lg shadow-[#c9487c]/30 transition-all duration-300"
          >
            Explore Collection
          </Link>

          <Link
            to="/about"
            className="border border-[#f9a8d4] text-[#f9a8d4] px-8 py-3 rounded-full text-sm font-medium hover:bg-[#f9a8d4] hover:text-[#3d0030] transition-all duration-300"
          >
            Our Store
          </Link>
        </div>
      </div>
      </div>
    </section>
  );
};

export default Landing;