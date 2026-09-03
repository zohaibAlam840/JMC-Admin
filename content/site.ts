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
 * Two dropdown items still have no page: SEO Content Strategy and the
 * Resources hub's deeper pages. The Master Brief forbids placeholder pages, so
 * each routes to the closest real section instead.
 */
export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "SEO Services",
    href: "/local-seo-services",
    children: [
      { label: "Local SEO Services", href: "/local-seo-services" },
      { label: "Traditional SEO Services", href: "/traditional-seo-services" },
      {
        label: "Google Business Profile Optimization",
        href: "/google-business-profile-optimization",
      },
      // Phase two: /seo-content-strategy
      {
        label: "SEO Content Strategy",
        href: "/traditional-seo-services#includes",
      },
      // In the dropdown as well as the footer. Build Spec §7 keeps SEO
      // Reporting out of the top-level menu, not out of the site.
      { label: "SEO Reporting", href: "/seo-reporting" },
    ],
  },
  {
    label: "Industries",
    // The only clickable dropdown parent on the site, Build Spec §7 and Page
    // Spec 08. On mobile a hover-only parent is a dead tap, which is most of
    // why the hub page exists.
    href: "/industries",
    children: [
      { label: "All industries", href: "/industries" },
      { label: "Home Services & Trades", href: "/industries/home-services-trades" },
      { label: "Healthcare & Wellness", href: "/industries/healthcare-wellness" },
      { label: "Hospitality & Attractions", href: "/industries/hospitality-attractions" },
      { label: "Professional Services", href: "/industries/professional-services" },
      { label: "Energy & Petrochemical", href: "/industries/energy-petrochemical" },
      { label: "Maritime & Logistics", href: "/industries/maritime-logistics" },
      {
        label: "Commercial Construction",
        href: "/industries/commercial-construction-infrastructure",
      },
      { label: "Aerospace & Aviation", href: "/industries/aerospace-aviation" },
    ],
  },
  {
    label: "Pricing",
    href: "/monthly-seo-packages",
    children: [
      { label: "Monthly SEO Packages", href: "/monthly-seo-packages" },
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
        href: "/google-business-profile-optimization",
      },
      // Kept out of the top-level menu by Build Spec §7, so the footer is one
      // of the few places it is reachable without following a CTA.
      { label: "SEO Reporting", href: "/seo-reporting" },
    ],
  },
  {
    heading: "Industries",
    links: [
      { label: "Home Services & Trades", href: "/industries/home-services-trades" },
      { label: "Healthcare & Wellness", href: "/industries/healthcare-wellness" },
      { label: "Hospitality & Attractions", href: "/industries/hospitality-attractions" },
      { label: "Professional Services", href: "/industries/professional-services" },
      { label: "Energy & Petrochemical", href: "/industries/energy-petrochemical" },
      { label: "Maritime & Logistics", href: "/industries/maritime-logistics" },
      {
        label: "Commercial Construction",
        href: "/industries/commercial-construction-infrastructure",
      },
      { label: "Aerospace & Aviation", href: "/industries/aerospace-aviation" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Monthly SEO Packages", href: "/monthly-seo-packages" },
      { label: "Launch Sprints", href: "/launch-sprints" },
      { label: "Resources", href: "/resources" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
];
