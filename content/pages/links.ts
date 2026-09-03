import type { PageContent } from "@/lib/types";

/**
 * Link hub — the page social bios point at.
 *
 * Replaces the linktr.ee/htxseo page so the traffic, the analytics, and any
 * link value from someone sharing the URL belong to jordanmarketingconsultants
 * .com rather than to a third party. For an SEO agency that is not a detail:
 * sending your own audience to someone else's domain is the sort of thing a
 * prospect notices.
 *
 * Ships UNPUBLISHED. The two social addresses below are placeholders — the
 * Master Brief forbids shipping placeholder content, so this page must not go
 * live until Wendell has confirmed the real profile URLs in /admin.
 */
export const linksPage: PageContent = {
  slug: "/links",
  label: "Link Hub",
  seoTitle: "Jordan Marketing Consultants | Houston-Area SEO",
  metaDescription:
    "Houston-area SEO from Jordan Marketing Consultants. Request a visibility review, see the monthly packages and pricing, or read the SEO resources here.",
  sections: [
    {
      id: "links",
      type: "linkStack",
      eyebrow: "@htxseo",
      theme: "dark",
      heading: "Houston’s SEO Agency",
      // Approved positioning, trimmed to one line. Deliberately not the
      // "powerful SEO strategies" wording from the existing Linktree — the
      // language guardrails rule out claim-led copy.
      body: "Houston-area SEO. Practical strategy, local optimization, content planning, and reporting you can actually read.",
      // Icon-only row, matching the existing Linktree. Addresses are
      // placeholders until Wendell confirms the real profiles.
      socials: [
        { platform: "instagram", href: "https://instagram.com/" },
        { platform: "facebook", href: "https://facebook.com/" },
        { platform: "linkedin", href: "https://linkedin.com/" },
      ],
      links: [
        {
          label: "Request a Visibility Review",
          href: "/contact",
          description: "Where you show up now, and what to fix first",
          icon: "target",
          featured: true,
        },
        {
          label: "SEO Packages & Pricing",
          href: "/monthly-seo-packages",
          description: "Local, traditional, and launch sprints",
          icon: "layers",
        },
        {
          label: "Local SEO Services",
          href: "/local-seo-services",
          description: "Google Business Profile, citations, local content",
          icon: "map-pin",
        },
        {
          label: "SEO Resources",
          href: "/resources",
          description: "Plain-English explainers, no jargon",
          icon: "file-text",
        },
        {
          label: "Call (281) 989-0468",
          href: "tel:+12819890468",
          icon: "message-square",
        },
      ],
      footnote: "League City, TX · Serving the Greater Houston area",
    },
  ],
};
