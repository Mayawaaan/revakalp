import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import useStore from "../../store/store";
import ProductItem from "../products/ProductItem";
import SectionHeading from "../ui/SectionHeading";

const LatestCollection = () => {
  const { products } = useStore();

  const latestProducts = [...products]
    .filter((product) => {
      const stock = Number(product.stock);
      return Number.isFinite(stock) && stock > 0;
    })
    .sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0))
    .slice(0, 8);

  if (!latestProducts.length) return null;

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-[#38131E]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeading
            eyebrow="Just Arrived"
            title="Latest"
            accentWord="Arrivals"
            subtitle="Fresh additions to our Indore storefront catalog."
            align="left"
          />
          <Link
            to="/shop/all/all?sort=newest"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#38131E] border-b border-[#D4AF63] pb-1 self-start md:self-auto"
          >
            View All New Arrivals <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7">
          {latestProducts.map((product) => (
            <ProductItem
              key={product._id}
              id={product._id}
              {...product}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestCollection;
