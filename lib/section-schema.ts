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
  "list-checks", "ship", "plane", "lightning", "image", "storefront", "phone",
  "envelope", "pencil", "code", "globe", "rocket", "warning",
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
      {
        name: "primaryCta",
        label: "Primary button",
        kind: "cta",
        optional: true,
        help: "Leave empty where the section directly below the hero is the action, as on the Industries hub.",
      },
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
          { value: "5", label: "5 — laid out as 3 + 2, centred" },
        ],
        help: "Cards always stack on mobile.",
      },
      {
        name: "groupLabels",
        label: "Row labels",
        kind: "repeater",
        itemLabel: "Label",
        optional: true,
        max: 3,
        help: "Drops a labelled divider into the grid. Position 0 puts it above the first card, 3 above the fourth, and so on.",
        fields: [
          { name: "at", label: "Before card number", kind: "text" },
          { name: "label", label: "Label", kind: "text" },
        ],
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
    description:
      "Copy on one side, and either a set of feature cards or a comparison table on the other.",
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
      {
        name: "tableHeadings",
        label: "Table column headings",
        kind: "stringList",
        optional: true,
        help: "Fill this in to draw a comparison table instead of the feature cards. The first heading labels the rows.",
      },
      {
        name: "tableRows",
        label: "Table rows",
        kind: "repeater",
        itemLabel: "Row",
        optional: true,
        fields: [
          {
            name: "cells",
            label: "Cells",
            kind: "stringList",
            help: "One per column, left to right, in the same order as the headings.",
          },
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
            help: "Descriptive only. Do not name a service line here: each group holds both single-area and multi-market businesses.",
          },
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
            help: "A full address for anything off-site (https://instagram.com/...), or a path like /monthly-seo-packages for a page on this site.",
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
        { label: "SEO Packages & Pricing", href: "/monthly-seo-packages", icon: "layers" },
        { label: "Instagram", href: "https://instagram.com/", icon: "message-square" },
        { label: "Facebook", href: "https://facebook.com/", icon: "users" },
      ],
      footnote: "League City, TX · Serving the Greater Houston area",
    },
  },

  {
    type: "fourQuestions",
    label: "The four questions, expanded",
    description:
      "The long-form version of the Monthly Recap headings, for the SEO Reporting page. The four titles are fixed; only the paragraphs are editable.",
    supportsTone: true,
    fields: [
      eyebrow,
      heading,
      body(true),
      {
        name: "did",
        label: "What We Did",
        kind: "textarea",
        help: "Roughly a paragraph. The heading itself is fixed.",
      },
      { name: "didExample", label: "What We Did — example line", kind: "text", optional: true },
      { name: "why", label: "Why We Did It", kind: "textarea" },
      { name: "whyExample", label: "Why We Did It — example line", kind: "text", optional: true },
      { name: "changed", label: "What Changed", kind: "textarea" },
      { name: "changedExample", label: "What Changed — example line", kind: "text", optional: true },
      { name: "next", label: "Where We're Headed", kind: "textarea" },
      { name: "nextExample", label: "Where We're Headed — example line", kind: "text", optional: true },
      sectionCta,
    ],
    defaults: {
      heading: "The four questions every recap answers",
      did: "What was actually done that month.",
      why: "Why that work was the priority.",
      changed: "What moved, reported honestly.",
      next: "What comes next, so nothing is a surprise.",
    },
  },

  {
    type: "recapExample",
    label: "Example recap",
    description:
      "A worked example of a monthly recap, drawn as a document. Never put a percentage, a figure or a client name in here — the whole point of the panel is that it contains none.",
    supportsTone: true,
    fields: [
      eyebrow,
      heading,
      body(true),
      { name: "panelTitle", label: "Panel title", kind: "text" },
      { name: "panelMeta", label: "Panel subtitle", kind: "text", optional: true },
      {
        name: "did",
        label: "What We Did — example lines",
        kind: "stringList",
        help: "Two or three. Each line is an action, never a result.",
      },
      { name: "why", label: "Why We Did It — example lines", kind: "stringList" },
      {
        name: "changed",
        label: "What Changed — example lines",
        kind: "stringList",
        help: "Describe the kind of movement tracked, not a number.",
      },
      { name: "next", label: "Where We're Headed — example lines", kind: "stringList" },
      {
        name: "caption",
        label: "Caption",
        kind: "textarea",
        help: "Sits under the panel and repeats that this is an example.",
      },
    ],
    defaults: {
      heading: "What a recap looks like",
      panelTitle: "Monthly Project Recap",
      panelMeta: "Example structure",
      did: ["An action completed that month."],
      why: ["The reasoning behind it."],
      changed: ["The kind of movement tracked."],
      next: ["What comes next."],
      caption:
        "An example of the structure, not a real client report. No figures appear because none would be real.",
    },
  },

  {
    type: "auditForm",
    label: "Free audit form",
    description:
      "The solid ink band with the Free Visibility Audit form. The five fields are fixed — adding a sixth is what kills a form like this.",
    supportsTone: false,
    fields: [
      eyebrow,
      heading,
      body(),
      {
        name: "covers",
        label: "What the audit covers",
        kind: "stringList",
        optional: true,
      },
      {
        name: "note",
        label: "Reassurance line",
        kind: "text",
        optional: true,
        help: "Short, e.g. \"No call required.\" Never state a turnaround time — the confirmation page does the reassuring instead.",
      },
      { name: "submitLabel", label: "Button label", kind: "text" },
      {
        name: "profileHelp",
        label: "Profile field helper text",
        kind: "text",
        optional: true,
      },
      {
        name: "source",
        label: "Lead source tag",
        kind: "text",
        help: "How this form is labelled in the enquiry list. Keep it different from the Visibility Review form so the two lead types stay separable.",
      },
    ],
    defaults: {
      eyebrow: "Free Visibility Audit",
      heading: "Get a free look at your profile",
      body: "A written audit of the profile and the site behind it.",
      note: "No call required.",
      submitLabel: "Get a Free Visibility Audit",
      profileHelp: "Optional. Paste the map listing link if handy.",
      source: "Free Visibility Audit",
    },
  },

  {
    type: "waiverMatrix",
    label: "Waiver table",
    description:
      "The three sprint rows and what each one waives. The same terms appear on the packages page and the sprints page — change one and change the other.",
    supportsTone: true,
    fields: [
      eyebrow,
      heading,
      body(true),
      { name: "sprintHeading", label: "First column heading", kind: "text" },
      {
        name: "priceHeading",
        label: "Price column heading",
        kind: "text",
        optional: true,
        help: "Leave empty to hide the price column, which the sprints page does — the prices are already on that page.",
      },
      { name: "waivesHeading", label: "Last column heading", kind: "text" },
      {
        name: "rows",
        label: "Rows",
        kind: "repeater",
        itemLabel: "Row",
        max: 4,
        fields: [
          { name: "sprint", label: "Sprint", kind: "text" },
          { name: "price", label: "One-time price", kind: "text", optional: true },
          { name: "waives", label: "Waives onboarding on", kind: "text" },
        ],
      },
      {
        name: "condition",
        label: "Condition line",
        kind: "text",
        help: "The 30-day rule. Must read identically on both pages that show this table.",
      },
      sectionCta,
    ],
    defaults: {
      heading: "Start with a Launch Sprint",
      sprintHeading: "Sprint",
      priceHeading: "One-time",
      waivesHeading: "Waives onboarding on",
      rows: [
        { sprint: "Neighborhood Launch Sprint", price: "$799", waives: "Neighborhood, Citywide, or Metro" },
        { sprint: "Regional Launch Sprint", price: "$1,495", waives: "Regional" },
        { sprint: "National Launch Sprint", price: "$2,295", waives: "National or National+" },
      ],
      condition:
        "Monthly service must begin within 30 calendar days of sprint completion.",
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
