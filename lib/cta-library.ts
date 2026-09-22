/**
 * The governed CTA library — Decisions Record §9.
 *
 * The prior documents carried roughly forty distinct button labels for a
 * dozen distinct actions. This is the approved set, and nothing outside it
 * ships without sign-off. `npm run check` fails the build on anything else.
 *
 * Kept as data rather than as prose in a spec so the rule is enforceable: a
 * label that drifts is caught before it reaches a page, not during a QA pass
 * six weeks later.
 */

/** One per action, not one per page. */
export const CTA_LIBRARY = {
  /** The sitewide primary. Sprint consultation is the Launch Sprints page only. */
  primary: ["Request a Visibility Review", "Request a Sprint Consultation"],

  secondary: [
    "View SEO Packages",
    "View Local SEO Packages",
    "View Traditional SEO Packages",
    "View Monthly SEO Packages",
    "View Launch Sprints",
    "See How JMC Reports SEO Progress",
    "Explore Industries",
    "Get a Free Visibility Audit",
    "Learn More About JMC",
  ],

  /** Homepage growth paths, and the lane routing repeated on industry pages. */
  routing: ["Explore Local SEO", "Explore Traditional SEO"],

  /**
   * Per-tier, so conversion tracking can tell which card produced a lead.
   * "Request [Tier] Review" is retired: "Review" was vague, and repeating it
   * six times read as filler.
   */
  pricing: [
    "Start with Neighborhood",
    "Start with Citywide",
    "Start with Metro",
    "Start with Regional",
    "Start with National",
    "Start with National+",
    "Start the Neighborhood Sprint",
    "Start the Regional Sprint",
    "Start the National Sprint",
  ],
} as const;

export const APPROVED_CTAS: readonly string[] = [
  ...CTA_LIBRARY.primary,
  ...CTA_LIBRARY.secondary,
  ...CTA_LIBRARY.routing,
  ...CTA_LIBRARY.pricing,
];

/**
 * Labels that were in circulation and are explicitly retired, with what to
 * use instead. Named so the checker can say "use X" rather than only "no".
 */
export const RETIRED_CTAS: Record<string, string> = {
  "Explore SEO Services": "Explore Industries",
  "Explore All Industries": "Explore Industries",
  "Start with a Visibility Review": "Request a Visibility Review",
  "Start With a Visibility Review": "Request a Visibility Review",
  "Compare Packages": "View SEO Packages",
  "Compare Local SEO Packages": "View Local SEO Packages",
  "Compare Launch Sprints": "View Launch Sprints",
  "See Monthly SEO Packages": "View Monthly SEO Packages",
  "See What Local SEO Includes": "View Local SEO Packages",
  "Explore Traditional SEO Strategy": "Explore Traditional SEO",
  "Talk Through Your SEO Growth Goals": "Request a Visibility Review",
  "Talk Through Your SEO Starting Point": "Request a Visibility Review",
  "Explore Real Estate SEO": "(retired with Real Estate SEO)",
  "Request a Real Estate Visibility Review": "(retired with Real Estate SEO)",
  "View Real Estate SEO Options": "(retired with Real Estate SEO)",
};
