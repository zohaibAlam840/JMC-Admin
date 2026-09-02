/**
 * The section library.
 *
 * A page is an ordered list of typed sections — never HTML. Phase 3 moves these
 * objects into Postgres as `sections.data` jsonb rows with `sections.type` as an
 * enum matching the `type` field below, so the admin page builder and these
 * renderers stay in sync. Nothing here should reference a database.
 */

export type CTA = {
  label: string;
  href: string;
};

/** Named Lucide icon. Resolved in components/blocks/icon.tsx. */
export type IconName =
  | "target"
  | "map-pin"
  | "file-text"
  | "wrench"
  | "bar-chart"
  | "building"
  | "home"
  | "heart-pulse"
  | "briefcase"
  | "utensils"
  | "hard-hat"
  | "factory"
  | "network"
  | "search"
  | "trending-up"
  | "clipboard-check"
  | "message-square"
  | "star"
  | "link"
  | "gauge"
  | "users"
  | "layers"
  | "calendar"
  | "shield-check"
  | "compass"
  | "list-checks";

export type Card = {
  title: string;
  body?: string;
  icon?: IconName;
  /**
   * A short line above the body, set apart from it. Used for the entry price
   * on the homepage packages preview, which Page Spec 01 §6 calls for as a
   * distinct price line rather than a sentence.
   */
  meta?: string;
  /** Card-level link. Path sections use these instead of buttons. */
  cta?: CTA;
};

