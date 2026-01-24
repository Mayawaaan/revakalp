import React from "react";
import useStore from "../../store/store";
import { Link } from "react-router-dom";
import { Heart, Eye } from "lucide-react";

const ProductItem = ({ id, image, name, price, onQuickView }) => {
  const { currency, wishlist, addToWishlist, removeFromWishlist } = useStore();
  const isWishlisted = wishlist.some((item) => (item._id || item.id) === id);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    if (isWishlisted) {
      removeFromWishlist(id);
    } else {
      addToWishlist(id);
    }
  };

  // console.log("one==========",id,name)

  return (
    <Link to={`/product/${id}`} className="group block">
      <div className="relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur-xl shadow-lg hover:shadow-2xl transition duration-500">

        {/* Image */}
        <div className="overflow-hidden rounded-3xl">
          <img
            src={image[0]}
            alt={name}
            className="w-full h-[340px] object-cover transition duration-700 group-hover:scale-110"
          />
        </div>

        {/* Soft overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition"></div>

        {/* Wishlist */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg hover:scale-110 transition"
        >
          <Heart
            className={`w-5 h-5 transition ${
              isWishlisted
                ? "fill-[#c9487c] text-[#c9487c]"
                : "text-[#9c2756]"
            }`}
          />
        </button>

        {/* Quick View */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onQuickView(id);
            }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full text-sm text-[#9c2756] shadow-xl opacity-0 group-hover:opacity-100 transition flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Quick View
          </button>
        )}
      </div>

      {/* Info */}
      <div className="mt-5 text-center">
        <p className="text-[#9c2756] font-medium leading-tight truncate">
          {name}
        </p>
        <p className="mt-2 text-lg text-[#c9487c] font-semibold">
          {currency}{price}
        </p>
      </div>
    </Link>
  );
};

export default ProductItem;

