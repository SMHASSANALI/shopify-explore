// components/HeroWrapper.tsx
import { fetchShopify } from "@/lib/shopify";
import Hero from "./Hero";

export default async function HeroWrapper({ banners }) {
  return <Hero banners={banners} />;
}
