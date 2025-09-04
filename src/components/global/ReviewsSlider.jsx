"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdStar } from "react-icons/md";

const ReviewsSlider = () => {
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

  const data = [
    {
      review:
        "Absolutely love shopping with HAAAIB! The delivery was right on time and the products were exactly as described. Quality is top-notch – I’ll definitely be ordering again.",
      reviewer: "Sarah Johnson",
      location: "London",
      rating: 4,
    },
    {
      review:
        "Great value for money! I ordered a few home essentials and they arrived beautifully packaged. The website is so easy to use, makes shopping a breeze.",
      reviewer: "James O'Connor",
      location: "Manchester",
      rating: 4,
    },
    {
      review:
        "My first order with HAAAIB exceeded expectations! Fast delivery, secure packaging and the items were exactly what I needed. Will 100% shop here again.",
      reviewer: "Michael Chen",
      location: "Bristol",
      rating: 5,
    },
    {
      review: "Good value for the price, though the sizing was slightly off.",
      reviewer: "Daniel Craig",
      location: "London",
      rating: 3,
    },
    {
      review:
        "Exceptional customer service and elegant pieces. Will shop again!",
      reviewer: "Emma Frost",
      location: "London",
      rating: 5,
    },
  ];

  return (
    <section className="max-w-[1400px] mx-auto space-y-[20px]">
      <div className="flex flex-row items-center justify-between border-b-4 border-gray-300 pb-2">
        <h1 className="font-semibold">Loved By Customers</h1>
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
          spaceBetween={8}
          grabCursor
          touchRatio={1.5}
          breakpoints={{
            0: { slidesPerView: 1.2 },
            640: { slidesPerView: 1.5 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3.5 },
            1280: { slidesPerView: 4 },
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
                <div className="py-6 px-4 border border-gray-200 rounded-lg shadow-sm flex flex-col items-center justify-between w-[340px] h-[250px] bg-white">
                  <div className="flex flex-col gap-4 items-center text-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <MdStar
                          key={i}
                          className={`h-6 w-6 ${
                            i < item.rating
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p>"{item.review}"</p>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <h3>{item.reviewer}</h3>
                    <p>{item.location}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <div className="p-4 text-center text-gray-500">
                No Reviews available
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
    </section>
  );
};

export default ReviewsSlider;
