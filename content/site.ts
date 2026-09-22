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
  /**
   * The approved positioning statement — Decisions Record §2. Verbatim: do
   * not reword it.
   *
   * Three sentences carrying the three pillars in order. The third echoes the
   * Monthly Recap headings on purpose, so the promise and the proof use the
   * same language.
   */
  positioning:
    "Jordan Marketing Consultants is a Houston-area SEO agency based in League City. JMC does one thing: search visibility for local, regional, and industrial businesses. Every month, clients know exactly what was done, why it was done, and what changed.",
  footerBlurb:
    "A Houston-area SEO agency based in League City. JMC does one thing: search visibility for local, regional, and industrial businesses.",
} as const;

/** The sitewide CTA. Appears in the header on every page. */
export const primaryCta = {
  label: "Request a Visibility Review",
  href: "/contact",
};

/**
 * Main navigation — Decisions Record §4, Global Build Spec §7.
 *
 * Home · SEO Services · Industries · Pricing · About · Contact.
 *
 * Two absences are deliberate rather than gaps. Resources is out while its
 * content is sourced and returns when it publishes. SEO Reporting is out
 * because it is reached by the sitewide "See How JMC Reports SEO Progress"
 * CTA and by the footer instead, which is the whole mechanism by which an
 * unlinked page still indexes.
 *
 * Contact is in the nav even though the header CTA also points at it. That
 * was queried during the build; the Decisions Record settles it.
 */
export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    /*
     * Hover-only on desktop. There is no services index page, which is also
     * why the service slugs are flat rather than nested under /seo-services/:
     * a URL segment only exists if a real page sits at it.
     */
    label: "SEO Services",
    href: "/local-seo-services",
    children: [
      { label: "Local SEO Services", href: "/local-seo-services" },
      { label: "Traditional SEO Services", href: "/traditional-seo-services" },
      {
        label: "Google Business Profile Optimization",
        href: "/google-business-profile-optimization",
      },
    ],
  },
  {
    // The only clickable dropdown parent, because it is the only one with a
    // real page behind it.
    label: "Industries",
    href: "/industries",
    children: [
      {
        label: "Home Services & Trades",
        href: "/industries/home-services-trades",
      },
      { label: "Healthcare & Wellness", href: "/industries/healthcare-wellness" },
      {
        label: "Hospitality & Attractions",
        href: "/industries/hospitality-attractions",
      },
      {
        label: "Professional Services",
        href: "/industries/professional-services",
      },
      {
        label: "Energy & Petrochemical",
        href: "/industries/energy-petrochemical",
      },
      { label: "Maritime & Logistics", href: "/industries/maritime-logistics" },
      {
        label: "Commercial Construction & Infrastructure",
        href: "/industries/commercial-construction-infrastructure",
      },
      { label: "Aerospace & Aviation", href: "/industries/aerospace-aviation" },
    ],
  },
  {
    // Hover-only, same reason as SEO Services.
    label: "Pricing",
    href: "/monthly-seo-packages",
    children: [
      { label: "Monthly SEO Packages", href: "/monthly-seo-packages" },
      { label: "Launch Sprints", href: "/launch-sprints" },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/**
 * Footer columns two to four — Global Build Spec §8.
 *
 * Column one is the reversed logo, the positioning line, the phone number and
 * the email address. The footer component builds that from the site details
 * above rather than from a link list, so it is not represented here.
 *
 * SEO Reporting sits in column two and nowhere in the nav, by design.
 *
 * Resources is absent until it publishes, at which point it joins column
 * four and its temporary redirect comes out of next.config.ts.
 */
export const footerNav: {
  heading: string;
  links: { label: string; href: string }[];
}[] = [
  {
    heading: "SEO Services",
    links: [
      { label: "Local SEO Services", href: "/local-seo-services" },
      { label: "Traditional SEO Services", href: "/traditional-seo-services" },
      {
        label: "Google Business Profile Optimization",
        href: "/google-business-profile-optimization",
      },
      { label: "SEO Reporting", href: "/seo-reporting" },
    ],
  },
  {
    heading: "Industries",
    links: [
      {
        label: "Home Services & Trades",
        href: "/industries/home-services-trades",
      },
      { label: "Healthcare & Wellness", href: "/industries/healthcare-wellness" },
      {
        label: "Hospitality & Attractions",
        href: "/industries/hospitality-attractions",
      },
      {
        label: "Professional Services",
        href: "/industries/professional-services",
      },
      {
        label: "Energy & Petrochemical",
        href: "/industries/energy-petrochemical",
      },
      { label: "Maritime & Logistics", href: "/industries/maritime-logistics" },
      {
        label: "Commercial Construction & Infrastructure",
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
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
];
