import { fetchShopify } from "@/lib/shopify";
import Link from "next/link";

export default async function BlogPage({ params }) {
  const { handle: blogHandle } = await Promise.resolve(params);

  // Query to fetch a specific blog and its articles
  const query = `
    query ($handle: String!) {
      blog(handle: $handle) {
        id
        title
        articles(first: 50) {
          edges {
            node {
              id
              title
              handle
              content
              excerpt
              publishedAt
              author {
                name
                bio
              }
            }
          }
        }
      }
    }
  `;

  // Fetch data with error handling
  const fetchData = async () => {
    try {
      const data = await fetchShopify(query, { handle: blogHandle });
      if (!data?.blog) {
        console.error("No blog data received for handle:", blogHandle);
        return { blog: null };
      }
      return data;
    } catch (error) {
      console.error("Error fetching Shopify blog:", error);
      return { blog: null };
    }
  };

  const data = await fetchData();
  const blog = data?.blog;
  const articles = blog?.articles?.edges || [];

  if (!blog) {
    return (
      <main className="w-full flex items-center justify-center min-h-screen">
        <div className="max-w-[1400px] w-full py-8">
          <h1 className="text-3xl font-semibold text-black mb-6">
            Blog Not Found
          </h1>
          <p className="text-black text-lg">
            Sorry, the blog you are looking for does not exist.
          </p>
          <Link
            href="/blogs"
            className="text-[var(--accent)] hover:underline mt-4 inline-block"
          >
            Back to Blogs
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full flex items-center justify-center min-h-screen">
      <div className="max-w-[1400px] w-full py-8 ">
        <h1 className="text-3xl font-semibold text-black mb-6">{blog.title}</h1>
        {articles.length === 0 ? (
          <p className="text-black text-lg">
            No articles available in this blog.
          </p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {articles.map((edge) => (
              <li
                key={edge.node.id}
                className="bg-white rounded-md shadow p-4 hover:shadow-lg transition-shadow"
              >
                <Link
                  href={`/blogs/${blogHandle}/${edge.node.handle}`}
                  className="text-lg font-semibold text-neutral-800 hover:text-[var(--accent)]"
                >
                  {edge.node.title}
                </Link>
                <p className="text-neutral-600 text-sm mt-2 line-clamp-3">
                  {edge.node.excerpt || edge.node.content}
                </p>
                {edge.node.author && (
                  <p className="text-xs text-gray-500 mt-2">
                    By {edge.node.author.name}
                  </p>
                )}
                {edge.node.featuredImage && (
                  <div className="relative w-full h-32 mt-2">
                    <Image
                      src={edge.node.featuredImage.url}
                      alt={edge.node.featuredImage.altText || edge.node.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
