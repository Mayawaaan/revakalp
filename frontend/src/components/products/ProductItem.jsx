import React from "react";
import useStore from "../../store/store";
import { Link } from "react-router-dom";
import { Heart, Eye, ArrowRight } from "lucide-react";

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
    <Link 
      to={`/product/${id}`} 
      className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#f5f3ef] shadow-[0_40px_80px_-20px_rgba(110,18,46,0.2),0_20px_40px_-10px_rgba(0,0,0,0.1)] border border-white/50 flex items-end transform transition-all duration-700 hover:-translate-y-6 hover:shadow-[0_60px_120px_-20px_rgba(110,18,46,0.25)] block w-full"
    >
      {/* IMAGE */}
      <img
        src={image?.[0]}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
      />

      {/* GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#c9487c]/80 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-700" />

      {/* DISCOUNT BADGE */}
      {discount > 0 && (
        <div className="absolute top-5 left-5 bg-white/20 backdrop-blur-md border border-white/40 text-white font-medium text-xs tracking-wider uppercase px-4 py-1.5 rounded-full shadow-lg z-20">
          {discount}% OFF
        </div>
      )}

      {/* WISHLIST */}
      <button
        onClick={handleWishlistClick}
        className="absolute top-5 right-5 bg-white/20 backdrop-blur-md border border-white/40 p-3 rounded-full hover:scale-110 hover:bg-white/30 transition-all shadow-lg z-20"
      >
        <Heart
          className={`w-5 h-5 transition-colors ${
            isWishlisted ? "fill-white text-white" : "text-white"
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
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 px-6 py-2.5 rounded-full text-xs uppercase tracking-widest text-[#c9487c] font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center gap-2 hover:bg-white hover:scale-105 z-20"
        >
          <Eye className="w-4 h-4" />
          Quick View
        </button>
      )}

      {/* INFO BOX (Glassmorphism) */}
      <div className="relative z-10 w-full flex justify-between items-end backdrop-blur-2xl bg-white/20 p-5 sm:p-6 m-3 sm:m-4 rounded-[1.5rem] border border-white/40 shadow-[0_30px_60px_-15px_rgba(110,18,46,0.15),inset_0_0_0_1px_rgba(255,255,255,0.2)] group-hover:bg-white/30 transition-all duration-700">
        <div className="flex-1 pr-2">
          {/* Price */}
          <div className="flex items-center gap-2 mb-1.5">
            {Math.round(discountedPrice) ? (
              <>
                <span className="text-white text-sm sm:text-base font-semibold drop-shadow-sm tracking-wide">
                  {currency}{Math.round(discountedPrice)}
                </span>
                <span className="text-white/70 text-xs line-through drop-shadow-sm">
                  {currency}{price}
                </span>
              </>
            ) : (
              <span className="text-white text-sm sm:text-base font-semibold drop-shadow-sm tracking-wide">
                {currency}{price}
              </span>
            )}
          </div>
          
          {/* Product Name */}
          <h3 className="font-serif text-lg sm:text-xl text-white drop-shadow-md leading-tight line-clamp-2">
            {name}
          </h3>
        </div>
        
        {/* Animated Arrow */}
        <ArrowRight className="w-6 h-6 text-white transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 drop-shadow-md shrink-0 mb-1" />
      </div>
    </Link>
  );
};

export default ProductItem;