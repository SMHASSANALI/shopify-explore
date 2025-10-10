"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import mediaLeft from "../../../public/assets/media/ImageLeft.png";
import mediaCenter from "../../../public/assets/media/ImageRight.png";
import mediaRight from "../../../public/assets/media/ImageCenter.png";
import Image from "next/image";

const RevealGallery = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end end"],
  });

  const card1 = {
    x: useTransform(scrollYProgress, [0, 0.8], ["0%", "100%"]),
    rotate: useTransform(scrollYProgress, [0, 0.7], ["0deg", "2deg"]),
  };

  const card2 = {
    x: useTransform(scrollYProgress, [0, 0.8], ["0%", "0%"]),
    rotate: useTransform(scrollYProgress, [0, 0.7], ["0deg", "0deg"]),
    scale: useTransform(scrollYProgress, [0, 0.8], [1, 1.2]),
  };

  const card3 = {
    x: useTransform(scrollYProgress, [0, 0.8], ["0%", "-100%"]),
    rotate: useTransform(scrollYProgress, [0, 0.7], ["0deg", "-2deg"]),
  };

  return (
    <section
      ref={containerRef}
      className="h-[100dvh] md:h-[200dvh] flex items-start justify-center relative overflow-x-clip"
    >
      <main className="h-[50dvh] md:h-[100dvh] sticky top-[50%]  md:top-20 w-full">
        <div className="flex items-center justify-center relative w-full h-full py-[30px]">
          <motion.div
            style={{ x: card1.x, rotate: card1.rotate }}
            className="absolute flex items-center justify-center h-[150px] w-4/12 md:h-[400px] md:w-[250px] rounded-xl border-2 border-white/20 overflow-hidden z-10"
          >
            <Image
              src={mediaLeft}
              alt=""
              width={200}
              height={500}
              className="h-full w-full object-cover"
            />
          </motion.div>
          <motion.div
            style={{ x: card2.x, rotate: card2.rotate, scale: card2.scale }}
            className="absolute flex items-center justify-center h-[150px] w-4/12 md:h-[400px] md:w-[250px] rounded-xl border-2 border-white/20 overflow-hidden z-20"
          >
            <Image
              src={mediaCenter}
              alt=""
              className="h-full w-full object-cover"
              width={200}
              height={500}
            />
          </motion.div>
          <motion.div
            style={{ x: card3.x, rotate: card3.rotate }}
            className="absolute flex items-center justify-center h-[150px] w-4/12 md:h-[400px] md:w-[250px] rounded-xl border-2 border-white/20 overflow-hidden z-10"
          >
            <Image
              src={mediaRight}
              alt=""
              width={200}
              height={500}
              className="h-full w-full object-cover"
            />
          </motion.div>
        </div>
      </main>
    </section>
  );
};

export default RevealGallery;
