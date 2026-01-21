import React from "react";
import useStore from "../../store/store";
import Title from "../../components/globalComponents/Title";
import ProductItem from "../../components/products/ProductItem";

const Wishlist = () => {
  const { wishlist } = useStore();

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

        {wishlist.length === 0 ? (
          <div className="text-center text-pink-600 py-24">
            Your wishlist is empty. Start saving beautiful pieces you love.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {wishlist.map((item) => (
              <div
                className="bg-white p-3 rounded-2xl shadow-sm hover:shadow-xl transition"
              >
                <ProductItem
                  key={item._id}
                  id={item._id}
                  name={item.name}
                  price={item.price}
                  image={item.image}
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

