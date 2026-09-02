import type { IconName, Section } from "@/lib/types";

/**
 * The block library, described as data.
 *
 * The admin page builder renders its forms from this file rather than from ten
 * hand-written editors. That is what keeps the editor honest: a section type
 * can only be given the fields its renderer actually reads, so the client
 * cannot produce a section the site does not know how to draw.
 *
 * Adding a section type is three edits — the union in lib/types.ts, a renderer
 * in components/blocks/sections.tsx, and an entry here.
 */

export type FieldKind =
  | "text"
  | "textarea"
  | "select"
  | "icon"
  | "boolean"
  | "stringList"
  | "cta"
  | "repeater"
  | "packages";

export type Field = {
  name: string;
  label: string;
  kind: FieldKind;
  help?: string;
  placeholder?: string;
  optional?: boolean;
  /** select only */
  options?: { value: string; label: string }[];
  /** select only — store the chosen value as a number, not a string. */
  numeric?: boolean;
  /** repeater only */
  itemLabel?: string;
  fields?: Field[];
  /**
   * repeater only. When present, the item's fields are chosen by the value of
   * `variantField` — used by the hero showcase, where a "stat" card carries a
   * different shape from a "report" card.
   */
  variantField?: string;
  variants?: Record<string, Field[]>;
  /** repeater only — cap enforced in the editor UI. */
  max?: number;
};

export type SectionSchema = {
  type: Section["type"];
  label: string;
  description: string;
  /** Sections drawn inside a Band can alternate white / tinted. */
  supportsTone: boolean;
  fields: Field[];
  /** Shape a freshly added section starts from. */
  defaults: Record<string, unknown>;
};

export const ICON_NAMES: IconName[] = [
  "target", "map-pin", "file-text", "wrench", "bar-chart", "building", "home",
  "heart-pulse", "briefcase", "utensils", "hard-hat", "factory", "network",
  "search", "trending-up", "clipboard-check", "message-square", "star", "link",
  "gauge", "users", "layers", "calendar", "shield-check", "compass",
  "list-checks",
];

const CTA_DEFAULT = { label: "Request a Visibility Review", href: "/contact" };

/* ------------------------------------------------------- shared fragments -- */

const eyebrow: Field = {
  name: "eyebrow",
  label: "Eyebrow",
  kind: "text",
  optional: true,
  placeholder: "Short label above the heading",
};

const heading: Field = { name: "heading", label: "Heading", kind: "text" };

const body = (optional = false): Field => ({
  name: "body",
  label: "Intro paragraph",
  kind: "textarea",
  optional,
});

const sectionCta: Field = {
  name: "cta",
  label: "Section button",
  kind: "cta",
  optional: true,
};

const showcaseCards: Field = {
  name: "showcase",
  label: "Showcase cards",
  kind: "repeater",
  itemLabel: "Card",
  max: 3,
  help: "Three cards sit under the hero copy. Describe scope — what is tracked or covered — never a result.",
  variantField: "kind",
  fields: [
    {
      name: "kind",
      label: "Card style",
      kind: "select",
      options: [
        { value: "report", label: "Report — a list of what is reported on" },
        { value: "coverage", label: "Coverage — areas or markets covered" },
        { value: "roadmap", label: "Roadmap — an ordered set of stages" },
        { value: "channels", label: "Channels — where visibility is worked" },
        { value: "stat", label: "Stats — three figures with labels" },
      ],
    },
    { name: "label", label: "Card label", kind: "text" },
    { name: "title", label: "Card title", kind: "text" },
    { name: "footnote", label: "Footnote", kind: "text", optional: true },
  ],
  variants: {
    report: [{ name: "items", label: "Lines", kind: "stringList" }],
    coverage: [{ name: "items", label: "Lines", kind: "stringList" }],
    roadmap: [{ name: "items", label: "Stages", kind: "stringList" }],
    channels: [{ name: "items", label: "Channels", kind: "stringList" }],
    stat: [
      {
        name: "stats",
        label: "Figures",
        kind: "repeater",
        itemLabel: "Figure",
        max: 3,
        fields: [
          { name: "value", label: "Value", kind: "text" },
          { name: "label", label: "Label", kind: "text" },
        ],
      },
    ],
  },
};

/* --------------------------------------------------------------- schemas -- */

