import ProductsSlider from "@/components/global/ProductsSlider";
import {
  fetchBlogs,
  fetchCollectionByHandle,
} from "@/lib/shopify";
import HeroWrapper from "@/components/hero/HeroWrapper";
import Link from "next/link";
import Image from "next/image";
import BentoWrapper from "@/components/bento/BentoWrapper";
import { toTitleCase } from "@/utils/toTitleCase";
import ReviewsSlider from "@/components/global/ReviewsSlider";
import CollectionsSection from "@/components/global/CollectionsSection";

export default async function Home() {
  const under20_99Collection = await fetchCollectionByHandle(
    "everything-under-20-99"
  );
  const springSlowdownSaleCollection = await fetchCollectionByHandle(
    "spring-slowdown-sale"
  );
  const recentBlogs = await fetchBlogs({ first: 3 });

  return (
    <main className="mx-auto 2xl:px-0 lg:px-4 px-2">
      <div className="bg-[var(--secondary)]/1">
          <HeroWrapper banners={"hero-banners"} />

        <CollectionsSection />
      </div>

      <section className="bg-[#f8fcff] flex flex-col py-[20px] md:py-[50px]">
        <ProductsSlider
          title={toTitleCase(under20_99Collection.title)}
          data={under20_99Collection.products}
        />
      </section>

      <BentoWrapper />

      <section className="bg-[#F8FCFF] flex flex-col py-[20px] md:py-[50px]">
        <ProductsSlider
          title={toTitleCase(springSlowdownSaleCollection.title)}
          data={springSlowdownSaleCollection.products}
        />
      </section>

        <HeroWrapper banners={"ad-banners"} />

      <section className="bg-[#F8FCFF] flex flex-col py-[20px] md:py-[50px]">
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
                href={`/blogs/${blog.blog.handle}/${blog.handle}`}
                className="p-4 bg-white rounded-lg shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow"
              >
                <div className="relative w-full h-64 rounded-t overflow-hidden mb-2">
                  <Image
                    src={blog.featuredImage?.url || "/assets/placeholder.jpg"}
                    alt={blog.featuredImage?.altText || blog.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2">{blog.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3 text-ellipsis">
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
