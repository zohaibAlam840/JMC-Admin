import { getPosts, getSiteConfig } from "@/lib/content";

/**
 * RSS feed for the Resources hub.
 *
 * Worth having for an SEO agency specifically: feeds are how aggregators and
 * other people's newsletters pick articles up, and those are real links.
 */

export const revalidate = 900;

/** XML has five characters that must never appear raw in a text node. */
function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const [posts, { site }] = await Promise.all([
    getPosts({ limit: 25 }),
    getSiteConfig(),
  ]);

  const items = posts
    .map((post) => {
      const url = `${site.url}/resources/${post.slug}`;
      const date = post.publishedAt
        ? new Date(post.publishedAt).toUTCString()
        : undefined;

      return [
        "    <item>",
        `      <title>${esc(post.title)}</title>`,
        `      <link>${esc(url)}</link>`,
        `      <guid isPermaLink="true">${esc(url)}</guid>`,
        post.excerpt ? `      <description>${esc(post.excerpt)}</description>` : "",
        post.category ? `      <category>${esc(post.category)}</category>` : "",
        date ? `      <pubDate>${date}</pubDate>` : "",
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(site.name)} — Resources</title>
    <link>${esc(`${site.url}/resources`)}</link>
    <description>${esc(site.footerBlurb)}</description>
    <language>en-US</language>
    <atom:link href="${esc(`${site.url}/resources/feed.xml`)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=900, stale-while-revalidate=86400",
    },
  });
}
