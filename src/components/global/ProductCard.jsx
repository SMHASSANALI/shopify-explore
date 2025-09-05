import Image from "next/image";
import Link from "next/link";
import React from "react";
import AddToCartButton from "./AddToCartButton";

const ProductCard = ({ product, compressed = false }) => {
  return (
    <div
      className={`rounded-lg overflow-hidden bg-white border-2 border-gray-400/40 shadow-sm ${
        compressed ? "h-[390px] w-[220px]" : "h-[427px] w-[262px]"
      }`}
    >
      <Link
        href={`/product/${product.node.handle}`}
        className="flex flex-col h-full relative z-10"
      >
        {!product.node.availableForSale && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-20">
            Out of Stock
          </div>
        )}
        {product.node.image && (
          <div
            className={`relative aspect-[1/1] flex items-center justify-center ${
              compressed ? "w-[210px]" : "w-[250px]"
            } mx-auto my-1`}
          >
            <Image
              src={product.node.image.src}
              alt={product.node.image.altText || product.node.title}
              fill
              className="object-contain rounded-md overflow-hidden"
              loading="lazy"
            />
          </div>
        )}
        <div className="p-3 flex flex-col justify-start flex-1 gap-1.5">
          {compressed ? (
            <h2 className="product-title h-[50px]">{product.node.title}</h2>
          ) : (
            <h3 className="product-title h-[50px]">{product.node.title}</h3>
          )}
          {/* <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 ${
                  i < product.node.rating
                    ? "text-yellow-500"
                    : "text-yellow-500"
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 15.27L16.18 18l-1.64-7.03L19 9.24l-7.19-.61L10 2 7.19 8.63 0 9.24l5.46 1.73L3.82 18z" />
              </svg>
            ))}
          </div> */}
          <p className="flex items-center justify-between font-semibold text-lg text-red-500 mt-auto">
            £ {product.node.price}
          </p>
          <div className="mt-auto w-full relative z-20">
            <AddToCartButton
              variantId={product.node.variants.edges[0]?.node.id}
            />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
