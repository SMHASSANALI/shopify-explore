import Link from 'next/link';
import { fetchShopify } from '@/lib/shopify';

export default async function BlogsPage() {
  // Query to fetch all blogs
  const query = `
    {
      blogs(first: 10) {
        edges {
          node {
            id
            title
            handle
          }
        }
      }
    }
  `;

  // Fetch data with error handling
  const fetchData = async () => {
    try {
      const data = await fetchShopify(query);
      if (!data?.blogs?.edges) {
        console.error('No blogs data received:', data);
        return { blogs: { edges: [] } };
      }
      return data;
    } catch (error) {
      console.error('Error fetching Shopify blogs:', error);
      return { blogs: { edges: [] } };
    }
  };

  const data = await fetchData();
  const blogs = data?.blogs?.edges || [];

  return (
    <main className="w-full flex items-center justify-center bg-[var(--primary-dark)] min-h-screen">
      <div className="max-w-[1400px] w-full py-8 px-4">
        <h1 className="text-3xl font-semibold text-white mb-6">Blogs</h1>
        {blogs.length === 0 ? (
          <p className="text-white text-lg">No blogs available.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {blogs.map((edge) => (
              <li key={edge.node.id} className="bg-white rounded-md shadow p-4">
                <Link
                  href={`/blogs/${edge.node.handle}`}
                  className="text-lg font-semibold text-neutral-800 hover:text-[var(--accent)]"
                >
                  {edge.node.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}