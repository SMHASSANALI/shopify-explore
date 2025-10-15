"use client";

import React, { useRef, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import ProductCard from "./ProductCard";

const ProductsSlider = ({ title = "", data = [] }) => {
  const swiperRef = useRef(null);
  const products = useMemo(() => data || [], [data]);

  const handleNext = () => swiperRef.current?.swiper?.slideNext();
  const handlePrev = () => swiperRef.current?.swiper?.slidePrev();
  const handleMouseEnter = () => swiperRef.current?.swiper?.autoplay?.stop();
  const handleMouseLeave = () => swiperRef.current?.swiper?.autoplay?.start();

  return (
    <section className="w-full md:max-w-[1400px] mx-auto space-y-5 px-2">
      <div className="flex items-center justify-between border-b-4 border-gray-300 pb-2">
        <h2 className="font-semibold text-base md:text-lg">{title}</h2>
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={handlePrev}
            aria-label="Previous products"
            className="rounded-full bg-[var(--accent)] text-white p-1.5 hover:opacity-90 transition"
          >
            <IoIosArrowBack size={16} />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next products"
            className="rounded-full bg-[var(--accent)] text-white p-1.5 hover:opacity-90 transition"
          >
            <IoIosArrowForward size={16} />
          </button>
        </div>
      </div>

      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="py-4 md:py-8"
      >
        <Swiper
          modules={[Autoplay]}
          spaceBetween={16}
          grabCursor
          touchRatio={1.5}
          breakpoints={{
            0: { slidesPerView: 2 },
            425: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
          }}
          loop
          autoplay={{
            delay: 3500,
            pauseOnMouseEnter: true,
            disableOnInteraction: false,
          }}
          ref={swiperRef}
        >
          {products.length > 0 ? (
            products.map((item) => {
              const price = parseFloat(item.node.price || 0);
              if (price <= 0) return null;
              return (
                <SwiperSlide key={item.node.id}>
                  <div className="aspect-auto max-w-[265px]">
                    <ProductCard product={item} />
                  </div>
                </SwiperSlide>
              );
            })
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

export default React.memo(ProductsSlider);
