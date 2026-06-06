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

const navLinks = [
  { to: "/admin",           end: true,  icon: LayoutDashboard, label: "Dashboard"   },
  { to: "/admin/products",              icon: Package,          label: "Products"    },
  { to: "/admin/orders",                icon: ShoppingCart,     label: "Orders"      },
  { to: "/admin/users",                 icon: Users,            label: "Users"       },
  { to: "/admin/collections",           icon: Layers,           label: "Collections" },
  { to: "/admin/types",                 icon: List,             label: "Types"       },
  { to: "/admin/coupons",               icon: Ticket,           label: "Coupons"     },
  { to: "/admin/analytics",             icon: BarChart3,        label: "Analytics"   },
  { to: "/admin/images",                icon: Image,            label: "Media"       },
  { to: "/admin/settings",              icon: Settings,         label: "Settings"    },
];

const Admin = () => {
  const settings  = useStore((state) => state.settings);
  const { handleLogout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const storeName = settings?.storeName || "Revakalp";

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#fffafc] via-[#fff1f4] to-[#ffe6ee]">

      {/* ── MOBILE OVERLAY ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ══════════════ SIDEBAR ══════════════ */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 flex flex-col
          bg-gradient-to-b from-[#7b1c3e] via-[#9d2a52] to-[#c9487c]
          shadow-2xl
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:z-auto
        `}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 pt-7 pb-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-pink-200/70 font-medium">
              Admin Panel
            </p>
            <h1 className="text-xl font-serif text-white mt-1 tracking-wide">
              {storeName}
            </h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-pink-200 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Divider */}
        <div className="mx-5 h-px bg-white/10 mb-4" />

        {/* Nav links */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto scrollbar-hide">
          {navLinks.map(({ to, end, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive
                  ? "bg-white/20 text-white shadow-lg backdrop-blur-sm ring-1 ring-white/20"
                  : "text-pink-100/80 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer / Logout */}
        <div className="px-3 pb-6 pt-4">
          <div className="mx-2 h-px bg-white/10 mb-4" />
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-pink-100/80 hover:bg-white/10 hover:text-white transition-all duration-200"
          >
            <LogOut size={16} />
            Logout
          </button>
          <p className="text-[10px] text-pink-200/40 text-center mt-4">
            © {new Date().getFullYear()} {storeName}
          </p>
        </div>
      </aside>

      {/* ══════════════ MAIN ══════════════ */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-white/70 backdrop-blur-xl border-b border-pink-100 flex items-center justify-between px-4 md:px-8 shadow-sm">
          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-pink-700 hover:text-pink-900 transition"
          >
            <Menu size={22} />
          </button>

          {/* Title breadcrumb area */}
          <p className="hidden md:block text-sm text-pink-500 font-medium tracking-wide">
            Welcome back, <span className="text-pink-800">Admin</span>
          </p>

          {/* Avatar / Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-pink-50 border border-pink-200 rounded-full px-3 py-1.5">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#c9487c] to-[#7b1c3e] flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">A</span>
              </div>
              <span className="text-xs text-pink-800 font-medium hidden sm:block">Admin</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Admin;
