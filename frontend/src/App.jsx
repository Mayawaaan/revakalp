import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import useLenis from "./hooks/useLenis";
import useReducedMotion from "./components/motion/useReducedMotion";
import axiosInstance from "./utils/axiosInstance";

/* ===== Global Layout ===== */
import Navbar from "./components/globalComponents/Navbar";
import SearchBar from "./components/search/SearchBar";
import Footer from "./components/globalComponents/Footer";
import Toast from "./components/globalComponents/Toast";
import ScrollToTop from "./components/globalComponents/ScrollToTop";
import WebsiteLoader from "./components/globalComponents/WebsiteLoader";
import CookieConsentBanner from "./components/compliance/CookieConsentBanner";
import PromoPopupAd from "./components/campaigns/PromoPopupAd";

/* ===== Public & Customer Pages ===== */
import Home from "./pages/home/Home";
const Cart = lazy(() => import("./pages/navbar/cart/Cart"));
const PlaceOrder = lazy(() => import("./pages/navbar/cart/PlaceOrder"));
const Orders = lazy(() => import("./pages/tracking/Orders"));
const TrackOrder = lazy(() => import("./pages/tracking/TrackOrder"));
const Contact = lazy(() => import("./pages/contact/Contact"));
const About = lazy(() => import("./pages/about/About"));
const Login = lazy(() => import("./pages/login/Login"));
const Signup = lazy(() => import("./pages/login/Signup"));
const MyProfile = lazy(() => import("./pages/footer/MyProfile"));
const ExploreJobs = lazy(() => import("./pages/contact/ExploreJobs"));
const ForgotPassword = lazy(() => import("./pages/login/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/login/ResetPassword"));
const Wishlist = lazy(() => import("./pages/navbar/Wishlist"));
const OrderSuccess = lazy(() => import("./pages/navbar/cart/OrderSuccess"));
const NotFound = lazy(() => import("./pages/NotFound"));

/* ===== Footer Pages ===== */
const PrivacyPolicy = lazy(() => import("./pages/footer/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/footer/Terms"));
const Delivery = lazy(() => import("./pages/footer/Delivery"));
const Returns = lazy(() => import("./pages/footer/Returns"));
const FAQ = lazy(() => import("./pages/footer/FAQ"));
const GrievanceRedressal = lazy(() => import("./pages/footer/GrievanceRedressal"));
const CookiePolicy = lazy(() => import("./pages/footer/CookiePolicy"));
const LegalDisclosures = lazy(() => import("./pages/footer/LegalDisclosures"));

/* ===== Shop ===== */
const CategoryPage = lazy(() => import("./pages/shop/CategoryPage"));
const SubCategoryPage = lazy(() => import("./pages/shop/SubCategoryPage"));
const ProductListPage = lazy(() => import("./pages/shop/ProductListPage"));
const ProductDetailsPage = lazy(() => import("./pages/shop/ProductDetailsPage"));
const PastEditions = lazy(() => import("./pages/editorial/PastEditions"));
const HeritageAtlasPage = lazy(() => import("./pages/heritage/HeritageAtlasPage"));
const HeritageTraditionPage = lazy(() => import("./pages/heritage/HeritageTraditionPage"));

/* ===== Route Guards ===== */
import ProtectedRoute from "./components/globalComponents/ProtectedRoute";
import AdminProtectedRoute from "./components/globalComponents/AdminProtectedRoute";

