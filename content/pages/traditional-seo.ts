import type { PageContent } from "@/lib/types";

/**
 * Traditional SEO Services.
 *
 * Structure approved (Traditional SEO Wireframe v1). Copy is DRAFT.
 * This page should read as more mature and strategic than Local SEO without
 * drifting into "full-service digital marketing" positioning, and must not
 * claim deep proof in industries where none has been developed yet.
 */
export const traditionalSeoPage: PageContent = {
  slug: "/traditional-seo-services",
  label: "Traditional SEO Services",
  seoTitle: "Traditional SEO Services | Regional and National Organic SEO",
  metaDescription:
    "Traditional SEO for businesses competing across regional, national, and industry-focused search markets. Strategy, strategic SEO pages, technical monitoring, and clear reporting.",
  sections: [
    {
      id: "hero",
      type: "heroSplit",
      eyebrow: "Traditional SEO Services",
      heading: "Organic Search Strategy for Larger and More Competitive Markets",
      body: "When your buyers are spread across regions, service lines, or a specialized industry, local tactics stop being enough. Traditional SEO builds visibility through search strategy, content structure, technical health, and competitor awareness — reported clearly every month.",
      primaryCta: { label: "Request a Visibility Review", href: "/contact" },
      secondaryCta: {
        label: "View Traditional SEO Packages",
        href: "/seo-packages#traditional",
      },
      // Stat + roadmap + report. Leads with campaign scale, which is what
      // separates this page from Local SEO.
      showcase: [
        {
          kind: "stat",
          label: "Regional tier",
          title: "Campaign Scope",
          stats: [
            { value: "60", label: "Tracked keywords" },
            { value: "5", label: "Tracked competitors" },
            { value: "2", label: "Strategic pages a month" },
          ],
          footnote: "Up to 90 keywords on National+",
        },
        {
          kind: "roadmap",
          label: "The plan",
          title: "Strategy Roadmap",
          items: [
            "Keyword and intent mapping",
            "Strategic SEO pages",
            "Authority-building signals",
          ],
        },
        {
          kind: "report",
          label: "Every month",
          title: "Monthly Recap",
          items: [
            "Pages published",
            "Technical issues resolved",
            "Competitor movement",
            "Next-step priorities",
          ],
        },
      ],
    },

    {
      id: "audience-fit",
      type: "cardGrid",
      variant: "compact",
      tone: "white",
      eyebrow: "Is This You",
      heading: "Traditional SEO Fits Businesses Competing Beyond One Map Result",
      body: "These are the situations where a broader organic strategy does more than local optimization alone.",
      columns: 3,
      cards: [
        {
          title: "A Regional Search Footprint",
          icon: "map-pin",
          body: "You serve several markets or a defined region rather than a single city.",
        },
        {
          title: "National Search Visibility",
          icon: "network",
          body: "Your buyers can be anywhere, and proximity is not what decides whether you get the work.",
        },
        {
          title: "Complex Services",
          icon: "layers",
          body: "What you sell takes explaining, and one services page cannot carry it.",
        },
        {
          title: "Longer Buyer Journeys",
          icon: "calendar",
          body: "Your deals involve research, comparison, and multiple people before anyone reaches out.",
        },
        {
          title: "Competitive Industries",
          icon: "trending-up",
          body: "Established competitors already rank, and gaining ground takes a plan rather than a checklist.",
        },
        {
          title: "Strategic Reporting",
          icon: "bar-chart",
          body: "Someone above you needs to understand where the investment is going and what it is producing.",
        },
      ],
      cta: { label: "Explore Traditional SEO Strategy", href: "#includes" },
    },

    {
      id: "includes",
      type: "cardGrid",
      variant: "numbered",
      tone: "surface",
      eyebrow: "What's Included",
      heading: "The Work Behind a Larger Search Footprint",
      body: "Traditional SEO is built on strategy and structure. These are the workstreams JMC runs each month.",
      columns: 3,
      cards: [
        {
          title: "SEO Strategy and Roadmap",
          icon: "target",
          body: "Keyword priorities, search intent mapping, and a sequenced plan tied to business goals rather than a task list.",
        },
        {
          title: "Strategic SEO Pages",
          icon: "file-text",
          body: "Purpose-built pages for the services, markets, and topics your buyers are actually searching for.",
        },
        {
          title: "Technical SEO Monitoring",
          icon: "wrench",
          body: "Ongoing review of crawling, indexing, metadata, schema, sitemaps, and the issues that quietly cap visibility.",
        },
        {
          title: "Competitor and Market Visibility",
          icon: "search",
          body: "Tracking who is winning the searches you want and where the realistic openings are.",
        },
        {
          title: "Authority-Building Recommendations",
          icon: "link",
          body: "Practical guidance on the signals that build credibility in your space, grounded in what your market rewards.",
        },
        {
          title: "Monthly Recaps and Reporting",
          icon: "clipboard-check",
          body: "Dashboard reporting plus a plain-English recap that explains progress, priorities, and next steps.",
        },
      ],
      cta: {
        label: "Compare Traditional SEO Packages",
        href: "/seo-packages#traditional",
      },
    },

    {
      id: "industries",
      type: "cardGrid",
      variant: "compact",
      tone: "white",
      eyebrow: "Industry Focus",
      heading: "Search Strategy Built Around How Your Industry Buys",
      body: "Technical services, long sales cycles, and specialized terminology all change what SEO has to do. These are the industries JMC builds traditional SEO strategy for.",
      columns: 4,
      cards: [
        { title: "Oil, Gas, and Industrial", icon: "factory" },
        { title: "Commercial Construction", icon: "hard-hat" },
        { title: "Aerospace", icon: "compass" },
        { title: "Healthcare and Life Sciences", icon: "heart-pulse" },
        { title: "Maritime", icon: "network" },
        { title: "Hospitality", icon: "utensils" },
        { title: "Tourism", icon: "map-pin" },
        { title: "Multi-Location Brands", icon: "building" },
      ],
      cta: { label: "Talk Through Your SEO Growth Goals", href: "/contact" },
    },

    {
      id: "footprint",
      type: "cardGrid",
      tone: "surface",
      eyebrow: "Campaign Scale",
      heading: "Match the Strategy to the Ground You Need to Cover",
      body: "Search footprint drives everything: how many keywords are in play, how much content the plan needs, and how many competitors are worth watching.",
      columns: 3,
      cards: [
        {
          title: "Regional SEO",
          icon: "map-pin",
          body: "For businesses targeting a defined set of markets or a regional service footprint where each market needs its own attention.",
        },
        {
          title: "National SEO",
          icon: "network",
          body: "For businesses competing across broad markets and multiple service lines where visibility is not tied to geography.",
        },
        {
          title: "Industry-Focused SEO",
          icon: "layers",
          body: "For specialized companies whose buyers use technical language and compare a small set of credible options.",
        },
      ],
      cta: {
        label: "View Traditional SEO Packages",
        href: "/seo-packages#traditional",
      },
    },

    {
      id: "foundation",
      type: "featureSplit",
      tone: "white",
      align: "right",
      eyebrow: "The Foundation",
      heading: "Content and Technical Work Have to Move Together",
      body: "Strong content on a site search engines struggle to crawl does not rank. A technically clean site with nothing to say does not convert. Traditional SEO keeps both moving, with competitor context to show whether the plan is working and reporting that makes it legible.",
      cta: { label: "Start with a Visibility Review", href: "/contact" },
      groups: [
        {
          title: "Content Structure",
          icon: "file-text",
          body: "Pages organized around real search intent and how your services actually relate to each other.",
        },
        {
          title: "Technical Visibility",
          icon: "wrench",
          body: "Crawling, indexing, schema, and performance issues found and flagged before they cost you visibility.",
        },
        {
          title: "Competitor Tracking",
          icon: "search",
          body: "Who ranks for what, and where there is realistic room to take ground.",
        },
        {
          title: "Reporting Clarity",
          icon: "bar-chart",
          body: "Monthly reporting that connects the work to movement and to what happens next.",
        },
      ],
    },

    {
      id: "packages",
      type: "pricingCards",
      tone: "surface",
      eyebrow: "Traditional SEO Packages",
      heading: "Structured Growth. Compounding Visibility. Built to Scale.",
      body: "Three levels of monthly traditional SEO, sized by how much search territory the campaign has to cover.",
      packageIds: [
        "traditional-regional",
        "traditional-national",
        "traditional-national-plus",
      ],
      cta: { label: "View All SEO Packages", href: "/seo-packages" },
    },

    {
      id: "reporting",
      type: "cardGrid",
      tone: "white",
      emphasis: true,
      eyebrow: "Clear Reporting",
      heading: "Complex Campaigns Need Clearer Reporting, Not Longer Reports",
      body: "The bigger the campaign, the easier it is for the work to become invisible. Reporting is how it stays accountable.",
      columns: 4,
      cards: [
        {
          title: "Priority Work Completed",
          body: "What was delivered this month and which roadmap priority it belonged to.",
        },
        {
          title: "Visibility Movement",
          body: "Where tracked keywords and competitor positions moved, and what that means.",
        },
        {
          title: "Content and Technical Progress",
          body: "Pages published or improved, and technical issues resolved or flagged.",
        },
        {
          title: "Next-Step Recommendations",
          body: "The priorities queued next and the reasoning behind the sequence.",
        },
      ],
      cta: { label: "See How JMC Reports SEO Progress", href: "/contact" },
    },

    {
      id: "faq",
      type: "faq",
      tone: "surface",
      eyebrow: "Questions",
      heading: "Traditional SEO Questions We Hear Often",
      items: [
        {
          question: "What is the difference between local SEO and traditional SEO?",
          answer:
            "Local SEO focuses on visibility in a specific service area, where Google Business Profile, map results, and proximity carry a lot of weight. Traditional SEO focuses on organic visibility across broader markets, where content depth, site structure, technical health, and authority matter more than location. Some businesses need both.",
        },
        {
          question: "How do regional and national SEO differ in practice?",
          answer:
            "Regional campaigns concentrate on a defined set of markets, so content and tracking are organized market by market. National campaigns compete across a much larger keyword set with more established competitors, which means more content, more competitor tracking, and a longer runway before movement compounds.",
        },
        {
          question: "How much content will this involve?",
          answer:
            "Each package includes a set number of Strategic SEO Pages per month, from two to four depending on tier. We prioritize them against the roadmap rather than publishing on volume alone, and every page is built for a specific search intent.",
        },
        {
          question: "Is technical SEO included or billed separately?",
          answer:
            "Technical SEO monitoring and issue flagging are included in every traditional package. We identify problems, explain their impact, and recommend fixes. Large development work on your site is scoped separately if it falls outside the monthly plan.",
        },
        {
          question: "Do you guarantee rankings?",
          answer:
            "No, and you should be cautious of anyone who does. Search results are influenced by competitors, algorithm changes, and factors outside any agency's control. What we commit to is a documented roadmap, consistent execution against it, and honest reporting on what moved.",
        },
        {
          question: "How does communication work during a campaign?",
          answer:
            "You get a Monthly Recap explaining the work, the movement, and the next priorities, plus a Quarterly Project Update that steps back to look at direction. Between those, we flag anything urgent rather than saving it for the next report.",
        },
      ],
      cta: { label: "Request a Visibility Review", href: "/contact" },
    },

    {
      id: "final-cta",
      type: "finalCta",
      heading: "See Where Your Organic Visibility Is Losing Ground",
      body: "A Visibility Review identifies the gaps between where you rank today and where your market is actually searching, plus the priorities worth acting on first.",
      primaryCta: { label: "Request a Visibility Review", href: "/contact" },
      secondaryCta: {
        label: "View Traditional SEO Packages",
        href: "/seo-packages#traditional",
      },
    },
  ],
};
