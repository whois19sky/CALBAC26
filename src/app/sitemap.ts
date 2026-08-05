import { MetadataRoute } from "next";
import { getBlogPosts } from "@/lib/sanity";

const BASE_URL = "https://www.calcuttabackpackers.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/the-nest`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/wanderxp`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/the-social`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/booking`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/checkin`, changeFrequency: "monthly", priority: 0.5 },
  ];

  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await getBlogPosts();
    blogRoutes = posts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug.current}`,
      lastModified: post.publishedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch {
    // If the CMS call fails at build time, we still return the static routes
    // below rather than failing the whole sitemap.
  }

  return [...staticRoutes, ...blogRoutes];
}
