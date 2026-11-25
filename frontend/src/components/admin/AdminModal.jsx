import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import useBodyScrollLock from "../../hooks/useBodyScrollLock";
import useReducedMotion from "../motion/useReducedMotion";

const MotionDiv = motion.div;

export default function AdminModal({
  isOpen,
  onClose,
  title,
  subtitle,
  maxWidth = "max-w-2xl",
  children,
  footer,
}) {
  const reducedMotion = useReducedMotion();

  useBodyScrollLock(Boolean(isOpen));

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <MotionDiv
          key="admin-modal-backdrop"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.18, ease: "easeOut" }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose?.();
          }}
          role="dialog"
          aria-modal="true"
          aria-label={typeof title === "string" ? title : "Admin dialog"}
          className="fixed inset-0 z-50 bg-[#1A1718]/55 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden overscroll-contain"
        >
          <MotionDiv
            key="admin-modal-panel"
            initial={reducedMotion ? false : { opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, scale: 0.97, y: 10 }}
            transition={{
              duration: reducedMotion ? 0 : 0.22,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`relative w-full ${maxWidth} max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-[#38131E]/15 flex flex-col overflow-hidden`}
          >
            {/* Sticky Header */}
            <div className="shrink-0 flex items-start justify-between gap-4 px-6 py-4 border-b border-[#38131E]/12 bg-white">
              <div>
                <h2 className="font-serif text-xl text-[#38131E] leading-snug">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-xs text-[#7A6A6E] mt-0.5">{subtitle}</p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#7A6A6E] hover:text-[#38131E] hover:bg-[#F7F1E5] transition-colors cursor-pointer shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Body (isolated from background page) */}
            <div
              data-lenis-prevent=""
              data-lenis-prevent-wheel=""
              data-lenis-prevent-touch=""
              className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-6"
            >
              {children}
            </div>

            {footer && (
              <div className="shrink-0 px-6 py-4 border-t border-[#38131E]/12 bg-[#FBF7EE]">
                {footer}
              </div>
            )}
          </MotionDiv>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
}
