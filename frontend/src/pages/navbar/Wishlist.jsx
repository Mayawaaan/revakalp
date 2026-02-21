import React from "react";
import useStore from "../../store/store";
import Title from "../../components/globalComponents/Title";
import ProductItem from "../../components/products/ProductItem";

const Wishlist = () => {
  const { wishlist, wishlistLoading } = useStore();

  return (
    <section className="bg-[#FFF1F4] min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-12">
          <Title text1={"MY"} text2={"WISHLIST"} />
          <p className="text-pink-600 mt-2">
            Your favorite pieces, waiting to become yours.
          </p>
        </div>

        {wishlistLoading ? (
          <div className="text-center text-pink-600 py-24">Loading your wishlist...</div>
        ) : !wishlist || wishlist.items.length === 0 ? (
          <div className="text-center text-pink-600 py-24">
            Your wishlist is empty. Start saving beautiful pieces you love.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.items.filter(item => item.product).map((item) => (
              <div
                key={item.product._id}
                className="bg-white p-3 rounded-2xl shadow-sm hover:shadow-xl transition"
              >
                <ProductItem
                  id={item.product._id}
                  name={item.product.name}
                  price={item.product.price}
                  image={item.product.image}
                />
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default Wishlist;

