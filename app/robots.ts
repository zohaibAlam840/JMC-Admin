import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/content";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { site } = await getSiteConfig();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/thank-you"],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
