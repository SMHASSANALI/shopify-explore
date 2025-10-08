"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import ProductsSlider from "../global/ProductsSlider";
import { toTitleCase } from "@/utils/toTitleCase";

export default function BentoSection({ images, collectionData }) {
  // Map images by their bento_position (integer values: 1, 2, 3, 4, 5)
  const imageMap = images.reduce((acc, edge) => {
    const position = edge.node.metafields?.find(
      (mf) => mf?.key === "bento_position"
    )?.value;
    let link =
      edge.node.metafields?.find((mf) => mf?.key === "banner_link")?.value ||
      "#";

    // Parse banner_link if it's a JSON string (e.g., {"text":"","url":"https://..."})
    try {
      const parsed = JSON.parse(link);
      if (parsed.url) {
        link = parsed.url;
      }
    } catch (error) {
      // If parsing fails, assume it's a direct URL
    }

    const positionMap = {
      1: "top",
      2: "left",
      3: "top-right",
      4: "bottom-right-1",
      5: "bottom-right-2",
    };

    const mappedPosition = positionMap[position];
    if (mappedPosition) {
      acc[mappedPosition] = {
        src: edge.node.images.edges[0]?.node.src || "/assets/placeholder.jpg",
        altText:
          edge.node.images.edges[0]?.node.altText ||
          edge.node.title ||
          "Bento image",
        link,
      };
    } else if (position) {
      console.warn(
        `Invalid bento_position: ${position} for product ${edge.node.title}`
      );
    }
    return acc;
  }, {});

  return (
    <section className="max-w-[1400px] mx-auto gap-[10px] flex flex-col min-h-[50vh] md:min-h-[70vh] lg:min-h-[80vh]">
      {/* Top Section (14:2) */}
      <div className="w-full relative rounded-xl overflow-hidden aspect-[14/2] group my-12">
        {imageMap["top"] ? (
          <Link
            href={imageMap["top"].link}
            aria-label={`View ${imageMap["top"].altText}`}
          >
            <div className="relative w-full h-full">
              <Image
                src={`${imageMap["top"].src}?width=1400&format=webp`}
                alt={imageMap["top"].altText}
                fill
                sizes="(max-width: 768px) 100vw, 1400px"
                className="object-center transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          </Link>
        ) : (
          <div className="bg-gray-200 flex items-center justify-center h-full">
            <span className="text-gray-500">No top image</span>
          </div>
        )}
      </div>

      <div className="py-12">
        <ProductsSlider
          title={toTitleCase(collectionData?.title || "Trending Now")}
          data={collectionData.products}
        />
      </div>

      {/* Bottom Section */}
      <div className="w-full flex flex-col md:flex-row gap-[10px] h-full my-12">
        {/* Bottom Left (1:1) */}
        <div className="w-full md:w-1/2 relative rounded-xl overflow-hidden aspect-square group">
          {imageMap["left"] ? (
            <Link
              href={imageMap["left"].link}
              aria-label={`View ${imageMap["left"].altText}`}
            >
              <div className="relative w-full h-full">
                <Image
                  src={`${imageMap["left"].src}?width=700&format=webp`}
                  alt={imageMap["left"].altText}
                  fill
                  sizes="(max-width: 768px) 100vw, 700px"
                  className="object-center transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </Link>
          ) : (
            <div className="bg-gray-200 flex items-center justify-center h-full">
              <span className="text-gray-500">No left image</span>
            </div>
          )}
        </div>

        {/* Bottom Right */}
        <div className="w-full md:w-1/2 flex flex-col gap-[10px]">
          {/* Top Right (16:6) */}
          <div className="w-full relative rounded-xl overflow-hidden aspect-[16/6] group">
            {imageMap["top-right"] ? (
              <Link
                href={imageMap["top-right"].link}
                aria-label={`View ${imageMap["top-right"].altText}`}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={`${imageMap["top-right"].src}?width=700&format=webp`}
                    alt={imageMap["top-right"].altText}
                    fill
                    sizes="(max-width: 768px) 100vw, 700px"
                    className="object-center transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </Link>
            ) : (
              <div className="bg-gray-200 flex items-center justify-center h-full">
                <span className="text-gray-500">No top-right image</span>
              </div>
            )}
          </div>

          {/* Bottom Right Row (4:3 each) */}
          <div className="w-full flex flex-col sm:flex-row gap-[10px]">
            <div className="w-full sm:w-1/2 relative rounded-xl overflow-hidden aspect-[3/4] group">
              {imageMap["bottom-right-1"] ? (
                <Link
                  href={imageMap["bottom-right-1"].link}
                  aria-label={`View ${imageMap["bottom-right-1"].altText}`}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={`${imageMap["bottom-right-1"].src}?width=350&format=webp`}
                      alt={imageMap["bottom-right-1"].altText}
                      fill
                      sizes="(max-width: 768px) 100vw, 350px"
                      className="object-center transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </Link>
              ) : (
                <div className="bg-gray-200 flex items-center justify-center h-full">
                  <span className="text-gray-500">No bottom-right-1 image</span>
                </div>
              )}
            </div>
            <div className="w-full sm:w-1/2 relative rounded-xl overflow-hidden aspect-[4/3] group">
              {imageMap["bottom-right-2"] ? (
                <Link
                  href={imageMap["bottom-right-2"].link}
                  aria-label={`View ${imageMap["bottom-right-2"].altText}`}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={`${imageMap["bottom-right-2"].src}?width=350&format=webp`}
                      alt={imageMap["bottom-right-2"].altText}
                      fill
                      sizes="(max-width: 768px) 100vw, 350px"
                      className="object-center transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </Link>
              ) : (
                <div className="bg-gray-200 flex items-center justify-center h-full">
                  <span className="text-gray-500">No bottom-right-2 image</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
