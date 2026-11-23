import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { X, ChevronDown, Heart, ShoppingBag, Search, User as UserIcon, LogOut, Shield } from "lucide-react";
import BrandMark from "../brand/BrandMark";
import { FEATURED_HERITAGE_TRADITIONS } from "../../data/heritageTraditions";
import { isRedundantAllEntry } from "../../config/storefrontCategories";

export default function MobileNav({
  open,
  onClose,
  onOpenSearch,
  onNavigate,
  user,
  onLogout,
  cartCount = 0,
  wishlistCount = 0,
  sareeTypes = [],
}) {
  const closeBtnRef = useRef(null);
  const [expanded, setExpanded] = useState(null);
  const visibleSareeTypes = (sareeTypes || []).filter(
    (t) => !isRedundantAllEntry(t, "saree")
  );

  useEffect(() => {
    if (!open) return undefined;
    closeBtnRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const toggleGroup = (key) => setExpanded((prev) => (prev === key ? null : key));

  return (
    <div
      className={`fixed inset-0 z-[100] lg:hidden transition-opacity duration-300 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1A1718]/70 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`fixed right-0 top-0 bottom-0 w-[88%] max-w-sm bg-[#F7F1E5] shadow-2xl flex flex-col transition-transform duration-300 ease-out border-l border-[#D4AF63]/35 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Dark burgundy brand header — official gold header SVG + monogram */}
        <div className="bg-[#2B0E17] px-4 sm:px-5 py-3.5 flex items-center justify-between gap-2 border-b border-[#D4AF63]/30">
          <Link to="/" onClick={onClose} className="flex items-center gap-2 min-w-0">
            <BrandMark variant="iconDark" className="h-6 w-6 shrink-0" decorative />
            <BrandMark variant="headerDark" className="h-4 w-auto max-w-[130px]" />
          </Link>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="w-11 h-11 flex items-center justify-center rounded-[2px] text-[#F7F1E5] hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-2">
          {/* Quick Search */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSearch();
            }}
            className="w-full min-h-[44px] flex items-center gap-3 px-4 py-2.5 rounded-[2px] bg-[#FBF7EE] border border-[#38131E]/18 text-sm text-[#1A1718]/75 mb-4"
          >
            <Search className="w-4 h-4 text-[#38131E]" />
            <span>Search sarees, lehengas, Indo-Western…</span>
          </button>

          <nav className="divide-y divide-[#38131E]/10" aria-label="Mobile storefront links">
            <button
              type="button"
              onClick={() => onNavigate("/")}
              className="w-full min-h-[46px] text-left px-2 py-2.5 text-base font-serif text-[#38131E] hover:text-[#2B0E17]"
            >
              Home
            </button>

            <button
              type="button"
              onClick={() => onNavigate("/shop/all/all?sort=newest")}
              className="w-full min-h-[46px] text-left px-2 py-2.5 text-base font-serif text-[#38131E]"
            >
              New Arrivals
            </button>

            {/* Indian Textiles Accordion */}
            <div>
              <button
                type="button"
                onClick={() => toggleGroup("heritage")}
                aria-expanded={expanded === "heritage"}
                className="w-full min-h-[46px] flex items-center justify-between px-2 py-2.5 text-base font-serif text-[#38131E]"
              >
                <span>Indian Textiles</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${expanded === "heritage" ? "rotate-180" : ""}`}
                />
              </button>
              {expanded === "heritage" && (
                <div className="pl-5 pr-2 pb-3 space-y-1">
                  <button
                    type="button"
                    onClick={() => onNavigate("/heritage")}
                    className="w-full min-h-[40px] text-left px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-[#38131E] font-semibold bg-[#EFE6D5] rounded-[2px]"
                  >
                    Explore All 29 States
                  </button>
                  {FEATURED_HERITAGE_TRADITIONS.map((trad) => (
                    <button
                      key={trad.slug}
                      type="button"
                      onClick={() => onNavigate(`/heritage/${trad.slug}`)}
                      className="w-full min-h-[40px] text-left px-3 py-1.5 text-sm text-[#1A1718]/85 hover:bg-[#FBF7EE]"
                    >
                      {trad.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sarees Accordion */}
            <div>
              <button
                type="button"
                onClick={() => toggleGroup("sarees")}
                aria-expanded={expanded === "sarees"}
                className="w-full min-h-[46px] flex items-center justify-between px-2 py-2.5 text-base font-serif text-[#38131E]"
              >
                <span>Sarees</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${expanded === "sarees" ? "rotate-180" : ""}`}
                />
              </button>
              {expanded === "sarees" && (
                <div className="pl-5 pr-2 pb-3 space-y-1">
                  <button
                    type="button"
                    onClick={() => onNavigate("/shop/saree/all")}
                    className="w-full min-h-[40px] text-left px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-[#38131E] font-semibold"
                  >
                    All Sarees
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate("/shop/saree")}
                    className="w-full min-h-[40px] text-left px-3 py-1.5 text-sm text-[#1A1718]/80"
                  >
                    Saree Categories
                  </button>
                  {visibleSareeTypes.slice(0, 6).map((t) => (
                    <button
                      key={t.slug || t._id}
                      type="button"
                      onClick={() => onNavigate(`/shop/saree/${t.slug}`)}
                      className="w-full min-h-[40px] text-left px-3 py-1.5 text-sm text-[#1A1718]/80"
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => onNavigate("/shop/lehenga/all")}
              className="w-full min-h-[46px] text-left px-2 py-2.5 text-base font-serif text-[#38131E]"
            >
              Lehengas
            </button>

            <button
              type="button"
              onClick={() => onNavigate("/shop/indo-western/all")}
              className="w-full min-h-[46px] text-left px-2 py-2.5 text-base font-serif text-[#38131E]"
            >
              Indo-Western
            </button>

            {/* Men Accordion */}
            <div>
              <button
                type="button"
                onClick={() => toggleGroup("men")}
                aria-expanded={expanded === "men"}
                className="w-full min-h-[46px] flex items-center justify-between px-2 py-2.5 text-base font-serif text-[#38131E]"
              >
                <span>Men</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${expanded === "men" ? "rotate-180" : ""}`}
                />
              </button>
              {expanded === "men" && (
                <div className="pl-5 pr-2 pb-3 space-y-1">
                  {[
                    { label: "Printed Tees", to: "/shop/printed-tees/all", active: true },
                    { label: "Suits", to: "/shop/suit/all" },
                    { label: "Kurta Pajama", to: "/shop/kurta/all" },
                    { label: "Jodhpuri", to: "/shop/jodhpuri/all" },
                  ].map((item) => (
                    <button
                      key={item.to}
                      type="button"
                      onClick={() => onNavigate(item.to)}
                      className="w-full min-h-[40px] flex items-center justify-between text-left px-3 py-1.5 text-sm text-[#1A1718]/80"
                    >
                      <span className={item.active ? "font-medium text-[#38131E]" : ""}>
                        {item.label}
                      </span>
                      <span
                        className={`text-[10px] uppercase tracking-wider ${
                          item.active
                            ? "text-[#38131E] font-semibold"
                            : "text-[#38131E]/55"
                        }`}
                      >
                        {item.active ? "Shop" : "Coming Soon"}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => onNavigate("/past-editions")}
              className="w-full min-h-[46px] text-left px-2 py-2.5 text-base font-serif text-[#38131E]"
            >
              Past Editions
            </button>

            <button
              type="button"
              onClick={() => onNavigate("/about")}
              className="w-full min-h-[46px] text-left px-2 py-2.5 text-base font-serif text-[#38131E]"
            >
              Our Store
            </button>

            <button
              type="button"
              onClick={() => onNavigate("/contact")}
              className="w-full min-h-[46px] text-left px-2 py-2.5 text-base font-serif text-[#38131E]"
            >
              Contact
            </button>
          </nav>

          {/* Bag & Wishlist */}
          <div className="pt-4 mt-4 border-t border-[#38131E]/15 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onNavigate("/wishlist")}
              className="min-h-[44px] flex items-center justify-center gap-2 px-3 py-2.5 rounded-[2px] bg-[#FBF7EE] border border-[#38131E]/18 text-xs uppercase tracking-[0.14em] font-medium text-[#38131E]"
            >
              <Heart className="w-4 h-4" />
              <span>Wishlist ({wishlistCount})</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate("/cart")}
              className="min-h-[44px] flex items-center justify-center gap-2 px-3 py-2.5 rounded-[2px] bg-[#FBF7EE] border border-[#38131E]/18 text-xs uppercase tracking-[0.14em] font-medium text-[#38131E]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Bag ({cartCount})</span>
            </button>
          </div>
        </div>

        {/* Account footer */}
        <div className="p-5 bg-[#EFE6D5] border-t border-[#38131E]/15 space-y-2.5">
          {user ? (
            <>
              <div className="flex items-center justify-between text-sm text-[#38131E] px-1">
                <span className="font-medium truncate">Hi, {user.fullName}</span>
                {user.role === "admin" && (
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-[#38131E] text-[#F1D889]">
                    Admin
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate("/my-profile")}
                  className="min-h-[44px] flex items-center justify-center gap-1.5 rounded-[2px] border border-[#38131E]/25 bg-[#FBF7EE] text-xs font-medium uppercase tracking-wider text-[#38131E]"
                >
                  <UserIcon className="w-3.5 h-3.5" /> Profile
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate("/orders")}
                  className="min-h-[44px] flex items-center justify-center gap-1.5 rounded-[2px] border border-[#38131E]/25 bg-[#FBF7EE] text-xs font-medium uppercase tracking-wider text-[#38131E]"
                >
                  Orders
                </button>
              </div>
              {user.role === "admin" && (
                <button
                  type="button"
                  onClick={() => onNavigate("/admin")}
                  className="w-full min-h-[44px] flex items-center justify-center gap-2 rounded-[2px] bg-[#38131E]/10 border border-[#38131E]/20 text-[#38131E] text-xs font-semibold uppercase tracking-wider"
                >
                  <Shield className="w-3.5 h-3.5" /> Admin Dashboard
                </button>
              )}
              <button
                type="button"
                onClick={onLogout}
                className="w-full min-h-[44px] flex items-center justify-center gap-2 rounded-[2px] bg-[#38131E] text-[#F7F1E5] text-xs font-medium uppercase tracking-wider"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate("/login")}
              className="w-full rk-btn-primary"
            >
              Sign In / Create Account
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}
