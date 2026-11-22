import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Layers,
  Ticket,
  List,
  BarChart3,
  Image,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import useStore from "../../store/store";
import useAuth from "../../hooks/useAuth";
import BrandMark from "../../components/brand/BrandMark";

const navLinks = [
  { to: "/admin", end: true, icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/products", icon: Package, label: "Products" },
  { to: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/collections", icon: Layers, label: "Collections" },
  { to: "/admin/types", icon: List, label: "Types" },
  { to: "/admin/coupons", icon: Ticket, label: "Coupons" },
  { to: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/admin/images", icon: Image, label: "Media" },
  { to: "/admin/settings", icon: Settings, label: "Settings" },
];

const Admin = () => {
  const settings = useStore((state) => state.settings);
  const { handleLogout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const storeName = settings?.storeName || "Revakalp";

  return (
    <div className="flex min-h-screen bg-[#F7F1E5] text-[#1A1718]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#1A1718]/50 backdrop-blur-xs md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-[#2B0E17] text-[#F7F1E5] border-r border-[#D4AF63]/25 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 md:z-auto`}
      >
        <div className="flex items-center justify-between px-5 pt-6 pb-5 border-b border-[#D4AF63]/20">
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-[0.26em] text-[#F1D889] font-semibold">
              Admin Panel
            </p>
            <BrandMark variant="headerDark" className="h-5 w-auto" />
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close admin sidebar"
            className="md:hidden text-[#F7F1E5]/75 hover:text-[#F1D889] p-1 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide" aria-label="Admin navigation">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#38131E] text-[#F1D889] border border-[#D4AF63]/50 shadow-sm"
                      : "text-[#F7F1E5]/80 hover:bg-white/10 hover:text-[#F7F1E5]"
                  }`
                }
              >
                <Icon size={16} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="px-3 pb-6 pt-4 border-t border-[#D4AF63]/20">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-[#F7F1E5]/85 hover:bg-white/10 hover:text-[#F1D889] transition-colors cursor-pointer"
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
        <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-[#38131E]/12 flex items-center justify-between px-4 md:px-8">
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

          <div className="flex items-center gap-2 bg-[#F7F1E5] border border-[#D4AF63]/50 rounded-full px-3 py-1.5">
            <div className="w-6 h-6 rounded-full bg-[#38131E] flex items-center justify-center">
              <span className="text-[#F1D889] text-[10px] font-bold">A</span>
            </div>
            <span className="text-xs text-[#38131E] font-semibold hidden sm:block">Admin</span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Admin;
