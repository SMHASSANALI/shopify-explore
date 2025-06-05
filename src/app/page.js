import CategoryAdSec from "@/components/CategoryAdSec";
import CustomLink from "@/components/global/CustomLink";
import SwiperSlider from "@/components/global/SwiperSlider";
import Hero from "@/components/Hero";
import { fetchShopify } from "@/lib/shopify";

export default async function Home() {
  
  // Query for collections
  const collectionsQuery = `
    {
      collections(first: 9) {
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

  // Query for products in "Spring Slowdown Sale" collection
  const productsQuery = `
    query CollectionByHandle($handle: String!) {
      collectionByHandle(handle: $handle) {
        id
        title
        products(first: 7) {
          edges {
            node {
              id
              title
              handle
              images(first: 1) {
                edges {
                  node {
                    src
                    altText
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const collectionsData = await fetchShopify(collectionsQuery);
  const collections = collectionsData?.collections?.edges || [];

  const collectionProductHandle = "spring-slowdown-sale"
  const collectionProductsData = await fetchShopify(productsQuery, {
    handle: collectionProductHandle,
  });
  const collectionProdtucts = collectionProductsData?.collectionByHandle?.products?.edges || [];

  // Prepare product data for CategoryAdSec
  const collectionProdtuctsImages = collectionProdtucts.map(({ node }) => ({
    src: node.images.edges[0]?.node.src || "/images/placeholder.jpg",
    altText: node.images.edges[0]?.node.altText || node.title,
    handle: node.handle,
  }));

  // Ensure at least 7 items for pictureArray, using placeholders if needed
  const fallbackImage = {
    src: "/images/placeholder.jpg",
    altText: "Placeholder product image",
    handle: "#",
  };
  while (collectionProdtuctsImages.length < 7) {
    collectionProdtuctsImages.push(fallbackImage);
  }

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
            <CustomLink
              text="Shop Now"
              href="/collections/spring-slowdown-sale"
              invert={true}
            />
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
          <div className="flex justify-center mt-24">
            <CustomLink
              text="View All Collections"
              href="/collections"
              invert={false}
            />
          </div>
        </section>
        {/* Featured Collection AD */}
        <section className="">
          <CategoryAdSec productImages={collectionProdtuctsImages} handle={collectionProductHandle} />
        </section>
      </main>
    </main>
  );
}