/* ===== Code-split Admin Pages ===== */
const Admin = lazy(() => import("./pages/admin/Admin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const ManageProducts = lazy(() => import("./pages/admin/ManageProducts"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const ViewOrders = lazy(() => import("./pages/admin/ViewOrders"));
const Analytics = lazy(() => import("./pages/admin/Analytics"));
const ManageCoupons = lazy(() => import("./pages/admin/ManageCoupons"));
const Settings = lazy(() => import("./pages/admin/Settings"));
const ManageCollections = lazy(() => import("./pages/admin/ManageCollections"));
const ManageTypes = lazy(() => import("./pages/admin/ManageTypes"));
const InventoryPOS = lazy(() => import("./pages/admin/InventoryPOS"));
const ManageCMS = lazy(() => import("./pages/admin/ManageCMS"));
const ManageGrievances = lazy(() => import("./pages/admin/ManageGrievances"));

/* ===== Store ===== */
import useStore from "./store/store";

const RouteFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center bg-[#F7F1E5] text-[#38131E] text-sm tracking-[0.2em] uppercase">
    Loading…
  </div>
);

const MotionMain = motion.main;
const MotionDiv = motion.div;

const App = () => {
  useLenis();
  const location = useLocation();
  const reducedMotion = useReducedMotion();

  const {
    fetchProducts,
    fetchPublicSettings,
    fetchActiveCampaigns,
    fetchWishlist,
    fetchCart,
    initAuth,
    user,
    settings,
  } = useStore();

  const routeTransitionKey = location.pathname.startsWith("/admin")
    ? "/admin"
    : location.pathname;

  /* Load public data and restore active session */
  useEffect(() => {
    fetchProducts();
    fetchPublicSettings();
    fetchActiveCampaigns();
    initAuth(axiosInstance);
  }, [fetchProducts, fetchPublicSettings, fetchActiveCampaigns, initAuth]);

  /* Load user-dependent data */
  useEffect(() => {
    if (user) {
      fetchWishlist();
      fetchCart();
    }
  }, [user, fetchWishlist, fetchCart]);

  const isAdminOrLoginRoute =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/login");
  const maintenanceBlocked =
    Boolean(settings?.maintenanceMode) &&
    user?.role !== "admin" &&
    !isAdminOrLoginRoute;

  if (maintenanceBlocked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#2B0E17] text-[#F7F1E5] px-6 text-center space-y-5">
        <p className="text-[11px] uppercase tracking-[0.28em] text-[#F1D889]">
          {settings?.storeName || "Revakalp"} · Indore
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#F7F1E5]">
          We&apos;ll Be Right Back
        </h1>
        <p className="text-sm sm:text-base text-[#F7F1E5]/80 max-w-md leading-relaxed">
          Our online store is undergoing brief scheduled curation and updates. For
          urgent assistance, email{" "}
          <a
            href={`mailto:${settings?.supportEmail || "contact@revakalp.com"}`}
            className="text-[#F1D889] underline"
          >
            {settings?.supportEmail || "contact@revakalp.com"}
          </a>
          .
        </p>
        <a
          href="/login"
          className="text-[11px] uppercase tracking-[0.2em] text-[#D4AF63] hover:text-[#F1D889] underline"
        >
          Admin Sign In
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F1E5] text-[#1A1718]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:px-4 focus:py-2 focus:rounded-full focus:bg-[#38131E] focus:text-[#F7F1E5] focus:text-xs focus:uppercase focus:tracking-widest"
      >
        Skip to content
      </a>

      <WebsiteLoader />
      <Toast />

      {/* Subtle golden top transition accent on route changes */}
      <MotionDiv
        key={`bar-${routeTransitionKey}`}
        aria-hidden="true"
        initial={{ scaleX: 0, opacity: 0.9 }}
        animate={{ scaleX: [0, 0.72, 1], opacity: [0.95, 0.95, 0] }}
        transition={{ duration: reducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 h-[2px] z-[180] origin-left pointer-events-none"
        style={{ backgroundColor: "var(--rk-accent, #D4AF63)" }}
      />

      <Navbar />
      <ScrollToTop />
      <CookieConsentBanner />
      <PromoPopupAd />
      <SearchBar />

      <AnimatePresence mode="wait" initial={false}>
        <MotionMain
          id="main-content"
          key={routeTransitionKey}
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: reducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1"
        >
          <Suspense fallback={<RouteFallback />}>
            <Routes location={location}>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<CategoryPage />} />
            <Route path="/shop/:category" element={<SubCategoryPage />} />
            <Route path="/shop/:category/:type" element={<ProductListPage />} />
            <Route path="/product/:productId" element={<ProductDetailsPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/heritage" element={<HeritageAtlasPage />} />
            <Route path="/heritage/:slug" element={<HeritageTraditionPage />} />
            <Route path="/textile-atlas" element={<HeritageAtlasPage />} />
            <Route path="/past-editions" element={<PastEditions />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/explore-jobs" element={<ExploreJobs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<Terms />} />
            <Route path="/delivery-information" element={<Delivery />} />
            <Route path="/shipping-policy" element={<Delivery />} />
            <Route path="/returns-exchanges" element={<Returns />} />
            <Route path="/cancellation-refund-policy" element={<Returns />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/grievance-redressal" element={<GrievanceRedressal />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/legal-compliance" element={<LegalDisclosures />} />

            {/* User Protected */}
            <Route element={<ProtectedRoute />}>
              <Route path="/place-order" element={<PlaceOrder />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/track/:orderId" element={<TrackOrder />} />
              <Route path="/my-profile" element={<MyProfile />} />
              <Route path="/wishlist" element={<Wishlist />} />
            </Route>

            {/* Admin Protected */}
            <Route element={<AdminProtectedRoute />}>
              <Route path="/admin" element={<Admin />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<ManageProducts />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="orders" element={<ViewOrders />} />
                <Route path="collections" element={<ManageCollections />} />
                <Route path="coupons" element={<ManageCoupons />} />
                <Route path="types" element={<ManageTypes />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="inventory" element={<InventoryPOS />} />
                <Route path="cms" element={<ManageCMS />} />
                <Route path="grievances" element={<ManageGrievances />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>

            {/* Catch All 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        </MotionMain>
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default App;
