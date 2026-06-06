import React, { useEffect, useState } from "react";

const WebsiteLoader = () => {
  const [loading, setLoading] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // This timer controls when the fade-out starts. 
    // Match this roughly to the duration of your video clip.
    const timer = setTimeout(() => {
      setFadingOut(true);
      // Remove from the DOM completely after the fade CSS transition (500ms) ends
      setTimeout(() => setLoading(false), 500); 
    }, 9000); 

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center lg:items-start justify-center bg-[#242526] transition-opacity duration-500 ${
        fadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className=" mix-blend-lighten ">
        <video
          autoPlay
          muted
          playsInline
          loop
          className="w-screen h-1/2 object-cover lg:mt-2"
        >
          {/* Replace these paths with the actual location of your video files */}
          {/* <source src="/assets/loader-animation.webm" type="video/webm" /> */}
          <source src="/loader.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default WebsiteLoader;