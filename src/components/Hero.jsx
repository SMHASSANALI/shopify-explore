"use client";

import React, { useRef } from "react";
import bg from "../../public/images/R02BG.jpg";
import ring from "../../public/images/R02Ring.png";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";

export default function Hero({ url }) {
  const containerRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { damping: 20, stiffness: 150 });
  const springY = useSpring(mouseY, { damping: 20, stiffness: 150 });

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Parallax transforms using centered coordinates
  const bgTranslateX = useTransform(springX, [-200, 200], [12, -12]);
  const bgTranslateY = useTransform(springY, [-150, 150], [12, -12]);

  const ringTranslateX = useTransform(springX, [-200, 200], [-8, 8]);
  const ringTranslateY = useTransform(springY, [-150, 150], [-8, 8]);

  const textTranslateX = useTransform(springX, [-200, 200], [20, -20]);
  const textTranslateY = useTransform(springY, [-150, 150], [20, -20]);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="flex flex-row items-center justify-center mb-12"
    >
      {/* Text Section */}
      <div className="w-6/12 flex flex-col items-start justify-center h-[60dvh]">
        <div className="p-4 max-w-[500px]">
          <h2 className="text-black font-extrabold text-5xl">
            Discover the COLMI R02 Smart Ring
          </h2>

          <div className="flex flex-row gap-2 pt-4 pb-6">
            <span className="border border-gray-500 text-gray-500 rounded-md px-2 text-base">
              Accessories
            </span>
            <span className="border border-gray-500 text-gray-500 rounded-md px-2 text-base">
              Health
            </span>
          </div>

          <p className="text-base text-gray-500 leading-6">
            Sleek, lightweight, and packed with intelligent sensors — the COLMI
            R02 Smart Ring helps you track your health, sleep, and activity
            seamlessly, all from your finger.
          </p>

          <button className="transition duration-300 cursor-pointer bg-[var(--primary)] hover:bg-[var(--primary-light)] text-white font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline mt-4">
            Explore More
          </button>
        </div>
      </div>

      {/* Visual Section */}
      <div className="relative h-[60dvh] w-6/12 cursor-pointer overflow-hidden bg-black">
        {/* Background Image */}
        <motion.div
          style={{ x: bgTranslateX, y: bgTranslateY, scale: 1.07 }}
          transition={{ type: "spring" }}
          className="w-full h-full absolute inset-0 -z-0"
        >
          <Image
            src={bg}
            alt="Background"
            fill
            style={{ objectFit: "cover" }}
            priority
            className="pointer-events-none"
          />
        </motion.div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none" />

        {/* Ring Image */}
        <motion.div
          style={{ x: ringTranslateX, y: ringTranslateY }}
          className="absolute inset-0 flex items-center justify-center z-20"
        >
          <Image
            src={ring}
            alt="Ring"
            width={250}
            height={250}
            style={{ objectFit: "cover" }}
            className="pointer-events-none drop-shadow-lg"
          />
        </motion.div>

        {/* Text Overlay */}
        <motion.div
          style={{ x: textTranslateX, y: textTranslateY }}
          className="absolute inset-0 w-full h-[180px] items-center justify-end z-10 flex flex-col"
        >
          <h2 className="text-5xl font-bold text-orange-400 drop-shadow-md">
            COLMI R02
          </h2>
          <p className="text-7xl font-extrabold text-white drop-shadow-2xl">
            SMART RING
          </p>
        </motion.div>
      </div>
    </section>
  );
}
