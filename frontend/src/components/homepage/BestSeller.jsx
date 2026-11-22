import React from "react";
import useStore from "../../store/store";
import ProductItem from "../products/ProductItem";
import SectionHeading from "../ui/SectionHeading";

const BestSeller = () => {
  const { products } = useStore();

  const bestSellers = products.filter(
    (product) =>
      product.bestseller === true &&
      product.stock !== null &&
      product.stock !== undefined &&
      Number(product.stock) > 0
  );

  if (!bestSellers.length) return null;

  return (
    <section className="py-16 sm:py-24 bg-[#F7F1E5] border-b border-[#38131E]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Customer Favorites"
          title="Best"
          accentWord="Sellers"
          subtitle="Most-requested sarees, lehengas, and occasion styles currently available in stock."
          className="mb-12"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7">
          {bestSellers.map((product) => (
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

export default BestSeller;
