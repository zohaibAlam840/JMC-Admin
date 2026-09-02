import type { PageContent } from "@/lib/types";

/**
 * Resources hub.
 *
 * The keyword map says this page should "launch simple and expand as content is
 * created". So it ships as an honest explainer hub rather than a fake blog with
 * placeholder posts — the Master Brief forbids placeholder content. Phase 3
 * turns these into real linked entries as articles are written.
 */
export const resourcesPage: PageContent = {
  slug: "/resources",
  label: "Resources",
  seoTitle: "SEO Resources for Houston-Area Businesses",
  metaDescription:
    "Plain-English SEO explainers covering local search, organic search, reporting, and how AI answer tools fit into modern SEO.",
  sections: [
    {
      id: "hero",
      type: "heroCentered",
      eyebrow: "Resources",
      heading: "SEO, Explained Without the Jargon",
      body: "Straight answers to the questions business owners actually ask about search visibility. We are building this out as we go. If something you need is missing, ask us directly.",
      primaryCta: { label: "Ask an SEO Question", href: "/contact" },
      secondaryCta: { label: "View SEO Packages", href: "/seo-packages" },
    },

    {
      id: "topics",
      type: "cardGrid",
      variant: "compact",
      tone: "white",
      eyebrow: "Topics",
      heading: "What We Write About",
      body: "The areas where clear information saves businesses the most money.",
      columns: 3,
      cards: [
        {
          title: "Local Search",
          icon: "map-pin",
          body: "How Google Business Profile, reviews, citations, and local content actually influence whether you show up nearby.",
        },
        {
          title: "Organic Search Strategy",
          icon: "trending-up",
          body: "How keyword strategy, content structure, and technical health work together across larger markets.",
        },
        {
          title: "SEO Reporting",
          icon: "bar-chart",
          body: "What to expect from an agency report, and the questions worth asking when something looks vague.",
        },
        {
          title: "Real Estate SEO",
          icon: "home",
          body: "How agents, teams, and brokerages build neighborhood visibility that compounds over time.",
        },
        {
          title: "Technical SEO",
          icon: "wrench",
          body: "The structural issues that quietly cap visibility, and how to tell whether yours are serious.",
        },
        {
          title: "AI and Answer Engines",
          icon: "search",
          body: "How search behavior is shifting, and which SEO fundamentals matter more because of it.",
        },
      ],
    },

    {
      id: "ai-search",
      type: "featureSplit",
      tone: "surface",
      eyebrow: "Search Is Changing",
      heading: "SEO Built for How People Search Now",
      body: "People search across Google, maps, organic results, and increasingly AI-powered answer tools. Nobody can guarantee placement inside an AI answer, and you should be skeptical of anyone who says otherwise. What does help is the same practical work that has always helped: clear service pages, strong site structure, sound internal linking, accurate schema, and content that establishes what you do and where you do it.",
      cta: { label: "Talk Through Your SEO Strategy", href: "/contact" },
      groups: [
        {
          title: "Clear Service Pages",
          icon: "file-text",
          body: "Unambiguous answers about what you offer and to whom.",
        },
        {
          title: "Site Structure",
          icon: "network",
          body: "Organization that makes relationships between services obvious.",
        },
        {
          title: "Schema and Entities",
          icon: "layers",
          body: "Structured data that states who you are and where you work.",
        },
        {
          title: "Topical Authority",
          icon: "shield-check",
          body: "Depth in your actual subject area rather than thin coverage everywhere.",
        },
      ],
    },

    {
      id: "articles",
      type: "postList",
      tone: "surface",
      eyebrow: "Articles",
      heading: "Latest From the Resources Hub",
      body: "Plain-English explainers, written as the questions come up.",
      limit: 6,
      // The Master Brief forbids placeholder content, so before the first
      // article is published this says so honestly rather than showing an
      // empty grid or invented posts.
      emptyMessage:
        "The first articles are being written now. In the meantime, ask us the question directly. We answer it either way.",
      cta: { label: "Ask an SEO Question", href: "/contact" },
    },

    {
      id: "final-cta",
      type: "finalCta",
      heading: "Have a Question We Haven't Written About Yet?",
      body: "Ask it directly. If it is useful to you, it is probably useful to other businesses in the same position, and it may well become the next resource here.",
      primaryCta: { label: "Request a Visibility Review", href: "/contact" },
      secondaryCta: { label: "View SEO Packages", href: "/seo-packages" },
    },
  ],
};
