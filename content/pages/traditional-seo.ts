import type { PageContent } from "@/lib/types";

/**
 * Traditional SEO Services — Page Spec 03. Ten sections.
 *
 * Every card in §2 describes reach rather than size, deliberately. A business
 * with seven locations across Texas is a large Local engagement, because it
 * still competes in local results, in one state, in one service line. A
 * single-location manufacturer selling nationally belongs here despite having
 * one address. The question is always where and against whom a business
 * competes, never how big it is, so no card uses headcount, location count or
 * revenue as the qualifier.
 *
 * §4 shows four industries rather than the canonical eight. This departs from
 * Decisions Record §5 and Page Spec 03 flags it for confirmation. The reason
 * is that four of the eight route to Local: showing all eight here duplicates
 * the homepage exactly and implies every industry is a Traditional buyer,
 * which is not true. The line below the grid keeps the door open for the other
 * four when they genuinely compete across markets.
 *
 * §6 card 3 has to state plainly that JMC recommends on authority building and
 * does not sell link placements. /link-building-service is an indexed old URL
 * that redirects here, so some visitors arrive expecting exactly that, and a
 * page that never addresses it loses them confused.
 *
 * The boundary between §3, §5 and §7 is worth protecting while editing: §3 is
 * what you get, §5 is how much of it, §7 is what it costs. Blur them and the
 * page reads as the same list three times.
 *
 * Copy is DRAFT. The Step 4 copy deck replaces it.
 */
