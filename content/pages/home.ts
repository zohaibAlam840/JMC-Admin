import type { PageContent } from "@/lib/types";

/**
 * Homepage.
 *
 * Structure follows Page Spec 01. The H1 and the transparency H2 are the only
 * two strings in that document marked LOCKED and must not be reworded.
 *
 * Everything else is DRAFT. Page Spec 01 is explicit that no other text in it
 * is finished copy: the real wording arrives in the Step 4 copy deck, which we
 * have not been sent.
 */
export const homePage: PageContent = {
  slug: "/",
  label: "Homepage",
  seoTitle: "Houston-Area SEO Agency | Jordan Marketing Consultants",
  metaDescription:
    "Houston-area SEO from Jordan Marketing Consultants. Local and traditional SEO, content planning, and a plain monthly recap of what changed, and why it did.",
  sections: [
    {
      id: "hero",
      type: "heroSplit",
      eyebrow: "SEO for local, regional, and industrial businesses",
      // LOCKED — Page Spec 01 §1. The retired H1 was "We Know Your Market, Not
      // Just Your Keywords", which claimed vertical expertise and contradicted
      // pillar 2. Do not reinstate it, and do not reword this one.
      heading: "Search Visibility, Explained Every Month.",
      // DRAFT. The subhead has to carry pillar 3 (SEO only, not full service)
      // so the locked H1 does not have to.
      body: "Jordan Marketing Consultants does one thing: search visibility for local, regional, and industrial businesses. Every month you get a plain recap of what was done, why, and what changed.",
      primaryCta: { label: "Request a Visibility Review", href: "/contact" },
      secondaryCta: {
        label: "See How JMC Reports SEO Progress",
        href: "/seo-reporting",
      },
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
      tone: "surface",
      eyebrow: "SEO Growth Paths",
      heading: "Two Paths, Sorted by Where You Compete",
      body: "Different businesses need different SEO strategies. Which one fits comes down to reach: a defined area, or several markets at once.",
      columns: 2,
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
      ],
    },

    {
      id: "transparency",
      type: "fullWidthText",
      treatment: "statement",
      // LOCKED — Page Spec 01 §3. The spec calls this the strongest line in
      // twelve documents. It is the promise; the Monthly Recap block is the
      // proof. They are separate by decision and must not be merged.
      heading:
        "No Mystery SEO. No Confusing Reports. No Guessing What You Paid For.",
      // DRAFT, 47 words. Transparency as an operating principle, not a feature.
      body: "Most agencies keep the work behind a login and the reasoning to themselves. JMC does the opposite. You see what was done, why it was done, and what it changed, in language that does not need translating. That is how the work is run, not a reporting add-on.",
      cta: {
        label: "See How JMC Reports SEO Progress",
        href: "/seo-reporting",
      },
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
      id: "industries",
      type: "industryGrid",
      tone: "surface",
      eyebrow: "Industries",
      // DRAFT heading. Framing must read "here is where this method gets
      // pointed", never "we are experts in aerospace" — that would contradict
      // the industry-agnostic method the rest of the page argues for.
      heading: "Where This Method Gets Pointed",
      body: "One method, aimed at two different kinds of search problem.",
      groups: [
        {
          /*
           * Descriptive only. Page Spec 01 §5 is explicit that these labels
           * must NOT assign a service lane: an earlier lane-based draft broke
           * because each group contains both single-area operators and
           * multi-market competitors.
           *
           * Group A sells to people. Group B sells to operations.
           */
          label: "Consumer & Community",
          cards: [
            {
              title: "Home Services & Trades",
              icon: "wrench",
              body: "Roofers, plumbers, electricians, and the trades that live on calls from a service area.",
              href: "/industries/home-services-trades",
            },
            {
              title: "Healthcare & Wellness",
              icon: "heart-pulse",
              body: "Practices and clinics where people check credibility before they ever call.",
              href: "/industries/healthcare-wellness",
            },
            {
              title: "Hospitality & Attractions",
              icon: "utensils",
              body: "Venues, parks, and places people search for by what they want to do, not by name.",
              href: "/industries/hospitality-attractions",
            },
            {
              title: "Professional Services",
              icon: "briefcase",
              body: "Firms whose next client is comparing three local options in a single sitting.",
              href: "/industries/professional-services",
            },
          ],
        },
        {
          label: "Industrial & B2B",
          cards: [
            {
              title: "Energy & Petrochemical",
              icon: "factory",
              body: "Operators and suppliers selling technical capability to a small, specific buyer pool.",
              href: "/industries/energy-petrochemical",
            },
            {
              title: "Maritime & Logistics",
              icon: "network",
              body: "Port, freight, and supply chain businesses working across regions rather than a radius.",
              href: "/industries/maritime-logistics",
            },
            {
              title: "Commercial Construction",
              icon: "hard-hat",
              body: "Contractors and infrastructure firms bidding well outside one city.",
              href: "/industries/commercial-construction-infrastructure",
            },
            {
              title: "Aerospace & Aviation",
              icon: "compass",
              body: "Suppliers and services in a market where the search volume is low and the intent is high.",
              href: "/industries/aerospace-aviation",
            },
          ],
        },
      ],
      // A line and a link, never a ninth card: a ninth would break the 4/4
      // symmetry the buckets depend on. It turns the edge case into a
      // statement of the method rather than a hole.
      escapeHatch:
        "The method does not change with the industry. If yours is not listed, it probably still applies.",
      cta: { label: "Explore All Industries", href: "/industries" },
    },

    {
      /*
       * Page Spec 01 §6. Preview only: entry price alone, no onboarding fees,
       * no term badges, no full deliverable lists. Those live on the pricing
       * pages. CardGrid rather than PricingCard, deliberately, for a lighter
       * treatment.
       *
       * Publishing entry prices on the homepage is a decision, not an
       * oversight: most agencies hide them, and doing the opposite is the
       * transparency pillar in practice rather than as a claim.
       *
       * The prices below are duplicated from content/packages.ts, which is the
       * canonical source. If a tier price changes there, this line has to be
       * changed too.
       */
      id: "packages",
      type: "cardGrid",
      tone: "white",
      eyebrow: "SEO Packages",
      heading: "SEO Options Built for Different Growth Stages",
      body: "JMC offers structured SEO options for businesses that need ongoing monthly support or a focused starting point before moving into a longer campaign.",
      columns: 3,
      cards: [
        {
          title: "Monthly Local SEO",
          icon: "map-pin",
          meta: "From $875/mo",
          body: "For businesses that need consistent local visibility support across search, maps, content, reviews, and reporting.",
          cta: {
            label: "View Local SEO Packages",
            href: "/monthly-seo-packages#local",
          },
        },
        {
          title: "Monthly Traditional SEO",
          icon: "trending-up",
          meta: "From $2,295/mo",
          body: "For businesses targeting regional, national, or competitive industry visibility with a larger search footprint.",
          cta: {
            label: "View Traditional SEO Packages",
            href: "/monthly-seo-packages#traditional",
          },
        },
        {
          title: "Launch Sprints",
          icon: "compass",
          meta: "From $799 one-time",
          body: "For businesses that need a fixed-scope SEO foundation before deciding on monthly service.",
          cta: { label: "View Launch Sprints", href: "/launch-sprints" },
        },
      ],
    },

    {
      id: "process",
      type: "processSteps",
      tone: "surface",
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
      // Page Spec 01 §8, the proof half of the transparency argument. Card
      // titles are locked in the renderer; only these sentences vary.
      id: "monthly-recap",
      type: "reportingBlock",
      tone: "white",
      eyebrow: "Clear Reporting",
      heading: "What You Get Every Month",
      body: "SEO should not feel vague. Every month you get the same four answers, in the same order, in language that does not need a glossary.",
      did: "A plain summary of the SEO work completed: content, technical checks, local visibility tasks, and everything else inside the scope.",
      why: "The reasoning behind each piece of work, and how it supports visibility, relevance, or trust.",
      changed: "What moved, what did not, and what we are still watching.",
      next: "The priorities for the coming month, in order, so you always know where the campaign is heading.",
      cta: {
        label: "See How JMC Reports SEO Progress",
        href: "/seo-reporting",
      },
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
      id: "final-cta",
      type: "finalCta",
      heading: "Not Sure Where Your SEO Is Stuck? Start with a Visibility Review.",
      body: "We will help you identify visibility gaps, priority opportunities, and the best next step based on your business, market, and goals.",
      primaryCta: { label: "Request a Visibility Review", href: "/contact" },
      secondaryCta: { label: "View SEO Packages", href: "/monthly-seo-packages" },
    },
  ],
};
