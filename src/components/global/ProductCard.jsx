"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import AddToCartButton from "./AddToCartButton";
import StarRating from "./StarRating";
import WishlistButton from "./WishlistButton";
import { useCustomer } from "@/contexts/CustomerContext";
import { getPriceDisplay } from "@/utils/discount-utlis";

const ProductCard = ({ product }) => {
  const customer = useCustomer();
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

  // Get discount information
  const originalPrice = chosenVariant?.price ?? product?.node?.price;
  const priceInfo = getPriceDisplay(
    originalPrice,
    product?.node?.metafields || []
  );

  return (
    <div className="h-full flex flex-col">
      <Link
        href={`/products/${product.node.handle}`}
        className="flex flex-col h-full relative z-10"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        {/* Badges Container */}
        <div className="absolute top-1 left-1 z-20 flex flex-col gap-1">
          {chosenVariant && !chosenVariant.availableForSale && (
            <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              Out of Stock
            </div>
          )}
          {priceInfo.hasDiscount && priceInfo.badge && (
            <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {priceInfo.badge}
            </div>
          )}
          {priceInfo.hasDiscount && priceInfo.discountPercentage && (
            <div className="bg-green-600 text-white text-xs font-bold w-fit px-2 py-1 rounded">
              {priceInfo.discountPercentage}% OFF
            </div>
          )}
        </div>

        {displayImage && (
          <div className="relative w-full h-[300px] border border-gray-300 shadow-sm rounded-md overflow-hidden">
            <Image
              src={displayImage.src}
              alt={
                displayImage.altText || `${product.node.title} product image`
              }
              width={300}
              height={300}
              className="object-cover"
              styles={{ width: "auto", height: "auto" }}
              priority
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1280px) 10vw, 10vw"
            />
          </div>
        )}

        <div className="p-1 mt-2 flex flex-col justify-start flex-1 gap-2 h-full">
          <div className="ml-auto w-fit">
            <WishlistButton product={product} customer={customer} />
          </div>

          <h3 className="product-title md:!text-[16px] leading-[110%] !tracking-tighter !text-sm md:h-[38px] line-clamp-2 text-ellipsis overflow-hidden">
            {product.node.title}
          </h3>

          {/* Price Display with Discount */}
          <div className="flex items-center gap-2">
            <p className="md:text-[16px] text-[14px] font-medium text-[var(--accent)]">
              £ {priceInfo.price}
            </p>
            {priceInfo.hasDiscount && (
              <p className="md:text-[14px] text-[12px] text-gray-500 line-through">
                £ {priceInfo.originalPrice}
              </p>
            )}
          </div>

          {/* Rating */}
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

          <AddToCartButton
            variantId={chosenVariant?.id || variants[0]?.id}
            quantity={1}
            disabled={!product.node.availableForSale}
          />
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
