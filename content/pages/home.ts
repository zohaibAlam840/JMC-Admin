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
    "Transparent Houston-area SEO with clear strategy, visible work, and a plain monthly recap of what changed and why, delivered by Jordan Marketing Consultants.",
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
          // Decorative only. These panels describe abstract signals rather
          // than pretending to be a report, dashboard, or client result.
          kind: "report",
          label: "Search patterns",
          title: "Signals",
          items: ["Pages", "Profiles", "Markets"],
        },
        {
          kind: "growth",
          label: "Direction",
          title: "Momentum",
          items: ["Foundation", "Progress", "Next"],
        },
        {
          kind: "coverage",
          label: "Market shape",
          title: "Coverage",
          items: ["Local", "Regional", "Industry"],
        },
        {
          kind: "roadmap",
          label: "Work in motion",
          title: "Sequence",
          items: ["Assess", "Prioritize", "Build"],
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
          items: [
            "Google Search and Maps",
            "Defined service areas",
            "Profile and listing work",
          ],
          cta: { label: "Explore Local SEO", href: "/local-seo-services" },
        },
        {
          title: "Traditional SEO",
          icon: "trending-up",
          body: "For regional, national, and industry-focused companies competing across larger search markets.",
          items: [
            "Multiple markets",
            "Strategic SEO pages",
            "Technical and authority work",
          ],
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
      // DRAFT, 46 words. Transparency as an operating principle, not a feature.
      body: "JMC makes the work visible from the start. Every month, clients see what was done, why it mattered, what changed, and what comes next, in language built for decisions rather than interpretation. Clear reasoning, visible priorities, and an accountable recap are the standard on every engagement.",
      cta: {
        label: "See How JMC Reports SEO Progress",
        href: "/seo-reporting",
      },
    },

    {
      id: "services",
      type: "featureSplit",
      tone: "white",
      eyebrow: "SEO Services",
      heading: "SEO Work Built Around Strategy, Visibility, and Accountability",
      body: "In 2022, JMC narrowed from a full-service agency to one discipline: SEO. That focus keeps every engagement centered on the work that builds search visibility, with a clear roadmap and an accountable monthly recap. The result is a tighter scope and a clear explanation of each priority.",
      align: "left",
      groups: [
        {
          title: "Strategy & Roadmap",
          icon: "compass",
          body: "Priorities set in order, with the reason for that order made clear.",
        },
        {
          title: "On-Page & Content",
          icon: "file-text",
          body: "Pages and written content built around the searches worth competing for.",
        },
        {
          title: "Technical Monitoring",
          icon: "wrench",
          body: "Crawling, indexing, and site health watched throughout the engagement.",
        },
        {
          title: "Reporting & Recap",
          icon: "bar-chart",
          body: "The work, reasoning, movement, and next priorities explained every month.",
        },
      ],
      cta: { label: "Learn More About JMC", href: "/about" },
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
      body: "One transparent method, adapted to how buyers search in each sector.",
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
              title: "Commercial Construction & Infrastructure",
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
          items: ["Fixed scope", "One-time pricing", "30-day action roadmap"],
          cta: { label: "View Launch Sprints", href: "/launch-sprints" },
        },
        {
          title: "Monthly Local SEO",
          icon: "map-pin",
          meta: "From $875/mo",
          body: "For businesses that need consistent local visibility support across search, maps, content, reviews, and reporting.",
          items: [
            "Search and Maps visibility",
            "Profile, listings, and reviews",
            "Monthly reporting and recap",
          ],
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
          items: [
            "Multi-market strategy",
            "Strategic pages and technical work",
            "Monthly reporting and recap",
          ],
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
      body: "JMC is based in League City and works with businesses across the Houston area that need practical SEO strategy, stronger search visibility, and clearer reporting. Whether the goal is local visibility or regional growth, the work starts with understanding where the business is trying to grow.",
    },

    {
      id: "final-cta",
      type: "finalCta",
      heading: "Start With a Visibility Review",
      body: "A review identifies visibility gaps, priority opportunities, and the best next step for your business, market, and goals.",
      primaryCta: { label: "Request a Visibility Review", href: "/contact" },
      secondaryCta: {
        label: "View Monthly SEO Packages",
        href: "/monthly-seo-packages",
      },
    },
  ],
};
