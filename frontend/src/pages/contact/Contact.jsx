import React, { useState } from "react";
import { MapPin, Phone, Briefcase, Check } from "lucide-react";
import PageHero from "../../components/globalComponents/PageHero";
import NewsletterBox from "../../components/homepage/NewsletterBox";
import EditorialButton from "../../components/ui/EditorialButton";
import useStore from "../../store/store";

export default function Contact() {
  const settings = useStore((s) => s.settings);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const address =
    settings?.address?.trim() ||
    "231-231, Shop No. 2, Dhanwantri Nagar, Rajendra Nagar, Indore, Madhya Pradesh – 452012";
  const phone = settings?.phone?.trim() || "+91 91096-76562";
  const email = settings?.supportEmail?.trim() || "contact@revakalp.com";

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="bg-[#F7F1E5] text-[#1A1718]">
      <PageHero
        label="Get in Touch"
        title="We'd Love to Hear From You"
        subtitle="Whether you need sizing guidance, order assistance, or boutique directions — our Indore team is here to help."
      />

      {/* Info Cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rk-surface-card p-7 space-y-3 border-t-4 border-t-[#38131E]">
            <MapPin className="w-6 h-6 text-[#38131E]" />
            <h2 className="font-serif text-2xl text-[#38131E]">Visit Our Boutique</h2>
            <p className="text-sm text-[#1A1718]/75 leading-relaxed">{address}</p>
            <p className="text-xs font-medium text-[#38131E]">
              Mon – Sat | 10:30 AM – 8:30 PM
            </p>
          </div>

          <div className="rk-surface-card p-7 space-y-3 border-t-4 border-t-[#D4AF63]">
            <Phone className="w-6 h-6 text-[#38131E]" />
            <h2 className="font-serif text-2xl text-[#38131E]">Talk to Us</h2>
            <p className="text-sm text-[#1A1718]/80">Phone / WhatsApp: {phone}</p>
            <p className="text-sm text-[#1A1718]/80">
              Email:{" "}
              <a href={`mailto:${email}`} className="text-[#38131E] font-medium underline">
                {email}
              </a>
            </p>
          </div>

          <div className="rounded-2xl bg-[#2B0E17] text-[#F7F1E5] p-7 space-y-3 border border-[#D4AF63]/40 shadow-sm">
            <Briefcase className="w-6 h-6 text-[#F1D889]" />
            <h2 className="font-serif text-2xl text-[#F7F1E5]">Join Revakalp</h2>
            <p className="text-sm text-[#F7F1E5]/80 leading-relaxed">
              Interested in retail, styling, or digital commerce roles? View open
              listings on our careers page.
            </p>
            <EditorialButton to="/explore-jobs" variant="gold" className="mt-2">
              Explore Careers
            </EditorialButton>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 space-y-4">
            <p className="text-[11px] uppercase tracking-[0.26em] text-[#38131E]/65 font-semibold">
              Personal Assistance
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#38131E] leading-tight">
              Speak With Our Store Team
            </h2>
            <p className="text-sm text-[#1A1718]/75 leading-relaxed">
              Reach out for bridal appointment queries, order tracking assistance, or
              product availability in Indore.
            </p>
            <ul className="space-y-2.5 text-sm text-[#38131E] pt-2">
              <li>✦ Personal styling &amp; sizing guidance</li>
              <li>✦ Order tracking &amp; delivery support</li>
              <li>✦ Wedding &amp; festive visits</li>
            </ul>
          </div>

          <form
            onSubmit={handleSubmit}
            className="lg:col-span-7 rk-surface-card p-6 sm:p-10 space-y-4"
          >
            <h3 className="font-serif text-2xl text-[#38131E] mb-2">Send a Message</h3>

            <div>
              <label htmlFor="contact-name" className="block text-xs uppercase tracking-wider text-[#38131E]/75 font-semibold mb-1.5">
                Your Name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full name"
                required
                className="w-full min-h-[46px] px-4 py-2.5 rounded-xl border border-[#38131E]/20 bg-white text-sm text-[#1A1718] focus:outline-none focus:ring-2 focus:ring-[#D4AF63]"
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-xs uppercase tracking-wider text-[#38131E]/75 font-semibold mb-1.5">
                Email Address
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full min-h-[46px] px-4 py-2.5 rounded-xl border border-[#38131E]/20 bg-white text-sm text-[#1A1718] focus:outline-none focus:ring-2 focus:ring-[#D4AF63]"
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-xs uppercase tracking-wider text-[#38131E]/75 font-semibold mb-1.5">
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we help you?"
                required
                className="w-full p-4 rounded-xl border border-[#38131E]/20 bg-white text-sm text-[#1A1718] focus:outline-none focus:ring-2 focus:ring-[#D4AF63]"
              />
            </div>

            {sent ? (
              <div className="p-4 rounded-xl bg-[#F7F1E5] border border-[#D4AF63]/60 text-sm text-[#38131E] space-y-2">
                <p className="font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4" /> Message ready to send via email
                </p>
                <p className="text-xs text-[#1A1718]/75">
                  Our storefront doesn&apos;t process direct web-form emails automatically.
                  Click below to open your email client addressed to {email}.
                </p>
                <a
                  href={`mailto:${email}?subject=${encodeURIComponent(
                    `Revakalp Inquiry from ${formData.name}`
                  )}&body=${encodeURIComponent(
                    `${formData.message}\n\nReply to: ${formData.email}`
                  )}`}
                  className="rk-btn-primary w-full"
                >
                  Open Email Client
                </a>
              </div>
            ) : (
              <EditorialButton type="submit" variant="primary" className="w-full">
                Continue to Send Message
              </EditorialButton>
            )}
          </form>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
}
