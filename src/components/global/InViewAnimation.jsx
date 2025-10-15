"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

export default function InViewAnimation({
  direction = "ltr",
  media,
  heading,
  text,
  title,
  to,
}) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.5 });

  const textVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: custom * 0.5 },
    }),
  };

  const isRTL = direction === "rtl";

  return (
    <main className="h-fit flex items-center w-full max-w-[1400px] mx-auto">
      <div
        ref={containerRef}
        className={`flex flex-col md:flex-row w-full items-center py-[20px] md:py-[50px] gap-[30px] ${
          isRTL ? "md:flex-row-reverse" : ""
        }`}
      >
        <div className="h-fit w-full md:w-6/12 flex items-center justify-center">
          <div className="w-full">
            <motion.div
              initial={{
                boxShadow: "0px 0px 0px rgba(0, 0, 0, 0)",
              }}
              animate={{
                boxShadow: isInView
                  ? "0px 4px 10px rgba(0, 0, 0, 0.4)"
                  : "0px 0px 0px rgba(0, 0, 0, 0)",
              }}
              transition={{ duration: 0.5, delay: 1.5 }}
              className="rounded-lg overflow-hidden p-1 bg-[var(--accent)]"
            >
              {media?.length > 0 ? (
                <div className="grid grid-cols-3 grid-rows-3 gap-1">
                  {media.slice(0, 9).map((image, index) => (
                    <Image
                      key={index}
                      src={image.src}
                      alt={image.altText || title}
                      className="w-full h-full object-cover rounded overflow-hidden"
                      sizes="(max-width: 768px) 100vw, (max-width: 1400px) 50vw, 25vw"
                      width={1200}
                      height={1200}
                      loading="lazy"
                      styles={{ width: "auto", height: "auto" }}
                    />
                  ))}
                </div>
              ) : (
                <Image
                  src={"/assets/placeholder.jpg"}
                  alt="clouds"
                  className="w-full h-full object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1400px) 50vw, 25vw"
                  width={1200}
                  height={1200}
                  loading="lazy"
                  styles={{ width: "auto", height: "auto" }}
                />
              )}
            </motion.div>
          </div>
        </div>

        {/* TEXT SECTION */}
        <div
          className={`w-full md:w-6/12 h-fit flex flex-col justify-center items-start py-[10px] md:py-[30px]`}
        >
          <motion.span
            className="text-[var(--primary-dark)] font-semibold pb-1"
            variants={textVariant}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={2}
          >
            {title}
          </motion.span>

          <motion.h1
            className="text-black font-bold pb-2"
            variants={textVariant}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={2.5}
          >
            {heading}
          </motion.h1>

          <motion.p
            className="text-slate-900 !text-[16px] font-medium"
            variants={textVariant}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={3}
          >
            {text}
          </motion.p>

          <motion.div
            variants={textVariant}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={3.5}
            className="flex gap-4 mt-4"
          >
            <Link
              href={`/products/${to}` || "/"}
              className="hover:bg-transparent hover:text-[var(--accent)] duration-300 transition-all  bg-[var(--accent)] text-white rounded border border-[var(--accent)] py-2 px-4 cursor-pointer"
            >
              Buy Now
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
