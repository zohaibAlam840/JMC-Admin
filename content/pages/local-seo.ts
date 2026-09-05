import type { PageContent } from "@/lib/types";

/**
 * Local SEO Services — Page Spec 02. Nine sections.
 *
 * Two things on this page are worth knowing before editing it.
 *
 * §4 carries the local search grid, which is the strongest differentiator on
 * the page: most agencies report one blended ranking number, and a grid shows
 * visibility changing block to block. It is drawn in code rather than shown as
 * a screenshot, because a real heatmap is client data and a capture invites
 * questions about whose account it is and whether it is typical.
 *
 * §6 Callout A routes to /contact and must never route to Traditional SEO.
 * Above the Metro tier a business is still a Local buyer if it competes in
 * local results, however many locations it has. Seven locations across Texas
 * is a large Local engagement and gets a custom Local quote. Traditional is a
 * different problem, not a bigger one.
 *
 * The old indexed slug is /local-seo-service, singular. This page is plural,
 * one character apart, and it takes more redirect traffic than any other page
 * on the site. The redirect is in next.config.ts and in the seed.
 *
 * Copy is DRAFT. The Step 4 copy deck replaces it.
 */
export const localSeoPage: PageContent = {
  slug: "/local-seo-services",
  label: "Local SEO Services",
  seoTitle: "Local SEO Services | Houston Area",
  metaDescription:
    "Local SEO for Houston-area businesses. Google Business Profile, citations, reviews, local search grid tracking, and a monthly recap of what actually changed.",
  sections: [
    {
      id: "hero",
      type: "heroSplit",
      eyebrow: "Local SEO Services",
      heading: "Get Found Where Your Customers Are Looking",
      body: "Local SEO is the work of appearing when somebody nearby searches for what you do. It runs across your Google Business Profile, your listings, your reviews and your service pages, and it is measured across your whole service area rather than as one number.",
      primaryCta: { label: "Request a Visibility Review", href: "/contact" },
      secondaryCta: {
        label: "View Local SEO Packages",
        href: "/monthly-seo-packages#local",
      },
      // Coverage first, which gives the hero panel the service-area motif
      // rather than the reporting bars used on the homepage.
      showcase: [
        {
          kind: "coverage",
          label: "Where you appear",
          title: "Local Surfaces",
          items: [
            "Google Search results",
            "Google Maps and the map pack",
            "Service-area searches",
            "The profile panel itself",
          ],
        },
        {
          kind: "channels",
          label: "Three tiers",
          title: "Sized by Area",
          items: ["Neighborhood", "Citywide", "Metro"],
        },
      ],
    },

    {
      id: "audience-fit",
      type: "cardGrid",
      tone: "surface",
      variant: "cards",
      columns: 4,
      eyebrow: "Is This You",
      heading: "Who Local SEO Is For",
      body: "The first three sort by how customers reach you. The fourth is about scale, so a practice with four offices is both the third and the fourth.",
      cards: [
        {
          title: "Storefront",
          icon: "storefront",
          body: "Customers come to you, and being findable on a map is most of the battle. Shops, showrooms, studios, gyms.",
        },
        {
          title: "Service Area",
          icon: "map-pin",
          body: "You travel to the customer, so you are ranked against an area rather than an address. Trades, contractors, mobile services.",
        },
        {
          title: "Appointment-Based",
          icon: "calendar",
          body: "Customers book time with you, and they compare two or three options before doing it. Practices, clinics, salons, consultants.",
        },
        {
          title: "Multi-Location",
          icon: "building",
          body: "Several locations competing across the same broad area. Each one needs its own profile, its own citations and its own tracking, or they compete with each other.",
        },
      ],
    },

    {
      id: "includes",
      type: "cardGrid",
      tone: "white",
      variant: "cards",
      columns: 3,
      eyebrow: "What You Get",
      heading: "What Local SEO Includes",
      body: "Every package includes all six. Tiers differ by volume, not by what is included.",
      cards: [
        {
          title: "SEO Strategy & Roadmap",
          icon: "compass",
          body: "A plan for the next quarter rather than a list of tasks, with the reasoning behind the order it runs in.",
        },
        {
          title: "Content & On-Page Optimization",
          icon: "pencil",
          body: "Service pages, titles, descriptions and on-page structure written for how people in your area actually search.",
        },
        {
          title: "Technical Monitoring",
          icon: "gauge",
          body: "Crawling, indexing and site health watched month to month, so a problem is found before it costs you visibility.",
        },
        {
          title: "Detailed Monthly Reporting",
          icon: "bar-chart",
          body: "What was tracked, what moved and what did not, in language that does not need translating.",
        },
        {
          title: "Monthly Project Recap (via Loom or video call)",
          icon: "message-square",
          body: "A person walking through the month rather than a file dropped into an inbox, with room to ask questions.",
        },
        {
          title: "Review Management",
          icon: "star",
          body: "Review requests sent to real customers and replies written to what comes back, positive and negative alike.",
        },
      ],
    },

    {
      id: "visibility-system",
      type: "cardGrid",
      tone: "surface",
      variant: "cards",
      // Five, laid out as 3 + 2 centred. Padding to six with a filler card is
      // explicitly forbidden by §4.
      columns: 5,
      eyebrow: "The System",
      heading: "The Local Visibility System",
      body: "Five parts, worked together. Any one of them on its own tends to stall.",
      cards: [
        {
          title: "Google Business Profile",
          icon: "storefront",
          body: "Categories, services, information, photos and posts. For many local searches the profile is what is being ranked.",
          cta: {
            label: "Profile optimization",
            href: "/google-business-profile-optimization",
          },
        },
        {
          title: "Citations & NAP Consistency",
          icon: "shield-check",
          body: "One standard for your name, address and phone number, applied across the listings that currently disagree with each other.",
        },
        {
          title: "Reviews",
          icon: "star",
          body: "Requests to real customers and replies to what arrives. Nothing fabricated, nothing incentivised.",
        },
        {
          title: "Local Search Grid Tracking",
          icon: "map-pin",
          body: "Visibility measured across a grid of points in your service area rather than as one blended rank, so you can see where you are strong and where you are not.",
          visual: "searchGrid",
        },
        {
          title: "Strategic SEO Pages",
          icon: "file-text",
          body: "Pages built for the services and areas worth competing for, rather than one page trying to hold all of them.",
        },
      ],
    },

    {
      id: "houston",
      type: "fullWidthText",
      tone: "white",
      eyebrow: "Where JMC Is",
      heading: "Based in League City, Working Across the Houston Area",
      body: "JMC is a Houston-area agency and most of its clients are within reach of it. Local SEO is not limited to the Houston area, though, and the work is the same wherever a business competes for customers in a defined patch.",
    },

    {
      id: "packages",
      type: "pricingCards",
      tone: "surface",
      eyebrow: "Pricing",
      heading: "Local SEO Packages",
      body: "Three tiers, sized by how much ground you are competing for. Every tier includes all six of the deliverables above.",
      packageIds: ["local-neighborhood", "local-citywide", "local-metro"],
    },

    /*
     * Callout A. Plain text under the three cards rather than a fourth card,
     * by instruction: a card here would read as a hidden fourth tier.
     *
     * It routes to /contact for a quote and must never route to Traditional
     * SEO. However many locations a business runs, if it competes in local
     * results it is a Local buyer, and sending it to Traditional would put it
     * in the wrong lane entirely.
     */
    {
      id: "custom-scope",
      type: "fullWidthText",
      tone: "surface",
      heading: "Working With Something Bigger?",
      body: "If the scope is bigger or more involved than what is here, JMC will look at it and put together a quote. However many locations are involved, a business competing in local results is still a Local engagement.",
      cta: { label: "Request a Visibility Review", href: "/contact" },
    },

    /*
     * Callout B, the strongest conversion mechanic on the page. $799 buys a
     * waiver worth up to $649, and the Neighborhood sprint unlocks it on all
     * three Local tiers. A tinted box rather than the dark statement band:
     * this is an offer beside the prices, not the visual peak of the page.
     */
    {
      id: "sprint-callout",
      type: "calloutBanner",
      tone: "surface",
      heading: "Or Start With a Launch Sprint",
      body: "The Neighborhood Launch Sprint is $799, one-time, completed within 30 days. It builds the local foundation and finishes with a 30-day roadmap. Begin monthly service within 30 days of the sprint finishing and the onboarding fee on any Local package is waived, up to $649.",
      primaryCta: { label: "View Launch Sprints", href: "/launch-sprints" },
      secondaryCta: {
        label: "View Local SEO Packages",
        href: "/monthly-seo-packages#local",
      },
    },

    {
      id: "monthly-recap",
      type: "reportingBlock",
      tone: "white",
      eyebrow: "Reporting",
      heading: "The Monthly Recap",
      body: "Four questions, every month, in the same order.",
      did: "The pages rewritten, the listings corrected, the posts published, named individually.",
      why: "Why that work was the priority ahead of everything else in the queue.",
      changed: "Grid visibility across the service area, compared with last month, including the quiet ones.",
      next: "What is queued for the coming month, written down before it starts.",
      cta: {
        label: "See How JMC Reports SEO Progress",
        href: "/seo-reporting",
      },
    },

    {
      id: "faq",
      type: "faq",
      tone: "surface",
      eyebrow: "Questions",
      heading: "Local SEO Questions",
      items: [
        {
          question: "How long before there are results?",
          answer:
            "Local tends to move faster than national search because the competing field is smaller, and profile or listing corrections can show within weeks. Ranking movement across a service area is a longer arc, usually a few months before the shape of it is clear. Nobody can honestly give you a date, and the recap tells you which stage the work is at each month.",
        },
        {
          question: "Is there a contract?",
          answer:
            "Yes. Twelve months, then month to month, with 30 days written notice to end it. The term exists because the work compounds and a three-month engagement cannot show what a twelve-month one can.",
        },
        {
          question: "What does the onboarding fee cover?",
          answer:
            "The audit, tracking setup, the foundational on-page work and the local visibility setup: profile, categories, services, citations and the grid baseline. It is the work that has to happen once before the monthly work means anything.",
        },
        {
          question: "How is this different from Traditional SEO?",
          answer:
            "Local SEO is for businesses competing for customers in a defined area, however many locations they run in it. Traditional SEO is for businesses competing across multiple markets, multiple service lines, or genuinely competitive search. It is a difference in reach, not in size.",
        },
        {
          question: "Do you guarantee rankings?",
          answer:
            "No, and anyone who does is guessing. What is guaranteed is the scope, the reporting, and knowing exactly what was done and why.",
        },
        {
          question: "What is local search grid tracking?",
          answer:
            "Instead of checking your rank from one point, it checks from a grid of points across your service area. That matters because local results change street by street: you can be first near your own address and invisible four miles away, and one blended number hides that completely.",
        },
        {
          question: "What if the business is not in Houston?",
          answer:
            "Local SEO is not limited to the Houston area. JMC is based in League City and most clients are nearby, but the work is the same for a business competing in a defined area anywhere.",
        },
      ],
      cta: { label: "Request a Visibility Review", href: "/contact" },
    },

    {
      id: "final-cta",
      type: "finalCta",
      heading: "Start With a Visibility Review",
      body: "Where you appear across your service area today, what is holding it back, and which of those gaps is worth closing first.",
      primaryCta: { label: "Request a Visibility Review", href: "/contact" },
      secondaryCta: {
        label: "View Local SEO Packages",
        href: "/monthly-seo-packages#local",
      },
    },
  ],
};
