import React from "react";
import { ArrowRight } from "lucide-react";
import useStore from "../../store/store";
import BrandMark from "../brand/BrandMark";
import EditorialButton from "../ui/EditorialButton";

export default function StoreStory() {
  const settings = useStore((s) => s.settings);

  const address =
    settings?.address?.trim() ||
    "231-231, Shop No. 2, Dhanwantri Nagar, Rajendra Nagar, Indore, Madhya Pradesh – 452012";
  const phone = settings?.phone?.trim() || "+91 91096-76562";
  const email = settings?.supportEmail?.trim() || "contact@revakalp.com";

  return (
    <section
      aria-label="Our Indore Storefront"
      className="py-16 sm:py-24 bg-[#FBF7EE] border-b border-[#38131E]/12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Official Brand Plaque */}
          <div className="lg:col-span-5">
            <div className="rounded-[2px] bg-[#F7F1E5] border border-[#D4AF63]/65 p-8 sm:p-10 space-y-6">
              <div className="flex justify-center py-4 border-b border-[#38131E]/12">
                <BrandMark variant="primaryLight" className="w-56 sm:w-64" />
              </div>

              <div className="space-y-4 text-sm text-[#1A1718]/85">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#38131E]/60 font-semibold mb-0.5">
                    Indore Retail Store
                  </p>
                  <p className="leading-relaxed">{address}</p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#38131E]/60 font-semibold mb-0.5">
                    Boutique Hours
                  </p>
                  <p>Mon – Sat: 10:30 AM – 8:30 PM</p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#38131E]/60 font-semibold mb-0.5">
                    Phone / WhatsApp
                  </p>
                  <p>{phone}</p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#38131E]/60 font-semibold mb-0.5">
                    Email
                  </p>
                  <a
                    href={`mailto:${email}`}
                    className="text-[#38131E] font-medium hover:underline"
                  >
                    {email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Store Story */}
          <div className="lg:col-span-7 space-y-5">
            <p className="uppercase tracking-[0.3em] text-[10px] sm:text-[11px] font-medium text-[#38131E]/75">
              Our Indore Store
            </p>

            <h2 className="font-serif text-[clamp(2rem,4vw,3.3rem)] text-[#38131E] leading-[1.08]">
              Drop by,{" "}
              <span className="italic font-normal">say hello.</span>
            </h2>

            <p className="text-sm sm:text-base text-[#1A1718]/80 leading-relaxed max-w-2xl">
              {settings?.storeDescription?.trim() ||
                "Revakalp is an Indore store bringing together sarees, lehengas, Indo-Western pieces, and everyday tees — online and in Rajendra Nagar."}
            </p>

            <div className="pt-3 flex flex-wrap gap-3">
              <EditorialButton to="/about" variant="primary">
                <span>Our Story</span>
                <ArrowRight className="w-4 h-4" />
              </EditorialButton>
              <EditorialButton to="/contact" variant="secondary">
                <span>Get in Touch</span>
              </EditorialButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
