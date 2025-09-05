// import { fetchAllProducts, fetchShopify } from "@/lib/shopify";
// import CollectionsSection from "@/components/global/CollectionsSection";
// import {
//   TfiLayoutColumn3,
//   TfiLayoutColumn3Alt,
//   TfiLayoutColumn4,
//   TfiLayoutColumn4Alt,
// } from "react-icons/tfi";
// import ProductCard from "@/components/global/ProductCard";

// export const metadata = {
//   title: "Products | HA-AA-IB",
// };

// export default async function ProductsPage() {
//   // Fetch all products (up to 250 for most stores)
//   const data = await fetchAllProducts({ first: 250 });
//   const products = data || [];

//   return (
//     <main className="w-full min-h-screen bg-white">
//       <main className="max-w-[1400px] mx-auto">
//         <CollectionsSection />
//         <div className="flex flex-row w-full h-full gap-[10px] border">
//           <div className="relative w-3/12 border p-2">
//             <div className="sticky top-[23%] h-fit py-2 w-full flex flex-col gap-[20px]">
//               <h2 className="font-semibold">Filter:</h2>
//               <div className="flex flex-col gap-[10px]">
//                 <p className="pb-2 border-b">Availability</p>
//                 {/* In Stock and Out of Stock checkbox */}
//                 <div className="flex flex-row justify-start gap-4">
//                   <label className="flex items-center gap-2">
//                     <input type="checkbox" className="accent-[var(--accent)]" />
//                     In Stock
//                   </label>
//                   <label className="flex items-center gap-2">
//                     <input type="checkbox" className="accent-[var(--accent)]" />
//                     Out of Stock
//                   </label>
//                 </div>
//               </div>
//               <div className="flex flex-col gap-[10px]">
//                 {/* Price slider with from and to input fields */}
//                 <p className="pb-2 border-b">Price</p>
//                 <div className="flex flex-row justify-start gap-4">
//                   <div className="flex items-center gap-2">
//                     <span>From:</span>
//                     <input
//                       type="number"
//                       className="w-full p-1 border border-[var(--primary-light)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
//                       placeholder="0"
//                     />
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span>To:</span>
//                     <input
//                       type="number"
//                       className="w-full p-1 border border-[var(--primary-light)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
//                       placeholder="0"
//                     />
//                   </div>
//                 </div>
//                 <input
//                   type="range"
//                   min="0"
//                   max="100"
//                   step="1"
//                   className="w-full"
//                 />
//               </div>
//             </div>
//           </div>
//           <div className="w-9/12 rounded shadow flex flex-col gap-[20px]">
//             <div className="w-full bg-[var(--background)] py-1 px-2 flex flex-row justify-between items-center">
//               <div className="flex flex-row gap-2">
//                 <button className="p-2 bg-white text-[var(--primary-dark)] rounded border border-[var(--primary-light)] cursor-pointer hover:bg-gray-200">
//                   <TfiLayoutColumn3Alt size={20} />
//                 </button>
//                 <button className="p-2 bg-white text-[var(--primary-dark)] rounded border border-[var(--primary-light)] cursor-pointer hover:bg-gray-200">
//                   <TfiLayoutColumn4Alt size={20} />
//                 </button>
//               </div>
//               <div>
//                 <span className="font-light">Sort by:</span>
//                 <select className="ml-2 p-1 border border-[var(--primary-light)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--accent)] bg-white cursor-pointer">
//                   <option value="best-selling">Best Selling</option>
//                   <option value="title-ascending">Title, A-Z</option>
//                   <option value="title-descending">Title, Z-A</option>
//                   <option value="price-ascending">Price, low to high</option>
//                   <option value="price-descending">Price, high to low</option>
//                   <option value="created-ascending">Date, old to new</option>
//                   <option value="created-descending">Date, new to old</option>
//                 </select>
//               </div>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-2">
//               {products.length > 0 ? (
//                 products.map((product) => (
//                   <ProductCard key={product.id} product={product} compressed />
//                 ))
//               ) : (
//                 <p>No products found.</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>
//     </main>
//   );
// }


import { fetchAllProducts } from "@/lib/shopify";
import CollectionsSection from "@/components/global/CollectionsSection";
import { ProductsClient } from "@/components/products/ProductsClient";

export const metadata = {
  title: "Products | HA-AA-IB",
};

export default async function ProductsPage() {
  // Fetch initial 30 products on server
  const { products: initialProducts, hasNextPage: initialHasNextPage, endCursor: initialEndCursor } = await fetchAllProducts({ first: 30 });

  return (
    <main className="w-full min-h-screen bg-white">
      <main className="max-w-[1400px] mx-auto">
        <CollectionsSection />
        <ProductsClient 
          initialProducts={initialProducts} 
          initialHasNextPage={initialHasNextPage} 
          initialEndCursor={initialEndCursor} 
        />
      </main>
    </main>
  );
}