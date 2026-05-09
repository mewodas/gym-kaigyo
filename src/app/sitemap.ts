import type { MetadataRoute } from "next";
import { getAllArticles, CATEGORY_LABELS } from "@/lib/articles";

const SITE_URL = "https://gym-kaigyo.jp";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/profile`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const categoryPages: MetadataRoute.Sitemap = Object.keys(CATEGORY_LABELS).map(
    (category) => ({
      url: `${SITE_URL}/${category}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    })
  );

  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/${article.category}/${article.slug}`,
    lastModified: article.date ? new Date(article.date) : now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...articlePages];
}
