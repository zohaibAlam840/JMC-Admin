import type { PageContent } from "@/lib/types";

/**
 * Homepage.
 *
 * Section order is fixed by the Master Wireframe. Copy is verbatim from
 * "JMC Website Copy Deck — Homepage Copy Deck v1" and is client-approved.
 * This is the only page with a finished copy deck.
 */
export const homePage: PageContent = {
  slug: "/",
  label: "Homepage",
  seoTitle: "Houston-Area SEO Agency | Jordan Marketing Consultants",
  metaDescription:
    "Jordan Marketing Consultants helps Houston-area businesses improve search visibility through local SEO, traditional SEO, real estate SEO, content planning, and clear reporting.",
  sections: [
    {
      id: "hero",
      type: "heroSplit",
      eyebrow: "Houston-Area SEO Agency",
      heading: "SEO Strategy for Houston-Area Businesses Ready to Grow Their Visibility",
      body: "Jordan Marketing Consultants helps local, regional, and industry-focused businesses improve search visibility through practical SEO strategy, content planning, local optimization, and clear reporting.",
      primaryCta: { label: "Request a Visibility Review", href: "/contact" },
      secondaryCta: { label: "View SEO Packages", href: "/seo-packages" },
      showcase: [
        {
          kind: "report",
          label: "Every month",
          title: "Monthly Recap",
          items: [
            "What was done",
            "Why it matters",
            "What changed",
            "What comes next",
          ],
        },
        {
          kind: "coverage",
          label: "Where you appear",
          title: "Search Visibility",
          items: ["Search", "Maps", "Local grid"],
        },
        {
          kind: "roadmap",
          label: "The plan",
          title: "SEO Roadmap",
          items: [
            "Priorities set",
            "Content queued",
            "Technical fixes tracked",
          ],
        },
      ],
    },

    {
      id: "growth-paths",
      type: "cardGrid",
      tone: "white",
      eyebrow: "SEO Growth Paths",
      heading: "Choose the SEO Path That Fits Where You Are Growing",
      body: "Different businesses need different SEO strategies. JMC helps visitors find the right path based on market size, competition, audience, and growth goals.",
      columns: 3,
      cards: [
        {
          title: "Local SEO",
          icon: "map-pin",
          body: "For businesses that need stronger visibility in Google Search, Google Maps, and local service-area searches.",
          cta: { label: "Explore Local SEO", href: "/local-seo-services" },
        },
        {
          title: "Traditional SEO",
          icon: "trending-up",
          body: "For regional, national, and industry-focused companies competing across larger search markets.",
          cta: {
            label: "Explore Traditional SEO",
            href: "/traditional-seo-services",
          },
        },
        {
          title: "Real Estate SEO",
          icon: "home",
          body: "For agents, teams, and brokerages that want stronger local search presence and content that supports trust.",
          cta: { label: "Explore Real Estate SEO", href: "/real-estate-seo" },
        },
      ],
    },

    {
      id: "reporting",
      type: "cardGrid",
      tone: "surface",
      emphasis: true,
      eyebrow: "Clear Reporting",
      heading: "You Should Know What Your SEO Team Is Actually Doing",
      body: "SEO should not feel vague. JMC gives clients clear monthly visibility into the work completed, the priorities being addressed, the movement we are tracking, and the next steps we recommend.",
      columns: 3,
      cards: [
        {
          title: "What Was Done",
          body: "A plain-English summary of completed SEO work, content updates, technical checks, local visibility tasks, and other scoped deliverables.",
        },
        {
          title: "Why It Matters",
          body: "Context around how the work supports visibility, search relevance, local trust, rankings, or lead quality.",
        },
        {
          title: "What Comes Next",
          body: "Priority recommendations so you understand where the campaign is heading and what should happen next.",
        },
      ],
      cta: { label: "See How JMC Reports SEO Progress", href: "/contact" },
    },

    {
      id: "services",
      type: "cardGrid",
      tone: "white",
      eyebrow: "SEO Services",
      heading: "SEO Work Built Around Strategy, Visibility, and Accountability",
      body: "JMC focuses on the pieces of SEO that help businesses become easier to find, easier to understand, and easier to trust in search.",
      columns: 3,
      cards: [
        {
          title: "SEO Strategy",
          icon: "target",
          body: "Keyword priorities, search intent, competitor visibility, and roadmap planning.",
        },
        {
          title: "Local Optimization",
          icon: "map-pin",
          body: "Local search improvements that support visibility in Google Search, Google Maps, and service-area searches.",
        },
        {
          title: "Google Business Profile Support",
          icon: "star",
          body: "Profile optimization, post strategy, service alignment, and activity that supports local trust.",
        },
        {
          title: "SEO Content Planning",
          icon: "file-text",
          body: "Strategic SEO pages, content roadmaps, service page improvements, and search-focused messaging.",
        },
        {
          title: "Technical SEO Monitoring",
          icon: "wrench",
          body: "Ongoing review of technical issues that can affect crawling, indexing, visibility, and site performance.",
        },
        {
          title: "Reporting and Monthly Recaps",
          icon: "bar-chart",
          body: "Clear monthly updates that explain progress, priorities, and next steps without burying you in jargon.",
        },
      ],
      cta: { label: "Explore SEO Services", href: "/local-seo-services" },
    },

    {
      id: "houston",
      type: "fullWidthText",
      tone: "surface",
      eyebrow: "Houston-Area SEO Agency",
      heading: "Rooted in League City. Built for Houston-Area Growth.",
      body: "JMC is based in League City and works with businesses across the Houston area that need practical SEO strategy, stronger search visibility, and clearer reporting. Whether the goal is local visibility, regional growth, or a more focused real estate SEO strategy, the work starts with understanding where your business is trying to grow.",
      cta: { label: "Learn More About JMC", href: "/about" },
    },

    {
      id: "packages",
      type: "cardGrid",
      tone: "white",
      eyebrow: "SEO Packages",
      heading: "SEO Options Built for Different Growth Stages",
      body: "JMC offers structured SEO options for businesses that need ongoing monthly support or a focused starting point before moving into a longer campaign.",
      columns: 3,
      cards: [
        {
          title: "Monthly Local SEO Packages",
          icon: "map-pin",
          body: "For businesses that need consistent local visibility support across search, maps, content, reviews, and reporting.",
          cta: {
            label: "Compare Local SEO Packages",
            href: "/seo-packages#local",
          },
        },
        {
          title: "Traditional SEO Packages",
          icon: "trending-up",
          body: "For businesses targeting regional, national, or competitive industry visibility with a larger search footprint.",
          cta: {
            label: "Compare Traditional SEO Packages",
            href: "/seo-packages#traditional",
          },
        },
        {
          title: "Launch Sprints",
          icon: "compass",
          body: "For businesses that need a fixed-scope SEO foundation before deciding on monthly service.",
          cta: { label: "View Launch Sprints", href: "/launch-sprints" },
        },
      ],
    },

    {
      id: "industries",
      type: "cardGrid",
      variant: "compact",
      tone: "surface",
      eyebrow: "Industries Served",
      heading: "We Know Your Market, Not Just Your Keywords",
      body: "JMC works with local, regional, and industry-focused businesses where search visibility supports trust, qualified leads, and long-term growth.",
      columns: 4,
      cards: [
        {
          title: "Home Services",
          icon: "wrench",
          body: "Local SEO support for service-based businesses that depend on visibility, trust, and calls from their service area.",
          cta: { label: "Local SEO", href: "/local-seo-services" },
        },
        {
          title: "Real Estate",
          icon: "home",
          body: "SEO strategy for agents, teams, and brokerages that need stronger local search presence and neighborhood visibility.",
          cta: { label: "Real Estate SEO", href: "/real-estate-seo" },
        },
        {
          title: "Health and Wellness",
          icon: "heart-pulse",
          body: "SEO support for businesses where clarity, trust, and local relevance matter before someone reaches out.",
          cta: { label: "Local SEO", href: "/local-seo-services" },
        },
        {
          title: "Professional Services",
          icon: "briefcase",
          body: "Search visibility strategy for local and regional service providers that need to be found by the right audience.",
          cta: { label: "Local SEO", href: "/local-seo-services" },
        },
        {
          title: "Food and Hospitality",
          icon: "utensils",
          body: "SEO support for businesses and hospitality groups that depend on visibility, reputation, and local discovery.",
          cta: { label: "Traditional SEO", href: "/traditional-seo-services" },
        },
        {
          title: "Commercial Construction",
          icon: "hard-hat",
          body: "SEO strategy for companies with complex services, longer sales cycles, and regional or industry-specific growth goals.",
          cta: { label: "Traditional SEO", href: "/traditional-seo-services" },
        },
        {
          title: "Oil, Gas, and Industrial",
          icon: "factory",
          body: "Traditional SEO support for industrial and B2B companies that need clearer visibility across specialized services.",
          cta: { label: "Traditional SEO", href: "/traditional-seo-services" },
        },
        {
          title: "Multi-Location Brands",
          icon: "network",
          body: "SEO strategy for businesses managing visibility across multiple locations, markets, or service areas.",
          cta: { label: "Traditional SEO", href: "/traditional-seo-services" },
        },
      ],
    },

    {
      id: "process",
      type: "processSteps",
      tone: "white",
      eyebrow: "How It Works",
      heading: "A Clear SEO Process From Review to Recap",
      body: "SEO works better when the process is organized. JMC keeps the work focused around visibility, priorities, implementation, and clear communication.",
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
      id: "transparency",
      type: "cardGrid",
      tone: "surface",
      heading:
        "No Mystery SEO. No Confusing Reports. No Guessing What You Paid For.",
      body: "JMC is built around clear strategy, documented priorities, practical execution, and reporting that helps business owners understand the work. The goal is not to bury you in dashboards. The goal is to help you see what is happening and what needs to happen next.",
      columns: 4,
      cards: [
        {
          title: "Clear Scope",
          icon: "list-checks",
          body: "You know what is included before the work begins.",
        },
        {
          title: "Clear Priorities",
          icon: "target",
          body: "SEO work is tied to roadmap priorities, not random tasks.",
        },
        {
          title: "Clear Reporting",
          icon: "bar-chart",
          body: "Monthly Recaps explain progress in plain English.",
        },
        {
          title: "Clear Next Steps",
          icon: "compass",
          body: "Every campaign should have a visible direction.",
        },
      ],
      cta: { label: "Request a Visibility Review", href: "/contact" },
    },

    {
      id: "final-cta",
      type: "finalCta",
      heading: "Not Sure Where Your SEO Is Stuck? Start with a Visibility Review.",
      body: "We will help you identify visibility gaps, priority opportunities, and the best next step based on your business, market, and goals.",
      primaryCta: { label: "Request a Visibility Review", href: "/contact" },
      secondaryCta: { label: "View SEO Packages", href: "/seo-packages" },
    },
  ],
};
