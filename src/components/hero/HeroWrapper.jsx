import { Suspense } from "react";
import Hero from "./Hero";

export default function HeroWrapper({ data }) {
  const banners = data?.products || [];

  return (
    <Suspense
      fallback={
        <div className="w-full h-fit">
          <div className="relative aspect-[19/6] lg:max-w-[1400px] w-full bg-gray-200 animate-pulse rounded-lg" />
        </div>
      }
    >
      <Hero banners={banners} type="hero" />
    </Suspense>
  );
}
