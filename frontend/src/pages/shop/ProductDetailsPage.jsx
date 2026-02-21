import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useStore from "../../store/store";
import { Star, ShieldCheck, Truck, RefreshCw, Shirt } from "lucide-react";
import Reviews from "../../components/reviews/Reviews";


const ProductDetailsPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const {
    products,
    addToCart,
    currency,
    fetchReviews,
    showToast,
  } = useStore();

  const [selectedSize, setSelectedSize] = useState("");
  const [activeImage, setActiveImage] = useState(null);

  const product = products.find(
    (p) => (p._id || p.id) === productId
  );

  const images = product?.image || product?.images || [];

  /* ================= FETCH REVIEWS ================= */
  useEffect(() => {
    if (productId) {
      fetchReviews(productId);
    }
  }, [productId]);

  /* ================= IMAGE ================= */
  useEffect(() => {
    if (images.length > 0) {
      setActiveImage(images[0]);
    }
  }, [images]);

  /* ================= AUTO SELECT SIZE ================= */
  useEffect(() => {
    if (product?.sizes?.length === 1) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product?.sizes]);

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
    discount,
    discountedPrice,
    category,
    subCategory,
    print,
    exclusivity,
    sizes,
    bestseller,
  } = product;

  const badgeText =
    discount > 0
      ? `-${discount}%`
      : bestseller
      ? "Bestseller"
      : exclusivity === "Limited"
      ? "Limited Edition"
      : null;

  /* ================= HANDLERS ================= */
  const handleAddToCart = () => {
    if (!selectedSize) {
      showToast("Please select a size", "error");
      return;
    }

    addToCart(product._id || product.id, selectedSize);
    showToast("Added to cart", "success");
    navigate("/cart");
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      showToast("Please select a size", "error");
      return;
    }

    addToCart(product._id || product.id, selectedSize);
    showToast("Proceeding to checkout", "success");
    navigate("/place-order");
  };

  return (
    <section className="bg-linear-to-br from-[#fffafc] via-[#fff1f4] to-[#ffe6ee] py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">

          {/* IMAGE */}
          <div className="flex flex-col-reverse md:flex-row gap-4">
            
            <div className="flex md:flex-col items-center justify-center gap-2 md:gap-4">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`border rounded-xl overflow-hidden ${
                    activeImage === img
                      ? "border-[#c9487c]"
                      : "border-pink-200"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${name} ${i + 1}`}
                    className="w-16 h-16 object-cover"
                  />
                </button>
              ))}
            </div>
            <div className="relative w-full">
              {badgeText && (
                <span className="absolute top-4 left-4 bg-[#c9487c] text-white text-xs px-3 py-1 rounded-full shadow z-10">
                  {badgeText}
                </span>
              )}

              <img
                src={activeImage}
                alt={name}
                className="w-full h-auto object-contain rounded-2xl shadow-lg"
              />
            </div>
          </div>

          {/* INFO */}
          <div className="flex flex-col justify-center">
            <p className="uppercase tracking-[0.2em] text-xs text-pink-600 mb-2">
              {category} • {subCategory}
            </p>

            <h1 className="font-serif text-3xl md:text-4xl text-pink-900 mb-4">
              {name}
            </h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-[#c9487c]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <span className="text-xs md:text-sm text-pink-700">
                Customer favorite
              </span>
            </div>

            <div className="text-2xl md:text-3xl font-medium text-pink-900 mb-6">
              {Math.round(discountedPrice) ? (
                <>
                  <span className="text-red-500">
                    {currency}{Math.round(discountedPrice)}
                  </span>
                  <span className="text-gray-400 line-through ml-3 text-xl">
                    {currency}{price}
                  </span>
                </>
              ) : (
                <span>{currency}{price}</span>
              )}
            </div>

            <div className="mb-6 space-y-5">
                <div className="border-t border-pink-200 pt-5">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-pink-900 mb-3">
                    Product Details
                  </h3>
                  <div className="space-y-2 text-pink-800 leading-relaxed text-sm">
                    {description.split('\n').map((line, index) => (
                      line.trim() && <p key={index}>{line}</p>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 bg-white/60 p-3 rounded-xl border border-pink-100">
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                    <Shirt size={16} className="text-pink-600" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-pink-500 font-semibold">
                      Fabric & Aesthetic
                    </p>
                    <p className="text-gray-800 font-medium text-sm">{print} Pattern</p>
                  </div>
                </div>
              </div>

            {/* SIZES */}
            {sizes?.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-medium uppercase tracking-wider mb-3">Select Size</p>
                <div className="flex gap-2 flex-wrap">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-2 text-sm rounded-full border transition-all duration-300 ${
                        selectedSize === size
                          ? "bg-[#c9487c] text-white border-[#c9487c]"
                          : "border-pink-300 text-pink-800 hover:bg-pink-100/50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#c9487c] hover:bg-[#b53f6c] text-white py-3 rounded-full text-sm font-semibold transition-colors"
              >
                Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 border border-[#c9487c] text-[#c9487c] hover:bg-[#c9487c] hover:text-white py-3 rounded-full text-sm font-semibold transition-all"
              >
                Buy Now
              </button>
            </div>

            {/* TRUST */}
            <div className="grid grid-cols-3 gap-2 md:gap-4 text-center">
              <Trust icon={ShieldCheck} text="Quality Checked" />
              <Trust icon={Truck} text="Fast Shipping" />
              <Trust icon={RefreshCw} text="Easy Returns" />
            </div>
          </div>
        </div>

        <div className="mt-16 md:mt-24">
          <Reviews productId={productId} />
        </div>
      </div>
    </section>
  );
};

const Trust = ({ icon: Icon, text }) => (
  <div className="bg-white/70 rounded-lg p-3 shadow-sm text-center">
    <Icon size={20} className="mx-auto text-[#c9487c]" />
    <p className="text-xs mt-2 text-pink-800">{text}</p>
  </div>
);

export default ProductDetailsPage;
