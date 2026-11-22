import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import useLenis from "./hooks/useLenis";
import axiosInstance from "./utils/axiosInstance";

/* ===== Global Layout ===== */
import Navbar from "./components/globalComponents/Navbar";
import SearchBar from "./components/search/SearchBar";
import Footer from "./components/globalComponents/Footer";
import Toast from "./components/globalComponents/Toast";
import ScrollToTop from "./components/globalComponents/ScrollToTop";
import WebsiteLoader from "./components/globalComponents/WebsiteLoader";

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

/* ===== Shop ===== */
const CategoryPage = lazy(() => import("./pages/shop/CategoryPage"));
const SubCategoryPage = lazy(() => import("./pages/shop/SubCategoryPage"));
const ProductListPage = lazy(() => import("./pages/shop/ProductListPage"));
const ProductDetailsPage = lazy(() => import("./pages/shop/ProductDetailsPage"));

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
const ImageManagement = lazy(() => import("./pages/admin/ImageManagement"));
const Settings = lazy(() => import("./pages/admin/Settings"));
const ManageCollections = lazy(() => import("./pages/admin/ManageCollections"));
const ManageTypes = lazy(() => import("./pages/admin/ManageTypes"));

/* ===== Store ===== */
import useStore from "./store/store";

const RouteFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center bg-[#F7F1E5] text-[#38131E] text-sm tracking-[0.2em] uppercase">
    Loading…
  </div>
);

const App = () => {
  useLenis();

  const {
    fetchProducts,
    fetchPublicSettings,
    fetchWishlist,
    fetchCart,
    initAuth,
    user,
  } = useStore();

  /* Load public data and restore active session */
  useEffect(() => {
    fetchProducts();
    fetchPublicSettings();
    initAuth(axiosInstance);
  }, [fetchProducts, fetchPublicSettings, initAuth]);

  /* Load user-dependent data */
  useEffect(() => {
    if (user) {
      fetchWishlist();
      fetchCart();
    }
  }, [user, fetchWishlist, fetchCart]);

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
      <Navbar />
      <ScrollToTop />
      <SearchBar />

      <main id="main-content" className="flex-1">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<CategoryPage />} />
            <Route path="/shop/:category" element={<SubCategoryPage />} />
            <Route path="/shop/:category/:type" element={<ProductListPage />} />
            <Route path="/product/:productId" element={<ProductDetailsPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/explore-jobs" element={<ExploreJobs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<Terms />} />
            <Route path="/delivery-information" element={<Delivery />} />
            <Route path="/returns-exchanges" element={<Returns />} />
            <Route path="/faq" element={<FAQ />} />

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
                <Route path="images" element={<ImageManagement />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>

            {/* Catch All 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
};

export default App;
