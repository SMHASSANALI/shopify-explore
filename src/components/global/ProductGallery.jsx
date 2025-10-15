"use client";

import Image from "next/image";
import React, { useMemo, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Thumbs, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

export default function ProductGallery({ images = [], className = "" }) {
  const normalized = useMemo(() => {
    return images
      .map((img) => ({
        src: img?.node?.src || img?.src,
        altText: img?.node?.altText || img?.altText || "",
      }))
      .filter((img) => !!img.src);
  }, [images]);

  const [activeIndex, setActiveIndex] = useState(0);
  const thumbsSwiperRef = useRef(null);
  const mainSwiperRef = useRef(null);

  return (
    <div className={`${className} w-full`}>
      <Swiper
        modules={[Thumbs, Navigation]}
        navigation
        onSwiper={(swiper) => {
          mainSwiperRef.current = swiper;
        }}
        onSlideChange={(s) => setActiveIndex(s.activeIndex)}
        thumbs={{ swiper: thumbsSwiperRef.current }}
        className="rounded-lg overflow-hidden border"
      >
        {normalized.map((img, idx) => (
          <SwiperSlide key={`${img.src}-${idx}`}>
            <div className="relative aspect-[1/1] w-full">
              <Image
                src={img.src}
                alt={img.altText || "Product image"}
                width={600}
                height={600}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                className="object-cover"
                priority
                styles={{ width: "auto", height: "auto" }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {normalized.length > 1 && (
        <Swiper
          modules={[FreeMode, Thumbs]}
          onSwiper={(swiper) => {
            thumbsSwiperRef.current = swiper;
          }}
          spaceBetween={8}
          slidesPerView={6}
          freeMode
          watchSlidesProgress
          className="mt-3"
          breakpoints={{
            0: { slidesPerView: 4 },
            640: { slidesPerView: 5 },
            1024: { slidesPerView: 6 },
          }}
        >
          {normalized.map((img, idx) => (
            <SwiperSlide key={`thumb-${img.src}-${idx}`}>
              <button
                type="button"
                onMouseEnter={() => mainSwiperRef.current?.slideTo(idx)}
                onClick={() => mainSwiperRef.current?.slideTo(idx)}
                className={`relative w-full aspect-[1/1] rounded border overflow-hidden cursor-pointer ${
                  idx === activeIndex
                    ? "border-[var(--primary-dark)]"
                    : "border-gray-300"
                }`}
                aria-label={`Thumbnail ${idx + 1}`}
              >
                <Image
                  src={img.src}
                  alt={img.altText || "Thumbnail"}
                  width={100}
                  height={100}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover"
                  styles={{ width: "auto", height: "auto" }}
                  priority
                />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
