import Link from "next/link";
import { fetchShopify } from "@/lib/shopify";

export async function generateMetadata({ params }) {
  const { handle: blogHandle, articleHandle } = await Promise.resolve(params);
  const query = `
    query ($blogHandle: String!, $articleHandle: String!) {
      blog(handle: $blogHandle) {
        title
        articles(query: $articleHandle, first: 1) {
          edges { node { title excerpt } }
        }
      }
    }
  `;
  try {
    const data = await fetchShopify(query, { blogHandle, articleHandle });
    const blog = data?.blog;
    const article = blog?.articles?.edges?.[0]?.node;
    const title = article?.title || articleHandle;
    const description = article?.excerpt || `Read ${title} on HAAAIB blog.`;
    const canonical = `/blogs/${blogHandle}/${articleHandle}`;
    return {
      title: `${title} | HAAAIB Blog`,
      description,
      alternates: { canonical },
      openGraph: { title: `${title} | HAAAIB Blog`, description, url: canonical },
      twitter: { card: "summary", title: `${title} | HAAAIB Blog`, description },
    };
  } catch {
    return { title: `${articleHandle} | HAAAIB Blog` };
  }
}
import styles from "./article-page.module.css";

export default async function ArticlePage({ params }) {
  const { handle: blogHandle, articleHandle } = await Promise.resolve(params);

  // Query to fetch a specific article by blog handle and article handle
  const query = `
    query ($blogHandle: String!, $articleHandle: String!) {
      blog(handle: $blogHandle) {
        id
        title
        articles(query: $articleHandle, first: 1) {
          edges {
            node {
              id
              title
              handle
              contentHtml
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
      const data = await fetchShopify(query, { blogHandle, articleHandle });
      if (!data?.blog || !data.blog.articles.edges.length) {
        console.error("No article data received for handle:", articleHandle);
        return { blog: null };
      }
      return data;
    } catch (error) {
      console.error("Error fetching Shopify article:", error);
      return { blog: null };
    }
  };

  const data = await fetchData();
  const blog = data?.blog;
  const article = blog?.articles.edges[0]?.node || null;

  if (!article) {
    return (
      <main className="w-full min-h-screen">
        <div className="max-w-[1000px] border mx-auto w-full py-8">
          <h1 className="text-3xl font-semibold text-black mb-6">
            Article Not Found
          </h1>
          <p className="text-black text-lg">
            Sorry, the article you are looking for does not exist or has been removed.
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
    <main className="w-full flex items-center justify-center min-h-screen p-3 md:p-0">
      <div className="max-w-[1400px] w-full py-8 ">
        <h1 className="text-3xl font-semibold text-black mb-6">
          {article.title}
        </h1>
        <div
          className={`${styles.articleContent} text-black text-lg prose prose-invert max-w-none`}
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />
        <p className="text-black text-sm mt-4">
          Published on: {new Date(article.publishedAt).toLocaleDateString()}
        </p>
        <Link
          href={`/blogs/${blogHandle}`}
          className="text-[var(--accent)] hover:underline mt-4 inline-block"
        >
          Back to {blog.title}
        </Link>
      </div>
    </main>
  );
}
