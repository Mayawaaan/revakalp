import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import useStore from "../../store/store";
import ProductItem from "../../components/products/ProductItem";
import PageHero from "../../components/globalComponents/PageHero";
import EmptyState from "../../components/ui/EmptyState";
import LoadingSkeleton from "../../components/ui/LoadingSkeleton";

const Wishlist = () => {
  const { wishlist, wishlistLoading } = useStore();
  const validItems = (wishlist?.items || []).filter((i) => i.product);

  return (
    <div className="min-h-screen bg-[#F7F1E5]">
      <PageHero
        label="Saved Pieces"
        title="My Wishlist"
        subtitle="Your saved silhouettes, ready whenever you decide to bring them home."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {wishlistLoading ? (
          <LoadingSkeleton count={4} />
        ) : validItems.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            description="Save sarees, lehengas, menswear, or printed tees you love while browsing."
            actionLabel="Browse Collections"
            actionTo="/shop"
          />
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm text-[#38131E]">
                <span className="font-semibold">{validItems.length}</span>{" "}
                {validItems.length === 1 ? "piece" : "pieces"} saved
              </p>
              <Link
                to="/shop"
                className="text-xs uppercase tracking-[0.18em] font-semibold text-[#38131E] border-b border-[#D4AF63] pb-0.5"
              >
                + Explore More
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
              {validItems.map((item) => (
                <ProductItem
                  key={item.product._id}
                  id={item.product._id}
                  hideOutOfStock={false}
                  {...item.product}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
