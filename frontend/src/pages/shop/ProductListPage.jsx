import React from "react";
import { useParams } from "react-router-dom";
import useStore from "../../store/store";
import ProductItem from "../../components/products/ProductItem";
import Breadcrums from "../../components/globalComponents/Breadcrums";

const ProductListPage = () => {
  const { category, type } = useParams();
  const { products } = useStore();

  const filteredProducts = products.filter((product) => {
    const productCategory = product.type.toLowerCase();
    const productType = product.name.toLowerCase();

    if (category === "saree") {
      if (type === "all") {
        return productCategory === "saree";
      }
      return (
        productCategory === "saree" &&
        productType.includes(type.toLowerCase())
      );
    }

    if (type === "all") {
      return productCategory === category.toLowerCase();
    }

    return (
      productCategory === category.toLowerCase() &&
      productType.includes(type.toLowerCase())
    );
  });

  const displayType = type === "all" ? category : type;
  const pageTitle =
    displayType.charAt(0).toUpperCase() + displayType.slice(1);

    // console.log("111111======",products)

  return (
    <section className="bg-gradient-to-br from-[#fffafc] via-[#fff1f4] to-[#ffe6ee] py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-center mb-8">
          <Breadcrums />
        </div>
        {/* Header */}
        <div className="text-center mb-12 md:mb-20 max-w-3xl mx-auto">
          <p className="uppercase tracking-[0.35em] text-xs text-pink-600 mb-4">
            Collection
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-pink-900">
            {pageTitle}
          </h1>
          <p className="mt-6 text-pink-700 leading-relaxed">
            Thoughtfully curated pieces designed to elevate your everyday
            elegance.
          </p>
        </div>

        {/* Products */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id || product.id}
                className="bg-white rounded-xl p-3 shadow-sm hover:shadow-lg transition duration-300 border border-pink-50"
              >
                <ProductItem id={product._id || product.id} {...product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-pink-700 text-lg mb-4">
              No products found in this collection.
            </p>
            <p className="text-sm text-pink-600">
              Try exploring a different category or check back soon.
            </p>
          </div>
        )}

      </div>
    </section>
  );
};

export default ProductListPage;
