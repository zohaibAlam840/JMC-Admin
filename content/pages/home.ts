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
      /*
       * Centred, with the panels floating around the copy rather than
       * stacked beside it. The client sent a reference for this layout on
       * 2026-10-14 and asked for the homepage to open that way.
       *
       * The reference printed a figure on every panel -- "98.8k", "32,00
       * tracked keywords", "30,872 visitors", "88% views". None of those are
       * here and none of their equivalents are either: Page Spec 01 §1
       * forbids fabricated metrics presented as real client data, and a
       * number on a hero panel is the most load-bearing claim on the site.
       * What is borrowed is the composition, which is the part he was
       * pointing at.
       */
      id: "hero",
      type: "heroCentered",
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
      collage: [
        {
          kind: "report",
          label: "Every month",
          title: "Monthly Recap",
          items: ["What was done", "Why it matters", "What changed"],
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
          items: ["Priorities set", "Content queued", "Fixes tracked"],
        },
        {
          kind: "channels",
          label: "Two paths",
          title: "Sorted by Reach",
          items: ["Local SEO", "Traditional SEO"],
        },
        {
          // The one panel carrying figures, and they are published scope:
          // the tracked-keyword ceiling on each Local tier, printed on the
          // pricing page. Keep it in step with those packages.
          kind: "scale",
          label: "Local tiers",
          title: "Tracked Keywords",
          unit: "per month, up to",
          series: [
            { label: "Neighborhood", value: 30 },
            { label: "Citywide", value: 45 },
            { label: "Metro", value: 60 },
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
      body: "Strategy and the monthly recap are the same whichever lane you are in. Underneath them the work splits, because competing in one area and competing across several are not the same problem.",
      columns: 3,
      /*
       * Split by lane, which the client asked for after seeing the six
       * panels undifferentiated: "if we're going to title this SEO
       * services, then we need another part of this section for traditional
       * SEO ... technical SEO monitoring and the other things that we do for
       * traditional versus local."
       *
       * Three each. Strategy and reporting used to take two of the six and
       * belong to neither lane; they are in the section's own body now, and
       * reporting has a section of its own further down the page.
       */
      groupLabels: [
        { at: 0, label: "Local SEO" },
        { at: 3, label: "Traditional SEO" },
      ],
      cards: [
        {
          title: "Google Business Profile",
          icon: "star",
          body: "Categories, services, posts and review activity. For a lot of local searches the profile is what is being ranked, not the site.",
        },
        {
          title: "Citations & Listings",
          icon: "shield-check",
          body: "One standard for your name, address and phone number, applied across the listings that currently disagree with each other.",
        },
        {
          title: "Local Grid Tracking",
          icon: "map-pin",
          body: "Visibility measured across a spread of points in the service area rather than as one blended rank, because local results change street by street.",
        },
        {
          title: "Strategic SEO Pages",
          icon: "file-text",
          body: "Pages built for specific searches worth competing for, produced to a schedule rather than when there is time.",
        },
        {
          title: "Technical SEO Monitoring",
          icon: "wrench",
          body: "Crawling, indexing and site health watched month to month, so a redirect chain or a stray noindex is found before it costs a quarter.",
        },
        {
          title: "Authority Recommendations",
          icon: "network",
          body: "What would genuinely strengthen the site's standing and why, including the parts you are best placed to do yourself. Advice, not bought placements.",
        },
      ],
      cta: { label: "Explore Local SEO", href: "/local-seo-services" },
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
      cta: { label: "Explore Industries", href: "/industries" },
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
      /*
       * Lightest to heaviest, left to right: the one-time sprint at $799,
       * then Local from $875 a month, then Traditional from $2,295. The
       * client reordered these in review -- "move launch to where local is,
       * move local to where traditional is, and traditional replaces launch,
       * because we want to go from the lightest to the heaviest" -- and the
       * old order opened with a monthly commitment and buried the cheapest
       * way in at the end of the row.
       */
      cards: [
        {
          title: "Launch Sprints",
          icon: "compass",
          meta: "From $799 one-time",
          body: "For businesses that need a fixed-scope SEO foundation before deciding on monthly service.",
          cta: { label: "View Launch Sprints", href: "/launch-sprints" },
        },
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
          body: "JMC reviews where your business currently shows up, where visibility is weak, and which opportunities are worth prioritizing.",
        },
        {
          title: "SEO Roadmap",
          body: "The work is organized around keyword priorities, content needs, local visibility, technical issues, and business goals.",
        },
        {
          title: "Implementation",
          body: "JMC completes the scoped SEO work, content updates, local optimization, and technical improvements tied to the plan.",
        },
        {
          title: "Monthly Recap",
          body: "You receive a clear summary of what was completed, what changed, and what should happen next.",
        },
      ],
      cta: { label: "Request a Visibility Review", href: "/contact" },
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
      changed: "What moved, what did not, and what is still being watched.",
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
      body: "A review identifies visibility gaps, priority opportunities, and the best next step for your business, market, and goals.",
      primaryCta: { label: "Request a Visibility Review", href: "/contact" },
      secondaryCta: { label: "View SEO Packages", href: "/monthly-seo-packages" },
    },
  ],
};
