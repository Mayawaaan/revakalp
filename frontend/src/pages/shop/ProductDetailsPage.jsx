import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useStore from "../../store/store";
import { Star, ShieldCheck, Truck, RefreshCw } from "lucide-react";

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, currency } = useStore();

  const product = products.find((p) => (p._id || p.id) === productId);
  const [selectedSize, setSelectedSize] = useState("");

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-pink-700">
        Product not found
      </div>
    );
  }

  const {
    name,
    description,
    price,
    image = [],
    category,
    subCategory,
    print,
    exclusivity,
    sizes,
    bestseller,
  } = product;

  const [activeImage, setActiveImage] = useState(image[0]);

  const badgeText = bestseller
    ? "Bestseller"
    : exclusivity === "Limited"
    ? "Limited Edition"
    : null;

  return (
    <section className="bg-gradient-to-br from-[#fffafc] via-[#fff1f4] to-[#ffe6ee] py-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">

          {/* ================= IMAGE GALLERY ================= */}
          <div>
            {/* Desktop main image */}
            <div className="relative hidden lg:block">
              {badgeText && (
                <span className="absolute top-6 left-6 z-10 bg-[#c9487c] text-white text-xs px-4 py-1 rounded-full shadow">
                  {badgeText}
                </span>
              )}

              <img
                src={activeImage}
                alt={name}
                className="w-full rounded-3xl shadow-2xl"
              />
            </div>

            {/* Desktop thumbnails */}
            {image.length > 1 && (
              <div className="hidden lg:flex gap-4 mt-6">
                {image.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`border rounded-xl overflow-hidden transition
                      ${
                        activeImage === img
                          ? "border-[#c9487c]"
                          : "border-pink-200 hover:border-[#c9487c]"
                      }`}
                  >
                    <img
                      src={img}
                      alt={`${name} ${i + 1}`}
                      className="w-24 h-24 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Mobile swipe gallery */}
            <div className="lg:hidden">
              <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4">
                {image.map((img, i) => (
                  <div
                    key={i}
                    className="min-w-full snap-center relative"
                  >
                    {i === 0 && badgeText && (
                      <span className="absolute top-4 left-4 z-10 bg-[#c9487c] text-white text-xs px-3 py-1 rounded-full shadow">
                        {badgeText}
                      </span>
                    )}
                    <img
                      src={img}
                      alt={`${name} ${i + 1}`}
                      className="w-full rounded-3xl shadow-xl"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ================= PRODUCT INFO ================= */}
          <div>
            <p className="uppercase tracking-[0.3em] text-xs text-pink-600 mb-4">
              {category} • {subCategory}
            </p>

            <h1 className="font-serif text-4xl md:text-5xl text-pink-900 mb-4">
              {name}
            </h1>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-[#c9487c]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              <span className="text-sm text-pink-700">(Customer favorite)</span>
            </div>

            <p className="text-3xl font-medium text-pink-900 mb-8">
              {currency}{price}
            </p>

            <p className="text-pink-700 leading-relaxed mb-10 max-w-xl">
              {description}
            </p>

            {/* Sizes */}
            {sizes?.length > 0 && (
              <div className="mb-10">
                <p className="text-sm font-medium text-pink-800 mb-4">
                  Select Size
                </p>
                <div className="flex gap-3 flex-wrap">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-2 rounded-full border text-sm transition
                        ${
                          selectedSize === size
                            ? "bg-[#c9487c] text-white border-[#c9487c]"
                            : "border-pink-300 text-pink-800 hover:border-[#c9487c]"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button
                onClick={() => addToCart(product._id || product.id, selectedSize)}
                className="flex-1 bg-[#c9487c] hover:bg-[#9c2756] text-white py-4 rounded-full font-medium shadow-xl transition"
              >
                Add to Cart
              </button>

              <button
                onClick={() => {
                  addToCart(product._id || product.id, selectedSize);
                  navigate("/place-order");
                }}
                className="flex-1 border border-[#c9487c] text-[#c9487c] hover:bg-[#c9487c] hover:text-white py-4 rounded-full font-medium transition"
              >
                Buy Now
              </button>
            </div>

            {/* Trust */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <Trust icon={ShieldCheck} text="Authentic & Quality Checked" />
              <Trust icon={Truck} text="Careful Shipping" />
              <Trust icon={RefreshCw} text="Easy Returns" />
            </div>

            {/* Details */}
            <div className="mt-14">
              <h3 className="font-serif text-2xl text-pink-900 mb-6">
                Product Details
              </h3>
              <ul className="space-y-2 text-pink-700">
                <li><strong>Category:</strong> {category}</li>
                <li><strong>Sub-category:</strong> {subCategory}</li>
                <li><strong>Print:</strong> {print}</li>
                <li><strong>Exclusivity:</strong> {exclusivity}</li>
              </ul>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

const Trust = ({ icon: Icon, text }) => (
  <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 shadow">
    <Icon className="mx-auto text-[#c9487c]" />
    <p className="text-sm text-pink-700 mt-2">{text}</p>
  </div>
);

export default ProductDetailsPage;
