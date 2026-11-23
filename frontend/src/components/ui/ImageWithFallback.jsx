import React, { useState, useEffect } from "react";

export default function ImageWithFallback({
  src,
  fallbackSrc = "/category-tiles/sarees.png",
  alt = "",
  className = "",
  loading = "lazy",
  ...props
}) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

  useEffect(() => {
    setImgSrc(src || fallbackSrc);
  }, [src, fallbackSrc]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      loading={loading}
      decoding="async"
      onError={() => {
        if (imgSrc !== fallbackSrc) setImgSrc(fallbackSrc);
      }}
      className={className}
      {...props}
    />
  );
}
