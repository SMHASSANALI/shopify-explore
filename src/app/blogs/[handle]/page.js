import Link from 'next/link';
import { fetchShopify } from '@/lib/shopify';

export default async function BlogPage({ params }) {
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
            }
          }
        }
      }
    }
  `;

  // Fetch data with error handling
  const fetchData = async () => {
    try {
      const data = await fetchShopify(query, { handle: params.handle });
      if (!data?.blog) {
        console.error('No blog data received for handle:', params.handle);
        return { blog: null };
      }
      return data;
    } catch (error) {
      console.error('Error fetching Shopify blog:', error);
      return { blog: null };
    }
  };

  const data = await fetchData();
  const blog = data?.blog;
  const articles = blog?.articles?.edges || [];

  if (!blog) {
    return (
      <main className="w-full flex items-center justify-center bg-[var(--primary-dark)] min-h-screen">
        <div className="max-w-[1400px] w-full py-8 px-4">
          <h1 className="text-3xl font-semibold text-white mb-6">Blog Not Found</h1>
          <p className="text-white text-lg">
            Sorry, the blog you are looking for does not exist.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full flex items-center justify-center bg-[var(--primary-dark)] min-h-screen">
      <div className="max-w-[1400px] w-full py-8 px-4">
        <h1 className="text-3xl font-semibold text-white mb-6">{blog.title}</h1>
        {articles.length === 0 ? (
          <p className="text-white text-lg">No articles available in this blog.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {articles.map((edge) => (
              <li key={edge.node.id} className="bg-white rounded-md shadow p-4">
                <Link
                  href={`/blogs/${params.handle}/${edge.node.handle}`}
                  className="text-lg font-semibold text-neutral-800 hover:text-[var(--accent)]"
                >
                  {edge.node.title}
                </Link>
                <p className="text-neutral-600 text-sm mt-2 line-clamp-3">
                  {edge.node.content}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}