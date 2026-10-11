import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { publicUpdates } from "@/data/updates";
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/our-story",
    "/play",
    "/world",
    "/memories",
    "/ranks",
    "/features",
    "/news",
    "/faq",
    "/status",
    "/cookies",
    ...(site.rulesApproved ? ["/rules"] : []),
    ...(site.legalReviewed ? ["/privacy", "/terms"] : []),
  ];
  return [
    ...paths.map((path) => ({
      url: `${site.url}${path}`,
      changeFrequency: "monthly" as const,
    })),
    ...publicUpdates().map((post) => ({
      url: `${site.url}/news/${post.slug}`,
      ...(post.publishedAt ? { lastModified: post.publishedAt } : {}),
    })),
  ];
}
