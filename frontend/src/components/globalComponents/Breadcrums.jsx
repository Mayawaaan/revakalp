import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrums = ({ product }) => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-2 text-xs tracking-[0.18em] text-[#38131E]/65 my-3 uppercase"
    >
      <Link to="/" className="hover:text-[#38131E] transition-colors">
        Home
      </Link>
      {product ? (
        <>
          <span aria-hidden="true" className="text-[#D4AF63]">/</span>
          <Link to="/shop" className="hover:text-[#38131E] transition-colors">
            Shop
          </Link>
          {product.category && (
            <>
              <span aria-hidden="true" className="text-[#D4AF63]">/</span>
              <span>{product.category}</span>
            </>
          )}
          <span aria-hidden="true" className="text-[#D4AF63]">/</span>
          <span className="text-[#38131E] font-medium truncate max-w-[220px] sm:max-w-xs">
            {product.name}
          </span>
        </>
      ) : (
        pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          const displayName = decodeURIComponent(value).replace(/-/g, " ");
          return (
            <React.Fragment key={to}>
              <span aria-hidden="true" className="text-[#D4AF63]">/</span>
              {isLast ? (
                <span className="text-[#38131E] font-medium">{displayName}</span>
              ) : (
                <Link to={to} className="hover:text-[#38131E] transition-colors">
                  {displayName}
                </Link>
              )}
            </React.Fragment>
          );
        })
      )}
    </nav>
  );
};

export default Breadcrums;
