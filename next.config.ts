import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
   * One trailing-slash convention, enforced sitewide. Build Spec §14 writes
   * every path with a trailing slash, and two spellings of the same page is
   * how duplicate-content problems start on a site whose whole argument is
   * that it does SEO properly. Next issues a 308 from the other form.
   */
  trailingSlash: true,

  /**
   * Legacy URL map, build-time copy.
   *
   * Redirects are now edited in /admin and resolved at request time by
   * proxy.ts, which is what lets the client add one without a deploy. These
   * three stay here as a safety net: they are the URLs named in the keyword
   * page map, and they keep working even if the database is unreachable.
   *
   * The full inventory of live URLs from the old site is still outstanding.
   */
  async redirects() {
    return [
      {
        source: "/local-seo-service",
        destination: "/local-seo-services",
        permanent: true,
      },
      {
        source: "/seo-packages-pricing",
        destination: "/monthly-seo-packages",
        permanent: true,
      },
      {
        // Renamed for Page Spec 06, which fixes the address as
        // /monthly-seo-packages/. The old one was live and linked, so it
        // redirects rather than disappearing.
        source: "/seo-packages",
        destination: "/monthly-seo-packages",
        permanent: true,
      },
      {
        // Page Spec 04 sends the old free-audit URL here rather than to the
        // contact page: the offer it promised now lives in §4 of this page.
        source: "/free-website-audit",
        destination: "/google-business-profile-optimization",
        permanent: true,
      },
      {
        source: "/contact-us",
        destination: "/contact",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
