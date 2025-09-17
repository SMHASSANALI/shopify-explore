"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import AddToCartButton from "./AddToCartButton";
import StarRating from "./StarRating";

const ProductCard = ({ product, compressed = false }) => {
  const variants = product?.node?.variants || [];
  const chosenVariant = useMemo(() => {
    const available = variants.find((v) => v.availableForSale);
    return available || variants[0] || null;
  }, [variants]);
  const [isHover, setIsHover] = useState(false);
  const images = product?.node?.images || [];
  const primaryImage = images[0] || product?.node?.image;
  const secondaryImage = images[1] || images[0] || product?.node?.image;
  const displayImage = isHover ? secondaryImage : primaryImage;
  const displayPrice = chosenVariant?.price ?? product?.node?.price;

  return (
    <div
      className={`rounded-lg overflow-hidden bg-white border-2 border-gray-400/40 shadow-sm w-full h-auto ${
        compressed
          ? "max-w-[200px] sm:max-w-[220px] md:w-[240px] md:h-[400px]"
          : "max-w-[250px] sm:max-w-[270px] md:w-[320px] md:h-[460px]"
      } mx-auto`}
    >
      <Link
        href={`/product/${product.node.handle}`}
        className="flex flex-col h-full relative z-10"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        {chosenVariant && !chosenVariant.availableForSale && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-20">
            Out of Stock
          </div>
        )}
        {displayImage && (
          <div
            className={`relative aspect-[1/1] flex items-center justify-center w-full ${
              compressed
                ? "max-w-[190px] sm:max-w-[210px] md:w-[230px]"
                : "max-w-[240px] sm:max-w-[260px] md:w-[310px]"
            } mx-auto my-1`}
          >
            <Image
              src={displayImage.src}
              alt={displayImage.altText || product.node.title}
              fill
              className="object-contain rounded-md overflow-hidden"
              loading="lazy"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1280px) 25vw, 20vw"
            />
          </div>
        )}
        <div className="p-3 flex flex-col justify-start flex-1 gap-1.5">
          {compressed ? (
            <h2 className="product-title md:!text-lg !text-xs">{product.node.title}</h2>
          ) : (
            <h3 className="product-title md:!text-lg !text-sm">{product.node.title}</h3>
          )}
          {/* Rating below title (default 0 when missing) */}
          {(() => {
            try {
              const validMetafields = Array.isArray(product.node.metafields)
                ? product.node.metafields.filter((m) => m)
                : [];
              const ratingField = validMetafields.find(
                (m) => m.key === "rating"
              );
              const countField = validMetafields.find(
                (m) => m.key === "rating_count"
              );
              const parsed = ratingField?.value
                ? JSON.parse(ratingField.value)
                : null;
              const value = parsed?.value ? Number(parsed.value) : 0;
              const scaleMin = parsed?.scale_min ? Number(parsed.scale_min) : 1;
              const scaleMax = parsed?.scale_max ? Number(parsed.scale_max) : 5;
              const count = countField?.value ? Number(countField.value) : 0;
              return (
                <StarRating
                  ratingValue={value}
                  scaleMin={scaleMin}
                  scaleMax={scaleMax}
                  ratingCount={count}
                  size={14}
                  showText={true}
                  className="mb-1"
                />
              );
            } catch (e) {
              return (
                <StarRating
                  ratingValue={0}
                  scaleMin={1}
                  scaleMax={5}
                  ratingCount={0}
                  size={14}
                  showText={true}
                  className="mb-1"
                />
              );
            }
          })()}
          <p className="flex items-center justify-between font-semibold md:!text-lg !text-sm text-red-500 mt-auto">
            £ {displayPrice}
          </p>
          {/* Variant selection removed: show only first available variant */}
          <div className="mt-auto w-full relative z-20">
            <AddToCartButton
              variantId={chosenVariant?.id || variants[0]?.id}
              quantity={1}
              disabled={!product.node.availableForSale}
            />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
