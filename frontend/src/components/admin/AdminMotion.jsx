import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import useReducedMotion from "../motion/useReducedMotion";

const MotionDiv = motion.div;

const EASE_OUT = [0.22, 1, 0.36, 1];

export function AdminStaggerGrid({ children, className = "" }) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <MotionDiv
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.04 },
        },
      }}
      className={className}
    >
      {children}
    </MotionDiv>
  );
}

export function AdminStaggerItem({ children, className = "" }) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <MotionDiv
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.24, ease: EASE_OUT },
        },
      }}
      className={className}
    >
      {children}
    </MotionDiv>
  );
}

export function AdminTabPanel({ activeKey, children, className = "" }) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <MotionDiv
        key={activeKey}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.18, ease: EASE_OUT }}
        className={className}
      >
        {children}
      </MotionDiv>
    </AnimatePresence>
  );
}
