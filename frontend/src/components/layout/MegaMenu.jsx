import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function MegaMenu({ activeMenu, collections = [], sareeTypes = [], kurtaTypes = [], suitTypes = [], onClose }) {
  if (!activeMenu) return null;

  return (
    <div
      className="hidden lg:block absolute left-0 right-0 top-full bg-[#F7F1E5] border-b border-[#D4AF63]/35 shadow-2xl z-50"
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeMenu === "sarees" && (
          <div className="grid grid-cols-12 gap-8 items-start">
            <div className="col-span-4 pr-6 border-r border-[#38131E]/10">
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#38131E]/65 mb-2">
                Saree Edit
              </p>
              <h3 className="font-serif text-2xl text-[#38131E] mb-2">
                Regional &amp; Occasion Drapes
              </h3>
              <p className="text-sm text-[#1A1718]/75 leading-relaxed mb-5">
                Explore curated sarees selected for celebratory occasions and everyday comfort.
              </p>
              <Link
                to="/shop/saree/all"
                onClick={onClose}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#38131E] hover:text-[#2B0E17] border-b border-[#D4AF63] pb-1"
              >
                View All Sarees <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="col-span-8">
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#38131E]/65 mb-4">
                {sareeTypes.length > 0 ? "Available Saree Styles" : "Browse Sarees"}
              </p>
              {sareeTypes.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {sareeTypes.slice(0, 9).map((t) => (
                    <Link
                      key={t.slug || t._id}
                      to={`/shop/saree/${t.slug}`}
                      onClick={onClose}
                      className="group flex items-center justify-between px-4 py-3 rounded-xl bg-white/80 border border-[#38131E]/10 hover:border-[#D4AF63] hover:bg-white transition-all"
                    >
                      <span className="text-sm font-medium text-[#38131E] group-hover:translate-x-0.5 transition-transform">
                        {t.name}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#D4AF63] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  <Link to="/shop/saree" onClick={onClose} className="rk-chip">
                    Saree Categories
                  </Link>
                  <Link to="/shop/saree/all" onClick={onClose} className="rk-chip">
                    All Sarees
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {activeMenu === "men" && (
          <div className="grid grid-cols-12 gap-8 items-start">
            <div className="col-span-4 pr-6 border-r border-[#38131E]/10">
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#38131E]/65 mb-2">
                Menswear
              </p>
              <h3 className="font-serif text-2xl text-[#38131E] mb-2">
                Kurta Pajama &amp; Jodhpuri
              </h3>
              <p className="text-sm text-[#1A1718]/75 leading-relaxed mb-5">
                Tailored festive silhouettes, classic bandhgalas, and contemporary menswear.
              </p>
              <Link
                to="/shop/kurta/all"
                onClick={onClose}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#38131E] border-b border-[#D4AF63] pb-1"
              >
                Explore Menswear <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="col-span-8 grid grid-cols-3 gap-5">
              <div>
                <Link
                  to="/shop/kurta"
                  onClick={onClose}
                  className="font-serif text-lg text-[#38131E] hover:underline block mb-3"
                >
                  Kurta Pajama
                </Link>
                <ul className="space-y-2 text-sm text-[#1A1718]/75">
                  <li>
                    <Link to="/shop/kurta/all" onClick={onClose} className="hover:text-[#38131E]">
                      All Kurtas
                    </Link>
                  </li>
                  {kurtaTypes.slice(0, 5).map((t) => (
                    <li key={t.slug || t._id}>
                      <Link to={`/shop/kurta/${t.slug}`} onClick={onClose} className="hover:text-[#38131E]">
                        {t.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <Link
                  to="/shop/jodhpuri/all"
                  onClick={onClose}
                  className="font-serif text-lg text-[#38131E] hover:underline block mb-3"
                >
                  Jodhpuri &amp; Bandhgala
                </Link>
                <ul className="space-y-2 text-sm text-[#1A1718]/75">
                  <li>
                    <Link to="/shop/jodhpuri/all" onClick={onClose} className="hover:text-[#38131E]">
                      All Jodhpuri Styles
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop/indo-western/all" onClick={onClose} className="hover:text-[#38131E]">
                      Indo-Western
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <Link
                  to="/shop/suit"
                  onClick={onClose}
                  className="font-serif text-lg text-[#38131E] hover:underline block mb-3"
                >
                  Suits &amp; Sets
                </Link>
                <ul className="space-y-2 text-sm text-[#1A1718]/75">
                  <li>
                    <Link to="/shop/suit/all" onClick={onClose} className="hover:text-[#38131E]">
                      All Suits
                    </Link>
                  </li>
                  {suitTypes.slice(0, 5).map((t) => (
                    <li key={t.slug || t._id}>
                      <Link to={`/shop/suit/${t.slug}`} onClick={onClose} className="hover:text-[#38131E]">
                        {t.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeMenu === "collections" && (
          <div className="grid grid-cols-12 gap-8 items-start">
            <div className="col-span-4 pr-6 border-r border-[#38131E]/10">
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#38131E]/65 mb-2">
                Catalog
              </p>
              <h3 className="font-serif text-2xl text-[#38131E] mb-2">
                All Collections
              </h3>
              <p className="text-sm text-[#1A1718]/75 leading-relaxed mb-5">
                Browse active collections and complete inventory curated by Revakalp.
              </p>
              <Link
                to="/shop"
                onClick={onClose}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#38131E] border-b border-[#D4AF63] pb-1"
              >
                Open Collections <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="col-span-8">
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#38131E]/65 mb-4">
                Storefront Categories
              </p>
              <div className="grid grid-cols-3 gap-3">
                {(collections.length > 0
                  ? collections.map((c) => ({ label: c.name, to: `/shop/${c.id}` }))
                  : [
                      { label: "Sarees", to: "/shop/saree" },
                      { label: "Lehengas", to: "/shop/lehenga/all" },
                      { label: "Kurta Pajama", to: "/shop/kurta" },
                      { label: "Jodhpuri", to: "/shop/jodhpuri/all" },
                      { label: "Printed Tees", to: "/shop/printed-tees/all" },
                      { label: "All Products", to: "/shop/all/all" },
                    ]
                ).map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className="group flex items-center justify-between px-4 py-3 rounded-xl bg-white/80 border border-[#38131E]/10 hover:border-[#D4AF63] hover:bg-white transition-all"
                  >
                    <span className="text-sm font-medium text-[#38131E]">{item.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D4AF63] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
