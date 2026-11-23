import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Search, Heart, ShoppingBag, Menu, User as UserIcon, ChevronDown } from "lucide-react";
import useStore from "../../store/store";
import axios from "../../utils/axiosInstance";
import BrandMark from "../brand/BrandMark";
import AnnouncementBar from "./AnnouncementBar";
import MegaMenu from "./MegaMenu";
import MobileNav from "./MobileNav";

export default function Header({ tone }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const dropdownRef = useRef(null);
  const headerRef = useRef(null);

  const {
    user,
    cart,
    wishlist,
    logout,
    setShowSearch,
    showToast,
    collections,
    sareeTypes,
  } = useStore();

  const navigate = useNavigate();
  const location = useLocation();

  const isDarkHeroRoute =
    location.pathname === "/" || location.pathname.startsWith("/heritage");

  useEffect(() => {
    const onScroll = () => {
      setScrolledPastHero(window.scrollY > 48);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  const isDark =
    tone === "dark" ||
    (tone !== "light" && isDarkHeroRoute && !scrolledPastHero && !activeMegaMenu);

  const wishlistCount = wishlist?.items?.filter((i) => i.product)?.length || 0;
  const cartCount = cart?.length || 0;

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
    setActiveMegaMenu(null);
  }, [location.pathname, location.search]);

  // Close desktop dropdown & megamenu when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setActiveMegaMenu(null);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setUserMenuOpen(false);
        setActiveMegaMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleNavigate = useCallback(
    (path) => {
      setMobileOpen(false);
      setActiveMegaMenu(null);
      navigate(path);
    },
    [navigate]
  );

  const handleLogout = useCallback(async () => {
    try {
      await axios.post("/api/auth/logout");
    } catch {
      // Clear local session regardless of server logout response
    }
    logout();
    setUserMenuOpen(false);
    setMobileOpen(false);
    showToast("Logged out successfully", "success");
    navigate("/");
  }, [logout, navigate, showToast]);

  const navTextCls = isDark
    ? "text-[#F7F1E5]/92 hover:text-[#F1D889]"
    : "text-[#38131E] hover:text-[#2B0E17]";
  const iconCls = isDark
    ? "text-[#F7F1E5] hover:text-[#F1D889] hover:bg-white/10"
    : "text-[#38131E] hover:text-[#2B0E17] hover:bg-[#38131E]/8";
  const badgeCls = isDark
    ? "bg-[#D4AF63] text-[#2B0E17] border-[#F1D889]"
    : "bg-[#38131E] text-[#F1D889] border-[#D4AF63]/60";

  return (
    <div ref={headerRef} className="sticky top-0 z-40">
      <AnnouncementBar />

      <header
        className={`relative border-b transition-colors duration-300 ${
          isDark
            ? "bg-[#2B0E17]/88 backdrop-blur-md border-[#D4AF63]/25 text-[#F7F1E5]"
            : "bg-[#F7F1E5]/96 backdrop-blur-md border-[#D4AF63]/30 text-[#38131E]"
        }`}
        onMouseLeave={() => setActiveMegaMenu(null)}
      >
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 xl:px-8 h-14 sm:h-[72px] flex items-center justify-between gap-2 lg:gap-4">
          {/* Official Brand Logo */}
          <Link
            to="/"
            aria-label="REVAKALP Home"
            className="flex items-center shrink-0 py-1"
          >
            <BrandMark
              variant={isDark ? "headerDark" : "headerLight"}
              className="h-5 sm:h-6 xl:h-7 w-auto shrink-0"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Primary storefront navigation"
            className="hidden lg:flex items-center justify-center gap-2.5 xl:gap-5 2xl:gap-6 text-[10px] xl:text-[11px] tracking-[0.1em] xl:tracking-[0.15em] uppercase font-medium"
          >
            <div className="relative" onMouseEnter={() => setActiveMegaMenu("sarees")}>
              <Link
                to="/shop/saree"
                onFocus={() => setActiveMegaMenu("sarees")}
                className={`inline-flex items-center gap-0.5 xl:gap-1 py-2 border-b transition-colors whitespace-nowrap ${
                  location.pathname.startsWith("/shop/saree")
                    ? "border-[#D4AF63]"
                    : "border-transparent hover:border-[#D4AF63]/60"
                } ${navTextCls}`}
              >
                <span>Sarees</span>
                <ChevronDown className="w-3 h-3 xl:w-3.5 xl:h-3.5 opacity-70 shrink-0" />
              </Link>
            </div>

            <NavLink
              to="/shop/lehenga/all"
              className={({ isActive }) =>
                `py-2 border-b transition-colors whitespace-nowrap ${
                  isActive ? "border-[#D4AF63]" : "border-transparent hover:border-[#D4AF63]/60"
                } ${navTextCls}`
              }
            >
              Lehengas
            </NavLink>

            <NavLink
              to="/shop/indo-western/all"
              className={({ isActive }) =>
                `py-2 border-b transition-colors whitespace-nowrap ${
                  isActive ? "border-[#D4AF63]" : "border-transparent hover:border-[#D4AF63]/60"
                } ${navTextCls}`
              }
            >
              Indo-Western
            </NavLink>

            <div className="relative" onMouseEnter={() => setActiveMegaMenu("men")}>
              <button
                type="button"
                aria-expanded={activeMegaMenu === "men"}
                onClick={() =>
                  setActiveMegaMenu((prev) => (prev === "men" ? null : "men"))
                }
                onFocus={() => setActiveMegaMenu("men")}
                className={`inline-flex items-center gap-0.5 xl:gap-1 py-2 border-b transition-colors uppercase tracking-[0.1em] xl:tracking-[0.15em] whitespace-nowrap cursor-pointer ${
                  location.pathname.startsWith("/shop/printed-tees") ||
                  location.pathname.startsWith("/shop/suit") ||
                  location.pathname.startsWith("/shop/kurta") ||
                  location.pathname.startsWith("/shop/jodhpuri")
                    ? "border-[#D4AF63]"
                    : "border-transparent hover:border-[#D4AF63]/60"
                } ${navTextCls}`}
              >
                <span>Men</span>
                <ChevronDown className="w-3 h-3 xl:w-3.5 xl:h-3.5 opacity-70 shrink-0" />
              </button>
            </div>

            <div className="relative" onMouseEnter={() => setActiveMegaMenu("heritage")}>
              <NavLink
                to="/heritage"
                onFocus={() => setActiveMegaMenu("heritage")}
                className={({ isActive }) =>
                  `inline-flex items-center gap-0.5 xl:gap-1 py-2 border-b transition-colors whitespace-nowrap ${
                    isActive || location.pathname.startsWith("/heritage")
                      ? "border-[#D4AF63] text-[#F1D889]"
                      : "border-transparent hover:border-[#D4AF63]/60"
                  } ${navTextCls}`
                }
              >
                <span>Heritage</span>
                <ChevronDown className="w-3 h-3 xl:w-3.5 xl:h-3.5 opacity-70 shrink-0" />
              </NavLink>
            </div>

            <div className="relative" onMouseEnter={() => setActiveMegaMenu("collections")}>
              <NavLink
                to="/shop"
                end
                onFocus={() => setActiveMegaMenu("collections")}
                className={({ isActive }) =>
                  `inline-flex items-center gap-0.5 xl:gap-1 py-2 border-b transition-colors whitespace-nowrap ${
                    isActive ? "border-[#D4AF63]" : "border-transparent hover:border-[#D4AF63]/60"
                  } ${navTextCls}`
                }
              >
                <span>Collections</span>
                <ChevronDown className="w-3 h-3 xl:w-3.5 xl:h-3.5 opacity-70 shrink-0" />
              </NavLink>
            </div>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `py-2 border-b transition-colors whitespace-nowrap ${
                  isActive ? "border-[#D4AF63]" : "border-transparent hover:border-[#D4AF63]/60"
                } ${navTextCls}`
              }
            >
              Our Store
            </NavLink>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-0.5 sm:gap-1.5 xl:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowSearch(true)}
              aria-label="Open product search"
              className={`w-9 h-9 sm:w-11 sm:h-11 rounded-[2px] flex items-center justify-center transition-colors cursor-pointer ${iconCls}`}
            >
              <Search className="w-[18px] h-[18px]" strokeWidth={1.65} />
            </button>

            <NavLink
              to="/wishlist"
              aria-label={`Wishlist (${wishlistCount} saved items)`}
              className={`relative w-9 h-9 sm:w-11 sm:h-11 rounded-[2px] flex items-center justify-center transition-colors ${iconCls}`}
            >
              <Heart className="w-[18px] h-[18px]" strokeWidth={1.65} />
              {wishlistCount > 0 && (
                <span
                  className={`absolute top-1 right-1 sm:top-1.5 sm:right-1.5 text-[10px] font-semibold min-w-[16px] h-4 px-1 flex items-center justify-center rounded-[2px] border ${badgeCls}`}
                >
                  {wishlistCount}
                </span>
              )}
            </NavLink>

            <NavLink
              to="/cart"
              aria-label={`Shopping bag (${cartCount} items)`}
              className={`relative w-9 h-9 sm:w-11 sm:h-11 rounded-[2px] flex items-center justify-center transition-colors ${iconCls}`}
            >
              <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.65} />
              {cartCount > 0 && (
                <span
                  className={`absolute top-1 right-1 sm:top-1.5 sm:right-1.5 text-[10px] font-semibold min-w-[16px] h-4 px-1 flex items-center justify-center rounded-[2px] border ${badgeCls}`}
                >
                  {cartCount}
                </span>
              )}
            </NavLink>

            {/* Desktop Account Menu */}
            <div className="hidden lg:block relative ml-1" ref={dropdownRef}>
              {user ? (
                <>
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    aria-expanded={userMenuOpen}
                    aria-label="Account menu"
                    className={`w-10 h-10 rounded-[2px] border flex items-center justify-center text-sm font-semibold cursor-pointer transition-colors ${
                      isDark
                        ? "bg-[#38131E] text-[#F1D889] border-[#D4AF63]/65 hover:bg-[#D4AF63] hover:text-[#2B0E17]"
                        : "bg-[#38131E] text-[#F1D889] border-[#D4AF63]/50 hover:bg-[#2B0E17]"
                    }`}
                  >
                    {user.fullName?.charAt(0)?.toUpperCase() || <UserIcon className="w-4 h-4" />}
                  </button>

                  {userMenuOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 top-full mt-2 w-56 bg-[#FBF7EE] border border-[#D4AF63]/45 rounded-[2px] shadow-2xl p-2 text-[#1A1718] z-50"
                    >
                      <div className="px-3 py-2.5 border-b border-[#38131E]/10 mb-1">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#38131E]/60">
                          Signed in as
                        </p>
                        <p className="text-sm font-semibold text-[#38131E] truncate">
                          {user.fullName}
                        </p>
                      </div>

                      <Link
                        to="/my-profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-3 py-2 text-xs uppercase tracking-[0.14em] hover:bg-[#EFE6D5] text-[#38131E]"
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-3 py-2 text-xs uppercase tracking-[0.14em] hover:bg-[#EFE6D5] text-[#38131E]"
                      >
                        My Orders
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-3 py-2 text-xs uppercase tracking-[0.14em] hover:bg-[#EFE6D5] text-[#38131E]"
                      >
                        Wishlist
                      </Link>

                      {user.role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-3 py-2 text-xs uppercase tracking-[0.14em] hover:bg-[#EFE6D5] font-semibold text-[#38131E]"
                        >
                          Admin Panel
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left mt-1 px-3 py-2 text-xs uppercase tracking-[0.14em] text-[#38131E] font-medium hover:bg-[#38131E] hover:text-[#F7F1E5] transition-colors cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to="/login"
                  className={`inline-flex items-center justify-center min-h-[38px] xl:min-h-[40px] px-3.5 xl:px-5 py-2 rounded-[2px] text-[10.5px] xl:text-[11px] uppercase tracking-[0.16em] xl:tracking-[0.18em] font-medium border transition-colors ${
                    isDark
                      ? "bg-[#D4AF63] text-[#2B0E17] border-[#D4AF63] hover:bg-[#F1D889]"
                      : "bg-[#38131E] text-[#F7F1E5] border-[#38131E] hover:bg-[#2B0E17] hover:border-[#D4AF63]"
                  }`}
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Drawer Trigger */}
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileOpen}
              className={`lg:hidden inline-flex items-center justify-center gap-1.5 h-9 sm:h-10 px-2.5 sm:px-3 rounded-[2px] border transition-colors cursor-pointer ${
                isDark
                  ? "border-[#D4AF63]/45 text-[#F7F1E5] hover:bg-white/10"
                  : "border-[#38131E]/25 text-[#38131E] hover:bg-[#38131E]/8"
              }`}
            >
              <Menu className="w-5 h-5" />
              <span className="text-[10px] uppercase tracking-[0.16em] font-semibold hidden min-[370px]:inline">
                Menu
              </span>
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Quick Navigation Strip */}
        <nav
          aria-label="Mobile quick navigation"
          className={`lg:hidden border-t overflow-x-auto scrollbar-hide ${
            isDark
              ? "border-[#D4AF63]/20 bg-[#2B0E17]/95"
              : "border-[#38131E]/10 bg-[#F7F1E5]/95"
          }`}
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-6 h-10 flex items-center gap-4 sm:gap-6 text-[10.5px] uppercase tracking-[0.18em] font-medium whitespace-nowrap">
            <NavLink
              to="/shop/saree"
              className={({ isActive }) =>
                `py-1 border-b transition-colors ${
                  isActive || location.pathname.startsWith("/shop/saree")
                    ? "border-[#D4AF63]"
                    : "border-transparent"
                } ${navTextCls}`
              }
            >
              Sarees
            </NavLink>
            <NavLink
              to="/shop/lehenga/all"
              className={({ isActive }) =>
                `py-1 border-b transition-colors ${
                  isActive ? "border-[#D4AF63]" : "border-transparent"
                } ${navTextCls}`
              }
            >
              Lehengas
            </NavLink>
            <NavLink
              to="/shop/indo-western/all"
              className={({ isActive }) =>
                `py-1 border-b transition-colors ${
                  isActive ? "border-[#D4AF63]" : "border-transparent"
                } ${navTextCls}`
              }
            >
              Indo-Western
            </NavLink>
            <NavLink
              to="/shop/printed-tees/all"
              className={({ isActive }) =>
                `py-1 border-b transition-colors ${
                  isActive ||
                  location.pathname.startsWith("/shop/printed-tees") ||
                  location.pathname.startsWith("/shop/suit") ||
                  location.pathname.startsWith("/shop/kurta") ||
                  location.pathname.startsWith("/shop/jodhpuri")
                    ? "border-[#D4AF63]"
                    : "border-transparent"
                } ${navTextCls}`
              }
            >
              Men
            </NavLink>
            <NavLink
              to="/heritage"
              className={({ isActive }) =>
                `py-1 border-b transition-colors ${
                  isActive || location.pathname.startsWith("/heritage")
                    ? "border-[#D4AF63]"
                    : "border-transparent"
                } ${navTextCls}`
              }
            >
              Heritage
            </NavLink>
            <NavLink
              to="/shop"
              end
              className={({ isActive }) =>
                `py-1 border-b transition-colors ${
                  isActive ? "border-[#D4AF63]" : "border-transparent"
                } ${navTextCls}`
              }
            >
              Collections
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `py-1 border-b transition-colors ${
                  isActive ? "border-[#D4AF63]" : "border-transparent"
                } ${navTextCls}`
              }
            >
              Our Store
            </NavLink>
          </div>
        </nav>

        {/* Desktop MegaMenu */}
        <MegaMenu
          activeMenu={activeMegaMenu}
          collections={collections}
          sareeTypes={sareeTypes}
          onClose={() => setActiveMegaMenu(null)}
        />
      </header>

      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onOpenSearch={() => setShowSearch(true)}
        onNavigate={handleNavigate}
        user={user}
        onLogout={handleLogout}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        sareeTypes={sareeTypes}
      />
    </div>
  );
}
