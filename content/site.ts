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
    href: "/real-estate-seo",
    children: [
      { label: "Real Estate SEO", href: "/real-estate-seo" },
      // Launch routing approved in the homepage wireframe §7.
      { label: "Home Services SEO", href: "/local-seo-services" },
      {
        label: "Commercial Construction SEO",
        href: "/traditional-seo-services#industries",
      },
      { label: "Oil and Gas SEO", href: "/traditional-seo-services#industries" },
      {
        label: "Healthcare and Life Sciences SEO",
        href: "/traditional-seo-services#industries",
      },
      {
        label: "Hospitality and Tourism SEO",
        href: "/traditional-seo-services#industries",
      },
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
      { label: "SEO Content Strategy", href: "/traditional-seo-services#includes" },
      { label: "SEO Reporting", href: "/seo-packages#reporting" },
    ],
  },
  {
    heading: "Industries",
    links: [
      { label: "Real Estate SEO", href: "/real-estate-seo" },
      { label: "Home Services SEO", href: "/local-seo-services" },
      {
        label: "Commercial Construction SEO",
        href: "/traditional-seo-services#industries",
      },
      { label: "Oil and Gas SEO", href: "/traditional-seo-services#industries" },
      {
        label: "Healthcare and Life Sciences SEO",
        href: "/traditional-seo-services#industries",
      },
      {
        label: "Hospitality and Tourism SEO",
        href: "/traditional-seo-services#industries",
      },
    ],
  },
  {
    heading: "Pricing & More",
    links: [
      { label: "Monthly SEO Packages", href: "/seo-packages" },
      { label: "Launch Sprints", href: "/launch-sprints" },
      { label: "Resources", href: "/resources" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
];
