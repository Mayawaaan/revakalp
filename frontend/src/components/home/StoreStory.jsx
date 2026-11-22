import React from "react";
import { MapPin, Clock, Phone, Mail, ArrowRight } from "lucide-react";
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
      className="py-16 sm:py-24 bg-white border-b border-[#38131E]/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Official Brand Plaque (honest storefront representation, no fake interior photo) */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-[#F7F1E5] border border-[#D4AF63]/55 p-8 sm:p-10 shadow-sm space-y-6">
              <div className="flex justify-center py-4 border-b border-[#38131E]/12">
                <BrandMark variant="primaryLight" className="w-60 sm:w-64" />
              </div>

              <div className="space-y-4 text-sm text-[#1A1718]/85">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#38131E] shrink-0 mt-1" />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#38131E]/60 font-semibold mb-0.5">
                      Indore Retail Store
                    </p>
                    <p className="leading-relaxed">{address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#38131E] shrink-0 mt-1" />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#38131E]/60 font-semibold mb-0.5">
                      Store Hours
                    </p>
                    <p>Mon – Sat: 10:30 AM – 8:30 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#38131E] shrink-0 mt-1" />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#38131E]/60 font-semibold mb-0.5">
                      Phone / WhatsApp
                    </p>
                    <p>{phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#38131E] shrink-0 mt-1" />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#38131E]/60 font-semibold mb-0.5">
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
          </div>

          {/* Store Story */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-3">
              <span className="h-px w-8 bg-[#D4AF63]" aria-hidden="true" />
              <p className="uppercase tracking-[0.28em] text-[11px] font-medium text-[#38131E]/75">
                Indore Retail Destination
              </p>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#38131E] leading-[1.1]">
              From Indore,{" "}
              <span className="italic font-normal">with an eye for detail.</span>
            </h2>

            <p className="text-sm sm:text-base text-[#1A1718]/80 leading-relaxed max-w-2xl">
              {settings?.storeDescription?.trim() ||
                "Revakalp is a trusted retail apparel destination in Indore, bringing together ethnic occasionwear — sarees, lehengas, kurta pajama, and Jodhpuri outfits — alongside contemporary printed tees for effortless everyday styling."}
            </p>

            <p className="text-sm sm:text-base text-[#1A1718]/75 leading-relaxed max-w-2xl">
              Shop our live inventory online across India or visit our Indore outlet
              to experience textures, silhouettes, and colors in person.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <EditorialButton to="/about" variant="primary">
                <span>About Revakalp</span>
                <ArrowRight className="w-4 h-4" />
              </EditorialButton>
              <EditorialButton to="/contact" variant="secondary">
                <span>Contact Our Store</span>
              </EditorialButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
