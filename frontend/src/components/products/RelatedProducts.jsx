import React, { useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useStore from "../../store/store";
import ProductItem from "./ProductItem";
import SectionHeading from "../ui/SectionHeading";

const RelatedProducts = ({ category, subCategory, currentId }) => {
  const products = useStore((state) => state.products);
  const sliderRef = useRef(null);

  const related = useMemo(() => {
    if (!products?.length) return [];
    const inStock = products.filter(
      (item) =>
        Number(item?.stock) > 0 && (item._id || item.id) !== currentId
    );
    const strict = inStock.filter(
      (item) =>
        (!category ||
          item.category?.toLowerCase() === category.toLowerCase()) &&
        (!subCategory ||
          item.subCategory?.toLowerCase() === subCategory.toLowerCase())
    );
    if (strict.length >= 2) return strict.slice(0, 8);

    const sameCategory = inStock.filter(
      (item) =>
        category && item.category?.toLowerCase() === category.toLowerCase()
    );
    return (sameCategory.length > 0 ? sameCategory : inStock).slice(0, 8);
  }, [products, category, subCategory, currentId]);

  if (!related.length) return null;

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -320, behavior: "smooth" });
  };
  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: 320, behavior: "smooth" });
  };

  return (
    <section className="mt-16 sm:mt-24 pt-14 border-t border-[#38131E]/15">
      <div className="flex items-end justify-between gap-4 mb-10">
        <SectionHeading
          eyebrow="Curated Pairing"
          title="You May"
          accentWord="Also Love"
          align="left"
        />

        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={scrollLeft}
            aria-label="Scroll related products left"
            className="w-10 h-10 rounded-full bg-white border border-[#38131E]/20 text-[#38131E] flex items-center justify-center hover:bg-[#38131E] hover:text-[#F7F1E5] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={scrollRight}
            aria-label="Scroll related products right"
            className="w-10 h-10 rounded-full bg-white border border-[#38131E]/20 text-[#38131E] flex items-center justify-center hover:bg-[#38131E] hover:text-[#F7F1E5] transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={sliderRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
      >
        {related.map((item) => (
          <div
            key={item._id || item.id}
            className="snap-start shrink-0 w-[260px] sm:w-[280px]"
          >
            <ProductItem id={item._id || item.id} {...item} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
