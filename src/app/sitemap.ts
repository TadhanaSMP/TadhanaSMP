import type { MetadataRoute } from "next";
import { ruleCollections } from "@/data/rules";
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
    ...(ruleCollections.server.reviewed ? ["/rules", "/rules/server"] : []),
    ...(ruleCollections.staff.reviewed ? ["/rules/staff"] : []),
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
