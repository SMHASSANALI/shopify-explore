"use client";

import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import CustomLink from "./global/CustomLink";

const CategoryAdSec = ({ productImages, handle }) => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const scale4times = useTransform(scrollYProgress, [0, 0.5], [4, 1]);
  const scale6times = useTransform(scrollYProgress, [0, 0.8], [6, 1]);
  const scale8times = useTransform(scrollYProgress, [0, 0.75], [8, 1]);
  const scale7times = useTransform(scrollYProgress, [0, 0.7], [7, 1]);
  const scale9times = useTransform(scrollYProgress, [0, 0.65], [9, 1]);
  const scale10times = useTransform(scrollYProgress, [0, 0.85], [10, 1]);

  const bg = useTransform(scrollYProgress, [0.4, 0.45], ["#ffffff", "#1a3c58"]);

  const pictureArray = productImages.map((product, index) => ({
    src: product.src,
    altText: product.altText,
    handle: product.handle,
    topValue: ["1%", "1%", "69%", "1%", "59%", "1%", "46%"][index],
    leftValue: ["1%", "24%", "25%", "50%", "1%", "78%", "72.8%"][index],
    scaleValue: [
      scale4times,
      scale9times,
      scale6times,
      scale8times,
      scale6times,
      scale10times,
      scale7times,
    ][index],
    widthPercentage: ["20vw", "15vw", "30vw", "14vw", "20vw", "20vw", "25vw"][
      index
    ],
    heightPercentage: ["55vh", "30vh", "30vh", "30vh", "40vh", "40vh", "53vh"][
      index
    ],
    zIndex: [5, 10, 15, 20, 25, 30, 35][index],
  }));

  return (
    <section className="flex flex-col justify-center items-center min-h-screen py-[10vh] space-y-[10vh] overflow-clip">
      <div
        ref={containerRef}
        className="h-[300vh] relative w-full overflow-clip"
      >
        <motion.div
          style={{ backgroundColor: bg }}
          className="w-full h-screen sticky top-0 overflow-clip rounded-lg"
        >
          {pictureArray.map(
            (
              {
                src,
                altText,
                handle,
                topValue,
                leftValue,
                scaleValue,
                widthPercentage,
                heightPercentage,
                zIndex,
              },
              index
            ) => {
              return (
                <motion.div
                  key={index}
                  style={{
                    scale: scaleValue,
                  }}
                  className="w-[100%] h-[100%] absolute flex items-center justify-center"
                >
                  <div className="h-full w-full">
                    <div
                      className="relative rounded overflow-hidden shadow-2xl shadow-black/70 "
                      style={{
                        width: widthPercentage,
                        height: heightPercentage,
                        top: topValue,
                        left: leftValue,
                        zIndex: zIndex,
                      }}
                    >
                      <Image
                        src={src}
                        alt={altText}
                        fill
                        className="w-full h-full object-cover"
                        priority={index === 0}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            }
          )}
        </motion.div>
        <div className="sticky inset-0 h-screen w-full flex items-center justify-center">
          <div className=" flex flex-col gap-8 p-6 bg-white rounded-lg shadow-2xl shadow-black/70 items-center border-2 border-[var(--primary)]">
            <p className="text-5xl font-semibold max-w-2xl text-start">
              {" "}
              <span className="text-[var(--primary)] text-7xl">
                Home Essentials...
              </span>{" "}
              Everything to make your space beautiful!
            </p>
            <CustomLink
              text="Shop Now"
              href={`/collections/${handle}`}
              invert={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryAdSec;
