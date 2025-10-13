// "use client";

// import React, { useRef } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay } from "swiper/modules";
// import "swiper/css";
// import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
// import { toTitleCase } from "@/utils/toTitleCase";
// import Image from "next/image";
// import Link from "next/link";

// const CollectionsSlider = ({ data }) => {
//   const swiperRef = useRef(null);

//   const handleNext = () => {
//     swiperRef.current?.swiper?.slideNext();
//   };

//   const handlePrev = () => {
//     swiperRef.current?.swiper?.slidePrev();
//   };

//   const handleMouseEnter = () => {
//     swiperRef.current?.swiper?.autoplay?.stop();
//   };

//   const handleMouseLeave = () => {
//     swiperRef.current?.swiper?.autoplay?.start();
//   };

//   return (
//     <section className="w-full md:max-w-[1400px] mx-auto relative">
//       <button
//         onClick={handlePrev}
//         aria-label="Previous products"
//         title="Previous products"
//         className="rounded-full cursor-pointer flex items-center justify-center bg-[var(--accent)]/70 hover:bg-[var(--accent)] p-1 text-white absolute top-1/2 -translate-y-1/2 left-2 z-50"
//       >
//         <IoIosArrowBack size={24} />
//       </button>
//       <button
//         onClick={handleNext}
//         aria-label="Next products"
//         title="Next products"
//         className="rounded-full cursor-pointer flex items-center justify-center bg-[var(--accent)]/70 hover:bg-[var(--accent)] p-1 text-white absolute top-1/2 -translate-y-1/2 right-2 z-50"
//       >
//         <IoIosArrowForward size={24} />
//       </button>

//       <div
//         onMouseEnter={handleMouseEnter}
//         onMouseLeave={handleMouseLeave}
//         className="py-[10px] md:py-4 bg-gray-100 rounded-md"
//       >
//         <Swiper
//           modules={[Autoplay]}
//           spaceBetween={12}
//           grabCursor
//           touchRatio={1.5}
//           breakpoints={{
//             0: { slidesPerView: 2 },
//             425: { slidesPerView: 2 },
//             768: { slidesPerView: 3 },
//             1024: { slidesPerView: 6 },
//             1280: { slidesPerView: 9 },
//           }}
//           loop
//           autoplay={{
//             delay: 3000,
//             pauseOnMouseEnter: true,
//             disableOnInteraction: false,
//           }}
//           ref={swiperRef}
//           className=""
//         >
//           {data.length > 0 ? (
//             data.map((item, i) => (
//               <SwiperSlide key={i}>
//                 <Link
//                   key={item.id}
//                   href={`/collections/${item.handle}`}
//                   className="hover:text-[var(--accent)] flex flex-col items-center gap-2"
//                 >
//                   <div className="h-[130px] w-[130px] relative rounded-sm overflow-hidden flex-shrink-0">
//                     <Image
//                       src={item.image.src}
//                       alt={item.image.altText || item.title}
//                       fill
//                       className="object-cover"
//                       sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
//                       loading="lazy"
//                       priority={i < 3} // preload first few
//                     />
//                   </div>
//                   <span className="font-extralight text-center">
//                     {toTitleCase(item.title)}
//                   </span>
//                 </Link>
//               </SwiperSlide>
//             ))
//           ) : (
//             <SwiperSlide>
//               <div className="p-4 text-center text-gray-500">
//                 No products available
//               </div>
//             </SwiperSlide>
//           )}
//         </Swiper>
//       </div>
//     </section>
//   );
// };

// export default CollectionsSlider;





"use client";

import React, { useRef, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { toTitleCase } from "@/utils/toTitleCase";
import Image from "next/image";
import Link from "next/link";

const CollectionsSlider = ({ data = [] }) => {
  const swiperRef = useRef(null);

  const collections = useMemo(() => data || [], [data]);

  const handleNext = () => swiperRef.current?.swiper?.slideNext();
  const handlePrev = () => swiperRef.current?.swiper?.slidePrev();
  const handleMouseEnter = () => swiperRef.current?.swiper?.autoplay?.stop();
  const handleMouseLeave = () => swiperRef.current?.swiper?.autoplay?.start();

  return (
    <section className="w-full md:max-w-[1400px] mx-auto relative px-2">
      {/* Navigation buttons */}
      <button
        onClick={handlePrev}
        aria-label="Previous collections"
        className="rounded-full hidden md:flex items-center justify-center bg-[var(--accent)]/70 hover:bg-[var(--accent)] text-white p-2 absolute top-1/2 -translate-y-1/2 left-2 z-50 transition-colors duration-200"
      >
        <IoIosArrowBack size={20} />
      </button>
      <button
        onClick={handleNext}
        aria-label="Next collections"
        className="rounded-full hidden md:flex items-center justify-center bg-[var(--accent)]/70 hover:bg-[var(--accent)] text-white p-2 absolute top-1/2 -translate-y-1/2 right-2 z-50 transition-colors duration-200"
      >
        <IoIosArrowForward size={20} />
      </button>

      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="py-4 bg-gray-100 rounded-md"
      >
        <Swiper
          modules={[Autoplay]}
          spaceBetween={12}
          grabCursor
          touchRatio={1.5}
          breakpoints={{
            0: { slidesPerView: 2 },
            425: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 6 },
            1280: { slidesPerView: 8 },
          }}
          loop
          autoplay={{
            delay: 3500,
            pauseOnMouseEnter: true,
            disableOnInteraction: false,
          }}
          ref={swiperRef}
        >
          {collections.length > 0 ? (
            collections.map((item, i) => (
              <SwiperSlide key={item.id || i}>
                <Link
                  href={`/collections/${item.handle}`}
                  className="flex flex-col items-center gap-2 text-center hover:text-[var(--accent)] transition-colors duration-200"
                >
                  <div className="relative h-[130px] w-[130px] overflow-hidden rounded-sm flex-shrink-0">
                    <Image
                      src={item.image?.src}
                      alt={item.image?.altText || item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 130px"
                      loading={i > 2 ? "lazy" : "eager"} // only first 3 eager
                      priority={i < 2}
                    />
                  </div>
                  <span className="font-light text-sm md:text-base">
                    {toTitleCase(item.title)}
                  </span>
                </Link>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <div className="p-4 text-gray-500 text-center">
                No collections available
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
    </section>
  );
};

export default React.memo(CollectionsSlider);
