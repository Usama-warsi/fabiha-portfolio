import type { MetadataRoute } from "next";
import { artworks } from "@/data/artworks";
import { siteConfig } from "@/data/artist";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const staticRoutes = ["", "/work", "/about", "/contact"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const workRoutes = artworks.map((a) => ({
    url: `${base}/work/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...workRoutes];
}
