// "use client";

// import React, { useRef } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay } from "swiper/modules";
// import "swiper/css";
// import { MdArrowBack, MdArrowForward } from "react-icons/md";
// import Image from "next/image";
// import Link from "next/link";

// const SwiperSlider = ({ title, data, endpoint }) => {
//   const swiperRef = useRef(null);
//   const handleNext = () => {
//     if (swiperRef.current && swiperRef.current.swiper) {
//       swiperRef.current.swiper.slideNext();
//     }
//   };

//   const handlePrev = () => {
//     if (swiperRef.current && swiperRef.current.swiper) {
//       swiperRef.current.swiper.slidePrev();
//     }
//   };

//   const handleMouseEnter = () => {
//     if (swiperRef.current && swiperRef.current.swiper) {
//       swiperRef.current.swiper.autoplay.stop();
//     }
//   };

//   const handleMouseLeave = () => {
//     if (swiperRef.current && swiperRef.current.swiper) {
//       swiperRef.current.swiper.autoplay.start();
//     }
//   };

//   return (
//     <main className="flex flex-col justify-center">
//       <section className="px-0">
//         <div className="flex flex-row items-center justify-between mb-[100px]">
//           <h2 className="text-3xl font-semibold">{title}</h2>
//           <div className="flex flex-row gap-x-6">
//             <span
//               onClick={handlePrev}
//               className="font-mono text-lg flex justify-center items-center border border-neutral-600 text-neutral-600 rounded-full size-[40px] hover:bg-[var(--primary)] hover:text-white transition-all duration-200 ease-linear cursor-pointer"
//             >
//               <MdArrowBack />
//             </span>
//             <span
//               onClick={handleNext}
//               className="font-mono text-lg flex justify-center items-center border border-neutral-600 text-neutral-600 rounded-full size-[40px] hover:bg-[var(--primary)] hover:text-white transition-all duration-200 ease-linear cursor-pointer"
//             >
//               <MdArrowForward />
//             </span>
//           </div>
//         </div>
//         <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
//           <Swiper
//             modules={[Autoplay]}
//             spaceBetween={10}
//             breakpoints={{
//               0: {
//                 slidesPerView: 1,
//               },
//               640: {
//                 slidesPerView: 2,
//               },
//               768: {
//                 slidesPerView: 2,
//               },
//               1024: {
//                 slidesPerView: 3,
//               },
//               1200: {
//                 slidesPerView: 3,
//               },
//               1300: {
//                 slidesPerView: 6,
//               },
//             }}
//             loop={true}
//             autoplay={{
//               delay: 5000,
//             }}
//             ref={swiperRef}
//           >
//             {data.length > 0 &&
//               data.map((item) => (
//                 <SwiperSlide key={item.node.id}>
//                   <Link
//                     href={`/${endpoint}/${item.node.handle}`}
//                     className="min-h-[400px] border rounded-lg flex flex-col cursor-grab bg-[var(--primary)]"
//                   >
//                     {item.node.image && (
//                       <Image
//                         src={item.node.image.src}
//                         alt={item.node.image.altText || item.node.title}
//                         width={1200}
//                         height={800}
//                         className="w-full h-[350px] rounded-xl p-1 object-cover"
//                       />
//                     )}
//                     <div className="flex flex-col">
//                       <div className="p-2">
//                         <h2 className="text-white text-2xl max-w-[260px]">
//                           {item.node.title}
//                         </h2>
//                         {item.node.description && (
//                           <p className="text-sm text-neutral-600">
//                             {item.node.description.length > 100
//                               ? `${item.node.description.slice(0, 100)}...`
//                               : item.node.description}
//                           </p>
//                         )}
//                         {item.node.priceRange && (
//                           <p className="text-lg font-semibold text-white">
//                             ${item.node.priceRange.minVariantPrice.amount}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   </Link>
//                 </SwiperSlide>
//               ))}
//           </Swiper>
//         </div>
//       </section>
//     </main>
//   );
// };

// export default SwiperSlider;

















"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";

const SwiperSlider = ({ title, data, endpoint }) => {
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
    <main className="flex flex-col justify-center px-4 sm:px-6 lg:px-8">
      <section>
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-[100px] gap-4">
          <h2 className="text-2xl sm:text-3xl font-semibold">{title}</h2>
          <div className="flex flex-row gap-x-4 sm:gap-x-6">
            <span
              onClick={handlePrev}
              className="text-lg flex justify-center items-center border border-neutral-600 text-neutral-600 rounded-full size-10 hover:bg-[var(--primary)] hover:text-white transition-all cursor-pointer"
            >
              <MdArrowBack />
            </span>
            <span
              onClick={handleNext}
              className="text-lg flex justify-center items-center border border-neutral-600 text-neutral-600 rounded-full size-10 hover:bg-[var(--primary)] hover:text-white transition-all cursor-pointer"
            >
              <MdArrowForward />
            </span>
          </div>
        </div>

        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <Swiper
            modules={[Autoplay]}
            spaceBetween={16}
            breakpoints={{
              0: {
                slidesPerView: 1.2,
              },
              480: {
                slidesPerView: 1.5,
              },
              640: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 2.5,
              },
              1024: {
                slidesPerView: 3,
              },
              1300: {
                slidesPerView: 6,
              },
            }}
            loop={true}
            autoplay={{
              delay: 5000,
            }}
            ref={swiperRef}
          >
            {data.length > 0 &&
              data.map((item) => (
                <SwiperSlide key={item.node.id}>
                  <Link
                    href={`/${endpoint}/${item.node.handle}`}
                    className="border rounded-lg flex flex-col bg-[var(--primary)] min-h-[300px] sm:min-h-[400px]"
                  >
                    {item.node.image && (
                      <Image
                        src={item.node.image.src}
                        alt={item.node.image.altText || item.node.title}
                        width={1200}
                        height={800}
                        className="w-full h-[270px] sm:h-[350px] object-cover rounded-t-lg"
                      />
                    )}
                    <div className="p-3 sm:p-4 flex flex-col gap-1">
                      <h2 className="text-white text-lg sm:text-2xl font-semibold">
                        {item.node.title}
                      </h2>
                      {item.node.description && (
                        <p className="text-sm text-neutral-300 hidden sm:block">
                          {item.node.description.length > 100
                            ? `${item.node.description.slice(0, 100)}...`
                            : item.node.description}
                        </p>
                      )}
                      {item.node.priceRange && (
                        <p className="text-base sm:text-lg font-semibold text-white pt-1">
                          ${item.node.priceRange.minVariantPrice.amount}
                        </p>
                      )}
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </section>
    </main>
  );
};

export default SwiperSlider;
