import type { PageContent } from "@/lib/types";

/**
 * Local SEO Services.
 *
 * Structure is approved (Local SEO Wireframe v1). Copy is DRAFT — no copy deck
 * exists for this page. Written against the wireframe intent and the language
 * guardrails in Approved Positioning §9. Needs client sign-off.
 */
export const localSeoPage: PageContent = {
  slug: "/local-seo-services",
  label: "Local SEO Services",
  seoTitle: "Local SEO Services in the Houston Area",
  metaDescription:
    "Local SEO for Houston-area businesses. Google Business Profile, citations, local content, review support, and clear monthly reporting.",
  sections: [
    {
      id: "hero",
      type: "heroSplit",
      eyebrow: "Local SEO Services",
      heading: "Get Found by the People Searching in Your Service Area",
      body: "Local SEO helps your business show up when nearby customers search for what you do. JMC works on the pieces that drive local visibility: your Google Business Profile, your service pages, your local listings, your reviews, and the reporting that shows what changed.",
      primaryCta: { label: "Request a Visibility Review", href: "/contact" },
      secondaryCta: {
        label: "View Local SEO Packages",
        href: "/seo-packages#local",
      },
      // Stat + coverage + channels. Deliberately a different mix from the
      // homepage so the two pages don't open identically.
      showcase: [
        {
          kind: "stat",
          label: "Neighborhood tier",
          title: "What Gets Tracked",
          // Real scope figures from the pricing sheet, not invented results.
          stats: [
            { value: "30", label: "Tracked keywords" },
            { value: "3", label: "Tracked competitors" },
            { value: "8", label: "Profile posts a month" },
          ],
          footnote: "Scales with Citywide and Metro",
        },
        {
          kind: "coverage",
          label: "Service area",
          title: "Local Search Grid",
          items: ["Neighborhood", "Citywide", "Metro"],
        },
        {
          kind: "channels",
          label: "Where you appear",
          title: "Local Surfaces",
          items: [
            "Google Search results",
            "Google Maps and the map pack",
            "Service-area searches",
          ],
          footnote: "Tracked across your whole service area",
        },
      ],
    },

    {
      id: "audience-fit",
      type: "cardGrid",
      tone: "white",
      variant: "split",
      eyebrow: "Is This You",
      heading: "Local SEO Is the Right Path When Your Customers Are Nearby",
      body: "If your business depends on people finding you in a specific city or service area, local SEO is where the work should start.",
      columns: 3,
      cards: [
        {
          title: "A Defined Local Market",
          icon: "map-pin",
          body: "You serve a city, a set of neighborhoods, or a drive-time radius rather than a national audience.",
        },
        {
          title: "Search and Maps Visibility",
          icon: "search",
          body: "You need to appear in both regular Google results and the map pack when someone searches nearby.",
        },
        {
          title: "Service Pages That Work",
          icon: "file-text",
          body: "Your services need pages that explain what you do clearly enough for search engines and buyers to understand.",
        },
        {
          title: "Google Business Profile Support",
          icon: "star",
          body: "Your profile needs consistent attention, not a one-time setup that goes stale after a month.",
        },
        {
          title: "Reporting You Can Read",
          icon: "bar-chart",
          body: "You want to know what was done and what changed without decoding a dashboard on your own.",
        },
      ],
      cta: { label: "See What Local SEO Includes", href: "#includes" },
    },

    {
      id: "includes",
      type: "cardGrid",
      tone: "surface",
      variant: "numbered",
      eyebrow: "What's Included",
      heading: "The Work Behind Local Search Visibility",
      body: "Local SEO is a set of connected workstreams. These are the pieces JMC manages month to month.",
      columns: 3,
      cards: [
        {
          title: "Google Business Profile Optimization",
          icon: "star",
          body: "Profile completeness, categories, services, posts, photos, and the ongoing activity that supports local trust.",
        },
        {
          title: "Local Content and Service Pages",
          icon: "file-text",
          body: "Strategic SEO pages and service page improvements built around what local buyers actually search for.",
        },
        {
          title: "Citation and Listing Support",
          icon: "link",
          body: "Consistent name, address, and phone details across the directories and platforms that influence local results.",
        },
        {
          title: "Review Support",
          icon: "message-square",
          body: "Review request sends and reply management so your reputation keeps building instead of stalling.",
        },
        {
          title: "Local Rank Tracking",
          icon: "gauge",
          body: "Local search grid tracking that shows where you appear across your service area, not just one average position.",
        },
        {
          title: "Monthly Recaps and Reporting",
          icon: "clipboard-check",
          body: "A plain-English summary of what was completed, what moved, and what is prioritized next.",
        },
      ],
      cta: { label: "Compare Local SEO Packages", href: "/seo-packages#local" },
    },

    {
      id: "system",
      type: "featureSplit",
      tone: "white",
      eyebrow: "How It Fits Together",
      heading: "Local Visibility Is One System, Not Six Separate Tasks",
      body: "Each piece of local SEO supports the others. A strong Google Business Profile works better when your service pages back it up. Reviews matter more when your listings are consistent. Tracking only helps if someone reads it and acts on it. JMC manages these as one system and reports on them together.",
      cta: { label: "Start with a Visibility Review", href: "/contact" },
      groups: [
        {
          title: "Google Business Profile",
          icon: "star",
          body: "The front door for local search and map results.",
        },
        {
          title: "Website Content",
          icon: "file-text",
          body: "Service and location pages that explain what you do.",
        },
        {
          title: "Citations and Listings",
          icon: "link",
          body: "Consistent business details across the platforms that count.",
        },
        {
          title: "Reviews",
          icon: "message-square",
          body: "Ongoing requests and replies that build local trust.",
        },
        {
          title: "Tracking",
          icon: "gauge",
          body: "Grid-based visibility tracking across your service area.",
        },
        {
          title: "Monthly Recaps",
          icon: "clipboard-check",
          body: "The summary that ties the month's work back to priorities.",
        },
      ],
    },

    {
      id: "houston",
      type: "fullWidthText",
      tone: "surface",
      eyebrow: "Houston-Area SEO Agency",
      heading: "Rooted in League City. Built for Houston-Area Growth.",
      body: "JMC is based in League City and works with businesses across the Greater Houston area. Local SEO is not limited to one part of the map. The strategy is built around where your customers actually are and where your business is trying to grow.",
      cta: { label: "Learn More About JMC", href: "/about" },
    },

    {
      id: "packages",
      type: "pricingCards",
      tone: "white",
      eyebrow: "Local SEO Packages",
      heading: "Monthly Local SEO Built Around Your Market Size",
      body: "Three levels of ongoing local SEO support. Every package includes strategy, on-page work, technical monitoring, review management, and a Monthly Recap.",
      packageIds: ["local-neighborhood", "local-citywide", "local-metro"],
      cta: { label: "View All SEO Packages", href: "/seo-packages" },
    },

    {
      id: "reporting",
      type: "cardGrid",
      tone: "surface",
      emphasis: true,
      eyebrow: "Clear Reporting",
      heading: "Every Month You Get a Straight Answer",
      body: "Local SEO involves a lot of small moving parts. Reporting is how those parts stay visible to you instead of disappearing into a dashboard.",
      columns: 4,
      cards: [
        {
          title: "What Was Completed",
          body: "The specific work delivered this month across profile, content, listings, and reviews.",
        },
        {
          title: "Why It Matters",
          body: "How each piece supports local visibility, relevance, or trust.",
        },
        {
          title: "What Changed",
          body: "Movement in local visibility, tracked keywords, and grid coverage across your service area.",
        },
        {
          title: "What Comes Next",
          body: "The priorities queued for next month and the reasoning behind them.",
        },
      ],
      cta: { label: "See How JMC Reports SEO Progress", href: "/contact" },
    },

    {
      id: "faq",
      type: "faq",
      tone: "white",
      eyebrow: "Questions",
      heading: "Local SEO Questions We Hear Often",
      items: [
        {
          question: "How long does local SEO take to show results?",
          answer:
            "Most businesses start seeing measurable movement in local visibility within three to six months, though profile and listing improvements can show up sooner. The timeline depends on your market's competitiveness, your site's current condition, and how consistently the work is applied. We track movement monthly so you can see progress before it turns into leads.",
        },
        {
          question: "Why does my Google Business Profile matter so much?",
          answer:
            "For local searches, your Google Business Profile is often the first thing a customer sees and sometimes the only thing they interact with. Categories, services, posts, photos, and reviews all influence whether you appear in map results and whether someone chooses you once you do.",
        },
        {
          question: "Do you work with competing businesses in the same area?",
          answer:
            "No. We do not take on two clients competing for the same service in the same primary market. If your market is already covered, we will tell you upfront rather than split our attention.",
        },
        {
          question: "What does monthly reporting actually include?",
          answer:
            "A Monthly Recap covering the work completed, why it mattered, what moved in your tracked keywords and local grid, and the priorities for the following month. It is delivered as a plain-English summary by Loom or video call, not just a raw dashboard export.",
        },
        {
          question: "Do I need new pages on my website?",
          answer:
            "Often yes. Strategic SEO pages give search engines and buyers a clear answer for each service you offer. Your package includes a set number of these pages per month, and we prioritize them based on what your market is actually searching for.",
        },
        {
          question: "Can you do local SEO on my existing website?",
          answer:
            "In most cases, yes. We start with an audit to confirm the site can support the work. If something structural is holding visibility back, we will flag it as a priority finding rather than working around it quietly.",
        },
      ],
      cta: { label: "Request a Visibility Review", href: "/contact" },
    },

    {
      id: "final-cta",
      type: "finalCta",
      heading: "Find Out Where Your Local Visibility Stands",
      body: "A Visibility Review shows where you currently appear, where the gaps are, and which local SEO priorities are worth acting on first.",
      primaryCta: { label: "Request a Visibility Review", href: "/contact" },
      secondaryCta: {
        label: "View Local SEO Packages",
        href: "/seo-packages#local",
      },
    },
  ],
};
