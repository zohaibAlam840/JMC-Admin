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
  | FinalCtaSection;

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
/*  Navigation                                                                 */
/* -------------------------------------------------------------------------- */

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};
