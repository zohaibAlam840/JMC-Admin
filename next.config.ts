import type { NextConfig } from "next";

/**
 * The legacy URL map, from JMC-Redirect-Map.xlsx.
 *
 * Source: Google Search Console coverage exports dated 2026-08-27. Twenty-five
 * URLs are known to Google, ten of them indexed. Everything below is one hop
 * to a final destination, per the Global Rules tab: no chains, 301 not 302
 * except where the map says otherwise, and matching on path so query strings
 * are ignored.
 *
 * These also live in the database, where the client can add to them without a
 * deploy. The copy here is the safety net: it keeps working if Supabase is
 * unreachable, and it is what runs before any database lookup happens.
 *
 * Coverage is not a full crawl. The old staging site blocks robots, so any URL
 * outside these twenty-five will 404 — which is the correct behaviour, and
 * deliberately not a blanket redirect to the homepage, because Google reads
 * that as a soft 404.
 */
const LEGACY_REDIRECTS: { source: string; destination: string }[] = [
  /* -- P1, indexed. Redirect correctly or lose the ranking. -------------- */

  /*
   * The one to be careful with. The old slug is SINGULAR and the new one is
   * PLURAL, one character apart, on the second-most-valuable page on the
   * site. Flagged in the spreadsheet for manual QA for exactly that reason.
   */
  { source: "/local-seo-service", destination: "/local-seo-services" },

  // Discontinued. Review Management survives as a feature of Local SEO.
  { source: "/reputation-management", destination: "/local-seo-services" },

  // Discontinued. Authority-Building survives as a feature of Traditional SEO.
  { source: "/link-building-service", destination: "/traditional-seo-services" },

  // Cut from scope. RESTORE THIS SLUG when Real Estate returns in phase two.
  { source: "/real-estate-seo", destination: "/local-seo-services" },

  // Generic services page. Traditional is the closer match for site-wide and
  // technical intent.
  { source: "/seo-website-services", destination: "/traditional-seo-services" },

  /*
   * An indexed lead magnet carrying paid referral traffic. It lands on the GBP
   * page because that page now holds the Free Visibility Audit form, which is
   * far closer to the original offer than a generic contact form.
   */
  { source: "/free-website-audit", destination: "/google-business-profile-optimization" },

  // The new architecture has no services index: the slugs are flattened.
  { source: "/services", destination: "/local-seo-services" },

  { source: "/contact-us", destination: "/contact" },

  /* -- P2, crawled but not indexed. Low value, redirected for inbound links. */

  { source: "/seo-service", destination: "/local-seo-services" },

  // Location page. RESTORE THIS SLUG when location pages ship in phase two.
  { source: "/seo-league-city", destination: "/local-seo-services" },

  { source: "/about-us", destination: "/about" },

  // Roofing is a business type under Home Services & Trades.
  {
    source: "/online-reviews-for-roofers",
    destination: "/industries/home-services-trades",
  },

  // Short form of the audit URL, same destination.
  { source: "/audit", destination: "/google-business-profile-optimization" },

  /*
   * The old blog sat under /general/. These point at the homepage for launch
   * and get repointed at /resources/ when it publishes — deliberately not at
   * /resources/ now, which would chain through its temporary 302.
   */
  { source: "/general", destination: "/" },
  { source: "/general/feed", destination: "/" },
  { source: "/navigating-the-ai-frontier", destination: "/" },

  /* -- Ours, not the old site's. ----------------------------------------- */

  /*
   * /seo-packages was live on this build before Page Spec 06 fixed the
   * address as /monthly-seo-packages/. Not in the GSC map, since it never
   * existed on the WordPress site, but it was linked and should keep working.
   */
  { source: "/seo-packages", destination: "/monthly-seo-packages" },
  { source: "/seo-packages-pricing", destination: "/monthly-seo-packages" },
];

const nextConfig: NextConfig = {
  /*
   * One trailing-slash convention, enforced sitewide. Global Rules tab #2, and
   * the Build Spec §14 writes every path with a trailing slash. Two spellings
   * of the same page is how duplicate-content problems start on a site whose
   * whole argument is that it does SEO properly.
   *
   * This also handles the four no-trailing-slash variants in the map
   * (/services, /contact-us, /link-building-service, /seo-website-services)
   * without needing a rule each.
   */
  trailingSlash: true,

  async redirects() {
    return [
      ...LEGACY_REDIRECTS.map(({ source, destination }) => ({
        source,
        destination,
        permanent: true,
      })),

      /*
       * The one 302 on the site, and deliberately so. Resources is built but
       * unpublished while content is sourced, and /resources/ is an indexed
       * URL. A 301 would tell Google the page is gone for good; a 302 keeps it
       * in the index and alive for the day it publishes.
       *
       * Remove this the moment Resources goes live.
       */
      {
        source: "/resources",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
