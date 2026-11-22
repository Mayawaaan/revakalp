import React from "react";
import { Link } from "react-router-dom";
import { Shirt, ShoppingBag, Users } from "lucide-react";
import Title from "../../components/globalComponents/Title";

const Admin = () => {
  return (
    <section className="min-h-screen py-16 bg-[#F7F1E5]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <Title text1="ADMIN" text2="DASHBOARD" />
          <p className="text-[#1A1718]/70 mt-2 text-sm">Manage your e-commerce store.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/admin/products"
            className="group rk-surface-card p-8 hover:border-[#D4AF63] transition text-center"
          >
            <Shirt className="w-12 h-12 mx-auto mb-4 text-[#38131E] group-hover:scale-105 transition" strokeWidth={1.5} />
            <h3 className="font-serif text-2xl text-[#38131E] mb-2">Manage Products</h3>
            <p className="text-[#1A1718]/70 text-sm">
              Add, edit, or remove products from your store catalog.
            </p>
          </Link>

          <Link
            to="/admin/orders"
            className="group rk-surface-card p-8 hover:border-[#D4AF63] transition text-center"
          >
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-[#38131E] group-hover:scale-105 transition" strokeWidth={1.5} />
            <h3 className="font-serif text-2xl text-[#38131E] mb-2">View Orders</h3>
            <p className="text-[#1A1718]/70 text-sm">
              View and process customer orders and manage shipments.
            </p>
          </Link>

          <Link
            to="/admin/users"
            className="group rk-surface-card p-8 hover:border-[#D4AF63] transition text-center"
          >
            <Users className="w-12 h-12 mx-auto mb-4 text-[#38131E] group-hover:scale-105 transition" strokeWidth={1.5} />
            <h3 className="font-serif text-2xl text-[#38131E] mb-2">User Management</h3>
            <p className="text-[#1A1718]/70 text-sm">
              Manage customer accounts and their roles.
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Admin;