export type Step = {
  title: string;
  body: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

/**
 * Hero showcase cards. Three sit in a grid below the hero copy, standing in for
 * the screenshots a product company would use.
 *
 * Five treatments so pages don't all open the same way — each page picks a
 * different mix. Values describe scope (what is tracked, what is covered) and
 * never claim a result, which the language guardrails require.
 */
type ShowcaseBase = { label: string; title: string; footnote?: string };

export type HeroShowcaseCard =
  | (ShowcaseBase & { kind: "report"; items: string[] })
  | (ShowcaseBase & { kind: "coverage"; items: string[] })
  | (ShowcaseBase & { kind: "roadmap"; items: string[] })
  | (ShowcaseBase & { kind: "channels"; items: string[] })
  | (ShowcaseBase & {
      kind: "stat";
      stats: { value: string; label: string }[];
    });

type Base = {
  /** Stable key. Becomes the section row id in phase 3. */
  id: string;
  /** Tinted band vs white. Sections alternate to give the page rhythm. */
  tone?: "white" | "surface";
};

/** Centered hero with a three-card showcase row beneath it. */
export type HeroSplitSection = Base & {
  type: "heroSplit";
  eyebrow: string;
  heading: string;
  body: string;
  primaryCta: CTA;
  secondaryCta?: CTA;
  showcase: HeroShowcaseCard[];
};

export type HeroCenteredSection = Base & {
  type: "heroCentered";
  eyebrow: string;
  heading: string;
  body: string;
  primaryCta: CTA;
  secondaryCta?: CTA;
};

export type CardGridSection = Base & {
  type: "cardGrid";
  eyebrow?: string;
  heading: string;
  body?: string;
  cards: Card[];
  /** Desktop column count. Cards always stack on mobile. */
  columns: 2 | 3 | 4;
  cta?: CTA;
  /** Reporting sections get the accent treatment — the site's differentiator. */
  emphasis?: boolean;
  /**
   * Layout treatment. Pages vary this so a run of card sections doesn't read as
   * the same grid five times.
   *  - cards    full card with icon tile (default)
   *  - numbered index badge instead of an icon, for "what's included" lists
   *  - compact  dense tiles, icon inline with the title
   *  - split    borderless rows with rules, no card chrome
   */
  variant?: "cards" | "numbered" | "compact" | "split";
};

export type ProcessStepsSection = Base & {
  type: "processSteps";
  eyebrow?: string;
  heading: string;
  body?: string;
  steps: Step[];
  cta?: CTA;
};

export type FullWidthTextSection = Base & {
  type: "fullWidthText";
  eyebrow?: string;
  heading: string;
  body: string;
  cta?: CTA;
  /**
   * "statement" is the solid-ink band from Page Spec 01 §3 — no cards, no
   * icons, large type, high contrast. Deliberately a treatment rather than a
   * tone: `tone` is constrained to white/surface by a check constraint in the
   * database, and the whole point of this band is that it is neither.
   */
  treatment?: "default" | "statement";
};

/**
 * The industry grid — Page Spec 01 §5, reused verbatim on Traditional SEO.
 *
 * Bucketed rather than flat on purpose. A flat grid of eight reads as "we do
 * everything"; two labelled groups of four reinforce the routing from the
 * growth-paths section and support the claim that one method is pointed at two
 * different engines.
 *
 * Group labels must be visitor-facing. Nobody self-identifies as a "B2B and
 * Industrial Engine" — that is internal vocabulary and must not reach the page.
 */
export type IndustryGridSection = Base & {
  type: "industryGrid";
  eyebrow?: string;
  heading: string;
  body?: string;
  groups: {
    /** Visitor-facing, e.g. "Businesses that serve a defined area". */
    label: string;
    /** The service line this bucket feeds, shown at the far right of the rule. */
    serviceLine: string;
    serviceHref: string;
    cards: {
      title: string;
      /** One line naming the kind of business, never a claim of expertise. */
      body: string;
      icon?: IconName;
      href?: string;
    }[];
  }[];
  /**
   * The line under the grid that turns "your industry is not listed" from a
   * hole into a statement of the method. A line and a link, never a ninth card
   * — a ninth card would break the 4/4 symmetry the buckets depend on.
   */
  escapeHatch?: string;
  cta?: CTA;
};

export type FeatureSplitSection = Base & {
  type: "featureSplit";
  eyebrow?: string;
  heading: string;
  body: string;
  cta?: CTA;
  groups: { title: string; body: string; icon?: IconName }[];
  /** Which side the copy sits on. */
  align?: "left" | "right";
};

export type PricingCardsSection = Base & {
  type: "pricingCards";
  eyebrow?: string;
  heading: string;
  body?: string;
  /** Keys into content/packages.ts rather than duplicating price data. */
  packageIds: string[];
  cta?: CTA;
};

export type CalloutBannerSection = Base & {
  type: "calloutBanner";
  heading: string;
  body: string;
  primaryCta: CTA;
  secondaryCta?: CTA;
};

export type FaqSection = Base & {
  type: "faq";
  eyebrow?: string;
  heading: string;
  items: FaqItem[];
  cta?: CTA;
};

export type FinalCtaSection = Base & {
  type: "finalCta";
  heading: string;
  body: string;
  primaryCta: CTA;
  secondaryCta?: CTA;
};

/**
 * Latest articles. The only section whose content is not authored inside it —
 * it queries `posts`, so a page carrying one stays current on its own.
 */
export type PostListSection = Base & {
  type: "postList";
  eyebrow?: string;
  heading: string;
  body?: string;
  /** How many to show. */
  limit: number;
  /** Blank shows every category. */
  category?: string;
  cta?: CTA;
  /** Copy shown when no article matches yet. */
  emptyMessage?: string;
};


/**
 * The Monthly Recap block — Build Spec §12.
 *
 * The four card titles are locked and identical on every page that carries
 * this. They are therefore NOT part of the data: they live in the renderer, and
 * only the supporting sentence under each one is editable, which is exactly
 * what §12 allows. Modelling it this way means the client cannot reword them
 * from the admin, which is the point — the spec says this block replaces five
 * conflicting versions found across the old wireframes.
 */
export type ReportingBlockSection = Base & {
  type: "reportingBlock";
  eyebrow?: string;
  heading: string;
  body?: string;
  /** One supporting sentence per locked card, in the locked order. */
  did?: string;
  why?: string;
  changed?: string;
  next?: string;
  cta?: CTA;
};

/** Platforms the link hub can show as an icon-only row. */
export type SocialPlatform =
  | "instagram"
  | "facebook"
  | "linkedin"
  | "x"
  | "youtube"
  | "tiktok"
  | "email"
  | "phone"
  | "website";

/**
 * Link hub — the "link in bio" page.
 *
 * A stack of large tappable buttons under a mark and one line of positioning.
 * Exists so social profiles can point at our own domain instead of a link
 * aggregator: the referral traffic, the analytics, and any link value from
 * someone sharing the URL all stay with the site.
 */
export type LinkStackSection = Base & {
  type: "linkStack";
  /** Small line above the name. */
  eyebrow?: string;
  heading: string;
  body?: string;
  /** Optional round avatar above the heading. */
  avatarUrl?: string;
  avatarAlt?: string;
  /**
   * Page treatment. "dark" is the brand gradient with white type, which is
   * what a link-in-bio page usually wants — it has to look like a profile,
   * not like another page of the marketing site.
   */
  theme?: "light" | "dark";
  /** Icon-only row under the name. Separate from the buttons below it. */
  socials?: { platform: SocialPlatform; href: string }[];
  links: {
    label: string;
    href: string;
    /** Second line inside the button. */
    description?: string;
    icon?: IconName;
    /** Filled treatment rather than outlined. Use for the one that matters. */
    featured?: boolean;
  }[];
  /** Small print under the stack. */
  footnote?: string;
};

export type Section =
  | HeroSplitSection
  | HeroCenteredSection
  | CardGridSection
  | ProcessStepsSection
  | FullWidthTextSection
  | FeatureSplitSection
  | PricingCardsSection
  | CalloutBannerSection
  | FaqSection
  | FinalCtaSection
  | PostListSection
  | LinkStackSection
  | ReportingBlockSection
  | IndustryGridSection;

export type PageContent = {
  slug: string;
  /** Internal label, shown in the admin page list. */
  label: string;
  seoTitle: string;
  metaDescription: string;
  sections: Section[];
};

/* -------------------------------------------------------------------------- */
/*  Packages                                                                   */
/* -------------------------------------------------------------------------- */

export type PackageGroup = "local" | "traditional" | "realEstate" | "sprint";

export type Package = {
  id: string;
  group: PackageGroup;
  name: string;
  /** Display string, not a number — "$875" and "Contact for pricing" coexist. */
  price: string;
  priceUnit?: string;
  onboardingFee?: string;
  /** Sprints show a window instead of an onboarding fee. */
  timeline?: string;
  bestFit: string;
  deliverables: string[];
  cta: CTA;
  featured?: boolean;
  /** Client can hide a tier without deleting it. */
  visible?: boolean;
  /** Surfaces a "pricing not yet set" warning in the admin. */
  pricingPending?: boolean;
};

/* -------------------------------------------------------------------------- */
/*  Articles                                                                   */
/* -------------------------------------------------------------------------- */

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Markdown. Rendered to React elements — never inserted as HTML. */
  body: string;
  category: string;
  tags: string[];
  author: string;
  coverImageUrl?: string;
  coverImageAlt?: string;
  seoTitle: string;
  metaDescription: string;
  published: boolean;
  /** ISO string. Null until the post is first published. */
  publishedAt: string | null;
  updatedAt: string;
};

/** Listing shape — everything a card needs, without hauling the whole body. */
export type PostSummary = Pick<
  Post,
  "slug" | "title" | "excerpt" | "category" | "publishedAt" | "coverImageUrl" | "coverImageAlt"
>;

/* -------------------------------------------------------------------------- */
/*  Navigation                                                                 */
/* -------------------------------------------------------------------------- */

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};
