"use client";

import React, { useMemo, useState } from "react";
import ProductGallery from "@/components/global/ProductGallery";
import AddToCartButton from "@/components/global/AddToCartButton";
import StarRating from "@/components/global/StarRating";
import Image from "next/image";

export default function ProductDetailClient({
  title,
  description,
  images = [],
  variants = [],
  totalInventory,
  reviews = [],
}) {
  const normalizedImages = useMemo(() => {
    return (images || [])
      .map((img) => ({
        src: img?.node?.src || img?.src,
        altText: img?.node?.altText || img?.altText || title,
      }))
      .filter((img) => !!img.src);
  }, [images, title]);

  const firstAvailable = useMemo(
    () => variants.find((v) => v.availableForSale) || variants[0] || null,
    [variants]
  );
  const [activeVariantId, setActiveVariantId] = useState(
    firstAvailable?.id || null
  );
  const activeVariant = useMemo(
    () =>
      variants.find((v) => v.id === activeVariantId) || firstAvailable || null,
    [variants, activeVariantId, firstAvailable]
  );
  const [quantity, setQuantity] = useState(1);

  const galleryImages = useMemo(() => {
    const optionValues = (activeVariant?.selectedOptions || [])
      .map((o) => String(o.value).toLowerCase())
      .filter(Boolean);

    const matchesAllOptions = (img) => {
      const hay = `${img.altText || ""} ${img.src || ""}`.toLowerCase();
      return optionValues.every((val) => hay.includes(val));
    };

    const filteredByOptions =
      optionValues.length > 0 ? normalizedImages.filter(matchesAllOptions) : [];

    const variantOnly = activeVariant?.image
      ? [
          {
            src: activeVariant.image.src,
            altText: activeVariant.image.altText || title,
          },
        ]
      : [];

    const base = filteredByOptions.length > 0 ? filteredByOptions : variantOnly;
    const merged = [...base, ...normalizedImages];

    const seen = new Set();
    return merged.filter((img) => {
      if (!img?.src) return false;
      const key = img.src;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [activeVariant, normalizedImages, title]);

  const priceLabel = useMemo(() => {
    const p = activeVariant?.price;
    if (!p) return "";
    return `${p.amount} ${p.currencyCode}`;
  }, [activeVariant]);

  let ratingValue, ratingScaleMin, ratingScaleMax, ratingCount;
  try {
    const ratingField = reviews.find((m) => m?.key === "rating");
    const ratingCountField = reviews.find((m) => m?.key === "rating_count");
    const parsed = ratingField?.value ? JSON.parse(ratingField.value) : null;
    ratingValue = parsed?.value ? Number(parsed.value) : undefined;
    ratingScaleMin = parsed?.scale_min ? Number(parsed.scale_min) : 1;
    ratingScaleMax = parsed?.scale_max ? Number(parsed.scale_max) : 5;
    ratingCount = ratingCountField?.value
      ? Number(ratingCountField.value)
      : undefined;
  } catch {}

  return (
    <div className="flex flex-col md:flex-row items-start justify-between gap-6 relative">
      <div className="md:w-5/12 w-full relative md:sticky top-0 md:top-[24%]">
        <ProductGallery images={galleryImages} />
      </div>
      <div className="md:w-5/12 w-full">
        {/* rating and reviews */}
        {typeof ratingValue === "number" && (
          <div className="mb-3 flex flex-row items-center gap-2">
            <StarRating
              ratingValue={ratingValue}
              scaleMin={ratingScaleMin}
              scaleMax={ratingScaleMax}
              ratingCount={ratingCount}
              size={16}
              showText
            />
          </div>
        )}

        {/* Title And Price */}
        <div className="mb-6">
          <h2 className="font-medium mb-1">{title}</h2>
          {priceLabel && <p className="text-lg font-medium">£ {priceLabel}</p>}
        </div>

        {/* Variant Dropdown */}
        {variants.length > 1 && (
          <div className="mb-2">
            <label className="block text-sm mb-1" htmlFor="variant-select">
              Variant
            </label>
            <select
              id="variant-select"
              className="w-full border rounded px-2 py-2 bg-white cursor-pointer"
              value={activeVariantId || ""}
              onChange={(e) => setActiveVariantId(e.target.value)}
            >
              {variants.map((v) => (
                <option key={v.id} value={v.id} disabled={!v.availableForSale}>
                  {v.title || v.id} {v.availableForSale ? "" : "(Out of stock)"}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Add To Cart */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center border rounded w-[120px] h-[40px] overflow-hidden">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, Number(q) - 1))}
              aria-label="Decrease quantity"
              className="w-10 h-full flex items-center justify-center cursor-pointer text-gray-600 hover:bg-gray-100"
            >
              −
            </button>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, Number(e.target.value) || 1))
              }
              className="w-full h-full text-center outline-none"
              aria-label="Quantity"
            />
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, Number(q) + 1))}
              aria-label="Increase quantity"
              className="w-10 h-full flex items-center justify-center cursor-pointer text-gray-600 hover:bg-gray-100"
            >
              +
            </button>
          </div>
          <div className="flex-1">
            <AddToCartButton
              variantId={activeVariant?.id}
              quantity={quantity}
            />
          </div>
        </div>
        {/* Available in Stock */}
        <div className="mb-6">
          <p>
            In Stock (<span className="font-semibold">{totalInventory}</span>).
            Ready to be shipped{" "}
          </p>
        </div>

        {/* Secured Checkout */}
        <div className="flex items-center justify-between px-2 py-1 border border-gray-400 rounded text-sm text-gray-600 mb-6">
          <p>Secure Checkout With</p>
          <div className="flex flex-row gap-2">
            <Image
              src="/assets/visa.svg"
              alt="Visa Logo"
              width={40}
              height={30}
            />
            <Image
              src="/assets/masterCard.svg"
              alt="Mastercard Logo"
              width={40}
              height={30}
            />
            <Image
              src="/assets/paypal.svg"
              alt="Paypal Logo"
              width={40}
              height={30}
            />
          </div>
        </div>

        {/* Product Description */}
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold pb-3 border-b border-gray-300">
            About The Product
          </h3>
          <div
            className="text-gray-600"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      </div>
    </div>
  );
}
