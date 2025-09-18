"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import ProductCard from "./ProductCard";

const ProductsSlider = ({ title, data }) => {
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
    <section className="w-full md:max-w-[1400px] mx-auto space-y-[20px]">
      <div className="flex flex-row items-center justify-between border-b-4 border-gray-300 pb-2">
        <h1 className="font-semibold">{title}</h1>
        <div className="w-fit flex flex-row items-center gap-2">
          <button
            onClick={handlePrev}
            className="rounded-full cursor-pointer hidden md:flex items-center justify-center bg-[var(--accent)] p-1 text-white"
          >
            <IoIosArrowBack size={14} />
          </button>
          <button
            onClick={handleNext}
            className="rounded-full cursor-pointer hidden md:flex items-center justify-center bg-[var(--accent)] p-1 text-white"
          >
            <IoIosArrowForward size={14} />
          </button>
        </div>
      </div>

      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="py-[10px] md:py-10"
      >
        <Swiper
          modules={[Autoplay]}
          spaceBetween={12}
          grabCursor
          touchRatio={1.5}
          breakpoints={{
            0: { slidesPerView: 1.5 },
            425: { slidesPerView: 2 },
            768: { slidesPerView: 2.8 },
            1024: { slidesPerView: 3.8 },
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

export default ProductsSlider;
