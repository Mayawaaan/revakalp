import React from "react";
import NewsletterBox from "../../components/homepage/NewsletterBox";

const About = () => {
  return (
    <section className="relative bg-linear-to-br from-[#ff3e8b69] via-[#fff1f4ab] to-[#ffe6ee] overflow-hidden">

      {/* Background flow */}
      <div className="absolute -top-40 left-32 w-125 h-125 bg-pink-200 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute -bottom-40 right-32 w-150 h-150 bg-rose-300 rounded-full blur-3xl opacity-30"></div>

      {/* Hero */}
      <div className="relative text-center pt-10 pb-20 max-w-4xl mx-auto px-8">
        <p className="uppercase tracking-[0.35em] text-xs text-pink-600 mb-4">
          About Revakalp
        </p>
        <h1 className="font-serif text-5xl md:text-6xl text-pink-900">
          A Modern Expression of Timeless Heritage
        </h1>
        <p className="mt-6 text-pink-700 text-lg leading-relaxed">
          Revakalp exists to preserve India’s textile traditions while bringing
          them into the lives of today’s conscious, modern women.
        </p>
      </div>

      {/* Story Section */}
      <div className="relative max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center pb-28">
        <div className="relative">
          <img
            src="./about.png"
            alt="Revakalp Heritage"
            className="rounded-3xl shadow-2xl"
          />
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>

        <div className="text-pink-800 space-y-8 leading-relaxed">
          <p>
            Revakalp was born from a deep respect for India’s weaving communities
            and the belief that tradition deserves a future. The name blends
            <b> Reva</b>, the river of life, with <b>Kalp</b>, a timeless era —
            symbolizing stories that flow through generations.
          </p>

          <p>
            We work closely with skilled artisans, cooperatives, and trusted
            manufacturers across regions to curate sarees that are authentic,
            ethical, and rich in cultural identity.
          </p>

          <p>
            Each Revakalp saree carries the imprint of human hands — chosen for
            craftsmanship, fabric integrity, and emotional beauty rather than
            mass production.
          </p>

          <h3 className="font-serif text-2xl text-pink-900 pt-6">
            Our Mission
          </h3>

          <p>
            To empower women to feel graceful, confident, and deeply connected
            to their roots through thoughtfully curated sarees that celebrate
            heritage, quality, and conscious fashion.
          </p>

          <h3 className="font-serif text-2xl text-pink-900 pt-6">
            Sourcing & Authenticity
          </h3>

          <p>
            While we do not weave these sarees ourselves, we are dedicated
            curators of India’s textile heritage. Every piece is handpicked,
            quality-checked, and sourced responsibly — ensuring authenticity,
            longevity, and respect for the craft.
          </p>
        </div>
      </div>

      {/* Values / Promise */}
      <div className="relative max-w-7xl mx-auto px-8 pb-28">
        <div className="text-center mb-20">
          <p className="uppercase tracking-[0.35em] text-xs text-pink-600 mb-4">
            Our Values
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-pink-900">
            What We Stand For
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              title: "Artisan Respect",
              desc: "We treat artisans as creators, not suppliers — supporting fair practices and long-term relationships."
            },
            {
              title: "Authentic Handloom",
              desc: "Every saree reflects regional identity, traditional techniques, and genuine craftsmanship."
            },
            {
              title: "Conscious Luxury",
              desc: "Slow fashion that values people, process, and purpose over trends."
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white/70 backdrop-blur-xl rounded-3xl p-10 shadow-xl hover:shadow-2xl transition text-center"
            >
              <h4 className="font-serif text-xl text-pink-900 mb-4">
                {item.title}
              </h4>
              <p className="text-pink-700 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Closing Statement */}
      <div className="relative max-w-4xl mx-auto text-center pb-28 px-8">
        <p className="font-serif text-2xl text-pink-900 leading-relaxed">
          Choosing Revakalp is more than a purchase.
        </p>
        <p className="mt-4 text-pink-700 text-lg leading-relaxed">
          It is a conscious decision to celebrate heritage, empower craftsmanship,
          and wear stories woven with meaning, patience, and pride.
        </p>
      </div>

      {/* Newsletter */}
      <NewsletterBox />

    </section>
  );
};

export default About;
