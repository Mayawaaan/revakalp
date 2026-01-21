import React from 'react'
import Title from '../../components/globalComponents/Title'
import { Link } from 'react-router-dom'
import { Shirt, ShoppingBag, Users } from 'lucide-react'

const Admin = () => {
  return (
    <section className="relative min-h-screen pt-28 pb-24 bg-gradient-to-br from-[#fffafc] via-[#fff1f4] to-[#ffe6ee] overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-8">
            <div className='text-center mb-16'>
                <Title text1={'ADMIN'} text2={'DASHBOARD'} />
                <p className='text-pink-600 mt-2'>Manage your e-commerce store.</p>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
                {/* Manage Products */}
                <Link to="/admin/products" className="group block bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl hover:shadow-2xl transition duration-500 text-center">
                    <Shirt className="w-16 h-16 mx-auto mb-6 text-pink-600 group-hover:scale-110 transition" strokeWidth={1.5} />
                    <h3 className="font-serif text-xl text-pink-900 mb-3">
                        Manage Products
                    </h3>
                    <p className="text-pink-700 leading-relaxed text-sm">
                        Add, edit, or remove products from your store catalog.
                    </p>
                </Link>

                {/* View Orders */}
                <Link to="/admin/orders" className="group block bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl hover:shadow-2xl transition duration-500 text-center">
                    <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-pink-600 group-hover:scale-110 transition" strokeWidth={1.5} />
                    <h3 className="font-serif text-xl text-pink-900 mb-3">
                        View Orders
                    </h3>
                    <p className="text-pink-700 leading-relaxed text-sm">
                        View and process customer orders and manage shipments.
                    </p>
                </Link>

                {/* User Management */}
                <Link to="/admin/users" className="group block bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl hover:shadow-2xl transition duration-500 text-center">
                    <Users className="w-16 h-16 mx-auto mb-6 text-pink-600 group-hover:scale-110 transition" strokeWidth={1.5} />
                    <h3 className="font-serif text-xl text-pink-900 mb-3">
                        User Management
                    </h3>
                    <p className="text-pink-700 leading-relaxed text-sm">
                        Manage customer accounts and their roles.
                    </p>
                </Link>
            </div>
        </div>
    </section>
  )
}

export default Admin