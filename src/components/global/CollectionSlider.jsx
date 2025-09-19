"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { toTitleCase } from "@/utils/toTitleCase";
import Image from "next/image";
import Link from "next/link";

const CollectionsSlider = ({ data }) => {
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
    <section className="w-full md:max-w-[1400px] mx-auto relative">
      <button
        onClick={handlePrev}
        aria-label="Previous products"
        title="Previous products"
        className="rounded-full cursor-pointer flex items-center justify-center bg-[var(--accent)]/70 hover:bg-[var(--accent)] p-1 text-white absolute top-1/2 -translate-y-1/2 left-2 z-50"
      >
        <IoIosArrowBack size={24} />
      </button>
      <button
        onClick={handleNext}
        aria-label="Next products"
        title="Next products"
        className="rounded-full cursor-pointer flex items-center justify-center bg-[var(--accent)]/70 hover:bg-[var(--accent)] p-1 text-white absolute top-1/2 -translate-y-1/2 right-2 z-50"
      >
        <IoIosArrowForward size={24} />
      </button>

      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="py-[10px] md:py-4 bg-white rounded-md"
      >
        <Swiper
          modules={[Autoplay]}
          spaceBetween={12}
          grabCursor
          touchRatio={1.5}
          breakpoints={{
            0: { slidesPerView: 2 },
            425: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 6 },
            1280: { slidesPerView: 9 },
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
            data.map((item, i) => (
              <SwiperSlide key={i}>
                <Link
                  key={item.id}
                  href={`/collections/${item.handle}`}
                  className="hover:text-[var(--accent)] flex flex-col items-center gap-2"
                >
                  <div className="h-[130px] w-[130px] relative rounded-sm overflow-hidden">
                    <Image
                      src={item.image.src}
                      alt={item.image.altText ? item.image.altText : item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      loading="lazy"
                    />
                  </div>
                  <span className="font-extralight text-center">
                    {toTitleCase(item.title)}
                  </span>
                </Link>
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

export default CollectionsSlider;
