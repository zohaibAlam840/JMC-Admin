import type { MetadataRoute } from "next";
import { getPublishedPages, getSiteConfig } from "@/lib/content";

/**
 * Built from the published rows in `pages`, so a page the client adds in
 * /admin appears here without a deploy. /thank-you is deliberately absent —
 * it is noindexed — and /contact is added by hand because it is a hand-built
 * route rather than a content page.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, { site }] = await Promise.all([
    getPublishedPages(),
    getSiteConfig(),
  ]);
  const lastModified = new Date();

  const entries = pages.map(({ slug }) => ({
    url: `${site.url}${slug === "/" ? "" : slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: slug === "/" ? 1 : 0.8,
  }));

  entries.push({
    url: `${site.url}/contact`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  });

  return entries;
}
