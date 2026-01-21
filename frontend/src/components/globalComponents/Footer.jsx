import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Linkedin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className='bg-white text-pink-800 py-16 px-6 border-t-2 border-pink-100'>
        <div className='max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10'>
            
            {/* About */}
            <div className='md:col-span-1'>
                <Link to='/' className='text-3xl font-serif text-pink-700'>Revakalp <span className='text-sm text-pink-800'>&trade;</span></Link>
                <p className='mt-4 text-pink-600 text-sm leading-relaxed'>
                    Woven with grace, for the modern woman. Discover timeless sarees that tell a story.
                </p>
                <div className='flex gap-4 mt-6'>
                    <a href="#" target="_blank" rel="noopener noreferrer" className='opacity-70 hover:opacity-100 transition'><Facebook className='w-6 h-6' /></a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className='opacity-70 hover:opacity-100 transition'><Twitter className='w-6 h-6' /></a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className='opacity-70 hover:opacity-100 transition'><Linkedin className='w-6 h-6' /></a>
                </div>
            </div>

            {/* Information */}
            <div>
                <h4 className='font-serif text-lg mb-4'>INFORMATION</h4>
                <ul className='space-y-3 text-sm text-pink-600'>
                    <li><Link to="/about" className='hover:text-pink-800 transition'>About Us</Link></li>
                    <li><Link to="/contact" className='hover:text-pink-800 transition'>Contact Us</Link></li>
                    <li><Link to="/delivery-information" className='hover:text-pink-800 transition'>Delivery Information</Link></li>
                    <li><Link to="/track-order" className='hover:text-pink-800 transition'>Track Order</Link></li>
                    <li><Link to="/faq" className='hover:text-pink-800 transition'>FAQ</Link></li>
                </ul>
            </div>

            {/* Policy */}
            <div>
                <h4 className='font-serif text-lg mb-4'>POLICY</h4>
                <ul className='space-y-3 text-sm text-pink-600'>
                    <li><Link to="/privacy-policy" className='hover:text-pink-800 transition'>Privacy Policy</Link></li>
                    <li><Link to="/terms-conditions" className='hover:text-pink-800 transition'>Terms & Conditions</Link></li>
                    <li><Link to="/returns-exchanges" className='hover:text-pink-800 transition'>Returns & Exchanges</Link></li>
                </ul>
            </div>

            {/* Account */}
            <div>
                <h4 className='font-serif text-lg mb-4'>MY ACCOUNT</h4>
                <ul className='space-y-3 text-sm text-pink-600'>
                    <li><Link to="/my-profile" className='hover:text-pink-800 transition'>My Profile</Link></li>
                    <li><Link to="/wishlist" className='hover:text-pink-800 transition'>Wishlist</Link></li>
                    <li><Link to="/cart" className='hover:text-pink-800 transition'>View Cart</Link></li>
                    <li><Link to="/orders" className='hover:text-pink-800 transition'>My Orders</Link></li>
                </ul>
            </div>

        </div>
        <div className='text-center mt-16 border-t border-pink-200 pt-8'>
            <p className='text-pink-500 text-sm'>© {new Date().getFullYear()} Revakalp. All Rights Reserved. <br /> Designed and Developed by <a className='font-bold text-pink-600 underline italic' href="https://www.zsyio.com">ZSYIO</a></p>
        </div>
    </footer>
  )
}

export default Footer