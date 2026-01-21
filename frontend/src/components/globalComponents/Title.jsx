import React from "react";

const Title = ({ text1, text2 }) => {
  return (
    <div className="flex items-center justify-center gap-4 mb-6">
      <span className="h-[2px] w-10 bg-gradient-to-r from-transparent via-[#c9487c] to-transparent"></span>

      <h2 className="text-center">
        <span className="block text-xs tracking-[0.3em] text-pink-500 uppercase">
          {text1}
        </span>
        <span className="block text-2xl sm:text-3xl font-serif text-[#9c2756] mt-1">
          {text2}
        </span>
      </h2>

      <span className="h-[2px] w-10 bg-gradient-to-r from-transparent via-[#c9487c] to-transparent"></span>
    </div>
  );
};

export default Title;
