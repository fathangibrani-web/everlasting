import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";
import { allCategoriesQuery, allPostsQuery } from "@/sanity/lib/queries";
import { safeFetch } from "@/sanity/lib/safeFetch";
import type { Category, PostCard } from "@/sanity/lib/types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories] = await Promise.all([
    safeFetch<PostCard[]>(allPostsQuery, {}, []),
    safeFetch<Category[]>(allCategoriesQuery, {}, []),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/genre`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/profil`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/artikel/${post.slug.current}`,
    lastModified: post.publishedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE_URL}/genre/${cat.slug.current}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes, ...categoryRoutes];
}
