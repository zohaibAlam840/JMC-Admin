import type { MetadataRoute } from "next";
import { getPublishedPages, getPublishedPostSlugs, getSiteConfig } from "@/lib/content";

/**
 * Built from the published rows in `pages`, so a page the client adds in
 * /admin appears here without a deploy. /thank-you is deliberately absent —
 * it is noindexed — and /contact is added by hand because it is a hand-built
 * route rather than a content page.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, posts, { site }] = await Promise.all([
    getPublishedPages(),
    getPublishedPostSlugs(),
    getSiteConfig(),
  ]);
  const lastModified = new Date();

  const entries: MetadataRoute.Sitemap = pages.map(({ slug }) => ({
    url: `${site.url}${slug === "/" ? "" : slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: slug === "/" ? 1 : 0.8,
  }));

  entries.push({
    url: `${site.url}/contact`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  });

  // Articles carry their own last-modified date rather than "now" — an
  // unchanged post should not look freshly edited on every rebuild.
  for (const post of posts) {
    entries.push({
      url: `${site.url}/resources/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: "yearly",
      priority: 0.6,
    });
  }

  return entries;
}
