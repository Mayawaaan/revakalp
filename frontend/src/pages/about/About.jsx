import React from "react";
import { MapPin, Clock, Phone, Package, Gift, CheckCircle2, Sparkles, Compass } from "lucide-react";
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
      {/* Hero with official full burgundy-on-ivory / gold-on-burgundy lockup */}
      <PageHero
        label="Est. 2014 · Indore, Madhya Pradesh"
        title="A Decade of Curated Elegance"
        subtitle="From Indore to shoppers across India — Revakalp is a retail apparel destination uniting classic occasionwear and contemporary everyday staples."
      >
        <div className="flex flex-wrap justify-center gap-3">
          <EditorialButton to="/shop" variant="gold">
            Explore Our Collections
          </EditorialButton>
          <EditorialButton to="/contact" variant="outlineDark">
            Contact Our Store
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
                Curating sarees, bridal lehengas, kurta pajama, Jodhpuri silhouettes,
                and contemporary printed tees for celebratory moments and daily comfort.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-5">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#38131E]/65 font-semibold">
              Our Retail Story
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#38131E] leading-tight">
              Rooted in Indore, Curated Across India
            </h2>
            <p className="text-sm sm:text-base text-[#1A1718]/80 leading-relaxed">
              Revakalp began in Indore with a clear retail focus: selecting distinctive
              sarees and occasion lehengas for weddings, festivals, and family milestones.
            </p>
            <p className="text-sm sm:text-base text-[#1A1718]/80 leading-relaxed">
              Indore is a city with an eye for warmth, detail, and textile heritage. Over
              the years, our retail assortment expanded to bring together varied regional
              styles — including Banarasi, Chanderi, Maheshwari, and Paithani selections —
              alongside tailored menswear and everyday printed T-shirts.
            </p>
            <p className="text-sm sm:text-base text-[#1A1718]/80 leading-relaxed">
              Whether you visit our physical store in Rajendra Nagar, Indore, or browse
              online from anywhere in India, every listing reflects live verified stock.
            </p>
          </div>
        </div>
      </section>

      {/* Curation Philosophy */}
      <section className="py-16 sm:py-24 bg-white border-b border-[#38131E]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#38131E]/65 font-semibold mb-2">
              The Revakalp Standard
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#38131E]">
              Thoughtful Retail Curation
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: CheckCircle2,
                title: "Personal Selection",
                desc: "Every garment in our store assortment is examined for drape, finish, and color balance before it reaches the catalog.",
              },
              {
                icon: Sparkles,
                title: "Regional Variety",
                desc: "We source across classic Indian textile hubs and contemporary garment makers to offer diverse weaves and silhouettes.",
              },
              {
                icon: Compass,
                title: "Occasion & Everyday",
                desc: "From bridal lehengas and celebratory sarees to structured Jodhpuri sets and relaxed printed tees.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-7 rounded-2xl bg-[#F7F1E5]/70 border border-[#38131E]/12 space-y-3"
                >
                  <div className="w-11 h-11 rounded-full bg-[#38131E] text-[#F1D889] flex items-center justify-center">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-serif text-2xl text-[#38131E]">{item.title}</h3>
                  <p className="text-sm text-[#1A1718]/75 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
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
                Our Retail Store in Indore
              </h2>
              <p className="text-sm sm:text-base text-[#1A1718]/80 leading-relaxed">
                Step into our Indore retail boutique to compare fabrics, drape styles,
                and sizes in person with guidance from our store team.
              </p>
            </div>

            <div className="rk-surface-card p-6 sm:p-8 space-y-4">
              {[
                { icon: MapPin, label: "Location", val: address },
                { icon: Clock, label: "Store Hours", val: "Mon–Sat: 10:30 AM – 8:30 PM" },
                { icon: Phone, label: "Call / WhatsApp", val: phone },
                { icon: Package, label: "Online Orders", val: "Shipped Pan-India" },
                { icon: Gift, label: "Gift Wrapping", val: "Available on request" },
              ].map((row, idx, arr) => {
                const Icon = row.icon;
                return (
                  <div
                    key={row.label}
                    className={`flex items-start gap-3.5 ${
                      idx < arr.length - 1 ? "pb-4 border-b border-[#38131E]/10" : ""
                    }`}
                  >
                    <Icon className="w-4 h-4 text-[#38131E] shrink-0 mt-1" />
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#38131E]/60 font-semibold">
                        {row.label}
                      </p>
                      <p className="text-sm text-[#1A1718] mt-0.5">{row.val}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl bg-[#2B0E17] text-[#F7F1E5] p-8 sm:p-14 text-center border border-[#D4AF63]/35">
            <blockquote className="font-serif text-2xl sm:text-3xl leading-relaxed max-w-3xl mx-auto">
              &ldquo;Choosing Revakalp is choosing to wear a story — curated with care,
              respect for Indian apparel, and the belief that every celebration deserves
              thoughtful style.&rdquo;
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
