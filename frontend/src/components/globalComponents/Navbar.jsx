import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useStore from "../../store/store";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { user, cart, wishlist, logout, setShowSearch } = useStore();
  const navigate = useNavigate();

  const handleLinkClick = (path) => {
    setVisible(false);
    navigate(path);
  };

  // Close desktop dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-[#fff1f4]/95 via-white/95 to-[#fff1f4]/95 border-b border-pink-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" className="h-10 sm:h-12" alt="Revakalp" />
            <span className="hidden sm:block text-xs tracking-widest text-[#c9487c]">
              CRAFTED ELEGANCE
            </span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden sm:flex gap-8 text-sm tracking-widest font-medium text-[#9c2756]">
            {["Home", "Shop", "About", "Contact"].map((item) => (
              <NavLink
                key={item}
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="relative group py-2"
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`transition-colors ${
                        isActive
                          ? "text-[#c9487c]"
                          : "text-[#9c2756] group-hover:text-[#c9487c]"
                      }`}
                    >
                      {item.toUpperCase()}
                    </span>
                    <span
                      className={`absolute left-0 -bottom-0 h-0.5 bg-[#c9487c] transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    ></span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-5">
            <div className="hidden sm:flex items-center gap-5">
              
              {/* Search */}
              <button
                onClick={() => {
                  setShowSearch(true);
                  navigate("/shop");
                }}
                className="hover:scale-110 transition-transform"
              >
                <Search className="w-5 h-5 text-[#9c2756]" />
              </button>

              {/* Wishlist */}
              <NavLink to="/wishlist" className="relative">
                <Heart className="w-5 h-5 text-[#9c2756] hover:text-[#c9487c]" />
                {wishlist?.items?.filter((i) => i.product).length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#c9487c] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {wishlist.items.filter((i) => i.product).length}
                  </span>
                )}
              </NavLink>

              {/* Cart */}
              <NavLink to="/cart" className="relative">
                <ShoppingBag className="w-5 h-5 text-[#9c2756] hover:text-[#c9487c]" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#9c2756] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {cart.length}
                  </span>
                )}
              </NavLink>

              {/* Desktop User Dropdown (Fixed) */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <div
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    className="w-8 h-8 rounded-full bg-pink-100 text-[#9c2756] flex items-center justify-center font-semibold cursor-pointer"
                  >
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg p-2">
                      <p className="px-3 py-2 text-sm text-gray-700">
                        Hi, {user.fullName}
                      </p>

                      <Link
                        to="/my-profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-3 py-2 text-sm hover:bg-pink-50 rounded-md"
                      >
                        My Profile
                      </Link>

                      {user.role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-3 py-2 text-sm hover:bg-pink-50 rounded-md"
                        >
                          Dashboard
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left text-red-500 block px-3 py-2 text-sm hover:bg-pink-50 rounded-md"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm font-medium bg-[#c9487c] text-white px-5 py-2 rounded-full shadow-lg hover:bg-[#9c2756] transition-colors"
                >
                  Login
                </button>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setVisible(true)}
              className="sm:hidden"
            >
              <Menu className="w-6 h-6 text-[#9c2756]" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU (UNCHANGED) */}
      <div
        className={`fixed inset-0 z-[100] transition-transform duration-300 ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setVisible(false)}></div>
        <div className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-gradient-to-b from-white to-[#fff8fa] p-6 shadow-xl">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold text-[#9c2756]">Menu</h2>
            <button onClick={() => setVisible(false)} className="text-[#9c2756]">
              <X className="w-7 h-7" />
            </button>
          </div>

          <nav className="flex flex-col gap-5 text-lg text-[#9c2756] font-medium">
            <button onClick={() => handleLinkClick("/")} className=" bg-white text-[#9c2756] py-3 rounded-full shadow-md border border-pink-100">Home</button>
            <button onClick={() => handleLinkClick("/shop")} className=" bg-white text-[#9c2756] py-3 rounded-full shadow-md border border-pink-100">Shop</button>
            <button onClick={() => handleLinkClick("/about")} className=" bg-white text-[#9c2756] py-3 rounded-full shadow-md border border-pink-100">About</button>
            <button onClick={() => handleLinkClick("/contact")} className=" bg-white text-[#9c2756] py-3 rounded-full shadow-md border border-pink-100">Contact</button>

            {/* Actions */}
            <div className="mt-2 space-y-3">
              <button
                onClick={() => {
                  setVisible(false);
                  setShowSearch(true);
                  navigate("/shop");
                }}
                className="w-full flex items-center justify-center gap-3 bg-white text-[#9c2756] py-3 rounded-full shadow-md border border-pink-100"
              >
                <Search size={18} /> Search
              </button>

              <button
                onClick={() => handleLinkClick("/wishlist")}
                className="w-full flex items-center justify-center gap-3 bg-white text-[#9c2756] py-3 rounded-full shadow-md border border-pink-100"
              >
                <Heart size={18} /> Wishlist ({wishlist?.items?.filter((item) => item.product).length || 0})
              </button>
              
              <button
                onClick={() => handleLinkClick("/cart")}
                className="w-full flex items-center justify-center gap-3 bg-white text-[#9c2756] py-3 rounded-full shadow-md border border-pink-100"
              >
                <ShoppingBag size={18} /> Cart ({cart.length || 0})
              </button>
            </div>

            {/* Auth */}
            <div className="mt-8 relative bottom-8 left-0 right-0 px-6 border-3 rounded-2xl px-3 bg-gray-250">
              {user ? (
                <div className="text-center">
                  <p className="text-gray-700">{user.fullName}</p>
                   <Link to="/my-profile" onClick={() => setVisible(false)} className="block w-full text-center mt-2  bg-white text-[#9c2756] py-3 rounded-full shadow-md border border-pink-100">My Profile</Link>
                  {user.role === "admin" && (
                    <Link to="/admin" onClick={() => setVisible(false)} className="block w-full text-center mt-2  bg-white text-[#9c2756] py-3 rounded-full shadow-md border border-pink-100">Dashboard</Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setVisible(false);
                    }}
                    className="mt-2  font-semibold  bg-white text-[#9c2756] py-3 rounded-full shadow-md border border-pink-100"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleLinkClick("/login")}
                  className="w-full bg-[#c9487c] text-white py-3 rounded-full shadow-lg"
                >
                  Login / Signup
                </button>
              )}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;

