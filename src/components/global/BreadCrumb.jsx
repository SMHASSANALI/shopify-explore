// "use client";

// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { fetchShopify } from "@/lib/shopify";

// const BreadCrumb = ({
//   className = "",
//   homeLabel = "Home",
//   separator = ">",
//   titleMap = {}, // Custom title mapping for static routes
//   fetchTitles = true, // Toggle dynamic title fetching
// }) => {
//   const pathname = usePathname();
//   const router = useRouter();
//   const [pathTitles, setPathTitles] = useState([]);
//   const paths = pathname.split("/").filter((path) => path !== "");

//   // Fetch dynamic titles for paths (e.g., blog/article handles)
//   useEffect(() => {
//     const fetchTitlesForPaths = async () => {
//       if (!fetchTitles) {
//         setPathTitles(paths.map((path) => titleMap[path] || path));
//         return;
//       }

//       const titles = await Promise.all(
//         paths.map(async (path, index) => {
//           // Static mapping or default handling
//           if (titleMap[path]) return titleMap[path];

//           // Dynamic fetching for specific routes
//           if (index === 0 && path === "blogs") return "Blogs";
//           if (index === 1) {
//             const query = `
//               query ($handle: String!) {
//                 blog(handle: $handle) {
//                   title
//                 }
//               }
//             `;
//             try {
//               const data = await fetchShopify(query, { handle: path });
//               return data?.blog?.title || path;
//             } catch (error) {
//               console.error(
//                 `Error fetching blog title for handle ${path}:`,
//                 error
//               );
//               return path;
//             }
//           }
//           if (index === 2) {
//             const blogHandle = paths[1];
//             const query = `
//               query ($blogHandle: String!, $articleHandle: String!) {
//                 blog(handle: $blogHandle) {
//                   articles(query: $articleHandle, first: 1) {
//                     edges {
//                       node {
//                         title
//                       }
//                     }
//                   }
//                 }
//               }
//             `;
//             try {
//               const data = await fetchShopify(query, {
//                 blogHandle,
//                 articleHandle: path,
//               });
//               return data?.blog?.articles.edges[0]?.node?.title || path;
//             } catch (error) {
//               console.error(
//                 `Error fetching article title for handle ${path}:`,
//                 error
//               );
//               return path;
//             }
//           }
//           return path;
//         })
//       );
//       setPathTitles(titles);
//     };

//     fetchTitlesForPaths();
//   }, [pathname, fetchTitles, titleMap]);

//   return (
//     <nav className={`flex items-center ${className}`} aria-label="Breadcrumb">
//       <div className="flex flex-row items-center justify-center ">
//         <Link href="/">
//           <p className="text-gray-500 hover:text-gray-700">{homeLabel}</p>
//         </Link>
//         {paths.length > 0 && (
//           <span className="mx-2 text-gray-400">{separator}</span>
//         )}
//         {paths.map((path, index) => (
//           <span key={index} className="flex items-center">
//             {index < paths.length - 1 ? (
//               <>
//                 <Link href={`/${paths.slice(0, index + 1).join("/")}`}>
//                   <p className="text-gray-500 hover:text-gray-700">
//                     {pathTitles[index] || path}
//                   </p>
//                 </Link>
//                 <span className="mx-2 text-gray-400">{separator}</span>
//               </>
//             ) : (
//               <span className="text-gray-700 font-medium">
//                 {pathTitles[index] || path}
//               </span>
//             )}
//           </span>
//         ))}
//       </div>
//     </nav>
//   );
// };

// export default BreadCrumb;
