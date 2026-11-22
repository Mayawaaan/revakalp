import React from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowRight, ChevronLeft } from "lucide-react";
import useStore from "../../store/store";
import Breadcrums from "../../components/globalComponents/Breadcrums";
import PageHero from "../../components/globalComponents/PageHero";
import LoadingSkeleton from "../../components/ui/LoadingSkeleton";
import EditorialButton from "../../components/ui/EditorialButton";

const CATEGORY_META = {
  saree: {
    heading: "Saree Traditions",
    subheading: "Weaves, prints, and draping styles from across India.",
  },
  suit: {
    heading: "Suits & Sets",
    subheading: "Salwar suits and festive sets made to wear easily.",
  },
  kurta: {
    heading: "Kurta Styles",
    subheading: "Easy everyday kurtas and festive menswear.",
  },
};

const DIRECT_LIST_ALIASES = new Set([
  "indo-western",
  "lehenga",
  "lehengas",
  "suit",
  "suits",
  "kurta",
  "kurtas",
  "kurta-pajama",
  "jodhpuri",
  "printed-tees",
  "all",
]);

const SubCategoryPage = () => {
  const { category } = useParams();
  const normalized = (category || "").toLowerCase();
  const { sareeTypes, suitTypes, kurtaTypes, loading, collections } = useStore();

  if (DIRECT_LIST_ALIASES.has(normalized)) {
    return <Navigate to={`/shop/${normalized}/all`} replace />;
  }

  let types = [];
  if (normalized === "saree") types = sareeTypes;
  else if (normalized === "suit") types = suitTypes;
  else if (normalized === "kurta") types = kurtaTypes;
  else {
    return <Navigate to={`/shop/${normalized || "all"}/all`} replace />;
  }

  const matchedCollection = (collections || []).find(
    (c) => c.id?.toLowerCase() === normalized
  );
  const meta = CATEGORY_META[normalized] || {
    heading: matchedCollection?.name || "Collections",
    subheading: matchedCollection?.description || "Curated styles from Revakalp.",
  };

  return (
    <div className="bg-[#F7F1E5] min-h-screen">
      <PageHero
        label={`${normalized} Collections`}
        title={meta.heading}
        subtitle={meta.subheading}
      >
        <EditorialButton to={`/shop/${normalized}/all`} variant="gold">
          <span>View All {normalized.charAt(0).toUpperCase() + normalized.slice(1)}</span>
          <ArrowRight className="w-4 h-4" />
        </EditorialButton>

        {normalized === "saree" && (
          <EditorialButton to="/heritage" variant="outlineDark">
            <span>Indian Textile Guide</span>
          </EditorialButton>
        )}
      </PageHero>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <Breadcrums />
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[2px] bg-[#FBF7EE] border border-[#38131E]/18 text-[11px] uppercase tracking-[0.18em] font-medium text-[#38131E] hover:border-[#38131E] transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back to Collections
          </Link>
        </div>

        {loading && !types?.length ? (
          <LoadingSkeleton count={6} />
        ) : types && types.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-8">
            <Link
              to={`/shop/${normalized}/all`}
              className="group relative aspect-[4/5] rounded-[2px] overflow-hidden bg-[#2B0E17] border border-[#D4AF63]/45 hover:border-[#F1D889] transition-colors duration-500 flex items-end"
            >
              <img
                src={
                  normalized === "saree"
                    ? "/campaign/category-sarees.png"
                    : "/campaign/category-kurta-pajama.png"
                }
                alt={`All ${normalized}`}
                className="absolute inset-0 w-full h-full object-cover opacity-55 transition-transform duration-700 group-hover:scale-105"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#2B0E17] via-[#2B0E17]/30 to-transparent"
              />
              <div className="relative z-10 w-full p-3.5 sm:p-6 flex items-end justify-between gap-2 text-[#F7F1E5]">
                <div className="min-w-0">
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.22em] text-[#F1D889] mb-1">
                    Complete Edit
                  </p>
                  <h3 className="font-serif text-lg sm:text-3xl leading-tight">
                    View All {normalized.charAt(0).toUpperCase() + normalized.slice(1)}
                  </h3>
                </div>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#F1D889] shrink-0 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {types.map((type) => (
              <Link
                key={type.slug || type._id}
                to={`/shop/${normalized}/${type.slug}`}
                className="group relative aspect-[4/5] rounded-[2px] overflow-hidden bg-[#2B0E17] border border-[#38131E]/15 hover:border-[#D4AF63] transition-colors duration-500 flex items-end"
              >
                <img
                  src={type.image}
                  alt={type.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover opacity-85 transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#2B0E17]/88 via-[#2B0E17]/20 to-transparent"
                />
                <div className="relative z-10 w-full p-3.5 sm:p-6 flex items-end justify-between gap-2 text-[#F7F1E5]">
                  <div className="min-w-0">
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.22em] text-[#F1D889] mb-1">
                      {normalized}
                    </p>
                    <h3 className="font-serif text-lg sm:text-3xl leading-tight truncate">
                      {type.name}
                    </h3>
                  </div>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#F1D889] shrink-0 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <Navigate to={`/shop/${normalized}/all`} replace />
        )}
      </div>
    </div>
  );
};

export default SubCategoryPage;
