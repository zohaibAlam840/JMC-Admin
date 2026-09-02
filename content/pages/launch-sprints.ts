import type { PageContent } from "@/lib/types";

/**
 * Launch Sprints.
 *
 * Structure approved (Launch Sprints Wireframe v1). Copy is DRAFT.
 * Guardrail: a sprint is a foundation offer, never positioned as a replacement
 * for ongoing SEO and never with a ranking promise attached. The
 * "What a Sprint Is Not" section is deliberate expectation-setting — keep it
 * direct without making it sound negative.
 */
export const launchSprintsPage: PageContent = {
  slug: "/launch-sprints",
  label: "Launch Sprints",
  seoTitle: "SEO Launch Sprints | Fixed-Scope 30-Day SEO Setup",
  metaDescription:
    "One-time, fixed-scope SEO Launch Sprints. A 30-day audit, setup, and optimization engagement that ends with a clear roadmap and a path into monthly SEO.",
  sections: [
    {
      id: "hero",
      type: "heroSplit",
      eyebrow: "Launch Sprints",
      heading: "A Fixed-Scope SEO Foundation in 30 Days",
      body: "A Launch Sprint is a one-time engagement that audits your current SEO, completes the core setup and optimization work, and hands you a prioritized 30-day roadmap. Fixed price, fixed scope, clear ending.",
      primaryCta: { label: "Request a Sprint Consultation", href: "/contact" },
      secondaryCta: { label: "Compare Launch Sprints", href: "#options" },
      // Roadmap + stat + report. Timeline first, because a fixed window is the
      // whole proposition of a sprint.
      showcase: [
        {
          kind: "roadmap",
          label: "30 days",
          title: "Sprint Timeline",
          items: ["Audit", "Implementation", "Handoff"],
          footnote: "One fixed window, then it ends",
        },
        {
          kind: "stat",
          label: "Fixed scope",
          title: "By the Numbers",
          stats: [
            { value: "30", label: "Day sprint window" },
            { value: "3", label: "Phases, start to handoff" },
            { value: "5–15", label: "Priority pages optimized" },
          ],
          footnote: "Page count depends on the sprint tier",
        },
        {
          kind: "report",
          label: "What you receive",
          title: "Sprint Handoff",
          items: [
            "Priority findings",
            "Completed sprint work",
            "30-day action roadmap",
            "Next-step direction",
          ],
        },
      ],
    },

    {
      id: "what-is-it",
      type: "cardGrid",
      tone: "white",
      eyebrow: "The Model",
      heading: "What a Launch Sprint Actually Is",
      body: "A sprint gets the foundation right before anyone commits to a monthly campaign. It is a good starting point when the groundwork has never been done properly.",
      columns: 3,
      cards: [
        {
          title: "Fixed Scope",
          icon: "list-checks",
          body: "You know exactly what is included before it starts. The deliverables are listed on the card, not discovered along the way.",
        },
        {
          title: "One-Time Investment",
          icon: "target",
          body: "A single price with no recurring commitment. If monthly SEO is not the right next step, the sprint still stands on its own.",
        },
        {
          title: "Clear Handoff",
          icon: "compass",
          body: "You finish with the completed work and a prioritized roadmap you can act on yourself or hand to someone else.",
        },
      ],
      cta: { label: "Compare Launch Sprints", href: "#options" },
    },

    {
      id: "options",
      type: "pricingCards",
      tone: "surface",
      eyebrow: "Sprint Options",
      heading: "Three Sprints, Sized to Your Search Footprint",
      body: "Each sprint runs 30 days. The difference is how much ground the audit and optimization work has to cover.",
      packageIds: ["sprint-neighborhood", "sprint-regional", "sprint-national"],
      cta: { label: "Talk Through the Right Sprint", href: "/contact" },
    },

    {
      id: "process",
      type: "processSteps",
      tone: "white",
      eyebrow: "How It Runs",
      heading: "What Happens During the Sprint",
      body: "Three phases across 30 days, with a defined ending rather than an open-ended engagement.",
      steps: [
        {
          title: "Audit",
          body: "We review the current foundation, identify priority issues, and confirm what needs to be fixed first.",
        },
        {
          title: "Implementation",
          body: "We complete the included setup and optimization work inside the sprint scope.",
        },
        {
          title: "Handoff",
          body: "You receive a clear roadmap with next-step recommendations and a clean path into monthly service if you want one.",
        },
      ],
      cta: { label: "Request a Sprint Consultation", href: "/contact" },
    },

    {
      id: "not",
      type: "cardGrid",
      variant: "compact",
      tone: "surface",
      eyebrow: "Setting Expectations",
      heading: "What a Sprint Is Not",
      body: "Worth being direct about this upfront, so a sprint is chosen for the right reasons.",
      columns: 4,
      cards: [
        {
          title: "Not a Full Monthly Campaign",
          body: "A sprint builds the foundation. Compounding visibility comes from sustained work after it.",
        },
        {
          title: "Not a Ranking Guarantee",
          body: "No one can promise positions. A sprint removes obstacles and sets direction.",
        },
        {
          title: "Not a Replacement for Content",
          body: "Long-term visibility needs ongoing content. A sprint optimizes what already exists.",
        },
        {
          title: "Not Ongoing Tracking",
          body: "You get a baseline snapshot. Continuous tracking and reporting come with monthly service.",
        },
      ],
      cta: { label: "See Monthly SEO Packages", href: "/seo-packages" },
    },

    {
      id: "transition",
      type: "calloutBanner",
      tone: "white",
      heading: "Sprint First, Then Monthly, With the Onboarding Fee Waived",
      body: "If you begin monthly service within 30 calendar days of completing your sprint, the one-time onboarding fee for the matching monthly package is waived. The sprint work carries directly into the monthly roadmap rather than being repeated.",
      primaryCta: { label: "View Monthly SEO Packages", href: "/seo-packages" },
      secondaryCta: { label: "Request a Visibility Review", href: "/contact" },
    },

    {
      id: "handoff",
      type: "cardGrid",
      tone: "surface",
      emphasis: true,
      eyebrow: "The Handoff",
      heading: "What You Walk Away With",
      body: "The handoff is the point of the sprint. It should feel organized, not like a loose audit document dropped in your inbox.",
      columns: 4,
      cards: [
        {
          title: "Priority Findings",
          body: "The issues holding visibility back, ranked by impact rather than listed alphabetically.",
        },
        {
          title: "Completed Sprint Work",
          body: "A clear record of everything delivered inside the sprint scope.",
        },
        {
          title: "Roadmap Recommendations",
          body: "A prioritized 30-day action roadmap covering what should happen next.",
        },
        {
          title: "Next-Step Direction",
          body: "An honest read on whether monthly SEO makes sense for you, and at what level.",
        },
      ],
      cta: { label: "Talk Through Your SEO Starting Point", href: "/contact" },
    },

    {
      id: "faq",
      type: "faq",
      tone: "white",
      eyebrow: "Questions",
      heading: "Launch Sprint Questions We Hear Often",
      items: [
        {
          question: "Who is a Launch Sprint best for?",
          answer:
            "Businesses whose SEO foundation has never been properly set up, or who want to see how JMC works before committing to a monthly engagement. If you already have solid technical footing and consistent content, monthly service is usually the better starting point.",
        },
        {
          question: "How long does a sprint take?",
          answer:
            "Thirty days from kickoff. That window is fixed, which is what keeps the scope honest on both sides.",
        },
        {
          question: "What happens after the sprint?",
          answer:
            "You receive the completed work and a prioritized 30-day roadmap. From there you can move into monthly SEO with us, hand the roadmap to another team, or execute it yourself. All three are legitimate outcomes.",
        },
        {
          question: "Do I have to move into monthly SEO afterward?",
          answer:
            "No. There is no obligation and no automatic rollover. The waived onboarding fee is an incentive if you do continue, not a commitment you make upfront.",
        },
        {
          question: "Is a sprint enough to rank?",
          answer:
            "Usually not on its own. A sprint clears obstacles, fixes the foundation, and sets direction. Rankings in competitive markets come from sustained content and optimization over months. Anyone telling you a one-time engagement will get you ranking is overselling it.",
        },
        {
          question: "Which sprint should I choose?",
          answer:
            "It depends on your search footprint. Neighborhood suits a single local market and includes Google Business Profile and citation work. Regional suits multiple markets. National suits broad competitive visibility. We will confirm the fit on a consultation before you commit.",
        },
        {
          question: "What is included in the handoff?",
          answer:
            "Priority findings, documentation of the completed sprint work, a 30-day action roadmap, and a direct recommendation on next steps.",
        },
        {
          question: "Can the sprint cost be applied toward monthly service?",
          answer:
            "The sprint fee itself is separate, but starting monthly service within 30 days of completing it waives the onboarding fee for the matching package, between $349 and $1,295 depending on the tier.",
        },
      ],
      cta: { label: "Request a Sprint Consultation", href: "/contact" },
    },

    {
      id: "final-cta",
      type: "finalCta",
      heading: "Start With a Solid Foundation Instead of Guessing",
      body: "A sprint consultation confirms which sprint fits your market, what the audit is likely to surface, and whether a sprint is the right starting point at all.",
      primaryCta: { label: "Request a Sprint Consultation", href: "/contact" },
      secondaryCta: { label: "View Monthly SEO Packages", href: "/seo-packages" },
    },
  ],
};
