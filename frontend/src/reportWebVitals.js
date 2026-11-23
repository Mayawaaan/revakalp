const reportWebVitals = (onPerfEntry) => {
  if (typeof onPerfEntry === "function") {
    import("web-vitals")
      .then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
        if (typeof onCLS === "function") onCLS(onPerfEntry);
        if (typeof onINP === "function") onINP(onPerfEntry);
        if (typeof onFCP === "function") onFCP(onPerfEntry);
        if (typeof onLCP === "function") onLCP(onPerfEntry);
        if (typeof onTTFB === "function") onTTFB(onPerfEntry);
      })
      .catch(() => {
        // Ignore web-vitals dynamic import failures
      });
  }
};

export default reportWebVitals;

