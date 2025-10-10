import ProductsSlider from "@/components/global/ProductsSlider";
import { fetchBlogs, fetchCollectionByHandle } from "@/lib/shopify";
import HeroWrapper from "@/components/hero/HeroWrapper";
import Link from "next/link";
import Image from "next/image";
import BentoWrapper from "@/components/bento/BentoWrapper";
import { toTitleCase } from "@/utils/toTitleCase";
import ReviewsSlider from "@/components/global/ReviewsSlider";
import CollectionsSection from "@/components/global/CollectionsSection";
import RevealGallery from "@/components/global/RevealGallery";
import left from "public/assets/images/ImageLeft.png";
import right from "public/assets/images/ImageRight.png";
import center from "public/assets/images/ImageCenter.png";

export const metadata = {
  title: "Home | HAAAIB",
  description:
    "Explore our curated collection of home décor, fashion, and lifestyle products at budget-friendly prices.",
  openGraph: {
    title: "Home | HAAAIB",
    description:
      "Explore our curated collection of home décor, fashion, and lifestyle products at budget-friendly prices.",
    url: "/",
    images: [
      {
        url: "/assets/logoMark-Dark.png",
        width: 1200,
        height: 630,
        alt: "HAAAIB Products",
      },
    ],
  },
};

export default async function Home() {
  const mainCollection = await fetchCollectionByHandle("christmas");
  const secondaryCollection = await fetchCollectionByHandle("spooky-autumn");
  const recentBlogs = await fetchBlogs({ first: 3 });
  const featureProducts = await fetchCollectionByHandle("trending-now", {
    first: 2,
  });
  console.log("featureProducts", featureProducts);

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "HAAAIB",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.haaaib.com",
    potentialAction: {
      "@type": "SearchAction",
      target: `${
        process.env.NEXT_PUBLIC_SITE_URL || "https://www.haaaib.com"
      }/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <main className="mx-auto 2xl:px-0 lg:px-4 px-2">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <div className="">
        <HeroWrapper handle={"hero-banners"} />

        <CollectionsSection />
      </div>

      <section className="flex flex-col py-[20px] md:py-[50px]">
        <ProductsSlider
          title={toTitleCase(mainCollection.title)}
          data={mainCollection.products}
        />
      </section>

      <BentoWrapper />

      <section className="flex flex-col py-[20px] md:py-[50px]">
        <ProductsSlider
          title={toTitleCase(secondaryCollection.title)}
          data={secondaryCollection.products}
        />
      </section>

      <section className="flex flex-col md:flex-row max-w-[1400px] mx-auto relative h-[200dvh] bg-gray-100 rounded-xl shadow-lg">
        <div className="w-full md:w-4/12 flex flex-col items-start justify-start md:justify-center gap-2 sticky top-20 h-[100dvh] p-[20px]">
          <span className="text-[var(--accent)] font-medium">
            {featureProducts?.products[0].node.title}
          </span>
          <h1 className="font-semibold">
            Transform Any Seat Into a Cloud of Comfort
          </h1>
          <p>
            Say goodbye to back pain and numb hips! This ergonomic cushion hugs
            your spine, relieves pressure, and supports perfect posture with
            memory foam that adapts to you. Whether it’s work, travel, or long
            drives — sit smarter, not harder.
          </p>
          <Link
            href={
              `/products/${featureProducts?.products[0].node.handle}` || "/"
            }
            className="hover:bg-transparent hover:text-[var(--accent)] duration-300 transition-all  bg-[var(--accent)] text-white rounded border border-[var(--accent)] py-2 px-4 cursor-pointer"
          >
            Buy Now
          </Link>
        </div>
        <div className="w-full md:w-8/12">
          <RevealGallery
            mediaLeft={left || "/public/assets/placeholder.jpg"}
            mediaCenter={center || "/public/assets/placeholder.jpg"}
            mediaRight={right || "/public/assets/placeholder.jpg"}
          />
        </div>
      </section>

      <HeroWrapper handle={"ad-banners"} />

      <section className="flex flex-col py-[20px] md:py-[50px]">
        <ReviewsSlider />
      </section>

      <div className="max-w-[1400px] mx-auto space-y-[50px] py-[20px] md:py-[50px]">
        <div className="flex flex-row items-center justify-between border-b-4 border-gray-300 pb-2">
          <h1 className="font-semibold">Recent Articles</h1>
          <Link href={"/blogs"} className="hover:text-[var(--accent)]">
            View All Blogs
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {recentBlogs.length > 0 ? (
            recentBlogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blogs/${blog.blog.handle}`}
                className="p-4 bg-white rounded-lg shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow"
              >
                <div className="relative w-full h-48 object-cover rounded-md overflow-hidden mb-4">
                  <Image
                    src={blog.image || "/public/assets/placeholder.jpg"}
                    alt={blog.image?.altText || blog.title}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2">{blog.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3 text-ellipsis mb-2">
                  {blog.excerpt || blog.content}
                </p>
                <p className="text-black font-semibold ml-auto w-fit text-xs">
                  Published on {new Date(blog.publishedAt).toLocaleDateString()}
                </p>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500">No articles available</p>
          )}
        </div>
      </div>
    </main>
  );
}
