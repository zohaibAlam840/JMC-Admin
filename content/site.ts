import type { NavItem } from "@/lib/types";

export const site = {
  name: "Jordan Marketing Consultants",
  shortName: "JMC",
  url: "https://jordanmarketingconsultants.com",
  email: "wendell@jordanmarketingconsultants.com",
  phone: "(281) 989-0468",
  phoneHref: "tel:+12819890468",
  locality: "League City",
  region: "TX",
  /** Approved public positioning. Do not reword — see the Master Brief §3. */
  positioning:
    "Jordan Marketing Consultants is a Houston-area SEO agency rooted in League City, helping local, regional, and industry-focused businesses improve search visibility through practical SEO strategy, content planning, local optimization, and clear reporting.",
  footerBlurb:
    "A Houston-area SEO agency rooted in League City. Practical strategy, local optimization, content planning, and reporting you can actually read.",
} as const;

/** The sitewide CTA. Appears in the header on every page. */
export const primaryCta = {
  label: "Request a Visibility Review",
  href: "/contact",
};

/**
 * Approved main navigation.
 *
 * Six dropdown items have no page at launch. The Master Brief forbids
 * placeholder pages, so each routes to the closest real section instead.
 * When the phase-two pages ship, these hrefs become the only thing to change.
 */
export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "SEO Services",
    href: "/local-seo-services",
    children: [
      { label: "Local SEO Services", href: "/local-seo-services" },
      { label: "Traditional SEO Services", href: "/traditional-seo-services" },
      // Phase two: /google-business-profile-optimization
      {
        label: "Google Business Profile Optimization",
        href: "/local-seo-services#includes",
      },
      // Phase two: /seo-content-strategy
      {
        label: "SEO Content Strategy",
        href: "/traditional-seo-services#includes",
      },
      // Phase two: /seo-reporting
      { label: "SEO Reporting", href: "/seo-packages#reporting" },
    ],
  },
  {
    label: "Industries",
    // The Industries parent is clickable, unlike the other two dropdowns —
    // Build Spec §7. It points at the homepage grid until /industries/ exists.
    href: "/#industries",
    children: [
      { label: "Home Services & Trades", href: "/local-seo-services" },
      { label: "Healthcare & Wellness", href: "/local-seo-services" },
      { label: "Hospitality & Attractions", href: "/local-seo-services" },
      { label: "Professional Services", href: "/local-seo-services" },
      { label: "Energy & Petrochemical", href: "/traditional-seo-services" },
      { label: "Maritime & Logistics", href: "/traditional-seo-services" },
      { label: "Commercial Construction", href: "/traditional-seo-services" },
      { label: "Aerospace & Aviation", href: "/traditional-seo-services" },
    ],
  },
  {
    label: "Pricing",
    href: "/seo-packages",
    children: [
      { label: "Monthly SEO Packages", href: "/seo-packages" },
      { label: "Launch Sprints", href: "/launch-sprints" },
    ],
  },
  { label: "Resources", href: "/resources" },
  { label: "About", href: "/about" },
  // No Contact item on purpose. The header CTA already goes to /contact, and
  // two controls side by side pointing at the same page splits the click
  // rather than adding a route. It stays in the footer, where people look for
  // it once they have finished reading.
];

export const footerNav: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "SEO Services",
    links: [
      { label: "Local SEO Services", href: "/local-seo-services" },
      { label: "Traditional SEO Services", href: "/traditional-seo-services" },
      {
        label: "Google Business Profile Optimization",
        href: "/local-seo-services#includes",
      },
      // Deliberately kept out of the main menu (Build Spec §7), which makes
      // the footer one of only two places SEO Reporting is reachable.
      { label: "SEO Reporting", href: "/#monthly-recap" },
    ],
  },
  {
    heading: "Industries",
    links: [
      { label: "Home Services & Trades", href: "/local-seo-services" },
      { label: "Healthcare & Wellness", href: "/local-seo-services" },
      { label: "Hospitality & Attractions", href: "/local-seo-services" },
      { label: "Professional Services", href: "/local-seo-services" },
      { label: "Energy & Petrochemical", href: "/traditional-seo-services" },
      { label: "Maritime & Logistics", href: "/traditional-seo-services" },
      { label: "Commercial Construction", href: "/traditional-seo-services" },
      { label: "Aerospace & Aviation", href: "/traditional-seo-services" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Monthly SEO Packages", href: "/seo-packages" },
      { label: "Launch Sprints", href: "/launch-sprints" },
      { label: "Resources", href: "/resources" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
];
