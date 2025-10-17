import BentoSection from "./Bento";

export default async function BentoWrapper({ data, trendingData }) {
  const images = data?.products?.edges || [];
  return <BentoSection images={images} collectionData={trendingData} />;
}
