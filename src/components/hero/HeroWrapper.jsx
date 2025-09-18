// components/HeroWrapper.tsx
import { Suspense } from "react";
import { fetchCollectionByHandle } from "@/lib/shopify";
import Hero from "./Hero";

export default async function HeroWrapper({ handle = "hero-banners" }) {
  const collection = await fetchCollectionByHandle(handle);
  const banners = collection.products || [];

  return (
    <Suspense
      fallback={
        <div className="w-full h-fit">
          <div className="relative aspect-[19/6] lg:max-w-[1400px] w-full md:h-auto bg-gray-200 animate-pulse rounded-lg" />
        </div>
      }
    >
      <Hero banners={banners} />
    </Suspense>
  );
}