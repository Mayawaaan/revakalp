import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Eye } from "lucide-react";
import useStore from "../../store/store";
import Price from "./Price";
import ImageWithFallback from "./ImageWithFallback";

export default function ProductCard({
  id,
  _id,
  image,
  images,
  name,
  price,
  discountedPrice,
  discount,
  stock,
  category,
  subCategory,
  type,
  bestseller,
  exclusivity,
  onQuickView,
  hideOutOfStock = true,
}) {
  const productId = id || _id;
  const { user, wishlist, addToWishlist, removeFromWishlist, showToast } =
    useStore();
  const navigate = useNavigate();

  const isOutOfStock = stock === 0 || stock === null;
  if (hideOutOfStock && isOutOfStock) return null;

  const isWishlisted = wishlist?.items?.some(
    (item) => (item.product?._id || item.product) === productId
  );

  const imageList = Array.isArray(image)
    ? image
    : Array.isArray(images)
    ? images
    : image
    ? [image]
    : [];
  const primaryImage = imageList[0] || "";
  const hoverImage = imageList[1] || primaryImage;

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showToast?.("Sign in to save pieces to your wishlist", "info");
      navigate("/login");
      return;
    }
    if (isWishlisted) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  const badgeText =
    Number(discount) > 0
      ? `${Math.round(discount)}% OFF`
      : bestseller
      ? "Bestseller"
      : exclusivity && String(exclusivity).toLowerCase() !== "false"
      ? String(exclusivity) === "true"
        ? "Exclusive"
        : String(exclusivity)
      : null;

  return (
    <article className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[#38131E]/10 hover:border-[#D4AF63]/70 shadow-xs hover:shadow-xl transition-all duration-500">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F7F1E5]">
        <Link
          to={`/product/${productId}`}
          aria-label={`View ${name}`}
          className="block w-full h-full"
        >
          <ImageWithFallback
            src={primaryImage}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {hoverImage && hoverImage !== primaryImage && (
            <ImageWithFallback
              src={hoverImage}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          )}
        </Link>

        {/* Subtle status badge */}
        {badgeText && (
          <span className="pointer-events-none absolute top-3 left-3 bg-[#38131E]/90 text-[#F1D889] text-[10px] font-semibold tracking-[0.16em] uppercase px-3 py-1 rounded-full border border-[#D4AF63]/40">
            {badgeText}
          </span>
        )}

        {isOutOfStock && !hideOutOfStock && (
          <span className="pointer-events-none absolute bottom-3 left-3 bg-[#1A1718]/85 text-[#F7F1E5] text-[10px] font-medium tracking-[0.14em] uppercase px-3 py-1 rounded-full">
            Out of Stock
          </span>
        )}

        {/* Wishlist toggle */}
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label={isWishlisted ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
          aria-pressed={Boolean(isWishlisted)}
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-[#F7F1E5]/90 backdrop-blur-xs border border-[#38131E]/15 flex items-center justify-center text-[#38131E] hover:bg-[#38131E] hover:text-[#F1D889] transition-colors shadow-sm cursor-pointer z-10"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
        </button>

        {/* Optional Quick View */}
        {onQuickView && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onQuickView(productId);
            }}
            className="hidden sm:inline-flex items-center gap-1.5 absolute bottom-3 right-3 bg-[#F7F1E5]/95 text-[#38131E] text-[11px] uppercase tracking-[0.14em] font-semibold px-3.5 py-2 rounded-full border border-[#D4AF63]/50 shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-2">
        <div>
          {(category || subCategory || type) && (
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#38131E]/60 mb-1 truncate">
              {[category, subCategory || type].filter(Boolean).join(" · ")}
            </p>
          )}
          <Link to={`/product/${productId}`} className="block">
            <h3 className="font-serif text-lg sm:text-xl text-[#38131E] leading-snug line-clamp-2 group-hover:text-[#2B0E17] transition-colors">
              {name}
            </h3>
          </Link>
        </div>

        <div className="pt-1 flex items-center justify-between gap-2">
          <Price
            price={price}
            discountedPrice={discountedPrice}
            discount={discount}
            size="sm"
          />
          {Number.isFinite(Number(stock)) && Number(stock) > 0 && Number(stock) <= 5 && (
            <span className="text-[10px] uppercase tracking-wider text-[#38131E]/70 font-medium">
              {stock} left
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
