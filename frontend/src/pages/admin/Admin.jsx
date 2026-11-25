import React, { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Layers,
  Ticket,
  List,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  Store,
  Megaphone,
  MessageSquareWarning,
  ExternalLink,
} from "lucide-react";
import useStore from "../../store/store";
import useAuth from "../../hooks/useAuth";
import useBodyScrollLock from "../../hooks/useBodyScrollLock";
import useReducedMotion from "../../components/motion/useReducedMotion";
import BrandMark from "../../components/brand/BrandMark";
import ThemeSwitcher from "../../components/theme/ThemeSwitcher";

const navLinks = [
  { to: "/admin", end: true, icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/cms", icon: Megaphone, label: "Campaigns & Ads" },
  { to: "/admin/products", icon: Package, label: "Products" },
  { to: "/admin/inventory", icon: Store, label: "Inventory / POS" },
  { to: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { to: "/admin/collections", icon: Layers, label: "Collections" },
  { to: "/admin/types", icon: List, label: "Types" },
  { to: "/admin/coupons", icon: Ticket, label: "Coupons" },
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/grievances", icon: MessageSquareWarning, label: "Grievances" },
  { to: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/admin/settings", icon: Settings, label: "Settings & Theme" },
];

const MotionDiv = motion.div;

const Admin = () => {
  const settings = useStore((state) => state.settings);
  const { handleLogout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const reducedMotion = useReducedMotion();

  useBodyScrollLock(sidebarOpen);

  const storeName = settings?.storeName || "Revakalp";

  return (
    <div className="flex min-h-screen bg-[#F7F1E5] text-[#1A1718]">
      <AnimatePresence>
        {sidebarOpen && (
          <MotionDiv
            key="admin-mobile-backdrop"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.18 }}
            className="fixed inset-0 z-40 bg-[#1A1718]/50 backdrop-blur-xs md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-[#2B0E17] text-[#F7F1E5] border-r border-[#D4AF63]/25 shadow-2xl transform transition-transform duration-300 ease-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 md:z-auto`}
      >
        <div className="flex items-center justify-between px-5 pt-6 pb-5 border-b border-[#D4AF63]/20">
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-[0.26em] text-[#F1D889] font-semibold">
              Admin Command Center
            </p>
            <BrandMark variant="headerDark" className="h-5 w-auto" />
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close admin sidebar"
            className="md:hidden text-[#F7F1E5]/75 hover:text-[#F1D889] p-1 cursor-pointer transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav
          data-lenis-prevent=""
          className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overscroll-contain scrollbar-hide"
          aria-label="Admin navigation"
        >
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-[#F1D889]"
                      : "text-[#F7F1E5]/80 hover:bg-white/10 hover:text-[#F7F1E5] hover:translate-x-0.5"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <MotionDiv
                        layoutId={reducedMotion ? undefined : "admin-sidebar-active-pill"}
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 32,
                        }}
                        className="absolute inset-0 rounded-xl bg-[#38131E] border border-[#D4AF63]/50 shadow-sm"
                      />
                    )}
                    <Icon size={16} className="relative z-10 shrink-0" />
                    <span className="relative z-10">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="px-3 pb-6 pt-4 border-t border-[#D4AF63]/20">
          <button
            type="button"
            onClick={handleLogout}
            className="rk-admin-btn w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-[#F7F1E5]/85 hover:bg-white/10 hover:text-[#F1D889] cursor-pointer"
          >
            <LogOut size={16} />
            Logout
          </button>
          <p className="text-[10px] text-[#F7F1E5]/45 text-center mt-4">
            © {new Date().getFullYear()} {storeName}
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="relative sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-[#38131E]/12 flex items-center justify-between px-4 md:px-8 gap-2">
          <MotionDiv
            key={`admin-sweep-${location.pathname}`}
            aria-hidden="true"
            initial={reducedMotion ? false : { scaleX: 0, opacity: 0.9 }}
            animate={{ scaleX: [0, 0.78, 1], opacity: [0.9, 0.9, 0] }}
            transition={{
              duration: reducedMotion ? 0 : 0.42,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="pointer-events-none absolute top-0 left-0 right-0 h-[2px] bg-[#D4AF63] origin-left"
          />
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open admin sidebar"
            className="md:hidden text-[#38131E] p-1 cursor-pointer"
          >
            <Menu size={22} />
          </button>

          <p className="hidden md:block text-sm text-[#1A1718]/70 font-medium">
            Welcome back, <span className="text-[#38131E] font-semibold">Admin</span>
          </p>

          <div className="flex items-center gap-2 sm:gap-2.5 ml-auto">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-full border border-[#38131E]/20 bg-[#F7F1E5] text-[#38131E] text-xs font-semibold hover:border-[#D4AF63] transition-colors"
            >
              <span>View Live Site</span>
              <ExternalLink size={12} />
            </Link>

            <ThemeSwitcher />

            <div className="flex items-center gap-2 bg-[#F7F1E5] border border-[#D4AF63]/50 rounded-full px-3 py-1.5">
              <div className="w-6 h-6 rounded-full bg-[#38131E] flex items-center justify-center">
                <span className="text-[#F1D889] text-[10px] font-bold">A</span>
              </div>
              <span className="text-xs text-[#38131E] font-semibold hidden sm:block">
                Admin
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <AnimatePresence mode="wait" initial={false}>
            <MotionDiv
              key={location.pathname}
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{
                duration: reducedMotion ? 0 : 0.18,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Outlet />
            </MotionDiv>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Admin;
