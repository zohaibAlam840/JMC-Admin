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
 * THREE DIFFERENT "30 DAYS" LIVE ON THIS PAGE. They are not the same number
 * and must not be reconciled with each other:
 *
 *  1. Sprint duration. 30 days on Neighborhood, 45 on Regional and National,
 *     confirmed by the client in review. It is never stated as a single
 *     figure in page copy — it comes off each package's own `timeline` field,
 *     which is why the hero headline no longer carries a number.
 *  2. The 30-Day Action Roadmap. The deliverable's name: a plan for the 30
 *     days after handover. It does not change when the sprint runs 45.
 *  3. The onboarding waiver window. Monthly service must begin within 30
 *     calendar days of the sprint finishing. Nothing to do with either of the
 *     above.
 *
 * Copy is DRAFT. The Step 4 copy deck replaces it.
 */
export const launchSprintsPage: PageContent = {
  slug: "/launch-sprints",
  label: "Launch Sprints",
  seoTitle: "SEO Launch Sprints | One-Time, Fixed Scope",
  metaDescription:
    "One-time SEO Launch Sprints from $799, with a fixed scope and a fixed end date. A full audit, foundational optimization, and a 30-day action roadmap at the end.",
  sections: [
    {
      id: "hero",
      type: "heroSplit",
      eyebrow: "Launch Sprints",
      /*
       * The headline no longer carries a number.
       *
       * It used to read "Finished in Thirty Days", which stopped being true
       * when the client confirmed Regional and National run 45. A headline is
       * the worst place on a page to put a figure that varies by tier: it is
       * the one line every visitor reads and the one nobody re-reads after
       * seeing the cards. The duration now lives only where it is accurate —
       * on each pricing card, from that package's own timeline field.
       */
      heading: "A Fixed Scope, With a Finish Date",
      body: "A Launch Sprint is a single engagement with a defined start, a defined end, and a written list of everything included. There is no term, no renewal, and no obligation to continue afterwards.",
      /*
       * One button, by instruction: "We got to get rid of the monthly SEO
       * package CTA here... if we are going to mention the monthly SEO
       * package, we need to do it later on."
       *
       * It still is mentioned later on, twice — the waiver section links to
       * the packages, and so does the closing CTA — so nothing is lost except
       * the invitation to leave this page before reading it.
       */
      primaryCta: {
        label: "Request a Sprint Consultation",
        href: "/contact?type=sprint",
      },
      /*
       * A sparkline rather than the route motif, which the client could not
       * read: it is the same card, drawn as a rising line instead of four
       * dots on a track. Abstract either way — no axis, no scale, no numbers,
       * because Page Spec 01 §1 forbids anything that could be read as a
       * result. A direction is the most it says.
       *
       * One card, not two. The second card ("Three Sprints / Sized by Reach")
       * is gone for a plain layout reason: it overlaps the bottom-left of the
       * panel and covered the first 45% of the line, so the growth read — the
       * entire point of the change — started halfway up. Nothing is lost by
       * dropping it. The three sprints get a full pricing section of their own
       * below, where they are names, prices and scopes rather than three
       * unexplained chips.
       */
      showcase: [
        {
          kind: "growth",
          label: "Fixed window",
          title: "The Sprint",
          items: [
            "Audit",
            "Implementation",
            "Handoff",
            "30-Day Action Roadmap",
          ],
        },
      ],
    },

    /*
     * Restructured from a three-card grid, by instruction: "we don't have
     * enough information on this page... we're probably going to have to
     * restructure this section to be able to articulate it in more than five
     * sentences, six sentences."
     *
     * A card grid cannot hold that. Three cards of two sentences each is six
     * sentences of captions, and the thing a reader actually wants answered —
     * what IS this, and why would I buy it instead of a retainer — has
     * nowhere to go. A split puts real prose on the left and keeps the three
     * points beside it as the summary they always were.
     *
     * The middle point is "A Defined Window" rather than "Thirty Days"
     * because the number is in dispute: the client says Neighborhood runs 30
     * days and Regional and National run 45, then said his own document does
     * not support that. The phrasing here is true under either answer, so it
     * does not have to be rewritten once he confirms. The hero headline and
     * the package timelines still assert thirty and are flagged, not guessed.
     *
     * Copy is DRAFT pending the Step 4 deck, as everywhere else.
     */
    {
      id: "what-a-sprint-is",
      type: "featureSplit",
      tone: "surface",
      eyebrow: "The Shape of It",
      heading: "What a Sprint Is",
      body: "A Launch Sprint is a single piece of SEO work with a start date, an end date, and a list agreed before anything begins. It is not a trial of monthly service, and it is not a discounted version of it.\n\nIt brings the foundational work into one defined engagement: the audit, technical and on-page fixes, and the setup that should be in place before ongoing work begins.\n\nThe scope and finish date are agreed at the start, so a business can establish the foundation without committing to a year of service.\n\nAt the end, the completed work and a written roadmap show what to do next. The roadmap remains useful whether the next step is monthly service, an internal team, or a pause.",
      groups: [
        {
          title: "One-Time",
          icon: "rocket",
          body: "A single engagement. No term, no renewal, and no ongoing invoice arriving next month.",
        },
        {
          title: "A Defined Window",
          icon: "calendar",
          body: "A fixed start and a fixed end. The work is completed inside the window rather than running until somebody stops it.",
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
          title: "The Window Closes",
          body: "30 days on a Neighborhood sprint, 45 on Regional and National. When it is up the work is delivered. There is no rollover into an open-ended timeline and no month four that nobody agreed to.",
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
      /*
       * Moved above the monthly-service section, by instruction: "it needs to
       * be the deliverables first, deliverables first, and then... the
       * deliverables needs to go ahead."
       *
       * It reads better that way too. What you walk away with is the answer to
       * "what am I buying"; the onboarding waiver is the answer to "what if I
       * continue", which is a question nobody asks before the first one.
       *
       * Tones swapped with the waiver section in the same move, so the bands
       * still alternate rather than running white into white.
       */
      id: "roadmap",
      type: "cardGrid",
      tone: "surface",
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
          body: "Everything done during the sprint, itemized, so there is no gap between what was paid for and what is visible.",
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
      /*
       * No CTA. This section used to link to /seo-reporting, and the client
       * cut it in review: "not how JMC reports SEO progress, because the
       * deliverable here is different, so this would take them to the wrong
       * place."
       *
       * He is right. /seo-reporting describes the monthly recap, and a sprint
       * does not produce one — it produces the 30-Day Action Roadmap these
       * cards describe. Nothing replaces it: the waiver section directly
       * below carries the real next step, and two CTAs one band apart would
       * compete anyway.
       */
    },

    {
      id: "waiver",
      type: "waiverMatrix",
      tone: "white",
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
      id: "faq",
      type: "faq",
      tone: "surface",
      eyebrow: "Questions",
      heading: "Sprint Questions",
      items: [
        {
          question: "Is there any ongoing commitment?",
          answer:
            "None. A sprint is a one-time engagement with no term and no auto-renewal. When the window is up, the work is delivered and the arrangement is over unless you decide otherwise.",
        },
        {
          question: "How long does a sprint take?",
          answer:
            "A Neighborhood sprint runs 30 days. Regional and National run 45, because the audit and the on-page work cover more ground. At the end the 30-Day Action Roadmap is handed over along with everything completed during the sprint, and continuing into monthly service is optional.",
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
      body: "A fixed scope, a fixed end date, and a roadmap at the end of it that is yours whatever you decide to do next.",
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
