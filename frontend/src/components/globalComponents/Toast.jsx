import React, { useEffect } from "react";
import useStore from "../../store/store";

const Toast = () => {
  const { toast, hideToast } = useStore();

  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => {
        hideToast();
      }, 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [toast, hideToast]);

  if (!toast.message) return null;

  const isError = toast.type === "error";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-[110] max-w-sm px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-medium transition-all duration-300 ${
        isError
          ? "bg-[#2B0E17] text-[#F7F1E5] border-[#D4AF63]"
          : "bg-[#38131E] text-[#F7F1E5] border-[#D4AF63]/60"
      }`}
    >
      {toast.message}
    </div>
  );
};

export default Toast;
