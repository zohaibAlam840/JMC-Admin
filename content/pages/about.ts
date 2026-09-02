import type { PageContent } from "@/lib/types";

/**
 * About.
 *
 * No wireframe exists for this page — built from the same component kit for
 * consistency. Copy is DRAFT. Guardrails still apply: no "founder-led"
 * language, no testimonials, no vague claims. Trust comes from process.
 */
export const aboutPage: PageContent = {
  slug: "/about",
  label: "About JMC",
  seoTitle: "About Jordan Marketing Consultants",
  metaDescription:
    "A Houston-area SEO agency rooted in League City. Practical strategy, local optimization, content planning, and reporting you can actually read.",
  sections: [
    {
      id: "hero",
      type: "heroCentered",
      eyebrow: "About JMC",
      heading: "Practical SEO, Explained in Plain English",
      body: "Jordan Marketing Consultants is a Houston-area SEO agency rooted in League City, helping local, regional, and industry-focused businesses improve search visibility through practical SEO strategy, content planning, local optimization, and clear reporting.",
      primaryCta: { label: "Request a Visibility Review", href: "/contact" },
      secondaryCta: { label: "View SEO Packages", href: "/seo-packages" },
    },

    {
      id: "approach",
      type: "cardGrid",
      variant: "split",
      tone: "white",
      eyebrow: "How We Work",
      heading: "SEO Should Be Understandable Before It Is Impressive",
      body: "Most businesses that have hired an SEO agency before describe the same experience: work happened, invoices arrived, and nobody could explain what changed. JMC is built around fixing that.",
      columns: 3,
      cards: [
        {
          title: "Scope Before Work",
          icon: "list-checks",
          body: "You know what is included before anything starts. No discovering the boundaries of your package three months in.",
        },
        {
          title: "Roadmap Over Tasks",
          icon: "compass",
          body: "Work is sequenced against a documented plan tied to your goals, not pulled from a generic monthly checklist.",
        },
        {
          title: "Reporting You Read",
          icon: "bar-chart",
          body: "A Monthly Recap in plain language, delivered by Loom or a call, so you can ask questions instead of decoding a dashboard.",
        },
      ],
    },

    {
      id: "houston",
      type: "fullWidthText",
      tone: "surface",
      eyebrow: "Houston-Area SEO Agency",
      heading: "Rooted in League City. Built for Houston-Area Growth.",
      body: "JMC is based in League City and works with businesses across the Greater Houston area and beyond. Being local matters for understanding a market, but it is not a boundary. Traditional SEO clients compete regionally and nationally, and the work is built around where your customers actually are.",
      cta: { label: "Explore SEO Services", href: "/local-seo-services" },
    },

    {
      id: "specialties",
      type: "cardGrid",
      tone: "white",
      eyebrow: "What We Focus On",
      heading: "Three Service Lanes, One Standard",
      body: "Different markets need different strategies. The commitment to clear scope, documented priorities, and honest reporting does not change between them.",
      columns: 3,
      cards: [
        {
          title: "Local SEO",
          icon: "map-pin",
          body: "For businesses that need visibility in a defined city or service area.",
          cta: { label: "Explore Local SEO", href: "/local-seo-services" },
        },
        {
          title: "Traditional SEO",
          icon: "trending-up",
          body: "For businesses competing across regions, national markets, or specialized industries.",
          cta: {
            label: "Explore Traditional SEO",
            href: "/traditional-seo-services",
          },
        },
        {
          title: "Real Estate SEO",
          icon: "home",
          body: "For agents, teams, and brokerages building neighborhood-level visibility.",
          cta: { label: "Explore Real Estate SEO", href: "/real-estate-seo" },
        },
      ],
    },

    {
      id: "process",
      type: "processSteps",
      tone: "surface",
      eyebrow: "The Process",
      heading: "A Clear SEO Process From Review to Recap",
      body: "The same four steps run every engagement, whether it is a local campaign or a national one.",
      steps: [
        {
          title: "Visibility Review",
          body: "We review where your business currently shows up, where visibility is weak, and which opportunities are worth prioritizing.",
        },
        {
          title: "SEO Roadmap",
          body: "We organize the work around keyword priorities, content needs, local visibility, technical issues, and business goals.",
        },
        {
          title: "Implementation",
          body: "We complete the scoped SEO work, content updates, local optimization, and technical improvements tied to the plan.",
        },
        {
          title: "Monthly Recap",
          body: "You receive a clear summary of what was completed, what changed, and what should happen next.",
        },
      ],
      cta: { label: "Start with a Visibility Review", href: "/contact" },
    },

    {
      id: "final-cta",
      type: "finalCta",
      heading: "Let's Look at Where Your Visibility Stands",
      body: "A Visibility Review is the starting point for every JMC engagement, and it is useful even if you decide not to work with us.",
      primaryCta: { label: "Request a Visibility Review", href: "/contact" },
      secondaryCta: { label: "View SEO Packages", href: "/seo-packages" },
    },
  ],
};
