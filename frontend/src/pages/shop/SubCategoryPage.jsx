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
    subheading: "Explore weaves, prints, and draping styles from across India.",
  },
  suit: {
    heading: "Suit Collections",
    subheading: "Classic salwar silhouettes and contemporary festive cuts.",
  },
  kurta: {
    heading: "Kurta Styles",
    subheading: "Effortless everyday and festive tailoring.",
  },
};

const DIRECT_LIST_ALIASES = new Set([
  "indo-western",
  "lehenga",
  "lehengas",
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
    // Allow any custom collection id to resolve cleanly to its product listing
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
      </PageHero>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <Breadcrums />
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#38131E]/15 text-xs uppercase tracking-[0.16em] font-medium text-[#38131E] hover:border-[#38131E] transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back to Collections
          </Link>
        </div>

        {loading && !types?.length ? (
          <LoadingSkeleton count={6} />
        ) : types && types.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Link
              to={`/shop/${normalized}/all`}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#38131E] border border-[#D4AF63]/40 shadow-sm hover:shadow-xl transition-all duration-500 flex items-end"
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
              <div className="relative z-10 w-full p-6 flex items-end justify-between text-[#F7F1E5]">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#F1D889] mb-1">
                    Complete Edit
                  </p>
                  <h3 className="font-serif text-2xl sm:text-3xl">
                    View All {normalized.charAt(0).toUpperCase() + normalized.slice(1)}
                  </h3>
                </div>
                <ArrowRight className="w-5 h-5 text-[#F1D889] shrink-0 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {types.map((type) => (
              <Link
                key={type.slug || type._id}
                to={`/shop/${normalized}/${type.slug}`}
                className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-white border border-[#38131E]/12 hover:border-[#D4AF63] shadow-xs hover:shadow-xl transition-all duration-500 flex items-end"
              >
                <img
                  src={type.image}
                  alt={type.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#2B0E17]/85 via-[#2B0E17]/20 to-transparent"
                />
                <div className="relative z-10 w-full p-6 flex items-end justify-between text-[#F7F1E5]">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#F1D889] mb-1">
                      {normalized}
                    </p>
                    <h3 className="font-serif text-2xl sm:text-3xl leading-tight">
                      {type.name}
                    </h3>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#F1D889] shrink-0 group-hover:translate-x-1 transition-transform" />
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
