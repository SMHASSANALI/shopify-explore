// components/Hero.tsx
"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link"; // Use standard Link instead of CustomLink for simplicity
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { MdArrowBack, MdArrowForward } from "react-icons/md";

export default function Hero({ banners }) {
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
    <section className="flex flex-row items-center justify-center max-w-[1400px] py-[50px] mx-auto">
      <section className="w-full relative">
        <button
          onClick={handlePrev}
          className="absolute left-4 top-[50%] transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md cursor-pointer opacity-30 hover:opacity-100 transition-opacity"
        >
          <MdArrowBack size={24} />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-[50%] transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md cursor-pointer opacity-30 hover:opacity-100 transition-opacity"
        >
          <MdArrowForward size={24} />
        </button>
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="rounded-lg overflow-hidden"
        >
          <Swiper
            modules={[Autoplay]}
            grabCursor
            loop
            autoplay={{
              delay: 3000,
              pauseOnMouseEnter: true,
              disableOnInteraction: false,
            }}
            ref={swiperRef}
            className="w-full"
          >
            {banners.length > 0 ? (
              banners.map((edge) => (
                <SwiperSlide key={edge.node.id}>
                  <div className=" h-fit shadow-sm">
                    <Link
                      href={
                        edge.node.metafields?.[0]?.value ||
                        `/products/${edge.node.handle}`
                      }
                      className="flex flex-col h-full"
                    >
                      {edge.node.image && (
                        <div className="relative aspect-[19/6] w-[1400px] h-auto">
                          <Image
                            src={`${edge.node.image.src}?width=1400&format=webp`}
                            alt={edge.node.image.altText || edge.node.title}
                            fill
                            className="object-cover"
                            loading="lazy"
                          />
                        </div>
                      )}
                    </Link>
                  </div>
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide>
                <div className="p-4 text-center text-gray-500">
                  No banners available
                </div>
              </SwiperSlide>
            )}
          </Swiper>
        </div>
      </section>
    </section>
  );
}
