import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import useReducedMotion from "../motion/useReducedMotion";
import { HERITAGE_TRADITIONS } from "../../data/heritageTraditions";

const MotionDiv = motion.div;

export default function MegaMenu({
  activeMenu,
  collections = [],
  sareeTypes = [],
  onClose,
}) {
  const reducedMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {activeMenu && (
        <MotionDiv
          key={activeMenu}
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
          transition={{ duration: reducedMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
          onMouseLeave={onClose}
          className="hidden lg:block absolute left-0 right-0 top-full bg-[#F7F1E5] border-b border-[#D4AF63]/45 shadow-[0_28px_60px_-24px_rgba(43,14,23,0.45)] z-50 text-[#1A1718]"
        >
          <div className="max-w-7xl mx-auto px-6 py-9">
            {activeMenu === "sarees" && (
              <div className="grid grid-cols-12 gap-8 items-start">
                <div className="col-span-4 pr-6 border-r border-[#38131E]/12">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#38131E]/65 mb-2">
                    Sarees
                  </p>
                  <h3 className="font-serif text-3xl text-[#38131E] mb-2">
                    For Every Occasion
                  </h3>
                  <p className="text-sm text-[#1A1718]/75 leading-relaxed mb-6">
                    Handpicked sarees in silks, cottons, and festive weaves — ready to
                    wear or gift.
                  </p>
                  <div className="flex flex-col gap-2.5">
                    <Link
                      to="/shop/saree/all"
                      onClick={onClose}
                      className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-semibold text-[#38131E] hover:text-[#2B0E17] border-b border-[#D4AF63] pb-1 w-fit"
                    >
                      See all sarees <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to="/heritage"
                      onClick={onClose}
                      className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#38131E]/80 hover:text-[#38131E] w-fit"
                    >
                      Explore Indian textiles →
                    </Link>
                  </div>
                </div>

                <div className="col-span-5">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#38131E]/65 mb-4">
                    {sareeTypes.length > 0 ? "Browse Saree Styles" : "Browse by Region"}
                  </p>
                  {sareeTypes.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2.5">
                      {sareeTypes.slice(0, 8).map((t) => (
                        <Link
                          key={t.slug || t._id}
                          to={`/shop/saree/${t.slug}`}
                          onClick={onClose}
                          className="group flex items-center justify-between px-4 py-3 rounded-[2px] bg-[#FBF7EE] border border-[#38131E]/12 hover:border-[#D4AF63] transition-colors"
                        >
                          <span className="text-xs uppercase tracking-[0.14em] font-medium text-[#38131E]">
                            {t.name}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#D4AF63] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2.5">
                      {HERITAGE_TRADITIONS.map((trad) => (
                        <Link
                          key={trad.slug}
                          to={trad.shopRoute}
                          onClick={onClose}
                          className="group flex items-center justify-between px-4 py-3 rounded-[2px] bg-[#FBF7EE] border border-[#38131E]/12 hover:border-[#D4AF63] transition-colors"
                        >
                          <span className="text-xs uppercase tracking-[0.14em] font-medium text-[#38131E]">
                            {trad.name}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#D4AF63] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <div className="col-span-3">
                  <Link
                    to="/shop/saree/all"
                    onClick={onClose}
                    className="group block relative aspect-[9/16] max-h-72 mx-auto overflow-hidden rounded-[2px] bg-[#2B0E17] border border-[#D4AF63]/40"
                  >
                    <img
                      src="/category-tiles/sarees.png"
                      alt="Revakalp Sarees collection"
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2B0E17]/85 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-[#F7F1E5]">
                      <p className="text-[9px] uppercase tracking-[0.22em] text-[#F1D889]">
                        In Store
                      </p>
                      <p className="font-serif text-lg">Saree Collection →</p>
                    </div>
                  </Link>
                </div>
              </div>
            )}

            {activeMenu === "men" && (
              <div className="grid grid-cols-12 gap-8 items-start">
                <div className="col-span-4 pr-6 border-r border-[#38131E]/12">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#38131E]/65 mb-2">
                    Men&apos;s Section
                  </p>
                  <h3 className="font-serif text-3xl text-[#38131E] mb-2">
                    Coming Soon
                  </h3>
                  <p className="text-sm text-[#1A1718]/75 leading-relaxed mb-6">
                    Suits, Kurta Pajama, and Jodhpuri — coming soon.
                  </p>
                  <Link
                    to="/shop/indo-western/all"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-semibold text-[#38131E] border-b border-[#D4AF63] pb-1"
                  >
                    Explore Indo-Western <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="col-span-8 grid grid-cols-3 gap-6">
                  {[
                    { title: "Suits", to: "/shop/suit/all", desc: "Men's tailored suits" },
                    { title: "Kurta Pajama", to: "/shop/kurta/all", desc: "Classic festive kurtas" },
                    { title: "Jodhpuri", to: "/shop/jodhpuri/all", desc: "Structured bandhgala styles" },
                  ].map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={onClose}
                      className="group p-5 rounded-[2px] bg-[#FBF7EE] border border-[#38131E]/12 hover:border-[#D4AF63] transition-colors flex flex-col justify-between gap-4"
                    >
                      <span className="text-[10px] uppercase tracking-[0.22em] text-[#38131E]/60 font-semibold">
                        Coming Soon
                      </span>
                      <div>
                        <p className="font-serif text-xl text-[#38131E] group-hover:underline">
                          {item.title}
                        </p>
                        <p className="text-xs text-[#1A1718]/65 mt-1">{item.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {activeMenu === "heritage" && (
              <div className="grid grid-cols-12 gap-8 items-start">
                <div className="col-span-4 pr-6 border-r border-[#38131E]/12">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#38131E]/65 mb-2">
                    Indian Textiles
                  </p>
                  <h3 className="font-serif text-3xl text-[#38131E] mb-2">
                    Stories Behind the Weaves
                  </h3>
                  <p className="text-sm text-[#1A1718]/75 leading-relaxed mb-6">
                    Explore six beloved regional traditions — where they come from, their
                    classic motifs, and how to care for them.
                  </p>
                  <Link
                    to="/heritage"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-semibold text-[#38131E] border-b border-[#D4AF63] pb-1"
                  >
                    Explore the textile guide <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="col-span-8 grid grid-cols-3 gap-3">
                  {HERITAGE_TRADITIONS.map((trad) => (
                    <Link
                      key={trad.slug}
                      to={`/heritage/${trad.slug}`}
                      onClick={onClose}
                      className="group p-4 rounded-[2px] bg-[#FBF7EE] border border-[#38131E]/12 hover:border-[#D4AF63] hover:bg-[#38131E] transition-colors"
                    >
                      <p className="text-[10px] uppercase tracking-[0.16em] text-[#38131E]/55 group-hover:text-[#F1D889] mb-1">
                        {trad.region}
                      </p>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-serif text-xl text-[#38131E] group-hover:text-[#F7F1E5]">
                          {trad.name}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#D4AF63] group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {activeMenu === "collections" && (
              <div className="grid grid-cols-12 gap-8 items-start">
                <div className="col-span-4 pr-6 border-r border-[#38131E]/12">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#38131E]/65 mb-2">
                    Shop
                  </p>
                  <h3 className="font-serif text-3xl text-[#38131E] mb-2">
                    All Collections
                  </h3>
                  <p className="text-sm text-[#1A1718]/75 leading-relaxed mb-6">
                    Browse what&apos;s in our Indore store and available online right now.
                  </p>
                  <div className="flex flex-col gap-2.5">
                    <Link
                      to="/shop"
                      onClick={onClose}
                      className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-semibold text-[#38131E] border-b border-[#D4AF63] pb-1 w-fit"
                    >
                      See all collections <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to="/past-editions"
                      onClick={onClose}
                      className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#38131E]/75 hover:text-[#38131E] w-fit"
                    >
                      Past pieces →
                    </Link>
                  </div>
                </div>

                <div className="col-span-8">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#38131E]/65 mb-4">
                    Categories
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {(collections.length > 0
                      ? collections.map((c) => ({ label: c.name, to: `/shop/${c.id}` }))
                      : [
                          { label: "Sarees", to: "/shop/saree" },
                          { label: "Lehengas", to: "/shop/lehenga/all" },
                          { label: "Indo-Western", to: "/shop/indo-western/all" },
                          { label: "Printed Tees", to: "/shop/printed-tees/all" },
                          { label: "Men's Section (Coming Soon)", to: "/shop/kurta/all" },
                          { label: "Everything", to: "/shop/all/all" },
                        ]
                    ).map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={onClose}
                        className="group flex items-center justify-between px-4 py-3 rounded-[2px] bg-[#FBF7EE] border border-[#38131E]/12 hover:border-[#D4AF63] transition-colors"
                      >
                        <span className="text-xs uppercase tracking-[0.14em] font-medium text-[#38131E]">
                          {item.label}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#D4AF63] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
}
