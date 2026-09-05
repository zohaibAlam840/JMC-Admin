import type { PageContent } from "@/lib/types";

/**
 * Monthly SEO Packages — Page Spec 06. Ten sections.
 *
 * Publishing the prices at all is the point of the page. Most agencies gate
 * this behind a call, and saying the numbers out loud is pillar 1 applied to
 * pricing, so the hero says so plainly without naming anyone.
 *
 * A centred hero here, against the split hero on Launch Sprints. The two pages
 * share every other component, and the hero is the cheapest available point of
 * visual separation between them.
 *
 * The path selector and both package sections sort by reach, never by size. A
 * seven-location Texas operation is a Local buyer. Location count, headcount
 * and revenue must never appear as the qualifier.
 *
 * Off-Page Essentials at $399 does not appear anywhere on this page or on the
 * site. It is a sales-conversation asset, and it is hidden rather than deleted
 * in content/packages.ts.
 *
 * Copy is DRAFT. The Step 4 copy deck replaces it.
 */
export const seoPackagesPage: PageContent = {
  slug: "/monthly-seo-packages",
  label: "Monthly SEO Packages",
  seoTitle: "Monthly SEO Packages & Pricing | Houston Area",
  metaDescription:
    "SEO pricing published in full. Local packages from $875 a month, Traditional from $2,295, with what each tier includes, what onboarding covers, and the terms.",
  sections: [
    {
      id: "hero",
      type: "heroCentered",
      eyebrow: "Monthly SEO Packages",
      heading: "The Prices Are on This Page",
      body: "Six monthly packages across two service lines, with what each one includes and what it costs. Nothing here is behind a call, because a price you have to ask for is a price that changes depending on who is asking.",
      // No buttons: the path selector directly below is the action.
    },

    {
      id: "path",
      type: "cardGrid",
      tone: "surface",
      variant: "cards",
      columns: 2,
      eyebrow: "Start Here",
      heading: "Two Paths, Sorted by Reach",
      body: "Which one fits comes down to where a business competes, not how large it is.",
      cards: [
        {
          title: "Local SEO",
          icon: "map-pin",
          meta: "From $875 a month",
          body: "For businesses competing for customers in a defined area, however many locations they run inside it.",
          cta: { label: "See Local Packages", href: "#local" },
        },
        {
          title: "Traditional SEO",
          icon: "globe",
          meta: "From $2,295 a month",
          body: "For businesses competing across multiple markets, multiple service lines, or genuinely competitive search.",
          cta: { label: "See Traditional Packages", href: "#traditional" },
        },
      ],
    },

    {
      id: "local",
      type: "pricingCards",
      tone: "white",
      eyebrow: "Local SEO",
      heading: "Local SEO Packages",
      body: "Three tiers, sized by how much ground you are competing for.",
      packageIds: ["local-neighborhood", "local-citywide", "local-metro"],
    },

    // The custom-scope line for the Local group. It routes to /contact for a
    // quote and must never route to Traditional: above the Metro tier a
    // business competing in local results is still a Local buyer.
    {
      id: "local-custom",
      type: "fullWidthText",
      tone: "white",
      heading: "Bigger Than Metro?",
      body: "If the scope is bigger or more involved than what is here, JMC will look at it and put together a quote. That is still a Local engagement, however many locations are involved.",
      cta: { label: "Request a Visibility Review", href: "/contact" },
    },

    {
      id: "traditional",
      type: "pricingCards",
      tone: "surface",
      eyebrow: "Traditional SEO",
      heading: "Traditional SEO Packages",
      body: "Three tiers, sized by footprint rather than by headcount.",
      packageIds: [
        "traditional-regional",
        "traditional-national",
        "traditional-national-plus",
      ],
      cta: { label: "Request a Visibility Review", href: "/contact" },
    },

    {
      id: "included",
      type: "cardGrid",
      tone: "white",
      variant: "compact",
      columns: 3,
      eyebrow: "Every Tier",
      heading: "Included in Every Package",
      body: "Tiers differ by volume, not by what is included.",
      groupLabels: [
        { at: 0, label: "Local SEO, all tiers" },
        { at: 6, label: "Traditional SEO, all tiers" },
      ],
      cards: [
        {
          title: "SEO Strategy & Roadmap",
          icon: "compass",
          body: "A plan for the quarter, with the reasoning behind the order.",
        },
        {
          title: "Content & On-Page Optimization",
          icon: "pencil",
          body: "Service pages, titles, descriptions and page structure.",
        },
        {
          title: "Technical Monitoring",
          icon: "gauge",
          body: "Crawling, indexing and site health watched month to month.",
        },
        {
          title: "Detailed Monthly Reporting",
          icon: "bar-chart",
          body: "What was tracked, what moved, and what did not.",
        },
        {
          title: "Monthly Project Recap",
          icon: "message-square",
          body: "Delivered by Loom or a video call, with room to ask questions.",
        },
        {
          title: "Review Management",
          icon: "star",
          body: "Requests sent to real customers, and replies to what arrives.",
        },
        {
          title: "SEO Strategy & Roadmap",
          icon: "compass",
          body: "The same plan, applied across markets rather than an area.",
        },
        {
          title: "Strategic SEO Pages",
          icon: "file-text",
          body: "Pages built for specific searches, produced to a schedule.",
        },
        {
          title: "Technical Monitoring",
          icon: "gauge",
          body: "Issues flagged as they appear, not found in an annual audit.",
        },
        {
          title: "Reporting & Monthly Recap",
          icon: "bar-chart",
          body: "Dashboard reporting alongside the recap, in both cases explained.",
        },
        {
          title: "Authority-Building Recommendations",
          icon: "network",
          body: "Advice on what would strengthen authority. Recommendations, not link placements.",
        },
      ],
    },

    {
      id: "onboarding",
      type: "featureSplit",
      tone: "surface",
      align: "left",
      eyebrow: "The One-Time Fee",
      heading: "What Onboarding Covers",
      body: "Every tier carries a one-time onboarding fee, from $349 to $1,295 depending on the package. It pays for the work that has to happen once before the monthly work means anything: nothing built on an unaudited foundation is worth reporting on.\n\nThe two scopes are genuinely different rather than one generic setup with different price tags, which is why they are listed separately below. A Launch Sprint can waive this fee entirely, which the next section sets out.",
      tableHeadings: ["Lane", "Onboarding covers"],
      tableRows: [
        {
          cells: [
            "Local SEO",
            "Audit, setup, tracking, foundational optimization, and local visibility setup",
          ],
        },
        {
          cells: [
            "Traditional SEO",
            "Audit, setup, tracking, foundational optimization, and roadmap development",
          ],
        },
      ],
      groups: [],
      cta: { label: "See how a sprint waives it", href: "#sprint-waiver" },
    },

    {
      id: "sprint-waiver",
      type: "waiverMatrix",
      tone: "white",
      eyebrow: "Another Way In",
      heading: "Start With a Launch Sprint",
      body: "A sprint is the onboarding work done standalone, with a roadmap attached. That is why the waiver exists rather than being a discount: it is close to the same job, bought once, with no monthly commitment behind it.",
      sprintHeading: "Sprint",
      priceHeading: "One-time",
      waivesHeading: "Waives onboarding on",
      rows: [
        {
          sprint: "Neighborhood Launch Sprint",
          price: "$799",
          waives: "Neighborhood, Citywide, or Metro",
        },
        {
          sprint: "Regional Launch Sprint",
          price: "$1,495",
          waives: "Regional",
        },
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
      body: "Included in every package in both lanes, at every tier.",
      did: "The specific work completed that month, named task by task.",
      why: "Why that work was the priority ahead of everything else in the queue.",
      changed:
        "What moved, reported honestly, including the months where little did.",
      next: "Next month's priorities, so nothing in the following recap is a surprise.",
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
      heading: "Pricing Questions",
      items: [
        {
          question: "Why a 12-month term?",
          answer:
            "Because SEO compounds and a short engagement cannot show what a full one can. Most of the foundational work lands in the first quarter and most of the return on it arrives later, so a three-month contract would mean paying for the setup and leaving before the benefit. The term applies to all six monthly tiers in both lanes.",
        },
        {
          question: "What happens after 12 months?",
          answer:
            "It runs month to month from then on, for as long as you want it to, and either side can end it with 30 days written notice. There is no second term and no automatic re-commitment.",
        },
        {
          question: "What does the onboarding fee cover?",
          answer:
            "On Local: the audit, tracking setup, foundational optimization and the local visibility setup, meaning profile, categories, services, citations and the grid baseline. On Traditional: the audit, tracking setup, foundational optimization and roadmap development. A Launch Sprint can waive it entirely if monthly service begins within 30 days of the sprint finishing.",
        },
        {
          question: "Can tiers be changed later?",
          answer:
            "Upgrades happen any time. The deliverables adjust from the next cycle and there is no additional onboarding fee. Downgrades take effect at renewal rather than mid-term.",
        },
        {
          question: "Which lane fits?",
          answer:
            "Reach decides it, not size. A business competing for customers in a defined area is Local, however many locations it runs there. A business competing across markets, service lines or competitive search is Traditional. Both service pages set out the difference in more detail.",
        },
        {
          question: "Does this include blog content?",
          answer:
            "Yes. Strategic SEO Pages covers all written SEO content, blog posts included. Early phases usually prioritise local and industry pages first, simply because blog content needs somewhere to point before it does much good.",
        },
        {
          question: "What is not included?",
          answer:
            "Paid advertising, web design and development, social media posting, and link building. Authority building is covered as recommendations rather than as placements bought on your behalf.",
        },
        {
          question: "Is there anything without a term?",
          answer:
            "Launch Sprints. One-time, completed within 30 days, no term and no renewal, ending with a roadmap that is yours whatever you decide next.",
        },
        {
          question: "Can Local and Traditional be combined?",
          answer:
            "Yes, as a custom plan. It is usually scoped from the Local deliverable side with the Traditional work layered on, and it needs a conversation rather than a package number.",
        },
        {
          question: "What if none of these fit?",
          answer:
            "Larger or more involved scopes get a custom quote. That is a real answer rather than a polite one: several kinds of engagement genuinely do not fit into three tiers.",
        },
      ],
      cta: { label: "Request a Visibility Review", href: "/contact" },
    },

    {
      id: "final-cta",
      type: "finalCta",
      heading: "Not Sure Which One Fits?",
      body: "A visibility review covers where you appear now, what is holding it back, and which package or sprint actually matches the problem.",
      primaryCta: { label: "Request a Visibility Review", href: "/contact" },
      secondaryCta: { label: "View Launch Sprints", href: "/launch-sprints" },
    },
  ],
};
