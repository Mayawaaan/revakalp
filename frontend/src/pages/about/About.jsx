import React from "react";
import NewsletterBox from "../../components/homepage/NewsletterBox";
import BrandMark from "../../components/brand/BrandMark";
import EditorialButton from "../../components/ui/EditorialButton";
import PageHero from "../../components/globalComponents/PageHero";
import useStore from "../../store/store";

const About = () => {
  const settings = useStore((s) => s.settings);
  const address =
    settings?.address?.trim() ||
    "231-231, Shop No. 2, Dhanwantri Nagar, Rajendra Nagar, Indore, Madhya Pradesh – 452012";
  const phone = settings?.phone?.trim() || "9109676562";

  return (
    <div className="bg-[#F7F1E5] text-[#1A1718]">
      <PageHero
        label="Est. 2014 · Indore, Madhya Pradesh"
        title="Our Story"
        subtitle="Born in Indore and shared with shoppers across India — sarees, occasionwear, and everyday pieces chosen with care."
      >
        <div className="flex flex-wrap justify-center gap-3">
          <EditorialButton to="/shop" variant="gold">
            Explore Collections
          </EditorialButton>
          <EditorialButton to="/contact" variant="outlineDark">
            Visit or Write to Us
          </EditorialButton>
        </div>
      </PageHero>

      {/* Brand Identity & Store Origin */}
      <section className="py-16 sm:py-24 bg-[#F7F1E5] border-b border-[#38131E]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-5">
            <div className="rk-surface-card p-8 sm:p-10 text-center space-y-6 border-[#D4AF63]/50">
              <div className="py-4 flex justify-center border-b border-[#38131E]/10">
                <BrandMark variant="primaryLight" className="w-60 sm:w-64" />
              </div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#38131E]/70 font-semibold">
                Indore · Est. 2014
              </p>
              <p className="text-sm text-[#1A1718]/75 leading-relaxed">
                Sarees, bridal lehengas, Indo-Western outfits, and relaxed printed tees, with
                our men&apos;s section coming soon.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-5">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#38131E]/65 font-semibold">
              Where We Started
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#38131E] leading-tight">
              Rooted in Indore, Loved Across India
            </h2>
            <p className="text-sm sm:text-base text-[#1A1718]/80 leading-relaxed">
              Revakalp began in Indore with a simple wish: helping families find sarees,
              lehengas, and Indo-Western styles for weddings, festivals, and milestones that
              feel thoughtful, honest, and easy to wear.
            </p>
            <p className="text-sm sm:text-base text-[#1A1718]/80 leading-relaxed">
              Every piece on our website reflects real inventory in our Rajendra Nagar
              store, from regional weaves like Banarasi, Chanderi, Maheshwari, and
              Paithani to everyday printed tees.
            </p>
          </div>
        </div>
      </section>

      {/* What Guides Us */}
      <section className="py-16 sm:py-24 bg-[#FBF7EE] border-b border-[#38131E]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#38131E]/65 font-semibold mb-2">
              How We Choose
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#38131E]">
              Chosen Piece by Piece
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Looked Over by Hand",
                desc: "Every garment that arrives in our store is checked in person for drape, stitching finish, and color balance.",
              },
              {
                title: "Regional Variety",
                desc: "We bring together weaves and silhouettes from different textile hubs across India alongside fresh everyday clothing.",
              },
              {
                title: "Celebrations & Everyday",
                desc: "From bridal lehengas and wedding sarees to Indo-Western styles and easy weekend T-shirts.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-7 rounded-[2px] bg-[#F7F1E5] border border-[#38131E]/14 space-y-3"
              >
                <h3 className="font-serif text-2xl text-[#38131E]">{item.title}</h3>
                <p className="text-sm text-[#1A1718]/75 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visit Us in Indore + Closing Quote */}
      <section className="py-16 sm:py-24 bg-[#F7F1E5]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#38131E]/65 font-semibold">
                Visit Us
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#38131E]">
                Our Store in Indore
              </h2>
              <p className="text-sm sm:text-base text-[#1A1718]/80 leading-relaxed">
                Drop by our Rajendra Nagar store whenever you want to compare colors,
                feel fabrics up close, or try on sizes with help from our team.
              </p>
            </div>

            <div className="rk-surface-card p-6 sm:p-8 space-y-4">
              {[
                { label: "Address", val: address },
                { label: "Store Hours", val: "Mon–Sat: 10:30 AM – 8:30 PM" },
                { label: "Call / WhatsApp", val: phone },
                { label: "Online Orders", val: "Shipped Across India" },
                { label: "Gift Wrapping", val: "Available on request" },
              ].map((row, idx, arr) => (
                <div
                  key={row.label}
                  className={idx < arr.length - 1 ? "pb-4 border-b border-[#38131E]/10" : ""}
                >
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#38131E]/60 font-semibold">
                    {row.label}
                  </p>
                  <p className="text-sm text-[#1A1718] mt-0.5">{row.val}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2px] bg-[#2B0E17] text-[#F7F1E5] p-8 sm:p-14 text-center border border-[#D4AF63]/35">
            <blockquote className="font-serif text-2xl sm:text-3xl leading-relaxed max-w-3xl mx-auto">
              &ldquo;Choosing Revakalp is choosing to wear a story — selected with care,
              respect for Indian clothing, and the belief that every celebration deserves
              something genuinely special.&rdquo;
            </blockquote>
            <p className="mt-5 text-xs uppercase tracking-[0.22em] text-[#F1D889]">
              — Anjali Katare, Founder · Revakalp, Indore
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <EditorialButton to="/shop" variant="gold">
                Shop Now
              </EditorialButton>
              <EditorialButton to="/contact" variant="outlineDark">
                Get in Touch
              </EditorialButton>
            </div>
          </div>
        </div>
      </section>

      <NewsletterBox />
    </div>
  );
};

export default About;
