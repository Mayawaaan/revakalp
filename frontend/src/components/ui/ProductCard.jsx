import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Eye, ArrowUpRight } from "lucide-react";
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
  reserved = 0,
  category,
  subCategory,
  type,
  state,
  bestseller,
  exclusivity,
  onQuickView,
  hideOutOfStock = true,
}) {
  const productId = id || _id;
  const { user, wishlist, addToWishlist, removeFromWishlist, showToast } =
    useStore();
  const navigate = useNavigate();

  const hasNumericStock = stock !== undefined && stock !== null && Number.isFinite(Number(stock));
  const availableStock = hasNumericStock
    ? Math.max(0, (Number(stock) || 0) - (Number(reserved) || 0))
    : 1;
  const isOutOfStock = stock === 0 || stock === null || (hasNumericStock && availableStock <= 0);
  if (hideOutOfStock && isOutOfStock) return null;

  const isOnePiece = hasNumericStock && availableStock === 1;

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

  const badgeText = isOnePiece
    ? "Only 1 piece left"
    : Number(discount) > 0
    ? `${Math.round(discount)}% OFF`
    : bestseller
    ? "Bestseller"
    : exclusivity && String(exclusivity).toLowerCase() !== "false"
    ? String(exclusivity) === "true"
      ? "Exclusive"
      : String(exclusivity)
    : null;

  return (
    <article data-reveal="card" className="group flex flex-col">
      {/* Architectural Plate Frame */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-[2px] bg-[#EFE6D5] border border-[#38131E]/12 group-hover:border-[#D4AF63] transition-colors duration-500">
        <Link
          to={`/product/${productId}`}
          aria-label={`View ${name}`}
          className="block w-full h-full"
        >
          <ImageWithFallback
            src={primaryImage}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          {hoverImage && hoverImage !== primaryImage && (
            <ImageWithFallback
              src={hoverImage}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            />
          )}
        </Link>

        {/* Minimal Status Tag */}
        {badgeText && (
          <span className="pointer-events-none absolute top-2 left-2 sm:top-3 sm:left-3 max-w-[calc(100%-3.25rem)] truncate bg-[#2B0E17]/92 text-[#F1D889] text-[9px] sm:text-[10px] font-semibold tracking-[0.14em] sm:tracking-[0.18em] uppercase px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-[2px] border border-[#D4AF63]/45">
            {badgeText}
          </span>
        )}

        {isOutOfStock && !hideOutOfStock && (
          <span className="pointer-events-none absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-[#1A1718]/90 text-[#F7F1E5] text-[9px] sm:text-[10px] font-medium tracking-[0.14em] sm:tracking-[0.18em] uppercase px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-[2px]">
            Sold Out
          </span>
        )}

        {/* Minimal Wishlist Trigger */}
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label={isWishlisted ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
          aria-pressed={Boolean(isWishlisted)}
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 sm:w-10 sm:h-10 rounded-[2px] border flex items-center justify-center transition-colors cursor-pointer z-10 ${
            isWishlisted
              ? "bg-[#38131E] text-[#F1D889] border-[#D4AF63]"
              : "bg-[#F7F1E5]/88 backdrop-blur-xs text-[#38131E] border-[#38131E]/18 hover:bg-[#38131E] hover:text-[#F1D889]"
          }`}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? "fill-current" : ""}`} />
        </button>

        {/* Slide-up Architectural Curtain CTA (Desktop Hover) */}
        <div className="pointer-events-none hidden sm:flex items-center justify-between gap-2 absolute inset-x-0 bottom-0 px-3.5 py-2.5 bg-[#2B0E17]/88 backdrop-blur-xs border-t border-[#D4AF63]/35 text-[#F7F1E5] translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
          <Link
            to={`/product/${productId}`}
            className="pointer-events-auto inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-[#F1D889] hover:text-[#F7F1E5]"
          >
            <span>View Piece</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          {onQuickView && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onQuickView(productId);
              }}
              className="pointer-events-auto inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.16em] text-[#F7F1E5]/85 hover:text-[#F1D889] cursor-pointer"
            >
              <Eye className="w-3 h-3" /> Quick View
            </button>
          )}
        </div>
      </div>

      {/* Borderless Editorial Metadata Caption */}
      <div className="pt-2.5 sm:pt-3.5 pb-1 flex flex-col gap-1 sm:gap-1.5">
        {(category || state || subCategory || type) && (
          <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.16em] sm:tracking-[0.22em] text-[#38131E]/60 truncate">
            {[category, state || subCategory || type].filter(Boolean).join(" · ")}
          </p>
        )}

        <Link to={`/product/${productId}`} className="block">
          <h3 className="font-serif text-[15px] sm:text-xl text-[#38131E] leading-snug line-clamp-2 group-hover:text-[#2B0E17] transition-colors">
            {name}
          </h3>
        </Link>

        <div className="pt-0.5 flex flex-wrap items-baseline justify-between gap-1 sm:gap-2">
          <Price
            price={price}
            discountedPrice={discountedPrice}
            discount={discount}
            size="sm"
          />
          {hasNumericStock && availableStock > 1 && availableStock <= 5 && (
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.12em] sm:tracking-[0.16em] text-[#38131E]/70 font-medium">
              Only {availableStock} left
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
