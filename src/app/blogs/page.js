import Link from "next/link";
import { fetchBlogs, fetchShopify } from "@/lib/shopify";
import Image from "next/image";

export default async function BlogsPage() {
  const recentBlogs = await fetchBlogs({ first: 100 });

  return (
    <main className="w-full flex p-2 md:p-0">
      <div className="max-w-[1400px] mx-auto w-full min-h-screen">
        <h1 className="py-[50px]">Blogs</h1>
        {recentBlogs.length === 0 ? (
          <p className="text-white text-lg">No blogs available.</p>
        ) : (
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
        )}
      </div>
    </main>
  );
}
