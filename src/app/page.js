// src/app/page.js
import SwiperSlider from "@/components/global/SwiperSlider";
import Hero from "@/components/Hero";
import { fetchShopify } from "@/lib/shopify";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const query = `
    {
      collections( first: 9 ) {
        edges {
          node {
            id
            title
            handle
            image {
              src
              altText
            }
          }
        }
      }
    }
  `;

  const data = await fetchShopify(query);
  const collections = data?.collections?.edges || [];

  return (
    <main className="mx-auto px-6">
      <section className="sticky top-0 z-0">
        <Hero
          url={
            "https://cdn.shopify.com/s/files/1/0895/2954/9134/files/Simple_Modern_Photo_Collage_Autumn_Fashion_Sale_Banner.png?v=1747742254"
          }
        />
        {/* Promo Banner */}
        <section className="mb-12">
          <div className="shadow-inner shadow-black/50 bg-[var(--primary-dark)] m-1 p-6 rounded-lg text-center flex flex-row items-center justify-between gap-4">
            <div className="flex flex-col items-start text-white">
              <h2 className="text-3xl font-bold text-white mb-2">
                LIMITED OFFER
              </h2>
              <p className="text-lg font-medium">
                Spring Slowdown Sale - Flat 15% off on selected items!
              </p>
            </div>
            <Link
              href="/collections/spring-slowdown-sale"
              className="transition duration-300 cursor-pointer border border-white hover:bg-white hover:text-[var(--primary-dark)] text-white font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline"
            >
              Shop Now
            </Link>
          </div>
        </section>
      </section>
      <main className="bg-[var(--background)] relative z-10">
        {/* Collections */}
        <section className="mb-16 py-12 px-6 bg-white rounded-xl shadow-lg">
          <SwiperSlider
            title="Shop by Collection"
            data={collections}
            endpoint={"collections"}
          />
        </section>

        {/* About Section */}
        <section className="py-12 text-center border-t">
          <h2 className="text-xl font-bold mb-4">Why HA-AA-IB?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We believe in timeless design, comfort, and quality. Our garments
            are crafted with care to bring you everyday essentials that last.
          </p>
        </section>

        {/* Contact CTA */}
        <section className="py-12 text-center">
          <p className="text-gray-700">Have a question or need support?</p>
          <Link
            href="/contact"
            className="text-blue-600 font-medium hover:underline"
          >
            Get in touch
          </Link>
        </section>
      </main>
    </main>
  );
}
