import React from "react";
import useStore from "../../store/store";
import { Link } from "react-router-dom";
import { Heart, Eye } from "lucide-react";

const ProductItem = ({
  id,
  image,
  name,
  price,
  discountedPrice,
  discount,
  stock,
  onQuickView,
}) => {
  const { currency, wishlist, addToWishlist, removeFromWishlist } = useStore();

  const isWishlisted = wishlist?.items?.some(
    (item) => item.product?._id === id
  );

  const handleWishlistClick = (e) => {
    e.preventDefault();
    isWishlisted ? removeFromWishlist(id) : addToWishlist(id);
  };

  const isOutOfStock = stock === 0 || stock === null;

  /* -------------------- OUT OF STOCK → RENDER NOTHING -------------------- */
  if (isOutOfStock) return null;

  /* -------------------- NORMAL PRODUCT CARD -------------------- */
  return (
    <Link to={`/product/${id}`} className="group block">
      <div className="relative overflow-hidden rounded-3xl shadow-xl bg-black">
        {/* IMAGE */}
        <img
          src={image?.[0]}
          alt={name}
          className="w-full h-110 object-cover transition duration-700 group-hover:scale-115"
        />

        {/* GRADIENT */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        {/* DISCOUNT BADGE */}
        {discount > 0 && (
          <div className="absolute top-5 left-5 bg-[#8b5e5e] text-white text-xs tracking-wide px-3 py-1 rounded-full">
            {discount}% OFF
          </div>
        )}

        {/* WISHLIST */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-5 right-5 bg-black/50 backdrop-blur-md p-3 rounded-full hover:scale-110 transition"
        >
          <Heart
            className={`w-5 h-5 transition ${
              isWishlisted
                ? "fill-[#e6c9a8] text-[#e6c9a8]"
                : "text-white"
            }`}
          />
        </button>

        {/* QUICK VIEW */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onQuickView(id);
            }}
            className="absolute bottom-28 left-1/2 -translate-x-1/2 bg-white/90 px-6 py-2 rounded-full text-xs tracking-wide text-black shadow-xl opacity-0 group-hover:opacity-100 transition flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Quick View
          </button>
        )}

        {/* CONTENT */}
        <div className="absolute bottom-0 p-6 text-white w-full">
          <p className="text-sm font-serif tracking-wide leading-tight line-clamp-1">
            {name}
          </p>

          <div className="mt-2 flex items-center gap-3">
            {Math.round(discountedPrice) ? (
              <>
                <span className="text-[#e6c9a8] text-lg font-semibold">
                  {currency}
                  {Math.round(discountedPrice)}
                </span>
                <span className="text-sm text-neutral-400 line-through">
                  {currency}
                  {price}
                </span>
              </>
            ) : (
              <span className="text-[#e6c9a8] text-lg font-semibold">
                {currency}
                {price}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;