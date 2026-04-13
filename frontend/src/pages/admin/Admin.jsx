import React, { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
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
} from "lucide-react";
import useStore from "../../store/store";

const Admin = () => {
  const settings = useStore((state) => state.settings);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItem =
    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition";
  const active = "bg-gray-900 text-white";
  const inactive = "text-gray-700 hover:bg-gray-100";

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0  w-64 bg-white border-r px-4 py-6 flex flex-col transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
      >
        {/* Brand and Close button */}
        <div className="flex items-center justify-between mb-10 px-2">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400">
              Admin Panel
            </p>
            <h1 className="text-xl font-semibold text-gray-900 mt-1">
              {settings?.storeName || "Revakalp"}
            </h1>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-gray-500 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `${navItem} ${isActive ? active : inactive}`
            }
          >
            <LayoutDashboard size={16} /> Dashboard
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `${navItem} ${isActive ? active : inactive}`
            }
          >
            <Package size={16} /> Products
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `${navItem} ${isActive ? active : inactive}`
            }
          >
            <ShoppingCart size={16} /> Orders
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `${navItem} ${isActive ? active : inactive}`
            }
          >
            <Users size={16} /> Users
          </NavLink>

          <NavLink
            to="/admin/collections"
            className={({ isActive }) =>
              `${navItem} ${isActive ? active : inactive}`
            }
          >
            <Layers size={16} /> Collections
          </NavLink>

          <NavLink
            to="/admin/types"
            className={({ isActive }) =>
              `${navItem} ${isActive ? active : inactive}`
            }
          >
            <List size={16} /> Types
          </NavLink>

          <NavLink
            to="/admin/coupons"
            className={({ isActive }) =>
              `${navItem} ${isActive ? active : inactive}`
            }
          >
            <Ticket size={16} /> Coupons
          </NavLink>

          <NavLink
            to="/admin/analytics"
            className={({ isActive }) =>
              `${navItem} ${isActive ? active : inactive}`
            }
          >
            <BarChart3 size={16} /> Analytics
          </NavLink>

          <NavLink
            to="/admin/images"
            className={({ isActive }) =>
              `${navItem} ${isActive ? active : inactive}`
            }
          >
            <Image size={16} /> Media
          </NavLink>

          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `${navItem} ${isActive ? active : inactive}`
            }
          >
            <Settings size={16} /> Settings
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="pt-6 border-t text-xs text-gray-400">
          © 2026 Revakalp Admin
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-8">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden text-gray-500 hover:text-gray-800"
          >
            <Menu size={24} />
          </button>
          <p className="text-sm text-gray-500 hidden md:block">
            Welcome back, Admin
          </p>

          <div className="relative">
            <img
              className="w-10 h-10 rounded-full cursor-pointer"
              src={"/smlogo.png"}
              alt="Admin Profile"
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
        ></div>
      )}
    </div>
  );
};

export default Admin;
