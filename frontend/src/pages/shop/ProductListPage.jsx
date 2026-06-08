import React from "react";
import { useParams } from "react-router-dom";
import useStore from "../../store/store";
import ProductItem from "../../components/products/ProductItem";
import Breadcrums from "../../components/globalComponents/Breadcrums";
import { ShoppingBag } from "lucide-react";

const ProductListPage = () => {
  const { category, type } = useParams();
  const { products } = useStore();

  const filteredProducts = products.filter((product) => {
    const productCategory = product.type.toLowerCase();
    const productType = product.name.toLowerCase();

    if (category === "saree") {
      if (type === "all") return productCategory === "saree";
      return productCategory === "saree" && productType.includes(type.toLowerCase());
    }
    if (type === "all") return productCategory === category.toLowerCase();
    return productCategory === category.toLowerCase() && productType.includes(type.toLowerCase());
  });

  const displayType = type === "all" ? category : type;
  const pageTitle = displayType.charAt(0).toUpperCase() + displayType.slice(1);

  return (
    <section className="relative bg-gradient-to-br from-[#fffafc] via-[#fff1f4] to-[#ffe6ee] min-h-screen overflow-hidden">

      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-40 -left-20 w-[500px] h-[500px] rounded-full bg-pink-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-0 w-[480px] h-[480px] rounded-full bg-rose-300/30 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20">

        {/* Breadcrumb */}
        <div className="flex justify-center mb-10">
          <Breadcrums />
        </div>

        {/* Page header */}
        <div className="text-center mb-14 md:mb-20 max-w-2xl mx-auto">
          <p className="uppercase tracking-[0.35em] text-xs text-pink-500 mb-3 font-medium">
            Collection
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-pink-900 leading-tight">
            {pageTitle}
          </h1>
          <div className="mt-4 mx-auto w-14 h-0.5 bg-gradient-to-r from-transparent via-[#c9487c] to-transparent rounded-full" />
          <p className="mt-6 text-pink-700 leading-relaxed text-base">
            Thoughtfully curated pieces designed to elevate your everyday elegance.
          </p>
        </div>

        {/* Product count pill */}
        {filteredProducts.length > 0 && (
          <div className="flex justify-end mb-6">
            <span className="inline-flex items-center gap-1.5 bg-white/70 backdrop-blur-sm border border-pink-200 text-pink-700 text-xs font-medium px-4 py-1.5 rounded-full shadow-sm">
              <ShoppingBag className="w-3.5 h-3.5" />
              {filteredProducts.length} {filteredProducts.length === 1 ? "piece" : "pieces"}
            </span>
          </div>
        )}

        {/* Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts.map((product) => (
              <ProductItem
                key={product._id || product.id}
                id={product._id || product.id}
                {...product}
              />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center mb-6 shadow-inner">
              <ShoppingBag className="w-9 h-9 text-[#c9487c]" />
            </div>
            <h2 className="font-serif text-2xl text-pink-900 mb-3">Nothing here yet</h2>
            <p className="text-pink-600 text-sm max-w-xs leading-relaxed">
              No products found in this collection. Try exploring a different category or check back soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductListPage;
