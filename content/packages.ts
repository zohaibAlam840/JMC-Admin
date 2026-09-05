import type { Package } from "@/lib/types";

/**
 * Approved pricing — "Pricing Sheet Content Master (website)".
 *
 * Do not edit prices or scope here without an official pricing update; the
 * content master is the authority. In phase 3 this array seeds the `packages`
 * table and the client edits it from /admin instead.
 */
export const packages: Package[] = [
  /* ---------------------------------------------------------------- local -- */
  {
    id: "local-off-page-essentials",
    group: "local",
    name: "Off-Page Essentials",
    price: "$399",
    priceUnit: "/month",
    onboardingFee: "$199 one-time",
    bestFit:
      "Best for businesses that need a stronger local visibility foundation without committing to a full local SEO campaign.",
    deliverables: [
      "Citation and business listing support",
      "Google Business Profile support",
      "NAP consistency cleanup and local presence maintenance",
      "Foundational off-page SEO support",
      "Monthly reporting and visibility summary",
    ],
    cta: { label: "Request a Visibility Review", href: "/contact" },
    // The wireframes show three local cards; the content master lists four.
    // Hidden by default so the approved layout holds — toggle on in /admin.
    visible: false,
  },
  {
    id: "local-neighborhood",
    group: "local",
    name: "Neighborhood",
    positioning: "Local Foundation",
    price: "$875",
    priceUnit: "/month",
    onboardingFee: "$349 one-time",
    term: "12-month term, then month to month",
    bestFit:
      "Best for businesses focused on improving visibility in one primary service area.",
    deliverables: [
      "30 tracked keywords",
      "3 tracked competitors",
      "8 Google Business Profile posts per month",
      "Up to 10 citations per month",
      "2 review request sends per month",
      "Up to 15 review replies per month",
      "Up to 2 Strategic SEO Pages per month",
      "Local search grid tracking",
      "Monthly Recap and Quarterly Project Update",
    ],
    cta: { label: "Start with Neighborhood", href: "/contact?tier=neighborhood" },
  },
  {
    id: "local-citywide",
    group: "local",
    name: "Citywide",
    positioning: "City-Level Growth",
    price: "$1,165",
    priceUnit: "/month",
    onboardingFee: "$449 one-time",
    term: "12-month term, then month to month",
    bestFit:
      "Best for businesses competing more aggressively across a city-level market with broader content and review support.",
    deliverables: [
      "45 tracked keywords",
      "5 tracked competitors",
      "12 Google Business Profile posts per month",
      "Up to 15 citations per month",
      "4 review request sends per month",
      "Up to 20 review replies per month",
      "Up to 3 Strategic SEO Pages per month",
      "Local search grid tracking",
      "Monthly Recap and Quarterly Project Update",
    ],
    cta: { label: "Start with Citywide", href: "/contact?tier=citywide" },
    featured: true,
  },
  {
    id: "local-metro",
    group: "local",
    name: "Metro",
    positioning: "Metro Expansion",
    price: "$1,695",
    priceUnit: "/month",
    onboardingFee: "$649 one-time",
    term: "12-month term, then month to month",
    bestFit:
      "Designed for businesses competing across multiple cities or high-demand metro areas where consistent content, visibility, and reputation signals are required to gain market share.",
    deliverables: [
      "60 tracked keywords",
      "5 tracked competitors",
      "16 Google Business Profile posts per month",
      "Up to 25 citations per month",
      "4 review request sends per month",
      "Up to 20 review replies per month",
      "Up to 4 Strategic SEO Pages per month",
      "Local search grid tracking",
      "Monthly Recap and Quarterly Project Update",
    ],
    cta: { label: "Start with Metro", href: "/contact?tier=metro" },
  },

  /* ---------------------------------------------------------- traditional -- */
  {
    id: "traditional-regional",
    group: "traditional",
    name: "Regional",
    positioning: "Multi-Market Foundation",
    price: "$2,295",
    priceUnit: "/month",
    onboardingFee: "$895 one-time",
    term: "12-month term, then month to month",
    bestFit:
      "Best for businesses targeting 1 to 3 priority markets or a defined regional service footprint.",
    deliverables: [
      "Up to 60 tracked keywords",
      "Up to 5 tracked competitors",
      "Up to 2 Strategic SEO Pages per month",
      "Technical SEO monitoring and issue flagging",
      "Authority-building strategy recommendations",
      "Monthly dashboard reporting",
      "Monthly Recap and Quarterly Project Update",
    ],
    cta: { label: "Start with Regional", href: "/contact?tier=regional" },
  },
  {
    id: "traditional-national",
    group: "traditional",
    name: "National",
    positioning: "National Growth",
    price: "$3,495",
    priceUnit: "/month",
    onboardingFee: "$1,095 one-time",
    term: "12-month term, then month to month",
    bestFit:
      "Best for businesses targeting broader multi-market visibility across larger service areas, multiple service lines, or more competitive search markets.",
    deliverables: [
      "Up to 75 tracked keywords",
      "Up to 8 tracked competitors",
      "Up to 3 Strategic SEO Pages per month",
      "Technical SEO monitoring and issue flagging",
      "Authority-building strategy recommendations",
      "Monthly dashboard reporting",
      "Monthly Recap and Quarterly Project Update",
    ],
    cta: { label: "Start with National", href: "/contact?tier=national" },
    featured: true,
  },
  {
    id: "traditional-national-plus",
    group: "traditional",
    name: "National+",
    positioning: "Competitive Expansion",
    price: "$5,295",
    priceUnit: "/month",
    onboardingFee: "$1,295 one-time",
    term: "12-month term, then month to month",
    bestFit:
      "Best for larger brands, complex service organizations, or high-competition industries that need broader search coverage and a more aggressive growth plan.",
    deliverables: [
      "Up to 90 tracked keywords",
      "Up to 10 tracked competitors",
      "Up to 4 Strategic SEO Pages per month",
      "Technical SEO monitoring and issue flagging",
      "Authority-building strategy recommendations",
      "Monthly dashboard reporting",
      "Monthly Recap and Quarterly Project Update",
    ],
    cta: { label: "Start with National+", href: "/contact?tier=national-plus" },
  },

  /* --------------------------------------------------------- real estate -- */
  /*
   * PRICING NOT YET DEFINED. The Real Estate SEO wireframe requires two priced
   * cards but no pricing exists in any source document. These ship with a
   * "contact for pricing" treatment and are flagged in the admin until Wendell
   * supplies real numbers. Do not invent prices in copy.
   */
  {
    id: "real-estate-agent",
    group: "realEstate",
    name: "Agent Growth SEO",
    price: "Contact for pricing",
    bestFit:
      "Built for individual agents who need stronger personal visibility in their market and content that supports trust with buyers and sellers.",
    deliverables: [
      "Google Business Profile and local visibility support",
      "Neighborhood and market content strategy",
      "Agent website structure and page improvements",
      "Review and trust signal support",
      "Search visibility tracking",
      "Monthly Recap and reporting",
    ],
    cta: { label: "Request Agent SEO Review", href: "/contact" },
    pricingPending: true,
    // Hidden with the Real Estate page — cut from scope by Page Spec 01 §2.
    visible: false,
  },
  {
    id: "real-estate-team",
    group: "realEstate",
    name: "Team and Brokerage Growth SEO",
    price: "Contact for pricing",
    bestFit:
      "Built for teams and brokerages that need scalable visibility across multiple agents, markets, and neighborhoods.",
    deliverables: [
      "Multi-market local visibility strategy",
      "Neighborhood and market authority content",
      "Site structure for teams and agent rosters",
      "Review and reputation support at scale",
      "Search visibility tracking across markets",
      "Monthly Recap and reporting",
    ],
    cta: { label: "Request Team/Brokerage SEO Review", href: "/contact" },
    pricingPending: true,
    visible: false,
  },

  /* -------------------------------------------------------------- sprints -- */
  {
    id: "sprint-neighborhood",
    group: "sprint",
    name: "Neighborhood Launch Sprint",
    price: "$799",
    priceUnit: "one-time",
    timeline: "30 days",
    bestFit:
      "For businesses that need a stronger local SEO foundation before moving into ongoing monthly service.",
    deliverables: [
      "Kickoff and access setup",
      "Local SEO audit with priority findings",
      "Local keyword and competitor snapshot",
      "Google Search Console and Bing setup or verification",
      "Google Business Profile audit and core optimization",
      "Citation audit and NAP standard",
      "Schema, sitemap, and robots.txt review",
      "Titles and meta descriptions for up to 5 priority pages",
      "Local search grid baseline snapshot",
      "30-Day Action Roadmap",
    ],
    cta: { label: "Start the Neighborhood Sprint", href: "/contact?type=sprint" },
  },
  {
    id: "sprint-regional",
    group: "sprint",
    name: "Regional Launch Sprint",
    price: "$1,495",
    priceUnit: "one-time",
    timeline: "30 days",
    bestFit:
      "For businesses targeting a broader service region or multiple markets that want a strong foundation before starting monthly service.",
    deliverables: [
      "Kickoff and access setup",
      "Technical and on-page SEO audit",
      "Regional keyword and competitor analysis",
      "Google Search Console and Bing setup or verification",
      "Schema, sitemap, and robots.txt review",
      "Titles and meta descriptions for up to 10 priority pages",
      "Backlink audit",
      "30-Day Roadmap and next-step recommendations",
    ],
    // No emphasis on any sprint. Page Spec 07 §4 is explicit that the three
    // are not a ladder, unlike the monthly tiers: Neighborhood is local work
    // and the other two are technical, which is a difference in kind rather
    // than in scale. Marking one "most chosen" would misdescribe the set.
    cta: { label: "Start the Regional Sprint", href: "/contact?type=sprint" },
  },
  {
    id: "sprint-national",
    group: "sprint",
    name: "National Launch Sprint",
    price: "$2,295",
    priceUnit: "one-time",
    timeline: "30 days",
    bestFit:
      "For businesses that need foundational technical and on-page SEO work in place before starting a national monthly campaign.",
    deliverables: [
      "Kickoff and access setup",
      "Technical and on-page SEO audit",
      "National keyword and competitor analysis",
      "Google Search Console and Bing setup or verification",
      "Schema, sitemap, and robots.txt review",
      "Titles and meta descriptions for up to 15 priority pages",
      "Backlink audit",
      "30-Day Roadmap and next-step recommendations",
    ],
    cta: { label: "Start the National Sprint", href: "/contact?type=sprint" },
  },
];

const byId = new Map(packages.map((p) => [p.id, p]));

/** Resolves ids from a pricingCards section, dropping any hidden tier. */
export function getPackages(ids: string[]): Package[] {
  return ids
    .map((id) => byId.get(id))
    .filter((p): p is Package => Boolean(p) && p!.visible !== false);
}

/** Shared feature row for Neighborhood, Citywide, and Metro only. */
export const localSharedFeatures = [
  "SEO Strategy & Roadmap",
  "Content & On-Page Optimization",
  "Technical Monitoring",
  "Detailed Monthly Reporting",
  "Monthly Project Recap (Loom or video call)",
  "Review Management",
];

export const traditionalSharedFeatures = [
  "SEO Strategy & Roadmap",
  "Strategic SEO Pages",
  "Technical Monitoring",
  "Reporting & Monthly Recap",
  "Authority-Building Recommendations",
];
