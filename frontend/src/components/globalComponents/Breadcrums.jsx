import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Breadcrums = ({ product }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <div className='flex items-center gap-2 text-sm text-gray-500 my-4 uppercase'>
      <Link to='/' className='hover:text-black'>HOME</Link>
      {product ? (
         <>
            <span>/</span>
            <Link to='/collections' className='hover:text-black'>COLLECTIONS</Link>
            <span>/</span>
            <span>{product.category}</span>
            <span>/</span>
            <span className='text-gray-700 font-medium'>{product.name}</span>
         </>
      ) : (
        pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            const displayName = value.replace(/-/g, ' ');
            return (
            <React.Fragment key={to}>
                <span>/</span>
                {isLast ? (
                <span className='text-gray-700 font-medium'>{displayName}</span>
                ) : (
                <Link to={to} className='hover:text-black'>{displayName}</Link>
                )}
            </React.Fragment>
            );
        })
      )}
    </div>
  )
}

export default Breadcrums