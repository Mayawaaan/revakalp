import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useStore from "../../store/store";
import { Search, Heart, ShoppingBag, Menu, X, Sparkles } from "lucide-react";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { user, cart, wishlist, logout, setShowSearch } = useStore();
  const navigate = useNavigate();

  return (
    <>
      {/* NAVBAR */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-[#fff1f4]/95 via-white/95 to-[#fff1f4]/95 border-b border-pink-200 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" className="h-12" alt="Revakalp" />
            <span className="hidden sm:block text-xs tracking-widest text-[#c9487c]">
              CRAFTED ELEGANCE
            </span>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden sm:flex gap-10 text-[13px] tracking-widest font-medium text-[#9c2756]">
            {["Home", "Shop", "About", "Contact"].map((item) => (
              <NavLink
                key={item}
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="relative group"
              >
                <span className="group-hover:text-[#c9487c] transition">
                  {item}
                </span>
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#c9487c] group-hover:w-full transition-all"></span>
              </NavLink>
            ))}
          </ul>

          {/* Right Controls */}
          <div className="flex items-center gap-6">

            {/* Search */}
            <button
              onClick={() => { setShowSearch(true); navigate("/shop"); }}
              className="hover:scale-110 transition"
            >
              <Search className="w-5 h-5 text-[#9c2756]" />
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative">
              <Heart className="w-5 h-5 text-[#9c2756] hover:text-[#c9487c] transition" />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#c9487c] text-white text-[10px] px-1.5 rounded-full">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative">
              <ShoppingBag className="w-5 h-5 text-[#9c2756] hover:text-[#c9487c] transition" />
              <span className="absolute -top-2 -right-2 bg-[#9c2756] text-white text-[10px] px-1.5 rounded-full">
                {cart.length}
              </span>
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <span>Hi, {user.fullName}</span>
                <button onClick={logout} className="text-sm text-red-500">Logout</button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="hidden sm:flex items-center gap-2 bg-[#c9487c] text-white px-6 py-2 rounded-full shadow-lg hover:bg-[#9c2756] transition"
              >
                Login
              </button>
            )}

            {/* Mobile */}
            <button onClick={() => setVisible(true)} className="sm:hidden">
              <Menu className="w-6 h-6 text-[#9c2756]" />
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div className={`fixed inset-0 bg-gradient-to-br from-[#fff1f4] via-white to-[#ffe4ed] z-50 transition-transform duration-300 ${visible ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-10">
          <button onClick={() => setVisible(false)} className="text-[#9c2756] mb-10">
            <X className="w-8 h-8" />
          </button>

          <div className="flex flex-col gap-10 text-xl text-[#9c2756] font-medium">
            <NavLink to="/" onClick={() => setVisible(false)}>Home</NavLink>
            <NavLink to="/shop" onClick={() => setVisible(false)}>Shop</NavLink>
            <NavLink to="/about" onClick={() => setVisible(false)}>About</NavLink>
            <NavLink to="/contact" onClick={() => setVisible(false)}>Contact</NavLink>

            <button
              onClick={() => { setVisible(false); navigate("/shop"); }}
              className="mt-6 bg-[#c9487c] text-white py-3 rounded-full shadow-lg"
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;


