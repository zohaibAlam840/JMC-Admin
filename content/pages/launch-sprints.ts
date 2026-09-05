import type { PageContent } from "@/lib/types";

/**
 * Launch Sprints — Page Spec 07.
 *
 * Nine sections. The two decisions that shape the page are both about telling
 * the truth at the cost of a sale.
 *
 * §3 was originally "What a Sprint Is Not" with four negatively-framed cards.
 * Reframed to "Where a Sprint Ends" with positive titles, and it earns its
 * place more that way than less: defining exactly where a fixed-scope
 * engagement stops is the transparency pillar applied to scope rather than to
 * reporting, and it is the first thing a reader who has been burned by a vague
 * SEO package will look for.
 *
 * §7 replaces the Monthly Recap block that appears on every other service
 * page. A sprint does not produce a monthly recap, and describing a deliverable
 * this purchase does not include is exactly the small inaccuracy that
 * undermines the positioning. The refined rule is that the recap block belongs
 * on pages selling ongoing service. This page describes its own deliverable
 * and links out for what monthly looks like.
 *
 * Copy is DRAFT. The Step 4 copy deck replaces it.
 */
export const launchSprintsPage: PageContent = {
  slug: "/launch-sprints",
  label: "Launch Sprints",
  seoTitle: "SEO Launch Sprints | One-Time, 30 Days",
  metaDescription:
    "One-time SEO Launch Sprints from $799, completed within 30 days. A fixed scope, a full audit, foundational optimization, and a 30-day action roadmap at the end.",
  sections: [
    {
      id: "hero",
      type: "heroSplit",
      eyebrow: "Launch Sprints",
      heading: "A Fixed Scope, Finished in Thirty Days",
      body: "A Launch Sprint is a single engagement with a defined start, a defined end, and a written list of everything included. There is no term, no renewal, and no obligation to continue afterwards.",
      primaryCta: {
        label: "Request a Sprint Consultation",
        href: "/contact?type=sprint",
      },
      secondaryCta: {
        label: "View Monthly SEO Packages",
        href: "/monthly-seo-packages",
      },
      // A roadmap motif rather than the reporting one. Page Spec 07 §1 wants
      // this hero visually distinct from the pages that sell ongoing service,
      // and the motif is the cheapest place to do it.
      showcase: [
        {
          kind: "roadmap",
          label: "Thirty days",
          title: "The Sprint",
          items: [
            "Audit",
            "Implementation",
            "Handoff",
            "30-Day Action Roadmap",
          ],
        },
        {
          kind: "coverage",
          label: "Three sprints",
          title: "Sized by Reach",
          items: ["Neighborhood", "Regional", "National"],
        },
      ],
    },

    {
      id: "what-a-sprint-is",
      type: "cardGrid",
      tone: "surface",
      variant: "cards",
      columns: 3,
      eyebrow: "The Shape of It",
      heading: "What a Sprint Is",
      body: "Three things, and they are the whole of the commitment.",
      cards: [
        {
          title: "One-Time",
          icon: "rocket",
          body: "A single engagement. No term, no renewal, and no ongoing invoice arriving next month.",
        },
        {
          title: "Thirty Days",
          icon: "calendar",
          body: "A defined window with a defined end. The work is completed inside it rather than running until somebody stops it.",
        },
        {
          title: "Fixed Scope",
          icon: "list-checks",
          body: "The deliverable list is the whole list, agreed before anything starts. What is on it gets done, and it is written down.",
        },
      ],
    },

    {
      id: "where-it-ends",
      type: "cardGrid",
      tone: "white",
      // Numbered rather than icon tiles, so the two three-card sections either
      // side of it do not read as the same grid twice.
      variant: "numbered",
      columns: 3,
      eyebrow: "The Boundary",
      heading: "Where a Sprint Ends",
      body: "Being precise about where a fixed-scope engagement stops is the same principle as reporting honestly. It just applies to scope instead.",
      cards: [
        {
          title: "The List Is the Scope",
          body: "Everything included is written down before the work begins. Anything outside it is quoted separately rather than absorbed quietly or dropped without mention.",
        },
        {
          title: "Thirty Days, Then Done",
          body: "The window closes. There is no rollover into an open-ended timeline and no month four that nobody agreed to.",
        },
        {
          title: "A Foundation, Not a Campaign",
          body: "A sprint builds the base and hands over a roadmap. Ongoing growth is a separate decision, made afterwards with the roadmap in hand.",
        },
      ],
    },

    {
      id: "sprints",
      type: "pricingCards",
      tone: "surface",
      eyebrow: "The Three Sprints",
      heading: "Three Sprints, Sized by Reach",
      body: "Neighborhood is local work. Regional and National are technical and on-page work across markets. That is a difference in kind rather than in size, so none of the three is a step up from another.",
      packageIds: ["sprint-neighborhood", "sprint-regional", "sprint-national"],
    },

    {
      id: "process",
      type: "processSteps",
      tone: "white",
      eyebrow: "Inside the Window",
      heading: "What Happens During the Sprint",
      // Three steps here against the homepage's four, deliberately. The two
      // describe different things and standardising them would blur both.
      steps: [
        {
          title: "Audit",
          body: "The current foundation is reviewed end to end, the priority issues are identified and ranked, and the first fixes are confirmed with you before any of them happen.",
        },
        {
          title: "Implementation",
          body: "The included setup and optimization work is completed inside the agreed scope. Anything found along the way that sits outside it is flagged and quoted rather than absorbed.",
        },
        {
          title: "Handoff",
          body: "A clear roadmap with next-step recommendations in priority order, and a clean path into monthly service if that is what you decide to do.",
        },
      ],
    },

    {
      id: "waiver",
      type: "waiverMatrix",
      tone: "surface",
      eyebrow: "Continuing On",
      heading: "Continuing Into Monthly Service",
      body: "The sprint deliverables and the onboarding work on a monthly package are close to the same job. That is why the waiver exists: a sprint is the onboarding done standalone, with a roadmap attached.",
      sprintHeading: "Sprint",
      // No price column on this page. The three prices are already on the
      // cards directly above, and repeating them turns a mapping table into a
      // second, quieter price list.
      waivesHeading: "Waives onboarding on",
      rows: [
        { sprint: "Neighborhood", waives: "Neighborhood, Citywide, or Metro" },
        { sprint: "Regional", waives: "Regional" },
        { sprint: "National", waives: "National or National+" },
      ],
      condition:
        "Monthly service must begin within 30 calendar days of sprint completion.",
      cta: {
        label: "View Monthly SEO Packages",
        href: "/monthly-seo-packages",
      },
    },

    {
      id: "roadmap",
      type: "cardGrid",
      tone: "white",
      variant: "cards",
      columns: 4,
      emphasis: true,
      eyebrow: "The Deliverable",
      heading: "What You Walk Away With",
      body: "The 30-Day Action Roadmap is the thing the sprint is actually for. Everything else is the work that makes it worth reading.",
      cards: [
        {
          title: "Priority Findings",
          icon: "search",
          body: "What is holding visibility back, ranked by impact rather than listed in the order it was found.",
        },
        {
          title: "Completed Work",
          icon: "clipboard-check",
          body: "Everything done during the sprint, itemised, so there is no gap between what was paid for and what is visible.",
        },
        {
          title: "Recommended Next Steps",
          icon: "compass",
          body: "What to do next, in order, with the reasoning behind the order rather than just the list.",
        },
        {
          title: "A Clear Path Forward",
          icon: "target",
          body: "Whether that means monthly service or handling the roadmap internally. Both are real answers, and the roadmap is written to work either way.",
        },
      ],
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
      heading: "Sprint Questions",
      items: [
        {
          question: "Is there any ongoing commitment?",
          answer:
            "None. A sprint is a one-time engagement with no term and no auto-renewal. When the 30 days are up, the work is delivered and the arrangement is over unless you decide otherwise.",
        },
        {
          question: "What happens after the 30 days?",
          answer:
            "The 30-Day Action Roadmap is handed over, along with everything completed during the sprint. Continuing into monthly service is optional and is a separate decision.",
        },
        {
          question: "How does the onboarding waiver work?",
          answer:
            "If monthly service starts within 30 calendar days of the sprint finishing, the onboarding fee on the matching package is waived. The Neighborhood sprint covers Neighborhood, Citywide or Metro; Regional covers Regional; National covers National or National+.",
        },
        {
          question: "Which sprint fits?",
          answer:
            "Neighborhood is local work, including the Google Business Profile, citations and a local grid baseline. Regional and National are technical and on-page work across multiple markets. The difference is what a business competes in, not how large it is.",
        },
        {
          question: "Can the roadmap be handled internally?",
          answer:
            "Yes. It is written to be actionable by whoever ends up doing it, and plenty of businesses take it and run it themselves. That is a legitimate outcome rather than a failed one.",
        },
        {
          question: "Is a sprint required before monthly service?",
          answer:
            "No. It is one route in, not a gate. Monthly packages can start directly, with the standard onboarding fee.",
        },
      ],
      cta: {
        label: "Request a Sprint Consultation",
        href: "/contact?type=sprint",
      },
    },

    {
      id: "final-cta",
      type: "finalCta",
      heading: "Start With a Sprint",
      body: "A fixed scope, thirty days, and a roadmap at the end of it that is yours whatever you decide to do next.",
      primaryCta: {
        label: "Request a Sprint Consultation",
        href: "/contact?type=sprint",
      },
      secondaryCta: {
        label: "View Monthly SEO Packages",
        href: "/monthly-seo-packages",
      },
    },
  ],
};
