import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-6xl md:text-8xl font-serif text-[#c9487c] mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Page Not Found</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        We're sorry, the page you requested could not be found. Please go back to the homepage.
      </p>
      <Link 
        to="/" 
        className="bg-[#c9487c] text-white px-8 py-3 rounded-md hover:bg-pink-800 transition-colors shadow-sm font-semibold"
      >
        BACK TO HOME
      </Link>
    </div>
  );
};

export default NotFound;
