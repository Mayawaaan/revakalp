import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

/* ===== Global Layout ===== */
import Navbar from "./components/globalComponents/Navbar";
import SearchBar from "./components/search/SearchBar";
import Footer from "./components/globalComponents/Footer";
import Toast from "./components/globalComponents/Toast";
import ScrollToTop from "./components/globalComponents/ScrollToTop";

/* ===== Pages ===== */
import Home from "./pages/home/Home";
import Cart from "./pages/navbar/cart/Cart";
import PlaceOrder from "./pages/navbar/cart/PlaceOrder";
import Orders from "./pages/tracking/Orders";
import TrackOrder from "./pages/tracking/TrackOrder";
import Contact from "./pages/contact/Contact";
import About from "./pages/about/About";
import Login from "./pages/login/Login";
import Signup from "./pages/login/Signup";
import MyProfile from "./pages/footer/MyProfile";
import ExploreJobs from "./pages/contact/ExploreJobs";
import Wishlist from "./pages/navbar/Wishlist";

/* ===== Footer Pages ===== */
import PrivacyPolicy from "./pages/footer/PrivacyPolicy";
import Terms from "./pages/footer/Terms";
import Delivery from "./pages/footer/Delivery";
import Returns from "./pages/footer/Returns";
import FAQ from "./pages/footer/FAQ";

/* ===== Shop ===== */
import CategoryPage from "./pages/shop/CategoryPage";
import SubCategoryPage from "./pages/shop/SubCategoryPage";
import ProductListPage from "./pages/shop/ProductListPage";
import ProductDetailsPage from "./pages/shop/ProductDetailsPage";

/* ===== Admin ===== */
import Admin from "./pages/admin/Admin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageProducts from "./pages/admin/ManageProducts";
import UserManagement from "./pages/admin/UserManagement";
import ViewOrders from "./pages/admin/ViewOrders";
import Analytics from "./pages/admin/Analytics";
import ManageCoupons from "./pages/admin/ManageCoupons";
import ImageManagement from "./pages/admin/ImageManagement";
import Settings from "./pages/admin/Settings";
import ManageCollections from "./pages/admin/ManageCollections";
import ManageTypes from "./pages/admin/ManageTypes";

/* ===== Routes ===== */
import ProtectedRoute from "./components/globalComponents/ProtectedRoute";
import AdminProtectedRoute from "./components/globalComponents/AdminProtectedRoute";

/* ===== Store ===== */
import useStore from "./store/store";

const App = () => {
  const {
    fetchProducts,
    fetchPublicSettings,
    fetchWishlist,
    fetchCart,
    user,
  } = useStore();

  /* Load public data */
  useEffect(() => {
    fetchProducts();
    fetchPublicSettings();
  }, []);

  /* Load user-dependent data */
  useEffect(() => {
    if (user) {
      fetchWishlist();
      fetchCart(); // ✅ CRITICAL: sync cart from backend
    }
  }, [user]);

  return (
    <div>
      <Toast />
      <Navbar />
      <ScrollToTop />
      <SearchBar />

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
        <Route path="/explore-jobs" element={<ExploreJobs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<Terms />} />
        <Route path="/delivery-information" element={<Delivery />} />
        <Route path="/returns-exchanges" element={<Returns />} />
        <Route path="/faq" element={<FAQ />} />

        {/* User Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/place-order" element={<PlaceOrder />} />
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
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
