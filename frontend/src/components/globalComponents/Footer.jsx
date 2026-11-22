import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, MapPin, Mail } from "lucide-react";
import BrandMark from "../brand/BrandMark";
import useStore from "../../store/store";

export default function Footer() {
  const settings = useStore((s) => s.settings);
  const supportEmail = settings?.supportEmail || "contact@revakalp.com";
  const storeAddress = settings?.address || "Indore, Madhya Pradesh";

  return (
    <footer className="bg-[#2B0E17] text-[#F7F1E5] border-t border-[#D4AF63]/30">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Official Brand Lockup with Tagline ("WEAVING LIFE INTO TIME") */}
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" aria-label="REVAKALP Home" className="inline-block">
              <BrandMark
                variant="primaryDark"
                className="w-48 sm:w-56"
              />
            </Link>
            <p className="text-sm text-[#F7F1E5]/75 leading-relaxed max-w-sm">
              An Indore-based fashion retail destination curating sarees, lehengas,
              kurta pajama, Jodhpuri silhouettes, and contemporary printed tees.
            </p>
            <div className="space-y-2 text-xs text-[#F7F1E5]/75">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF63] shrink-0 mt-0.5" />
                <span>{storeAddress}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D4AF63] shrink-0" />
                <a
                  href={`mailto:${supportEmail}`}
                  className="hover:text-[#F1D889] transition-colors"
                >
                  {supportEmail}
                </a>
              </p>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://www.facebook.com/people/Revakalp/61587307439316/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Revakalp on Facebook"
                className="w-10 h-10 rounded-full border border-[#D4AF63]/40 flex items-center justify-center text-[#F1D889] hover:bg-[#D4AF63] hover:text-[#2B0E17] transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/revakalp?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Revakalp on Instagram"
                className="w-10 h-10 rounded-full border border-[#D4AF63]/40 flex items-center justify-center text-[#F1D889] hover:bg-[#D4AF63] hover:text-[#2B0E17] transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="lg:col-span-2">
            <h4 className="text-xs uppercase tracking-[0.24em] text-[#D4AF63] font-semibold mb-4">
              Shop
            </h4>
            <ul className="space-y-2.5 text-sm text-[#F7F1E5]/80">
              <li>
                <Link to="/shop" className="hover:text-[#F1D889] transition-colors">
                  All Collections
                </Link>
              </li>
              <li>
                <Link to="/shop/saree" className="hover:text-[#F1D889] transition-colors">
                  Sarees
                </Link>
              </li>
              <li>
                <Link to="/shop/lehenga/all" className="hover:text-[#F1D889] transition-colors">
                  Lehengas
                </Link>
              </li>
              <li>
                <Link to="/shop/kurta" className="hover:text-[#F1D889] transition-colors">
                  Kurta Pajama
                </Link>
              </li>
              <li>
                <Link to="/shop/jodhpuri/all" className="hover:text-[#F1D889] transition-colors">
                  Jodhpuri
                </Link>
              </li>
              <li>
                <Link to="/shop/printed-tees/all" className="hover:text-[#F1D889] transition-colors">
                  Printed Tees
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div className="lg:col-span-2">
            <h4 className="text-xs uppercase tracking-[0.24em] text-[#D4AF63] font-semibold mb-4">
              Information
            </h4>
            <ul className="space-y-2.5 text-sm text-[#F7F1E5]/80">
              <li>
                <Link to="/about" className="hover:text-[#F1D889] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#F1D889] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/delivery-information" className="hover:text-[#F1D889] transition-colors">
                  Delivery Information
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#F1D889] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/explore-jobs" className="hover:text-[#F1D889] transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Policy */}
          <div className="lg:col-span-2">
            <h4 className="text-xs uppercase tracking-[0.24em] text-[#D4AF63] font-semibold mb-4">
              Policy
            </h4>
            <ul className="space-y-2.5 text-sm text-[#F7F1E5]/80">
              <li>
                <Link to="/privacy-policy" className="hover:text-[#F1D889] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="hover:text-[#F1D889] transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link to="/returns-exchanges" className="hover:text-[#F1D889] transition-colors">
                  Returns &amp; Exchanges
                </Link>
              </li>
            </ul>
          </div>

          {/* My Account */}
          <div className="lg:col-span-2">
            <h4 className="text-xs uppercase tracking-[0.24em] text-[#D4AF63] font-semibold mb-4">
              My Account
            </h4>
            <ul className="space-y-2.5 text-sm text-[#F7F1E5]/80">
              <li>
                <Link to="/my-profile" className="hover:text-[#F1D889] transition-colors">
                  My Profile
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-[#F1D889] transition-colors">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-[#F1D889] transition-colors">
                  View Cart
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-[#F1D889] transition-colors">
                  My Orders
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="mt-12 pt-8 border-t border-[#D4AF63]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F7F1E5]/65">
          <p>© {new Date().getFullYear()} Revakalp. All Rights Reserved.</p>
          <p>
            Designed and Developed by{" "}
            <a
              className="text-[#F1D889] hover:underline font-medium"
              href="https://www.zsyio.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              ZSYIO
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
