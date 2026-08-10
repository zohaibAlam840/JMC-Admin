import type { PageContent } from "@/lib/types";

/**
 * Monthly SEO Packages.
 *
 * Structure approved (Monthly SEO Packages Wireframe v1). Copy is DRAFT.
 * Prices come from content/packages.ts — never duplicate them here.
 * Guardrail: this is a guided package selection page, not a comparison table
 * and not an SOW.
 */
export const seoPackagesPage: PageContent = {
  slug: "/seo-packages",
  label: "Monthly SEO Packages",
  seoTitle: "Monthly SEO Packages and Pricing",
  metaDescription:
    "Monthly SEO packages from Jordan Marketing Consultants. Local SEO, traditional SEO, and real estate SEO options with clear pricing, deliverables, and monthly reporting.",
  sections: [
    {
      id: "hero",
      type: "heroCentered",
      eyebrow: "SEO Packages",
      heading: "Clear SEO Packages With Clear Scope",
      body: "Every package includes strategy, execution, tracking, and a Monthly Recap that explains the work. Pick the lane that matches your market, and we will confirm the fit on a Visibility Review before anything starts.",
      primaryCta: { label: "Request a Visibility Review", href: "/contact" },
      secondaryCta: { label: "Compare Packages", href: "#local" },
    },

    {
      id: "path-selector",
      type: "cardGrid",
      tone: "white",
      eyebrow: "Start Here",
      heading: "Three Lanes. Pick the One That Matches Your Market.",
      body: "The right package depends less on budget than on where your buyers are searching.",
      columns: 3,
      cards: [
        {
          title: "Local SEO Packages",
          icon: "map-pin",
          body: "For businesses that need visibility in a defined city or service area, across search, maps, reviews, and local content.",
          cta: { label: "View Local SEO Packages", href: "#local" },
        },
        {
          title: "Traditional SEO Packages",
          icon: "trending-up",
          body: "For businesses competing across regions, national markets, or specialized industries with larger keyword sets.",
          cta: { label: "View Traditional SEO Packages", href: "#traditional" },
        },
        {
          title: "Real Estate SEO Options",
          icon: "home",
          body: "For agents, teams, and brokerages that need neighborhood visibility and content built for buyers and sellers.",
          cta: { label: "View Real Estate SEO Options", href: "#real-estate" },
        },
      ],
    },

    {
      id: "local",
      type: "pricingCards",
      tone: "surface",
      eyebrow: "Local SEO",
      heading: "Monthly Local SEO Packages",
      body: "Built for businesses that want to be found in their service area and turn local searches into consistent leads. Every tier includes SEO strategy and roadmap, content and on-page optimization, technical monitoring, review management, detailed reporting, and a Monthly Project Recap.",
      packageIds: ["local-neighborhood", "local-citywide", "local-metro"],
    },

    {
      id: "traditional",
      type: "pricingCards",
      tone: "white",
      eyebrow: "Traditional SEO",
      heading: "Monthly Traditional SEO Packages",
      body: "Designed for businesses targeting multiple markets, service lines, or competitive search landscapes. Every tier includes SEO strategy and roadmap, Strategic SEO Pages, technical monitoring, authority-building recommendations, and reporting with a Monthly Recap.",
      packageIds: [
        "traditional-regional",
        "traditional-national",
        "traditional-national-plus",
      ],
    },

    {
      id: "real-estate",
      type: "pricingCards",
      tone: "surface",
      eyebrow: "Real Estate SEO",
      heading: "Real Estate SEO Options",
      body: "Real estate SEO is scoped around your markets and business model rather than a fixed tier. Reach out and we will size it on a Real Estate Visibility Review.",
      packageIds: ["real-estate-agent", "real-estate-team"],
      cta: { label: "Explore Real Estate SEO", href: "/real-estate-seo" },
    },

    {
      id: "onboarding",
      type: "cardGrid",
      variant: "numbered",
      tone: "white",
      eyebrow: "Onboarding",
      heading: "What the One-Time Onboarding Fee Covers",
      body: "Onboarding is the setup work that makes month one productive instead of exploratory. It happens once, at the start.",
      columns: 3,
      cards: [
        {
          title: "Access and Setup",
          icon: "shield-check",
          body: "Getting the right access in place across your site, analytics, and profiles so nothing stalls later.",
        },
        {
          title: "SEO Audit",
          icon: "search",
          body: "A review of your current visibility, technical health, and the issues worth fixing first.",
        },
        {
          title: "Keyword and Competitor Research",
          icon: "target",
          body: "Identifying what your market actually searches for and who is currently winning those searches.",
        },
        {
          title: "Tracking Setup",
          icon: "gauge",
          body: "Rank tracking, local grid tracking where applicable, and the reporting connections behind them.",
        },
        {
          title: "Roadmap Planning",
          icon: "compass",
          body: "Turning the audit and research into a sequenced plan tied to your business goals.",
        },
        {
          title: "Baseline Reporting",
          icon: "bar-chart",
          body: "A starting-point snapshot, so every month afterward has something honest to measure against.",
        },
      ],
      cta: { label: "Start with a Visibility Review", href: "/contact" },
    },

    {
      id: "monthly-service",
      type: "cardGrid",
      variant: "compact",
      tone: "surface",
      eyebrow: "Monthly Service",
      heading: "What Happens Every Month After That",
      body: "Monthly SEO is recurring execution against the roadmap, not a repeating checklist.",
      columns: 3,
      cards: [
        {
          title: "Roadmap Execution",
          icon: "list-checks",
          body: "Working through the prioritized plan rather than reacting to whatever surfaced that week.",
        },
        {
          title: "Content and Page Improvements",
          icon: "file-text",
          body: "Strategic SEO pages and improvements to existing pages, scoped to your tier.",
        },
        {
          title: "Local or Traditional Visibility Work",
          icon: "map-pin",
          body: "Profile, citation, and review work for local campaigns; content and authority work for traditional.",
        },
        {
          title: "Technical Monitoring",
          icon: "wrench",
          body: "Ongoing checks for the technical issues that quietly limit visibility.",
        },
        {
          title: "Tracking and Movement Review",
          icon: "gauge",
          body: "Watching what moved, what did not, and adjusting priorities accordingly.",
        },
        {
          title: "Monthly Recaps",
          icon: "clipboard-check",
          body: "The summary that keeps all of it visible and accountable to you.",
        },
      ],
      cta: { label: "Talk Through the Right Package", href: "/contact" },
    },

    {
      id: "reporting",
      type: "cardGrid",
      tone: "white",
      emphasis: true,
      eyebrow: "Clear Reporting",
      heading: "Reporting Is Part of the Package, Not an Upsell",
      body: "Every package at every tier includes the same reporting commitment. This is the part most agencies treat as optional.",
      columns: 4,
      cards: [
        {
          title: "What Was Completed",
          body: "The specific work delivered, in language you do not need a background in SEO to follow.",
        },
        {
          title: "Why It Matters",
          body: "How each piece supports visibility, relevance, or trust.",
        },
        {
          title: "What Changed",
          body: "Movement across tracked keywords, local grid coverage, and competitor positions.",
        },
        {
          title: "What Comes Next",
          body: "The priorities queued next and the reasoning behind them.",
        },
      ],
    },

    {
      id: "sprint-crosslink",
      type: "calloutBanner",
      tone: "surface",
      heading: "Not Ready for Monthly SEO Yet?",
      body: "A Launch Sprint is a fixed-scope, one-time engagement that puts the SEO foundation in place over 30 days and hands you a roadmap. If you start monthly service within 30 days of finishing a sprint, the onboarding fee for the matching package is waived.",
      primaryCta: { label: "View Launch Sprints", href: "/launch-sprints" },
      secondaryCta: { label: "Request a Visibility Review", href: "/contact" },
    },

    {
      id: "faq",
      type: "faq",
      tone: "white",
      eyebrow: "Questions",
      heading: "Package Questions We Hear Often",
      items: [
        {
          question: "Which SEO package is right for me?",
          answer:
            "It comes down to where your buyers search. If they are nearby and proximity matters, start with Local SEO. If they are spread across regions or industries, Traditional SEO fits better. If you are in real estate, that has its own lane. We confirm the fit on a Visibility Review before anything starts.",
        },
        {
          question: "What is included in the onboarding fee?",
          answer:
            "Access and setup, an SEO audit, keyword and competitor research, tracking setup, roadmap planning, and baseline reporting. It is one-time, and it is what makes the first month productive rather than exploratory.",
        },
        {
          question: "Do I need a 12-month term?",
          answer:
            "No. SEO does compound over time and short engagements rarely show what the work is capable of, but we do not lock clients into a year to prove that.",
        },
        {
          question: "Can I start with a Launch Sprint instead?",
          answer:
            "Yes, and it is often the better move if your foundation needs work. If you move into monthly service within 30 days of completing a sprint, the onboarding fee for the matching package is waived.",
        },
        {
          question: "Can I change packages later?",
          answer:
            "Yes. Businesses commonly start at one tier and move up as their market or service area expands. We will flag it when your current tier is limiting the plan.",
        },
        {
          question: "What is included in the Monthly Recap?",
          answer:
            "A plain-English summary of what was completed, why it mattered, what changed, and what comes next — delivered by Loom or video call so you can ask questions rather than interpreting a PDF.",
        },
        {
          question: "Do all packages include reporting?",
          answer:
            "Yes. Every tier includes detailed monthly reporting and a Monthly Recap. Core packages also include a Quarterly Project Update that steps back to review direction.",
        },
        {
          question: "How do I know if I need Local, Traditional, or Real Estate SEO?",
          answer:
            "The short version: Local if customers come to you or you go to them within a service area. Traditional if location is not the deciding factor. Real Estate if you are an agent, team, or brokerage. If you are between two of these, that is exactly what the Visibility Review sorts out.",
        },
      ],
      cta: { label: "Request a Visibility Review", href: "/contact" },
    },

    {
      id: "final-cta",
      type: "finalCta",
      heading: "Not Sure Which Package Fits? Start With a Visibility Review.",
      body: "We will look at your market, your current visibility, and your goals, then recommend the package that actually fits — including telling you if the answer is a sprint instead.",
      primaryCta: { label: "Request a Visibility Review", href: "/contact" },
      secondaryCta: { label: "View Launch Sprints", href: "/launch-sprints" },
    },
  ],
};
