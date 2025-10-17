"use client";

import React, { useRef, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { toTitleCase } from "@/utils/toTitleCase";

const ProductsSlider = ({ data }) => {
  const swiperRef = useRef(null);
  const products = useMemo(() => data?.products || [], [data?.products]);
  const handleNext = () => swiperRef.current?.swiper?.slideNext();
  const handlePrev = () => swiperRef.current?.swiper?.slidePrev();
  const handleMouseEnter = () => swiperRef.current?.swiper?.autoplay?.stop();
  const handleMouseLeave = () => swiperRef.current?.swiper?.autoplay?.start();

  return (
    <section className="w-full md:max-w-[1400px] mx-auto space-y-5 px-2">
      <div className="flex items-center justify-between border-b-4 border-gray-300 pb-2">
        <h2 className="font-semibold text-base md:text-lg">
          {toTitleCase(data?.title)}
        </h2>
        <div className="w-fit">
          <Link
            href={`/collections/${data.handle}`}
            className="underline font-medium text-base md:text-lg p-2"
          >
            View All
          </Link>
        </div>
      </div>

      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="py-4 md:py-8 relative"
      >
        <button
          onClick={handlePrev}
          aria-label="Previous products"
          className="cursor-pointer rounded-full bg-[var(--accent)] text-white p-1.5 opacity-60 hover:opacity-100 transition absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
        >
          <IoIosArrowBack size={32} />
        </button>
        <button
          onClick={handleNext}
          aria-label="Next products"
          className="cursor-pointer rounded-full bg-[var(--accent)] text-white p-1.5 opacity-60 hover:opacity-100 transition absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
        >
          <IoIosArrowForward size={32} />
        </button>
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
          {products.edges.length > 0 ? (
            products.edges.map((item) => {
              const price = parseFloat(
                item.node?.variants?.edges[0]?.node?.price?.amount || 0
              );
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
