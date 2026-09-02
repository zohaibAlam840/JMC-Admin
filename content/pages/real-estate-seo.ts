import type { PageContent } from "@/lib/types";

/**
 * Real Estate SEO.
 *
 * Structure approved (Real Estate SEO Wireframe v1). Copy is DRAFT.
 * Guardrails specific to this page: CE class stays secondary and never becomes
 * the main proof point, no luxury-only positioning, no lead-generation promises,
 * and it must not read as a lightly edited Local SEO page.
 */
export const realEstateSeoPage: PageContent = {
  slug: "/real-estate-seo",
  label: "Real Estate SEO",
  seoTitle: "Real Estate SEO for Agents, Teams, and Brokerages",
  metaDescription:
    "Real estate SEO for agents, teams, and brokerages. Neighborhood content, local search visibility, Google Business Profile support, and clear monthly reporting.",
  sections: [
    {
      id: "hero",
      type: "heroSplit",
      eyebrow: "Real Estate SEO",
      heading: "Be the Agent Your Market Finds First",
      body: "Real estate search is local, personal, and competitive. JMC builds SEO strategy around the neighborhoods you work, the buyers and sellers you want, and the content that makes you a credible choice before anyone picks up the phone.",
      primaryCta: {
        label: "Request a Real Estate Visibility Review",
        href: "/contact",
      },
      secondaryCta: {
        label: "View Real Estate SEO Options",
        href: "#options",
      },
      // Channels + coverage + report. Leads with the two audiences, which is
      // the thing that makes real estate search different.
      showcase: [
        {
          kind: "channels",
          label: "Who is searching",
          title: "Both Sides of the Move",
          items: [
            "Buyers researching a neighborhood",
            "Sellers checking their market",
            "Referrals looking you up by name",
          ],
          footnote: "Different intent, different pages",
        },
        {
          kind: "coverage",
          label: "Your markets",
          title: "Neighborhood Reach",
          items: ["Buyer intent", "Seller intent", "Market pages"],
        },
        {
          kind: "report",
          label: "Every month",
          title: "Monthly Recap",
          items: [
            "Market content published",
            "Profile and review activity",
            "Visibility movement",
            "Next-step priorities",
          ],
        },
      ],
    },

    {
      id: "audience-path",
      type: "cardGrid",
      tone: "white",
      eyebrow: "Where You Fit",
      heading: "SEO Works Differently for Agents, Teams, and Brokerages",
      body: "The right strategy depends on whether you are building a personal reputation, scaling one across several agents, or establishing a firm as the authority in a market.",
      columns: 3,
      cards: [
        {
          title: "Individual Agents",
          icon: "users",
          body: "You are the brand. Visibility has to attach to your name and the neighborhoods you actually know.",
          cta: { label: "Agent Growth SEO", href: "#options" },
        },
        {
          title: "Real Estate Teams",
          icon: "layers",
          body: "Several agents, overlapping markets, one shared reputation to build and protect.",
          cta: { label: "Team and Brokerage SEO", href: "#options" },
        },
        {
          title: "Brokerages",
          icon: "building",
          body: "You need market-level authority that supports recruiting as much as it supports listings.",
          cta: { label: "Team and Brokerage SEO", href: "#options" },
        },
      ],
      cta: { label: "Find the Right Real Estate SEO Path", href: "/contact" },
    },

    {
      id: "includes",
      type: "cardGrid",
      variant: "split",
      tone: "surface",
      eyebrow: "What's Included",
      heading: "The Work Behind Real Estate Search Visibility",
      body: "Real estate SEO is less about chasing generic terms and more about owning the searches tied to your markets and your name.",
      columns: 3,
      cards: [
        {
          title: "Local Visibility and Google Business Profile",
          icon: "star",
          body: "Profile optimization and local search work so you appear when someone searches an agent in your area.",
        },
        {
          title: "Neighborhood and Market Content",
          icon: "map-pin",
          body: "Pages built around the specific communities you serve, written for buyers and sellers researching a move.",
        },
        {
          title: "Website Structure and Service Pages",
          icon: "file-text",
          body: "Clear pages for buyers, sellers, and the markets you cover, organized so search engines understand your focus.",
        },
        {
          title: "Review and Trust Signals",
          icon: "message-square",
          body: "Review support and reputation work, because real estate decisions run on trust more than most industries.",
        },
        {
          title: "Search Visibility Tracking",
          icon: "gauge",
          body: "Tracking across your neighborhoods and market terms so you can see where you are gaining ground.",
        },
        {
          title: "Monthly Recaps and Reporting",
          icon: "clipboard-check",
          body: "A clear summary of the work, the movement, and the priorities queued next.",
        },
      ],
      cta: { label: "Explore Real Estate SEO Options", href: "#options" },
    },

    {
      id: "growth-model",
      type: "cardGrid",
      variant: "compact",
      tone: "white",
      eyebrow: "Growth Model",
      heading: "The Strategy Changes With the Business Model",
      body: "Same market, same search results, very different SEO problems to solve.",
      columns: 3,
      cards: [
        {
          title: "Agents Need Personal Visibility",
          icon: "users",
          body: "Your name, your neighborhoods, and your track record have to be findable and consistent. The goal is being recognized as the person who knows a specific area.",
        },
        {
          title: "Teams Need Scalable Visibility",
          icon: "layers",
          body: "Content and structure that support multiple agents without competing against each other for the same searches or splitting the team's authority.",
        },
        {
          title: "Brokerages Need Market Authority",
          icon: "building",
          body: "Depth across markets, a site structure that holds up as agents come and go, and visibility that supports both listings and recruiting.",
        },
      ],
      cta: {
        label: "Request a Real Estate Visibility Review",
        href: "/contact",
      },
    },

    {
      id: "neighborhood-authority",
      type: "featureSplit",
      tone: "surface",
      eyebrow: "Neighborhood Authority",
      heading: "Own the Searches That Come Before the Listing Search",
      body: "Long before someone searches for a specific address, they are searching for a neighborhood. What it is like to live there, what homes go for, what the schools and commute look like. Answering those questions well is how agents become the obvious local expert instead of one more name in the results.",
      cta: { label: "Explore Real Estate SEO Options", href: "#options" },
      groups: [
        {
          title: "Neighborhood Content",
          icon: "map-pin",
          body: "Pages that genuinely answer what people ask about a community.",
        },
        {
          title: "Buyer and Seller Intent",
          icon: "target",
          body: "Separate paths, because the two search very differently.",
        },
        {
          title: "Local Search Presence",
          icon: "search",
          body: "Profile, listings, and local signals that reinforce your market.",
        },
        {
          title: "Trust Signals",
          icon: "shield-check",
          body: "Reviews and credibility markers that support the decision.",
        },
      ],
    },

    {
      id: "options",
      type: "pricingCards",
      tone: "white",
      eyebrow: "Real Estate SEO Options",
      heading: "Two Paths Depending on How You Are Built",
      body: "Real estate SEO is scoped differently than standard local SEO packages. Reach out and we will size it against your markets and business model.",
      packageIds: ["real-estate-agent", "real-estate-team"],
      cta: {
        label: "Request a Real Estate Visibility Review",
        href: "/contact",
      },
    },

    {
      id: "education",
      type: "fullWidthText",
      tone: "surface",
      eyebrow: "Continuing Education",
      heading: "SEO Education for Real Estate Professionals",
      body: "JMC teaches continuing education on search visibility for real estate professionals. If you would rather understand the fundamentals before hiring anyone, that is a reasonable place to start.",
      cta: { label: "Ask About Upcoming Classes", href: "/contact" },
    },

    {
      id: "reporting",
      type: "cardGrid",
      tone: "white",
      emphasis: true,
      eyebrow: "Clear Reporting",
      heading: "Know Exactly What Your SEO Is Doing Each Month",
      body: "Real estate moves fast and marketing spend gets questioned. Reporting is how the work stays defensible.",
      columns: 4,
      cards: [
        {
          title: "Visibility Movement",
          body: "Where you are gaining or losing ground across your neighborhoods and market terms.",
        },
        {
          title: "Content Progress",
          body: "The market and neighborhood content published or improved this month.",
        },
        {
          title: "Local Search Opportunities",
          body: "Openings in your markets worth pursuing next, and why they look reachable.",
        },
        {
          title: "Next-Step Recommendations",
          body: "The priorities queued for the coming month, in plain language.",
        },
      ],
      cta: { label: "See How JMC Reports SEO Progress", href: "/contact" },
    },

    {
      id: "faq",
      type: "faq",
      tone: "surface",
      eyebrow: "Questions",
      heading: "Real Estate SEO Questions We Hear Often",
      items: [
        {
          question: "Is SEO worth it for an individual agent?",
          answer:
            "It can be, if you work defined neighborhoods and want visibility that does not stop the moment you stop paying for ads. SEO builds slowly and compounds. If you need volume this month, paid channels will move faster, the two solve different problems.",
        },
        {
          question: "How is this different for teams and brokerages?",
          answer:
            "Individual agents need visibility tied to a personal brand and a handful of neighborhoods. Teams need content and site structure that support several agents without competing internally. Brokerages need market-level authority that holds up as the roster changes. The tactics overlap; the structure does not.",
        },
        {
          question: "Does a Google Business Profile matter for real estate?",
          answer:
            "Yes. Agents and brokerages appear in local search and map results, and profile completeness, activity, and reviews all influence whether you show up and whether someone contacts you.",
        },
        {
          question: "What does neighborhood visibility actually mean?",
          answer:
            "Appearing in searches tied to specific communities rather than only broad city-level terms. Those searches usually have less competition and much clearer intent, because someone researching a neighborhood is genuinely considering a move.",
        },
        {
          question: "How long before real estate SEO shows results?",
          answer:
            "Expect three to six months for meaningful movement in a moderately competitive market, longer where established agents and portals already dominate. Neighborhood content typically gains traction sooner than broad city terms.",
        },
        {
          question: "Who writes the content?",
          answer:
            "JMC plans and produces the content as part of your monthly scope. We will pull on your market knowledge where it makes the content genuinely better, but you are not being handed a writing assignment.",
        },
      ],
      cta: {
        label: "Request a Real Estate Visibility Review",
        href: "/contact",
      },
    },

    {
      id: "final-cta",
      type: "finalCta",
      heading: "See How You Show Up in the Neighborhoods You Work",
      body: "A Real Estate Visibility Review looks at where you currently appear across your markets, where the gaps are, and what is worth prioritizing first.",
      primaryCta: {
        label: "Request a Real Estate Visibility Review",
        href: "/contact",
      },
      secondaryCta: { label: "View Real Estate SEO Options", href: "#options" },
    },
  ],
};