export const SECTION_SCHEMAS = [
  {
    type: "heroSplit",
    label: "Hero with showcase",
    description:
      "Page opener: badge, big heading, two buttons, and a row of three showcase cards.",
    supportsTone: false,
    fields: [
      { ...eyebrow, optional: false },
      heading,
      body(),
      { name: "primaryCta", label: "Primary button", kind: "cta" },
      { name: "secondaryCta", label: "Secondary button", kind: "cta", optional: true },
      showcaseCards,
    ],
    defaults: {
      eyebrow: "Eyebrow",
      heading: "New hero heading",
      body: "One paragraph explaining what this page is about.",
      primaryCta: CTA_DEFAULT,
      showcase: [
        {
          kind: "report",
          label: "What you see",
          title: "Monthly Reporting",
          items: ["Line one", "Line two", "Line three"],
        },
      ],
    },
  },

  {
    type: "heroCentered",
    label: "Hero, centred",
    description: "Simpler opener with no showcase row. Used on lighter pages.",
    supportsTone: false,
    fields: [
      { ...eyebrow, optional: false },
      heading,
      body(),
      { name: "primaryCta", label: "Primary button", kind: "cta" },
      { name: "secondaryCta", label: "Secondary button", kind: "cta", optional: true },
    ],
    defaults: {
      eyebrow: "Eyebrow",
      heading: "New hero heading",
      body: "One paragraph explaining what this page is about.",
      primaryCta: CTA_DEFAULT,
    },
  },

  {
    type: "cardGrid",
    label: "Card grid",
    description:
      "The workhorse. Four layouts so a run of card sections doesn't read as the same grid five times.",
    supportsTone: true,
    fields: [
      eyebrow,
      heading,
      body(true),
      {
        name: "variant",
        label: "Layout",
        kind: "select",
        options: [
          { value: "cards", label: "Cards — icon tile above the title" },
          { value: "numbered", label: "Numbered — 01 / 02 / 03 badges" },
          { value: "compact", label: "Compact — dense tiles, icon inline" },
          { value: "split", label: "Split — borderless rows, sticky heading" },
        ],
      },
      {
        name: "columns",
        label: "Columns on desktop",
        kind: "select",
        numeric: true,
        options: [
          { value: "2", label: "2" },
          { value: "3", label: "3" },
          { value: "4", label: "4" },
        ],
        help: "Cards always stack on mobile.",
      },
      {
        name: "emphasis",
        label: "Accent treatment",
        kind: "boolean",
        optional: true,
        help: "Adds the brand rule across the top of each card. Reserved for reporting sections.",
      },
      {
        name: "cards",
        label: "Cards",
        kind: "repeater",
        itemLabel: "Card",
        fields: [
          { name: "title", label: "Title", kind: "text" },
          {
            name: "meta",
            label: "Price line",
            kind: "text",
            optional: true,
            help: "Shown above the body in the accent colour. Keep it to a price or a short qualifier.",
          },
          { name: "body", label: "Body", kind: "textarea", optional: true },
          { name: "icon", label: "Icon", kind: "icon", optional: true },
          { name: "cta", label: "Card link", kind: "cta", optional: true },
        ],
      },
      sectionCta,
    ],
    defaults: {
      heading: "New card section",
      variant: "cards",
      columns: 3,
      cards: [
        { title: "First card", body: "What this card is about." },
        { title: "Second card", body: "What this card is about." },
        { title: "Third card", body: "What this card is about." },
      ],
    },
  },

  {
    type: "processSteps",
    label: "Process roadmap",
    description:
      "Dark band with the steps drawn as a route. Works with three or four steps.",
    supportsTone: false,
    fields: [
      eyebrow,
      heading,
      body(true),
      {
        name: "steps",
        label: "Steps",
        kind: "repeater",
        itemLabel: "Step",
        max: 4,
        help: "Three or four. More than four and the route runs off the band.",
        fields: [
          { name: "title", label: "Title", kind: "text" },
          { name: "body", label: "Body", kind: "textarea" },
        ],
      },
      sectionCta,
    ],
    defaults: {
      heading: "How it works",
      steps: [
        { title: "Step one", body: "What happens first." },
        { title: "Step two", body: "What happens next." },
        { title: "Step three", body: "How it finishes." },
      ],
    },
  },

  {
    type: "fullWidthText",
    label: "Statement",
    description:
      "One centred paragraph. Set the treatment to Dark band for the transparency statement — solid ink, large type, nothing else on screen.",
    supportsTone: true,
    fields: [
      eyebrow,
      heading,
      body(),
      {
        name: "treatment",
        label: "Treatment",
        kind: "select",
        options: [
          { value: "default", label: "Standard — on the section background" },
          { value: "statement", label: "Dark band — solid ink, large type, no icons" },
        ],
        help: "The dark band is meant to be rare. Two on one page and neither reads as a peak.",
      },
      sectionCta,
    ],
    defaults: {
      heading: "A statement worth its own section",
      body: "One paragraph. Keep it short — this section works because it is the only thing on screen.",
    },
  },

  {
    type: "featureSplit",
    label: "Feature split",
    description: "Copy on one side, a staggered set of feature cards on the other.",
    supportsTone: true,
    fields: [
      eyebrow,
      heading,
      body(),
      {
        name: "align",
        label: "Copy side",
        kind: "select",
        options: [
          { value: "left", label: "Copy on the left" },
          { value: "right", label: "Copy on the right" },
        ],
      },
      {
        name: "groups",
        label: "Feature cards",
        kind: "repeater",
        itemLabel: "Feature",
        fields: [
          { name: "title", label: "Title", kind: "text" },
          { name: "body", label: "Body", kind: "textarea" },
          { name: "icon", label: "Icon", kind: "icon", optional: true },
        ],
      },
      sectionCta,
    ],
    defaults: {
      heading: "New feature section",
      body: "What this side of the section is arguing.",
      align: "left",
      groups: [
        { title: "First feature", body: "What it covers." },
        { title: "Second feature", body: "What it covers." },
      ],
    },
  },

  {
    type: "pricingCards",
    label: "Pricing cards",
    description:
      "Pulls live prices from Packages. Edit a price once there and every page showing it updates.",
    supportsTone: true,
    fields: [
      eyebrow,
      heading,
      body(true),
      {
        name: "packageIds",
        label: "Packages shown",
        kind: "packages",
        help: "Order here is the order on the page. Hidden packages are skipped automatically.",
      },
      sectionCta,
    ],
    defaults: { heading: "Pricing", packageIds: [] },
  },

  {
    type: "calloutBanner",
    label: "Callout banner",
    description: "A boxed offer or clarification with its own buttons.",
    supportsTone: true,
    fields: [
      heading,
      body(),
      { name: "primaryCta", label: "Primary button", kind: "cta" },
      { name: "secondaryCta", label: "Secondary button", kind: "cta", optional: true },
    ],
    defaults: {
      heading: "Something worth calling out",
      body: "The detail that belongs in a box rather than in a paragraph.",
      primaryCta: CTA_DEFAULT,
    },
  },

  {
    type: "faq",
    label: "FAQ accordion",
    description:
      "Also emits FAQ structured data, so these answers can appear in search results.",
    supportsTone: true,
    fields: [
      eyebrow,
      heading,
      {
        name: "items",
        label: "Questions",
        kind: "repeater",
        itemLabel: "Question",
        fields: [
          { name: "question", label: "Question", kind: "text" },
          { name: "answer", label: "Answer", kind: "textarea" },
        ],
      },
      sectionCta,
    ],
    defaults: {
      heading: "Questions we hear often",
      items: [{ question: "A question", answer: "The answer." }],
    },
  },

  {
    type: "postList",
    label: "Latest articles",
    description:
      "Pulls the newest published articles. Add it once and the page keeps itself current as you write.",
    supportsTone: true,
    fields: [
      eyebrow,
      heading,
      body(true),
      {
        name: "limit",
        label: "How many to show",
        kind: "select",
        numeric: true,
        options: [
          { value: "3", label: "3" },
          { value: "6", label: "6" },
          { value: "9", label: "9" },
          { value: "12", label: "12" },
        ],
      },
      {
        name: "category",
        label: "Only this category",
        kind: "text",
        optional: true,
        placeholder: "Leave blank for all",
        help: "Must match the category on the articles exactly.",
      },
      {
        name: "emptyMessage",
        label: "If there are no articles yet",
        kind: "text",
        optional: true,
        help: "Shown instead of an empty space before the first article is published.",
      },
      sectionCta,
    ],
    defaults: {
      eyebrow: "Latest",
      heading: "Recent Articles",
      limit: 3,
      emptyMessage: "The first articles are being written now — check back shortly.",
    },
  },

  {
    type: "industryGrid",
    label: "Industries, bucketed",
    description:
      "Eight industries in two labelled groups of four, each group tied to the service line it feeds. The canonical industry component.",
    supportsTone: true,
    fields: [
      eyebrow,
      heading,
      body(true),
      {
        name: "groups",
        label: "Groups",
        kind: "repeater",
        itemLabel: "Group",
        max: 2,
        help: "Two groups of four. The 4/4 symmetry is the point — an odd count breaks the rows.",
        fields: [
          {
            name: "label",
            label: "Group label",
            kind: "text",
            help: "Visitor-facing. How the buyer would describe themselves, not internal vocabulary.",
          },
          { name: "serviceLine", label: "Service line", kind: "text" },
          { name: "serviceHref", label: "Service line links to", kind: "text" },
          {
            name: "cards",
            label: "Industries",
            kind: "repeater",
            itemLabel: "Industry",
            max: 4,
            fields: [
              { name: "title", label: "Industry", kind: "text" },
              {
                name: "body",
                label: "One line",
                kind: "textarea",
                help: "Name the kind of business. Never claim expertise in it.",
              },
              { name: "icon", label: "Icon", kind: "icon", optional: true },
              { name: "href", label: "Links to", kind: "text", optional: true },
            ],
          },
        ],
      },
      {
        name: "escapeHatch",
        label: "Line under the grid",
        kind: "textarea",
        optional: true,
        help: "For the visitor whose industry is not listed. A line, never a ninth card.",
      },
      sectionCta,
    ],
    defaults: {
      eyebrow: "Industries",
      heading: "Where This Method Gets Pointed",
      groups: [],
      escapeHatch:
        "The method does not change with the industry. If yours is not listed, it probably still applies.",
    },
  },

  {
    type: "reportingBlock",
    label: "Monthly Recap",
    description:
      "The four reporting cards. Their titles are fixed sitewide and cannot be edited — only the sentence under each one.",
    supportsTone: true,
    fields: [
      eyebrow,
      heading,
      body(true),
      {
        name: "did",
        label: "Under “What We Did”",
        kind: "textarea",
        optional: true,
      },
      {
        name: "why",
        label: "Under “Why We Did It”",
        kind: "textarea",
        optional: true,
      },
      {
        name: "changed",
        label: "Under “What Changed”",
        kind: "textarea",
        optional: true,
      },
      {
        name: "next",
        label: "Under “Where We’re Headed”",
        kind: "textarea",
        optional: true,
      },
      sectionCta,
    ],
    defaults: {
      eyebrow: "Clear Reporting",
      heading: "What You Get Every Month",
      did: "A plain summary of the SEO work completed, in language you do not need a glossary for.",
      why: "The reasoning behind each piece of work and how it supports visibility.",
      changed: "What moved, what did not, and what we are still watching.",
      next: "The priorities for the coming month, in order.",
      cta: {
        label: "See How JMC Reports SEO Progress",
        href: "/seo-reporting",
      },
    },
  },

  {
    type: "linkStack",
    label: "Link hub",
    description:
      "The link-in-bio page: a mark, one line of positioning, and a stack of big tappable buttons. Point social profiles here instead of a link aggregator.",
    supportsTone: false,
    fields: [
      { ...eyebrow, placeholder: "@htxseo" },
      { name: "heading", label: "Name", kind: "text" },
      {
        name: "body",
        label: "One-line positioning",
        kind: "textarea",
        optional: true,
        help: "Kept to a sentence. This page is scanned on a phone, not read.",
      },
      {
        name: "avatarUrl",
        label: "Profile image address",
        kind: "text",
        optional: true,
        help: "Optional. Leave blank to show the JMC mark instead.",
      },
      { name: "avatarAlt", label: "Profile image description", kind: "text", optional: true },
      {
        name: "theme",
        label: "Page style",
        kind: "select",
        options: [
          { value: "dark", label: "Brand gradient — white type, like a profile" },
          { value: "light", label: "Light — white background, like the rest of the site" },
        ],
      },
      {
        name: "socials",
        label: "Social icons",
        kind: "repeater",
        itemLabel: "Icon",
        help: "A row of small marks under the name. Keep the buttons below for things people should actually tap.",
        fields: [
          {
            name: "platform",
            label: "Platform",
            kind: "select",
            options: [
              { value: "instagram", label: "Instagram" },
              { value: "facebook", label: "Facebook" },
              { value: "linkedin", label: "LinkedIn" },
              { value: "x", label: "X" },
              { value: "youtube", label: "YouTube" },
              { value: "tiktok", label: "TikTok" },
              { value: "email", label: "Email" },
              { value: "phone", label: "Phone" },
              { value: "website", label: "Website" },
            ],
          },
          {
            name: "href",
            label: "Links to",
            kind: "text",
            help: "The full profile address. For email use mailto:…, for phone use tel:…",
          },
        ],
      },
      {
        name: "links",
        label: "Buttons",
        kind: "repeater",
        itemLabel: "Button",
        help: "Order matters — the top two get most of the taps. Put the thing you actually want people to do first.",
        fields: [
          { name: "label", label: "Button text", kind: "text" },
          {
            name: "href",
            label: "Links to",
            kind: "text",
            help: "A full address for anything off-site (https://instagram.com/...), or a path like /seo-packages for a page on this site.",
          },
          { name: "description", label: "Second line", kind: "text", optional: true },
          { name: "icon", label: "Icon", kind: "icon", optional: true },
          {
            name: "featured",
            label: "Highlight this one",
            kind: "boolean",
            optional: true,
            help: "Solid black instead of outlined. Use it once — highlighting everything highlights nothing.",
          },
        ],
      },
      {
        name: "footnote",
        label: "Small print",
        kind: "text",
        optional: true,
      },
    ],
    defaults: {
      eyebrow: "@htxseo",
      heading: "Houston's SEO Agency",
      theme: "dark",
      socials: [
        { platform: "instagram", href: "https://instagram.com/" },
        { platform: "facebook", href: "https://facebook.com/" },
        { platform: "linkedin", href: "https://linkedin.com/" },
      ],
      body: "Houston-area SEO. Practical strategy, local optimization, and reporting you can actually read.",
      links: [
        {
          label: "Request a Visibility Review",
          href: "/contact",
          description: "Where you show up now, and what to fix first",
          icon: "target",
          featured: true,
        },
        { label: "SEO Packages & Pricing", href: "/seo-packages", icon: "layers" },
        { label: "Instagram", href: "https://instagram.com/", icon: "message-square" },
        { label: "Facebook", href: "https://facebook.com/", icon: "users" },
      ],
      footnote: "League City, TX · Serving the Greater Houston area",
    },
  },

  {
    type: "finalCta",
    label: "Closing CTA",
    description: "Full-width brand band. Every page should end with one.",
    supportsTone: false,
    fields: [
      heading,
      body(),
      { name: "primaryCta", label: "Primary button", kind: "cta" },
      { name: "secondaryCta", label: "Secondary button", kind: "cta", optional: true },
    ],
    defaults: {
      heading: "The closing ask",
      body: "One or two sentences on what happens when they get in touch.",
      primaryCta: CTA_DEFAULT,
    },
  },
] satisfies readonly SectionSchema[];

/*
 * Compile-time guarantee that every section type has an editor.
 *
 * Adding a type to lib/types.ts without adding it here would otherwise ship a
 * block the client can see on the page but cannot edit in /admin, which fails
 * silently. This makes it a type error instead.
 */
type EditableType = (typeof SECTION_SCHEMAS)[number]["type"];
type EveryTypeIsEditable = Exclude<Section["type"], EditableType> extends never
  ? true
  : ["No admin editor for:", Exclude<Section["type"], EditableType>];
const _everyTypeIsEditable: EveryTypeIsEditable = true;
void _everyTypeIsEditable;

const schemaByType = new Map(SECTION_SCHEMAS.map((s) => [s.type, s]));

export function getSectionSchema(type: string): SectionSchema | undefined {
  return schemaByType.get(type as Section["type"]);
}

export function sectionLabel(type: string): string {
  return schemaByType.get(type as Section["type"])?.label ?? type;
}

/**
 * A short, human line summarising a section in the page list — the heading if
 * it has one, so the client can scan the page without opening every block.
 */
export function sectionSummary(data: Record<string, unknown>): string {
  const h = data.heading;
  return typeof h === "string" && h.trim() ? h : "Untitled";
}
