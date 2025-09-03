import CustomLink from "@/components/global/CustomLink";
import SwiperSlider from "@/components/global/SwiperSlider";
import { fetchCollectionByHandle, fetchShopify } from "@/lib/shopify";
import HeroWrapper from "@/components/hero/HeroWrapper";
import Link from "next/link";
import Image from "next/image";
import BentoWrapper from "@/components/bento/BentoWrapper";
import { toTitleCase } from "@/utils/toTitleCase";

export default async function Home() {
  const getAllCollectionQuery = {
    getAllCollections: `
      query {
        collections(first: 10) {
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
    `,
  };

  const allCollections = await fetchShopify(
    getAllCollectionQuery.getAllCollections,
    {
      first: 10,
    }
  );

  const under20_99Collection = await fetchCollectionByHandle(
    "everything-under-20-99"
  );
  const springSlowdownSaleCollection = await fetchCollectionByHandle(
    "spring-slowdown-sale"
  );

  return (
    <main className="mx-auto">
      <div className="bg-[var(--secondary)]/1 space-y-[50px] py-[50px]">
        <HeroWrapper handle="hero-banners" />

        <div className="max-w-[1400px] mx-auto space-y-[10px]">
          <div className="flex flex-row items-center justify-between border-b-4 border-gray-300 pb-2">
            <h1 className="font-semibold">Shop By Categories</h1>
            <Link href={"/collections"} className="hover:text-[var(--accent)]">
              View All Categories
            </Link>
          </div>
          <div className="flex flex-row overflow-x-auto overflow-y-hidden gap-2 bg-white p-2 rounded-lg">
            {allCollections.collections.edges.length > 0 &&
              allCollections.collections.edges.map((item) => (
                <Link
                  key={item.node.id}
                  href={`/collections/${item.node.handle}`}
                  className="hover:text-[var(--accent)] flex flex-col items-center gap-2"
                >
                  <div className="h-[130px] w-[130px] relative rounded-sm overflow-hidden">
                    <Image
                      src={item.node.image.src}
                      alt={
                        item.node.image.altText
                          ? item.node.image.altText
                          : item.node.title
                      }
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="font-extralight text-center">
                    {toTitleCase(item.node.title)}
                  </span>
                </Link>
              ))}
          </div>
        </div>
      </div>

      <section className="bg-[#f8fcff] flex flex-col py-[50px]">
        <SwiperSlider
          title={toTitleCase(under20_99Collection.title)}
          data={under20_99Collection.products}
        />
      </section>

      <BentoWrapper />

      <section className="bg-neutral-100 flex flex-col py-[50px]">
        <SwiperSlider
          title={toTitleCase(springSlowdownSaleCollection.title)}
          data={springSlowdownSaleCollection.products}
        />
      </section>

      <HeroWrapper handle="hero-banners" />
    </main>
  );
}

{
  /* Video section */
}
{
  /* <section className="flex flex-row h-[100dvh]">
  <div className="lg:w-1/2 h-full">
    <div className="relative h-full w-fit rounded-l-lg overflow-hidden shadow-lg">
      <video
        playsInline
        autoPlay
        loop
        muted
        controls
        preload="metadata"
        poster="https://haaaib.com/cdn/shop/files/preview_images/733257c79f554fcbbdfbd77e6f2c0268.thumbnail.0000000000_2500x.jpg"
        className="w-full h-full object-cover"
        aria-label="Promotional video showcasing jewelry collection"
      >
        <source
          src="https://haaaib.com/cdn/shop/videos/c/vp/733257c79f554fcbbdfbd77e6f2c0268/733257c79f554fcbbdfbd77e6f2c0268.HD-1080p-3.3Mbps-49549370.mp4"
          type="video/mp4"
        />
        <source
          src="https://haaaib.com/cdn/shop/videos/c/vp/733257c79f554fcbbdfbd77e6f2c0268/733257c79f554fcbbdfbd77e6f2c0268.webm"
          type="video/webm"
        />
        <p>
          Your browser does not support the video tag. Please view our
          collection images instead.
        </p>
      </video>
    </div>
  </div>
  <div className="lg:w-1/2 h-full relative">
    <div className="sticky top-0 p-[30px] flex flex-col h-screen justify-center">
      <h2 className="text-5xl max-w-2xl font-semibold font-[lora] mb-2 uppercase">
        A Legacy of elegance, reimagined.
      </h2>
      <p className="max-w-xl mb-4">
        Jewelry carries more than beauty - It holds memmories, milestones,
        and meaning. Our pieces are crafted to celebrate the stories you
        wear and the mommnts you'll never forget.
      </p>
      <div className="w-fit">
        <CustomLink
          text="Shop Now"
          href="/collections/jewelry"
          invert={false}
        />
      </div>
    </div>
  </div>
</section> */
}
