"use client";
import React, { useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect } from "react";

export default function ScrollReveal({ children, delay = 0 }) {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}