export const traditionalSeoPage: PageContent = {
  slug: "/traditional-seo-services",
  label: "Traditional SEO Services",
  seoTitle: "Traditional SEO Services | Multi-Market Search",
  metaDescription:
    "SEO for businesses competing across several markets, service lines or competitive search. Strategy, strategic pages, technical monitoring, clear reporting.",
  sections: [
    {
      id: "hero",
      type: "heroSplit",
      eyebrow: "Traditional SEO Services",
      heading: "Built for Businesses Competing Beyond One Market",
      body: "When buyers are spread across cities, regions or the whole country, the work changes shape. Traditional SEO is strategy, strategic pages, technical monitoring and authority, measured against a competitive field rather than a service area.",
      primaryCta: { label: "Request a Visibility Review", href: "/contact" },
      secondaryCta: {
        label: "View Traditional SEO Packages",
        href: "/monthly-seo-packages#traditional",
      },
      // Report motif, which draws the ascending bar shape. Maps and pins
      // belong to Local and must not appear on this page.
      showcase: [
        {
          kind: "report",
          label: "What gets worked",
          title: "The Search Footprint",
          items: [
            "Tracked keywords across markets",
            "Tracked competitors",
            "Strategic SEO pages",
            "Technical monitoring",
          ],
        },
        {
          kind: "channels",
          label: "Three tiers",
          title: "Sized by Reach",
          items: ["Regional", "National", "National+"],
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
      heading: "Who Traditional SEO Is For",
      body: "All four describe reach rather than size. One address selling nationally belongs here; seven addresses inside one metro does not.",
      cards: [
        {
          title: "Multiple Markets",
          icon: "globe",
          body: "The business sells into more than one city, region or state, and the same search returns a different set of competitors in each of them.",
        },
        {
          title: "Multiple Service Lines",
          icon: "layers",
          body: "Several distinct offerings, each with its own buyers and its own search language. One page trying to hold all of them ranks for none of them.",
        },
        {
          title: "Competitive Search",
          icon: "target",
          body: "High-value searches with established competitors already sitting on them, where progress starts on the specific terms rather than the broadest one.",
        },
        {
          title: "Longer Buying Cycles",
          icon: "clipboard-check",
          body: "Procurement, requests for quotes and research-heavy purchases rather than a phone call. Several people search for different things before one decision is made.",
        },
      ],
    },

    {
      id: "includes",
      type: "cardGrid",
      tone: "white",
      variant: "cards",
      // Five, laid out as 3 + 2 centred. Not padded to six.
      columns: 5,
      eyebrow: "What You Get",
      heading: "What Traditional SEO Includes",
      body: "Every package includes all five. Tiers differ by scale, not by what is included.",
      cards: [
        {
          title: "SEO Strategy & Roadmap",
          icon: "compass",
          body: "A plan for the quarter with the reasoning behind the order, rather than a list of tasks arriving one at a time.",
        },
        {
          title: "Strategic SEO Pages",
          icon: "file-text",
          body: "Pages built for specific searches worth competing for, produced to a schedule rather than when there is time.",
        },
        {
          title: "Technical Monitoring",
          icon: "gauge",
          body: "Crawling, indexing and site health watched month to month, with issues flagged as they appear rather than found in an annual audit.",
        },
        {
          title: "Reporting & Monthly Recap",
          icon: "bar-chart",
          body: "Dashboard reporting alongside a recap delivered by Loom or a video call, so somebody explains it rather than sending it.",
        },
        {
          title: "Authority-Building Recommendations",
          icon: "network",
          body: "What would strengthen the site's authority and why, as advice you can act on. Recommendations, not placements bought on your behalf.",
        },
      ],
    },

    {
      id: "industries",
      type: "cardGrid",
      tone: "surface",
      variant: "cards",
      columns: 4,
      eyebrow: "Common Fits",
      heading: "Industries That Usually Land Here",
      body: "Businesses in other industries fit here too when they compete across several markets. Reach matters more than sector.",
      cards: [
        {
          title: "Energy & Petrochemical",
          icon: "lightning",
          body: "Suppliers and service firms found by specification, standard and part number rather than by name.",
          cta: { label: "Energy & Petrochemical", href: "/industries/energy-petrochemical" },
        },
        {
          title: "Maritime & Logistics",
          icon: "ship",
          body: "Port, freight and marine businesses searched by route, mode and capability.",
          cta: { label: "Maritime & Logistics", href: "/industries/maritime-logistics" },
        },
        {
          title: "Commercial Construction",
          icon: "hard-hat",
          body: "Contractors, civil firms and suppliers qualified on project type long before any bid conversation.",
          cta: {
            label: "Construction & Infrastructure",
            href: "/industries/commercial-construction-infrastructure",
          },
        },
        {
          title: "Aerospace & Aviation",
          icon: "plane",
          body: "Manufacturers and service providers where certification is the first filter a buyer applies.",
          cta: { label: "Aerospace & Aviation", href: "/industries/aerospace-aviation" },
        },
      ],
      cta: { label: "Explore Industries", href: "/industries" },
    },

    {
      id: "footprint",
      type: "featureSplit",
      tone: "white",
      align: "left",
      eyebrow: "Coverage",
      heading: "Coverage That Scales With the Business",
      body: "The three tiers are not different services. They are the same work applied to a wider footprint: more keywords tracked, more competitors watched, and more strategic pages produced each month.\n\nWhich one fits comes out of the visibility review rather than out of a headcount. A business competing in two states against four serious competitors is a different problem from one competing nationally against ten, and the coverage is what has to match.",
      // The one permitted table on a service page. It compares scale rather
      // than packages, which is exactly what keeps the pricing cards below it
      // from having to carry the comparison themselves.
      tableHeadings: ["", "Regional", "National", "National+"],
      tableRows: [
        { cells: ["Tracked keywords", "Up to 60", "Up to 75", "Up to 90"] },
        { cells: ["Tracked competitors", "Up to 5", "Up to 8", "Up to 10"] },
        {
          cells: ["Strategic pages a month", "Up to 2", "Up to 3", "Up to 4"],
        },
      ],
      groups: [],
    },

    {
      id: "content-technical",
      type: "cardGrid",
      tone: "surface",
      variant: "split",
      columns: 3,
      eyebrow: "In Detail",
      heading: "Content and Technical Work, Explained",
      body: "Three items from the list above that get misread more often than the rest.",
      cards: [
        {
          title: "Strategic SEO Pages",
          icon: "file-text",
          body: "Pages built for a specific search that a buyer actually makes, with the depth to answer it. They are not blog posts: a blog post is published and left, a strategic page is built to rank for something and maintained until it does.",
        },
        {
          title: "Technical Monitoring",
          icon: "gauge",
          body: "Ongoing issue flagging rather than a one-time audit. Sites break quietly, and a redirect chain or a noindex tag introduced during a redesign can undo months of work before anyone notices.",
        },
        {
          title: "Authority-Building Recommendations",
          icon: "network",
          body: "JMC advises on authority building and does not sell link placements. What you get is what would genuinely strengthen the site's standing and why, including the parts you are best placed to do yourself. Bought links are a risk taken with your domain, not with the agency's.",
        },
      ],
    },

    {
      id: "packages",
      type: "pricingCards",
      tone: "white",
      eyebrow: "Pricing",
      heading: "Traditional SEO Packages",
      body: "Three tiers, sized by footprint. Every tier includes all five deliverables above.",
      packageIds: [
        "traditional-regional",
        "traditional-national",
        "traditional-national-plus",
      ],
    },

    // Callout A. Plain text below the cards, not a card, and it routes to
    // /contact for a quote rather than anywhere else.
    {
      id: "custom-scope",
      type: "fullWidthText",
      tone: "white",
      heading: "Working With Something Bigger?",
      body: "If the scope is bigger or more involved than what is here, JMC will look at it and put together a quote.",
      cta: { label: "Request a Visibility Review", href: "/contact" },
    },

    /*
     * Callout B. Two sprints apply here and they map differently from the
     * Local page, where one sprint unlocks all three tiers. Both rows have to
     * be shown or the waiver reads as a blanket one.
     */
    {
      id: "sprint-callout",
      type: "waiverMatrix",
      tone: "white",
      eyebrow: "Another Way In",
      heading: "Or Start With a Launch Sprint",
      body: "Each sprint is one-time, completed within 30 days, and finishes with a 30-day roadmap. Begin monthly service within 30 days of the sprint completing and the onboarding fee on the matching package is waived.",
      sprintHeading: "Sprint",
      priceHeading: "One-time",
      waivesHeading: "Waives onboarding on",
      rows: [
        { sprint: "Regional Launch Sprint", price: "$1,495", waives: "Regional" },
        {
          sprint: "National Launch Sprint",
          price: "$2,295",
          waives: "National or National+",
        },
      ],
      condition:
        "Monthly service must begin within 30 calendar days of sprint completion.",
      cta: { label: "View Launch Sprints", href: "/launch-sprints" },
    },

    {
      id: "monthly-recap",
      type: "reportingBlock",
      tone: "surface",
      eyebrow: "Reporting",
      heading: "The Monthly Recap",
      body: "Four questions, every month, in the same order.",
      did: "The pages built, the technical issues fixed, the recommendations made, named individually.",
      why: "Why that work was the priority ahead of everything else in the queue.",
      changed: "Movement across the tracked keyword and competitor set, including the months where little moved.",
      next: "What is queued for the coming month, written down before it starts.",
      cta: {
        label: "See How JMC Reports SEO Progress",
        href: "/seo-reporting",
      },
    },

    {
      id: "faq",
      type: "faq",
      tone: "white",
      eyebrow: "Questions",
      heading: "Traditional SEO Questions",
      items: [
        {
          question: "How long before there are results?",
          answer:
            "Longer than local, because the competing field is bigger and the buying cycles behind it are slower. Technical fixes can show within weeks, but movement on competitive terms is usually a matter of months, and it starts on the specific searches before the broad ones. The recap says which stage the work is at rather than implying steady progress.",
        },
        {
          question: "Is there a contract?",
          answer:
            "Yes. Twelve months, then month to month, with 30 days written notice to end it. The term exists because this work compounds and a short engagement cannot show what a full one can.",
        },
        {
          question: "What does the onboarding fee cover?",
          answer:
            "The technical and on-page audit, tracking setup across markets, competitor analysis, and the foundational fixes that have to happen once before the monthly work means anything.",
        },
        {
          question: "Do you build links?",
          answer:
            "No. JMC advises on authority building and does not sell or place links. Bought placements are a risk taken with your domain rather than with the agency's, and the recommendations you get are the ones that would be given if the domain were ours.",
        },
        {
          question: "How is this different from Local SEO?",
          answer:
            "Local SEO is for businesses competing for customers in a defined area, however many locations they run in it. Traditional SEO is for businesses competing across markets, service lines or genuinely competitive search. It is a difference in reach, not in size, and a large single-area business is still a Local engagement.",
        },
        {
          question: "Do you guarantee rankings?",
          answer:
            "No, and anyone who does is guessing. What is guaranteed is the scope, the reporting, and knowing exactly what was done and why.",
        },
      ],
      cta: { label: "Request a Visibility Review", href: "/contact" },
    },

    {
      id: "final-cta",
      type: "finalCta",
      heading: "Start With a Visibility Review",
      body: "Where the business appears across its markets today, who is holding the space, and which gap is worth closing first.",
      primaryCta: { label: "Request a Visibility Review", href: "/contact" },
      secondaryCta: {
        label: "View Traditional SEO Packages",
        href: "/monthly-seo-packages#traditional",
      },
    },
  ],
};
