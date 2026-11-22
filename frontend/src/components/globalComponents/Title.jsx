import React from "react";

const Title = ({ text1, text2 }) => {
  return (
    <div className="flex items-center justify-center gap-4 mb-6">
      <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#D4AF63] to-transparent" aria-hidden="true" />

      <h2 className="text-center">
        {text1 && (
          <span className="block text-[11px] tracking-[0.28em] text-[#38131E]/70 uppercase font-medium">
            {text1}
          </span>
        )}
        <span className="block text-2xl sm:text-3xl font-serif text-[#38131E] mt-1">
          {text2}
        </span>
      </h2>

      <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#D4AF63] to-transparent" aria-hidden="true" />
    </div>
  );
};

export default Title;
