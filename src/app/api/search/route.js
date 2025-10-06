import { NextResponse } from "next/server";
import { fetchShopify } from "@/lib/shopify";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim();
  if (!q) {
    return NextResponse.json({ products: [], collections: [], articles: [] });
  }

  const query = `
    query Search($query: String!) {
      products(first: 5, query: $query) {
        edges { node { id title handle images(first: 1) { edges { node { src altText } } } } }
      }
      collections(first: 5, query: $query) {
        edges { node { id title handle image { src altText } } }
      }
      articles(first: 5, query: $query) {
        edges { node { id title handle blog { handle } excerpt } }
      }
    }
  `;

  try {
    const data = await fetchShopify(query, { query: q }, { cache: 'no-store', revalidate: 0 });
    const products = (data?.products?.edges || []).map(({ node }) => ({
      id: node.id,
      title: node.title,
      handle: node.handle,
      image: node.images?.edges?.[0]?.node || null,
      href: `/products/${node.handle}`,
    }));
    const collections = (data?.collections?.edges || []).map(({ node }) => ({
      id: node.id,
      title: node.title,
      handle: node.handle,
      image: node.image || null,
      href: `/collections/${node.handle}`,
    }));
    const articles = (data?.articles?.edges || []).map(({ node }) => ({
      id: node.id,
      title: node.title,
      handle: node.handle,
      blogHandle: node.blog?.handle,
      excerpt: node.excerpt,
      href: `/blogs/${node.blog?.handle}/${node.handle}`,
    }));
    return NextResponse.json({ products, collections, articles });
  } catch (e) {
    console.error("Search API error:", e?.message || e);
    return NextResponse.json({ products: [], collections: [], articles: [] }, { status: 200 });
  }
}


