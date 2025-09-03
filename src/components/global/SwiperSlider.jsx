"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import ProductCard from "./ProductCard";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  hover: {
    y: -8,
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.3, ease: "easeOut" },
  },
  tap: { scale: 0.98, transition: { duration: 0.2 } },
};

const buttonVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.1, transition: { duration: 0.2 } },
  tap: { scale: 0.9, transition: { duration: 0.2 } },
};

const SwiperSlider = ({ title, data }) => {
  const swiperRef = useRef(null);

  const handleNext = () => {
    swiperRef.current?.swiper?.slideNext();
  };

  const handlePrev = () => {
    swiperRef.current?.swiper?.slidePrev();
  };

  const handleMouseEnter = () => {
    swiperRef.current?.swiper?.autoplay?.stop();
  };

  const handleMouseLeave = () => {
    swiperRef.current?.swiper?.autoplay?.start();
  };

  return (
    <section className="max-w-[1400px] mx-auto space-y-[20px]">
      <div className="flex flex-row items-center justify-between border-b-4 border-gray-300 pb-2">
        <h1 className="font-semibold">{title}</h1>
        <div className="w-fit flex flex-row items-center gap-2">
          <button
            onClick={handlePrev}
            className="rounded-full cursor-pointer flex items-center justify-center bg-[var(--accent)] p-1 text-white"
          >
            <IoIosArrowBack size={14} />
          </button>
          <button
            onClick={handleNext}
            className="rounded-full cursor-pointer flex items-center justify-center bg-[var(--accent)] p-1 text-white"
          >
            <IoIosArrowForward size={14} />
          </button>
        </div>
      </div>

      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="py-10"
      >
        <Swiper
          modules={[Autoplay]}
          spaceBetween={16}
          grabCursor
          touchRatio={1.5}
          breakpoints={{
            0: { slidesPerView: 1.2 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
          }}
          loop
          autoplay={{
            delay: 3000,
            pauseOnMouseEnter: true,
            disableOnInteraction: false,
          }}
          ref={swiperRef}
          className=""
        >
          {data.length > 0 ? (
            data.map((item) => (
              <SwiperSlide key={item.node.id}>
                {parseInt(item.node.price) > 0 && (
                  <ProductCard product={item} />
                )}
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <div className="p-4 text-center text-gray-500">
                No products available
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
    </section>
  );
};

export default SwiperSlider;
