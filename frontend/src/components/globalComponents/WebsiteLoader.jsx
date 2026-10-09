import React, { useEffect, useState } from "react";

const WebsiteLoader = () => {
  const [loading, setLoading] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // This timer controls when the fade-out starts. 
    const timer = setTimeout(() => {
      setFadingOut(true);
      // Remove from the DOM completely after the fade CSS transition (500ms) ends
      setTimeout(() => setLoading(false), 500); 
    }, 2500); 

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#242526] transition-opacity duration-500 ${
        fadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-6xl font-serif text-[#c9487c] tracking-widest animate-pulse">
          REVAKALP
        </h1>
        <div className="mt-4 flex space-x-2">
          <div className="w-2.5 h-2.5 bg-[#c9487c] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-2.5 h-2.5 bg-[#c9487c] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-2.5 h-2.5 bg-[#c9487c] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteLoader;