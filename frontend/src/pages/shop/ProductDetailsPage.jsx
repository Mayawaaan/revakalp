import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Star,
  Heart,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ArrowRight,
} from "lucide-react";
import useStore from "../../store/store";
import { apiFetch } from "../../hooks/useApiHelper";
import Breadcrums from "../../components/globalComponents/Breadcrums";
import Price from "../../components/ui/Price";
import EditorialButton from "../../components/ui/EditorialButton";
import EmptyState from "../../components/ui/EmptyState";
import RelatedProducts from "../../components/products/RelatedProducts";
import Reviews from "../../components/reviews/Reviews";
import { useSeoMeta } from "../../utils/seo";
import { trackEvent } from "../../utils/analytics";
import { getEffectivePrice } from "../../config/storefrontCategories";
import { findTraditionForProduct } from "../../data/heritageTraditions";

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const {
    products,
    loading: storeLoading,
    user,
    cart,
    wishlist,
    addToCart,
    incrementQuantity,
    addToWishlist,
    removeFromWishlist,
    fetchReviews,
    reviews,
    settings,
    showToast,
  } = useStore();

  const [fetchedProduct, setFetchedProduct] = useState(null);
  const [fetchingSingle, setFetchingSingle] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50, active: false });
  const [submitting, setSubmitting] = useState(false);

  const productFromStore = useMemo(
    () => (products || []).find((p) => (p._id || p.id) === productId),
    [products, productId]
  );
  const product = productFromStore || fetchedProduct;

  // Deep-link fallback fetch if product isn't already in store
  useEffect(() => {
    setActiveIndex(0);
    setSelectedSize("");
    setQuantity(1);
    setFetchedProduct(null);

    if (!productId || productFromStore) return undefined;
    let cancelled = false;
    setFetchingSingle(true);
    apiFetch(`/api/products/${productId}`)
      .then((data) => {
        if (!cancelled && data && (data._id || data.id)) {
          setFetchedProduct(data);
        }
      })
      .catch(() => {
        // Handled cleanly by not-found state
      })
      .finally(() => {
        if (!cancelled) setFetchingSingle(false);
      });

    return () => {
      cancelled = true;
    };
  }, [productId, productFromStore]);

  // Fetch live reviews
  useEffect(() => {
    if (productId) {
      fetchReviews(productId);
    }
  }, [productId, fetchReviews]);

  // Auto-select single size when product requires sizes
  useEffect(() => {
    if (product?.hasSizes && product?.sizes?.length === 1) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product?.hasSizes, product?.sizes]);

  // Lightbox Escape & Arrow keyboard navigation
  const images = useMemo(() => {
    const raw = product?.image || product?.images || [];
    return Array.isArray(raw) ? raw.filter(Boolean) : raw ? [raw] : [];
  }, [product]);

  const availableStock = useMemo(() => {
    if (!product) return 0;
    return Math.max(0, (Number(product.stock) || 0) - (Number(product.reserved) || 0));
  }, [product]);

  const seoJsonLd = useMemo(() => {
    if (!product) return null;
    const resolved = product._id || product.id;
    const effective = getEffectivePrice(product);
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description || undefined,
      image: images.length ? images : undefined,
      sku: product.sku || resolved,
      category: product.category || undefined,
      brand: { "@type": "Brand", name: "REVAKALP" },
      offers: {
        "@type": "Offer",
        priceCurrency: "INR",
        price: effective,
        availability:
          availableStock > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        url: origin ? `${origin}/product/${resolved}` : undefined,
      },
    };
  }, [product, images, availableStock]);

  useSeoMeta({
    title: product?.name || "Product Details",
    description: product?.description
      ? String(product.description).slice(0, 155)
      : "Discover Revakalp ethnic wear, sarees, lehengas, and festive silhouettes.",
    canonicalPath: productId ? `/product/${productId}` : undefined,
    jsonLd: seoJsonLd,
  });

  useEffect(() => {
    if (!product) return;
    const resolved = product._id || product.id;
    trackEvent("view_item", {
      item_id: resolved,
      item_name: product.name,
      item_category: product.category || undefined,
      price: getEffectivePrice(product),
      available: availableStock,
    });
    if (availableStock <= 0) {
      trackEvent("stock_unavailable", {
        item_id: resolved,
        item_name: product.name,
      });
    }
  }, [product, availableStock]);

  useEffect(() => {
    if (!lightboxOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight" && images.length > 1) {
        setActiveIndex((prev) => (prev + 1) % images.length);
      }
      if (e.key === "ArrowLeft" && images.length > 1) {
        setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [lightboxOpen, images.length]);

  if ((storeLoading || fetchingSingle) && !product) {
    return (
      <div className="min-h-[70vh] bg-[#F7F1E5] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 animate-pulse">
          <div className="aspect-[3/4] rounded-3xl bg-[#38131E]/10" />
          <div className="space-y-4 py-8">
            <div className="h-4 w-32 bg-[#38131E]/10 rounded" />
            <div className="h-10 w-3/4 bg-[#38131E]/15 rounded" />
            <div className="h-6 w-28 bg-[#D4AF63]/30 rounded" />
            <div className="h-24 w-full bg-[#38131E]/8 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] bg-[#F7F1E5] flex items-center justify-center px-4 py-16">
        <EmptyState
          title="Product not found"
          description="This item may no longer be listed in our catalog. Explore our current collections instead."
          actionLabel="Browse Collections"
          actionTo="/shop"
        />
      </div>
    );
  }

  const resolvedId = product._id || product.id;
  const {
    name,
    description = "",
    price,
    discount = 0,
    discountedPrice,
    category,
    subCategory,
    type,
    print,
    state: regionState,
    exclusivity,
    hasSizes,
    sizes = [],
    bestseller,
  } = product;

  const numericStock = availableStock;
  const isOutOfStock = numericStock <= 0;
  const isOnePiece = numericStock === 1;
  const activeImage = images[activeIndex] || images[0] || "";

  const isWishlisted = wishlist?.items?.some(
    (item) => (item.product?._id || item.product) === resolvedId
  );

  // Real derived review rating (never fabricated)
  const reviewCount = Array.isArray(reviews) ? reviews.length : 0;
  const averageRating =
    reviewCount > 0
      ? (
          reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) /
          reviewCount
        ).toFixed(1)
      : null;

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

  const handleToggleWishlist = () => {
    if (!user) {
      showToast("Please sign in to save items to your wishlist", "info");
      navigate("/login");
      return;
    }
    if (isWishlisted) {
      removeFromWishlist(resolvedId);
    } else {
      addToWishlist(resolvedId);
      trackEvent("add_to_wishlist", {
        item_id: resolvedId,
        item_name: name,
      });
    }
  };

  const addSelectionToCart = async (redirectPath) => {
    if (isOutOfStock) {
      showToast("This piece is currently out of stock", "error");
      return;
    }
    if (!user) {
      showToast("Please sign in to add items to your bag", "info");
      navigate("/login");
      return;
    }
    if (hasSizes && !selectedSize) {
      showToast("Please select a size", "error");
      return;
    }

    const sizeToUse = hasSizes ? selectedSize : "NO_SIZE";
    const existingQty =
      cart?.find((i) => i._id === resolvedId && i.size === sizeToUse)?.quantity || 0;
    if (existingQty + quantity > numericStock) {
      showToast(
        isOnePiece
          ? "Only one piece of this creation is available"
          : `Only ${numericStock} available in stock`,
        "error"
      );
      return;
    }

    setSubmitting(true);
    try {
      await addToCart(resolvedId, sizeToUse);
      for (let i = 1; i < quantity; i++) {
        await incrementQuantity(resolvedId, sizeToUse);
      }
      trackEvent("add_to_cart", {
        item_id: resolvedId,
        item_name: name,
        price: getEffectivePrice(product),
        quantity,
        size: sizeToUse,
      });
      showToast(
        redirectPath === "/place-order" ? "Proceeding to checkout" : "Added to bag",
        "success"
      );
      navigate(redirectPath);
    } catch (err) {
      showToast(err?.message || "Could not add item to bag", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleThumbKeyDown = (e, idx) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((idx + 1) % images.length);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((idx - 1 + images.length) % images.length);
    }
  };

  const freeThreshold = settings?.freeShippingThreshold;
  const currencySym = settings?.currencySymbol || "₹";
  const matchedTradition = findTraditionForProduct(product);

  return (
    <div className="bg-[#F7F1E5] min-h-screen pt-6 pb-28 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrums product={product} />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ── GALLERY ── */}
          <div className="lg:col-span-6 flex flex-col-reverse md:flex-row gap-4">
            {images.length > 1 && (
              <div
                role="tablist"
                aria-label="Product image thumbnails"
                className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-1 md:pb-0"
              >
                {images.map((img, i) => {
                  const selected = i === activeIndex;
                  return (
                    <button
                      key={`${img}-${i}`}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-label={`View image ${i + 1} of ${images.length}`}
                      onClick={() => setActiveIndex(i)}
                      onKeyDown={(e) => handleThumbKeyDown(e, i)}
                      className={`w-16 h-20 sm:w-20 sm:h-24 shrink-0 rounded-[2px] overflow-hidden border-2 transition-all cursor-pointer ${
                        selected
                          ? "border-[#38131E] ring-1 ring-[#D4AF63]"
                          : "border-[#38131E]/15 opacity-75 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${name} view ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Main Image with Interactive Hover Zoom & Lightbox */}
            <div className="relative flex-1 rounded-[2px] overflow-hidden bg-[#EFE6D5] border border-[#38131E]/14">
              {badgeText && (
                <span className="pointer-events-none absolute top-3 left-3 sm:top-4 sm:left-4 z-10 bg-[#2B0E17] text-[#F1D889] text-[10px] uppercase tracking-[0.2em] font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-[2px] border border-[#D4AF63]/45">
                  {badgeText}
                </span>
              )}

              <span className="pointer-events-none hidden md:inline-block absolute bottom-4 left-4 z-10 px-2.5 py-1 rounded-[2px] bg-[#2B0E17]/75 text-[#F1D889] text-[10px] uppercase tracking-[0.18em] border border-[#D4AF63]/35">
                Hover to zoom in
              </span>

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous product image"
                    onClick={() =>
                      setActiveIndex((prev) => (prev - 1 + images.length) % images.length)
                    }
                    className="lg:hidden absolute left-2.5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-[2px] bg-[#F7F1E5]/90 border border-[#38131E]/22 flex items-center justify-center text-[#38131E] cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next product image"
                    onClick={() => setActiveIndex((prev) => (prev + 1) % images.length)}
                    className="lg:hidden absolute right-2.5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-[2px] bg-[#F7F1E5]/90 border border-[#38131E]/22 flex items-center justify-center text-[#38131E] cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <span className="lg:hidden pointer-events-none absolute bottom-3 left-3 z-10 px-2.5 py-1 rounded-[2px] bg-[#2B0E17]/82 text-[#F1D889] text-[10px] font-mono tracking-wider border border-[#D4AF63]/40">
                    {activeIndex + 1} / {images.length}
                  </span>
                </>
              )}

              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                aria-label="Open full-size image zoom"
                className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-[2px] bg-[#F7F1E5]/92 border border-[#38131E]/22 flex items-center justify-center text-[#38131E] hover:bg-[#38131E] hover:text-[#F1D889] transition-colors shadow-sm cursor-pointer"
              >
                <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  setZoomOrigin({ x, y, active: true });
                }}
                onMouseLeave={() => setZoomOrigin((prev) => ({ ...prev, active: false }))}
                onClick={() => setLightboxOpen(true)}
                className="relative aspect-[9/16] w-full overflow-hidden cursor-zoom-in bg-[#F7F1E5]/40"
              >
                {activeImage && (
                  <img
                    src={activeImage}
                    alt={name}
                    style={{
                      transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                    }}
                    className={`w-full h-full object-contain transition-transform duration-300 ${
                      zoomOrigin.active ? "md:scale-150" : "scale-100"
                    }`}
                  />
                )}
              </div>
            </div>
          </div>

          {/* ── PRODUCT INFO ── */}
          <div className="lg:col-span-6 space-y-6 bg-[#FBF7EE] border border-[#38131E]/14 rounded-[2px] p-4 sm:p-8 lg:p-10">
            <div>
              <p className="uppercase tracking-[0.24em] text-[11px] font-medium text-[#38131E]/65 mb-2">
                {[category, subCategory, type].filter(Boolean).join(" · ")}
              </p>

              <h1 className="font-serif text-2xl sm:text-4xl lg:text-[2.6rem] text-[#38131E] leading-tight">
                {name}
              </h1>

              {/* Authentic Review Summary (no fabricated stars) */}
              <div className="mt-3 flex items-center gap-3 text-xs sm:text-sm">
                {averageRating ? (
                  <a
                    href="#reviews"
                    className="inline-flex items-center gap-2 text-[#38131E] hover:underline"
                  >
                    <span className="inline-flex items-center gap-1 font-semibold">
                      <Star className="w-4 h-4 text-[#D4AF63] fill-[#D4AF63]" />
                      {averageRating}
                    </span>
                    <span className="text-[#1A1718]/65">
                      ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
                    </span>
                  </a>
                ) : (
                  <a href="#reviews" className="text-[#1A1718]/60 hover:text-[#38131E]">
                    No customer reviews yet
                  </a>
                )}
                <span className="text-[#D4AF63]">•</span>
                <span
                  className={`font-medium ${
                    isOutOfStock ? "text-red-700" : "text-[#38131E]"
                  }`}
                >
                  {isOutOfStock
                    ? "Out of Stock"
                    : isOnePiece
                    ? "Only 1 piece left"
                    : numericStock <= 5
                    ? `Only ${numericStock} left`
                    : "In Stock"}
                </span>
              </div>
            </div>

            <div className="py-2 border-y border-[#38131E]/10">
              <Price
                price={price}
                discountedPrice={discountedPrice}
                discount={discount}
                size="lg"
                showSavings
              />
              <p className="mt-1 text-xs text-[#1A1718]/55">
                Inclusive of applicable taxes
              </p>
            </div>

            {/* Sizes (only when hasSizes is true) */}
            {hasSizes && sizes?.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#38131E] mb-3">
                  Select Size
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {sizes.map((size) => {
                    const active = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        aria-pressed={active}
                        className={`min-h-[44px] min-w-[52px] px-4 py-2 text-sm font-medium rounded-[2px] border transition-all cursor-pointer ${
                          active
                            ? "bg-[#38131E] text-[#F7F1E5] border-[#38131E]"
                            : "bg-[#F7F1E5]/70 border-[#38131E]/25 text-[#38131E] hover:border-[#38131E]"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            {!isOutOfStock && (
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#38131E]">
                  Quantity
                </span>
                <div className="inline-flex items-center rounded-[2px] border border-[#38131E]/25 bg-[#F7F1E5]/70">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-11 h-11 flex items-center justify-center text-[#38131E] disabled:opacity-40 cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-[#38131E]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    disabled={quantity >= numericStock}
                    onClick={() => setQuantity((q) => Math.min(numericStock, q + 1))}
                    className="w-11 h-11 flex items-center justify-center text-[#38131E] disabled:opacity-40 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <EditorialButton
                variant="primary"
                disabled={isOutOfStock || submitting}
                onClick={() => addSelectionToCart("/cart")}
                className="flex-1"
              >
                {isOutOfStock ? "Out of Stock" : submitting ? "Adding…" : "Add to Bag"}
              </EditorialButton>

              <EditorialButton
                variant="secondary"
                disabled={isOutOfStock || submitting}
                onClick={() => addSelectionToCart("/place-order")}
                className="flex-1"
              >
                Buy Now
              </EditorialButton>

              <button
                type="button"
                onClick={handleToggleWishlist}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                aria-pressed={Boolean(isWishlisted)}
                className={`min-h-[46px] px-4 rounded-[2px] border flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  isWishlisted
                    ? "bg-[#38131E] text-[#F1D889] border-[#38131E]"
                    : "bg-white text-[#38131E] border-[#38131E]/30 hover:border-[#38131E]"
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
                <span className="sm:hidden text-xs uppercase tracking-wider font-medium">
                  {isWishlisted ? "Saved" : "Save"}
                </span>
              </button>
            </div>

            {/* Product Details & Metadata */}
            <div className="pt-4 border-t border-[#38131E]/10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-[#38131E]">
                Product Details
              </h2>
              <div className="space-y-2 text-sm text-[#1A1718]/80 leading-relaxed">
                {description
                  .split("\n")
                  .map(
                    (line, index) =>
                      line.trim() && <p key={index}>{line}</p>
                  )}
              </div>

              <div className="pt-3 space-y-3">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#38131E]/75">
                  Fabric &amp; Care
                </h3>
                {(() => {
                  const specs = product.specs || {};
                  const includedValue =
                    specs.includedPieces ||
                    (typeof specs.blouseIncluded === "boolean"
                      ? specs.blouseIncluded
                        ? "Includes unstitched blouse piece"
                        : "Blouse piece not included"
                      : "");
                  const rows = [
                    { label: "Fabric", value: specs.fabric },
                    { label: "Weave & Pattern", value: specs.weave || print },
                    { label: "Length", value: specs.length },
                    { label: "What's Included", value: includedValue },
                    { label: "Origin", value: specs.provenance || regionState },
                    { label: "Care", value: specs.care },
                    { label: "Weight", value: specs.gsm },
                    { label: "Alterations", value: specs.alterationNotes },
                    {
                      label: "Country of Origin",
                      value: settings?.countryOfOriginDefault || "India",
                    },
                    {
                      label: "Seller",
                      value: settings?.legalEntityName
                        ? `${settings.legalEntityName}, Indore, Madhya Pradesh`
                        : "Revakalp, Indore, Madhya Pradesh",
                    },
                  ].filter((r) => Boolean(r.value && String(r.value).trim()));

                  return (
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {rows.map((row) => (
                        <div
                          key={row.label}
                          className="rounded-[2px] bg-[#F7F1E5] border border-[#38131E]/12 px-4 py-3"
                        >
                          <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#38131E]/70">
                            {row.label}
                          </dt>
                          <dd className="mt-1 text-xs sm:text-sm font-medium text-[#1A1718]">
                            {row.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  );
                })()}
              </div>
            </div>

            {/* Matched Textile Heritage Lineage Link */}
            {matchedTradition && (
              <Link
                to={`/heritage/${matchedTradition.slug}`}
                className="flex items-center justify-between gap-4 p-4 rounded-[2px] bg-[#2B0E17] text-[#F7F1E5] border border-[#D4AF63]/45 hover:border-[#F1D889] transition-colors"
              >
                <div className="space-y-0.5">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#F1D889]">
                    Behind the Weave
                  </p>
                  <p className="font-serif text-lg">
                    Read about {matchedTradition.name} history &amp; care
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#F1D889] shrink-0" />
              </Link>
            )}

            {/* Policy Notes (strictly aligned with store policy) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-[2px] bg-[#F7F1E5] border border-[#38131E]/12 text-center">
                <p className="text-xs font-medium text-[#38131E]">Checked by hand</p>
              </div>
              <div className="p-3.5 rounded-[2px] bg-[#F7F1E5] border border-[#38131E]/12 text-center">
                <p className="text-xs font-medium text-[#38131E]">
                  {Number.isFinite(Number(freeThreshold))
                    ? `Free shipping over ${currencySym}${freeThreshold}`
                    : "Ships across India"}
                </p>
              </div>
              <div className="p-3.5 rounded-[2px] bg-[#F7F1E5] border border-[#38131E]/12 text-center">
                <p className="text-xs font-medium text-[#38131E]">
                  7-day returns (unboxing video)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts
          category={category}
          subCategory={subCategory}
          currentId={resolvedId}
        />

        {/* Reviews */}
        <div id="reviews" className="mt-16 sm:mt-20">
          <Reviews productId={resolvedId} />
        </div>
      </div>

      {/* Lightbox Zoom Modal */}
      {lightboxOpen && activeImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Product image zoom"
          className="fixed inset-0 z-[105] bg-[#1A1718]/90 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close zoomed view"
            className="absolute top-5 right-5 w-11 h-11 rounded-[2px] bg-[#F7F1E5] text-[#38131E] flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={() =>
                  setActiveIndex((prev) => (prev - 1 + images.length) % images.length)
                }
                className="absolute left-4 sm:left-8 w-11 h-11 rounded-[2px] bg-[#F7F1E5]/90 text-[#38131E] flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={() => setActiveIndex((prev) => (prev + 1) % images.length)}
                className="absolute right-4 sm:right-8 w-11 h-11 rounded-[2px] bg-[#F7F1E5]/90 text-[#38131E] flex items-center justify-center cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          <img
            src={activeImage}
            alt={`${name} enlarged view`}
            className="max-h-[88vh] max-w-[92vw] object-contain rounded-[2px] shadow-2xl"
          />
        </div>
      )}

      {/* Sticky Mobile Purchase Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-[#F7F1E5]/96 backdrop-blur-md border-t border-[#D4AF63]/45 px-3.5 pt-2.5 pb-safe flex items-center justify-between gap-2.5">
        <div className="min-w-0 flex-1">
          <p className="text-[9.5px] uppercase tracking-[0.16em] text-[#38131E]/65 truncate">
            {name}
          </p>
          <Price
            price={price}
            discountedPrice={discountedPrice}
            discount={discount}
            size="sm"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!isOutOfStock && (
            <EditorialButton
              variant="secondary"
              disabled={submitting}
              onClick={() => addSelectionToCart("/place-order")}
              className="px-3 min-[380px]:px-4 py-2 min-h-[42px] text-[10px] tracking-[0.12em] shrink-0"
            >
              Buy Now
            </EditorialButton>
          )}
          <EditorialButton
            variant="primary"
            disabled={isOutOfStock || submitting}
            onClick={() => addSelectionToCart("/cart")}
            className="px-3.5 min-[380px]:px-5 py-2 min-h-[42px] text-[10px] tracking-[0.12em] shrink-0"
          >
            {isOutOfStock ? "Out of Stock" : submitting ? "Adding…" : "Add to Bag"}
          </EditorialButton>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
