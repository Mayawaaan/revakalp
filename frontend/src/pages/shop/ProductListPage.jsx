import React from "react";
import { useParams } from "react-router-dom";
import useStore from "../../store/store";
import ProductItem from "../../components/products/ProductItem";

const ProductListPage = () => {
  const { category, type } = useParams();
  const { products, loading } = useStore();

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

  return (
    <section className="bg-gradient-to-br from-[#fffafc] via-[#fff1f4] to-[#ffe6ee] py-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <p className="uppercase tracking-[0.35em] text-xs text-pink-600 mb-4">
            Collection
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-pink-900">
            {pageTitle}
          </h1>
          <p className="mt-6 text-pink-700 leading-relaxed">
            Thoughtfully curated pieces designed to elevate your everyday
            elegance.
          </p>
        </div>

        {/* Products */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
            {filteredProducts.map(({ _id, ...rest }) => (
                          <div
                            className="bg-white rounded-3xl p-3 shadow-sm hover:shadow-xl transition duration-300"
                          >
                            <ProductItem key={_id} id={_id} {...rest} />
                          </div>            ))}
          </div>
        ) : (
          <div className="text-center py-24">
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
