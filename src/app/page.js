import BentoWrapper from "@/components/bento/BentoWrapper";
import CollectionsSection from "@/components/global/CollectionsSection";
import ProductsSlider from "@/components/global/ProductsSlider";
import RevealGallery from "@/components/global/RevealGallery";
import ReviewsSlider from "@/components/global/ReviewsSlider";
import HeroWrapper from "@/components/hero/HeroWrapper";
import { fetchHomePageData } from "@/lib/shopify/fetch/home";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const { hero, ads, main, secondary, collections, blogs, bento, trending } =
    await fetchHomePageData();

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
        <HeroWrapper data={hero} />

        <CollectionsSection data={collections} />
      </div>

      <section className="flex flex-col py-[20px] md:py-[50px]">
        <ProductsSlider data={main} />
      </section>

      <BentoWrapper data={bento} trendingData={trending} />

      <section className="flex flex-col py-[20px] md:py-[50px]">
        <ProductsSlider data={secondary} />
      </section>

      <section className="flex flex-col md:flex-row max-w-[1400px] mx-auto relative h-[200dvh] bg-gray-100 rounded-xl shadow-lg">
        <div className="w-full md:w-4/12 flex flex-col items-start justify-start md:justify-center gap-2 sticky top-20 h-[100dvh] p-[20px]">
          <span className="text-[var(--accent)] font-medium">
            {trending?.products.edges[1]?.node.title}
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
              `/products/${trending?.products.edges[1]?.node.handle}` || "/"
            }
            className="hover:bg-transparent hover:text-[var(--accent)] duration-300 transition-all  bg-[var(--accent)] text-white rounded border border-[var(--accent)] py-2 px-4 cursor-pointer"
          >
            Buy Now
          </Link>
        </div>
        <div className="w-full md:w-8/12">
          <RevealGallery />
        </div>
      </section>

      <HeroWrapper data={ads} />

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
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blogs/${blog.handle}`}
                className="p-4 bg-white rounded-lg shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow"
              >
                <div className="w-full h-[200px] object-cover rounded-md overflow-hidden mb-4">
                  <Image
                    src={blog.image?.url || "/assets/placeholder.jpg"}
                    alt={blog.image?.altText || blog.title}
                    width={400}
                    height={200}
                    className="object-cover w-full h-full object-center"
                    style={{ width: "auto", height: "auto" }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1400px) 50vw, 25vw"
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
