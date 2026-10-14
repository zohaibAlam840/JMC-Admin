import { cn } from "@/lib/utils";
import type { HeroShowcaseCard } from "@/lib/types";

/**
 * The hero's right-hand composition — Build Spec §9A, Page Spec 01 §1.
 *
 * Two overlapping rounded panels on a soft gradient wash, suggesting a monthly
 * recap: a header bar, a few labelled rows, and one simple bar shape.
 *
 * Built in HTML and CSS rather than as an image, for three reasons the spec
 * gives: there is then no LCP image to optimise (§16), it sidesteps the SaaS-04
 * asset licensing problem entirely (§1.5), and it stays crisp at any size.
 *
 * Deliberately abstract. Page Spec 01 §1: "No fabricated metrics presented as
 * real client data. Generic labels only." So there is not a single number in
 * here — the bars carry no scale, no axis, and no value, and every label comes
 * from the section's own content rather than being invented.
 */
/**
 * The shape at the foot of the panel, chosen by the first showcase card.
 *
 * Every page that opens with a split hero used to draw the same bar row, which
 * made eight different pages open identically — the one thing the specs are
 * most consistently against. The card's `kind` already varies per page, so it
 * picks the motif too: a coverage card gets a service-area grid, a roadmap
 * card gets a route, a channels card gets a set of surfaces.
 *
 * All four are abstract by the same rule as the rest of the composition. No
 * axis, no scale, no values, nothing that could be read as a result.
 */
/**
 * Pick one of a set deterministically from a string.
 *
 * The eight industry pages share this component, and before this they shared
 * the identical drawing too — the client's note was that moving between them
 * "feels like I am on the same page". Varying the shape by the card's own
 * title means no two pages draw the same curve, without anybody maintaining a
 * per-page number.
 *
 * Deterministic rather than random, because a shape that differs between the
 * server and the client hydrates mismatched, and a chart that redraws itself
 * on every render is noise rather than structure.
 */
function pick<T>(options: T[], seed: string): T {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return options[hash % options.length];
}

/** Rising, with pullbacks. A line that only goes up reads as a drawing. */
const GROWTH_CURVES = [
  [58, 52, 55, 42, 38, 26, 29, 14, 6],
  [62, 59, 48, 50, 36, 31, 33, 19, 9],
  [55, 57, 44, 46, 30, 33, 21, 16, 8],
];

const BAR_SETS = [
  [34, 48, 41, 60, 55, 74, 88],
  [28, 36, 52, 45, 63, 71, 90],
  [40, 38, 55, 62, 58, 76, 84],
];

/**
 * Arc and dot colours for the ring motif, in order.
 *
 * The same four entries drive the ring's arcs and the bullet beside each row
 * above it, which is what makes the ring readable without a legend: the arc
 * and the words it stands for carry the same colour. Keep the two arrays in
 * step or the diagram starts lying about which part is which.
 */
const RING_DOTS = ["bg-teal", "bg-teal/55", "bg-blue/55", "bg-blue"];
const RING_ARCS = [
  { stroke: "var(--color-teal)", opacity: 1 },
  { stroke: "var(--color-teal)", opacity: 0.55 },
  { stroke: "var(--color-blue)", opacity: 0.55 },
  { stroke: "var(--color-blue)", opacity: 1 },
];

/**
 * The ring itself. One arc per labelled item, equal arcs, nothing in the hole.
 *
 * A pie chart's expressive power is entirely in unequal slices, and an
 * unequal slice here would be a claim about proportion with no source behind
 * it -- Page Spec 01 §1 rules exactly that out. So what is borrowed is the
 * shape's legibility, not its claim: this says "the profile is made of these
 * parts", which is true, and says nothing about how much each one matters.
 */
function ProfileRing({ count }: { count: number }) {
  const segments = Math.max(2, Math.min(count || 4, 4));
  const r = 26;
  const circumference = 2 * Math.PI * r;
  const gap = 7;
  const arc = circumference / segments - gap;

  return (
    <svg
      viewBox="0 0 72 72"
      className="size-[9.5rem] shrink-0"
      aria-hidden="true"
    >
      {Array.from({ length: segments }, (_, i) => (
        <circle
          key={i}
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke={RING_ARCS[i % RING_ARCS.length].stroke}
          strokeOpacity={RING_ARCS[i % RING_ARCS.length].opacity}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={`${arc} ${circumference - arc}`}
          strokeDashoffset={-((circumference / segments) * i) + gap / 2}
          /* Start at twelve o'clock rather than three. */
          transform="rotate(-90 36 36)"
        />
      ))}
    </svg>
  );
}

function Motif({
  kind,
  bars,
  seed,
}: {
  kind: HeroShowcaseCard["kind"];
  bars: number[];
  /** Varies the drawn shape between pages that share a motif. */
  seed: string;
}) {
  if (kind === "coverage") {
    // A service area, strongest around the middle. The same idea as the
    // search-grid illustration, at a size that reads as a motif.
    const cells = Array.from({ length: 24 }, (_, i) => {
      const row = Math.floor(i / 8);
      const col = i % 8;
      const d = Math.hypot(row - 1, (col - 3.5) / 2);
      return Math.max(0, 1 - d / 2.4);
    });
    return (
      <div className="grid h-20 grid-cols-8 grid-rows-3 gap-1.5">
        {cells.map((strength, i) => (
          <span
            key={i}
            className="rounded-[3px] bg-teal"
            style={{ opacity: 0.12 + strength * 0.68 }}
          />
        ))}
      </div>
    );
  }

  if (kind === "growth") {
    /*
     * A sparkline. Asked for in review: the route motif below "was not making
     * much sense" and the client wanted something a non-technical reader reads
     * instantly as going up.
     *
     * Still abstract, by the same rule as every other motif here — Page Spec
     * 01 §1 forbids fabricated metrics presented as real data. So there is no
     * axis, no gridline, no scale and not one number. What is left is the only
     * honest thing a shape like this can say: the direction.
     *
     * The two small pullbacks are deliberate. A line that only ever rises
     * reads as a drawing of a line; SEO does not work like that, and neither
     * does the reporting this site promises.
     *
     * No hover layer, which is the one place this departs from how a real
     * chart would be built. A tooltip implies there is a value underneath to
     * read, and there is not.
     */
    const ys = pick(GROWTH_CURVES, seed);
    const points = ys.map((y, i) => [(i * 200) / (ys.length - 1), y]);
    const line = points.map(([x, y]) => `${x},${y}`).join(" ");
    const end = points[points.length - 1];

    return (
      <div className="relative h-20 w-full">
        <svg
          viewBox="0 0 200 72"
          // Stretched to whatever width the panel is, because the panel's
          // width is not knowable here. non-scaling-stroke keeps the line 2px
          // through that stretch, which is the whole reason this is safe.
          preserveAspectRatio="none"
          className="absolute inset-0 size-full overflow-visible"
        >
          <defs>
            <linearGradient id="jmc-growth-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="var(--color-teal)" />
              <stop offset="1" stopColor="var(--color-blue)" />
            </linearGradient>
            <linearGradient id="jmc-growth-fill" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0"
                stopColor="var(--color-teal)"
                stopOpacity="0.22"
              />
              <stop offset="1" stopColor="var(--color-teal)" stopOpacity="0" />
            </linearGradient>
          </defs>

          <polygon points={`0,72 ${line} 200,72`} fill="url(#jmc-growth-fill)" />
          <polyline
            points={line}
            fill="none"
            stroke="url(#jmc-growth-line)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/*
         * The end point, in HTML rather than as an SVG <circle>. The stretch
         * above would squash a circle into an ellipse, and non-scaling-stroke
         * only rescues the stroke, not the geometry.
         */}
        <span
          className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue ring-2 ring-white"
          style={{ left: "100%", top: `${(end[1] / 72) * 100}%` }}
        />
      </div>
    );
  }

  if (kind === "roadmap") {
    // A route with four stops. Reads as a sequence rather than a measurement,
    // which is what a roadmap card is claiming.
    return (
      <div className="flex h-20 items-center">
        <div className="relative flex w-full items-center justify-between">
          <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line" />
          <span className="absolute left-0 top-1/2 h-[2px] w-1/2 -translate-y-1/2 rounded-full bg-[linear-gradient(90deg,var(--color-teal),var(--color-blue))]" />
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={cn(
                "relative size-3 rounded-full border-2",
                i <= 1
                  ? "border-teal bg-white"
                  : "border-line-strong bg-surface"
              )}
            />
          ))}
        </div>
      </div>
    );
  }

  if (kind === "channels") {
    // Stacked surfaces of unequal width. A list of places, not a chart.
    return (
      <div className="flex h-20 flex-col justify-center gap-2.5">
        {["w-full", "w-4/5", "w-3/5", "w-2/5"].map((w, i) => (
          <span
            key={w}
            className={cn(
              "h-2.5 rounded-full",
              w,
              i === 0 ? "bg-teal/70" : i === 1 ? "bg-blue/40" : "bg-surface"
            )}
          />
        ))}
      </div>
    );
  }

  /*
   * The default: a column chart that rises, with the latest column picked
   * out and a baseline under it.
   *
   * It used to be a row of bars at arbitrary heights with the second-to-last
   * one coloured, which read as decoration rather than as a chart. The client
   * asked for something "actually meaningful... understandable to normal
   * people", and the two things that turn bars into a chart a layperson reads
   * instantly are a baseline to sit on and a direction to travel in.
   *
   * Still abstract, like every other motif here: no axis, no scale, no
   * numbers. Page Spec 01 §1 forbids anything that could be read as a real
   * result, so direction is the most this is allowed to say.
   *
   * `bars` is the caller's fallback; the seeded set is what actually varies
   * between pages sharing this motif.
   */
  const heights = pick(BAR_SETS, seed) ?? bars;

  return (
    <div className="flex h-20 flex-col justify-end gap-1.5">
      <div className="flex flex-1 items-end gap-1.5">
        {heights.map((height, i) => (
          <span
            key={i}
            style={{ height: `${height}%` }}
            className={cn(
              "flex-1 rounded-t-[3px]",
              i === heights.length - 1
                ? "bg-[linear-gradient(180deg,var(--color-teal),var(--color-blue))]"
                : "bg-surface"
            )}
          />
        ))}
      </div>
      <span aria-hidden="true" className="h-px w-full bg-line" />
    </div>
  );
}

export function HeroCardStack({ cards }: { cards: HeroShowcaseCard[] }) {
  const primary = cards[0];
  const secondary = cards[1];

  const rows = primary && "items" in primary ? primary.items.slice(0, 4) : [];
  const chips =
    secondary && "items" in secondary ? secondary.items.slice(0, 3) : [];

  // Fixed heights rather than random ones: a shape that changes between the
  // server and the client would hydrate mismatched, and a "chart" that reads
  // differently on every render is noise rather than structure.
  const bars = [38, 62, 45, 78, 56, 88, 70];

  const isRing = primary?.kind === "profile";

  return (
    <div className="relative isolate mx-auto w-full max-w-[30rem] lg:mx-0">
      {/* Soft gradient wash behind the composition. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-8 -z-10 rounded-[2.5rem] bg-[radial-gradient(60%_60%_at_60%_35%,rgba(54,209,220,0.18),rgba(91,134,229,0.12)_45%,transparent_72%)] blur-2xl"
      />

      {/* ------------------------------------------------------ main panel -- */}
      <div className="rounded-bento border border-line bg-white p-6 shadow-[0_8px_24px_rgba(0,0,0,0.10)]">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div className="flex flex-col gap-1.5">
            {primary ? (
              <>
                <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-subtle">
                  {primary.label}
                </span>
                <span className="font-heading text-[1.0625rem] font-bold leading-none text-ink-strong">
                  {primary.title}
                </span>
              </>
            ) : null}
          </div>
          <span
            aria-hidden="true"
            className="h-2 w-10 rounded-full bg-[linear-gradient(135deg,var(--color-teal),var(--color-blue))]"
          />
        </div>

        {isRing ? (
          /*
           * The chart IS the panel.
           *
           * Everywhere else this component draws a small shape in a band at
           * the foot of a list of rows, which reads as a dashboard. The
           * client's note on this page was to make it "a pie chart instead
           * of the dashboard looking one", so here the ring takes the body
           * and the rows become its legend. Each legend dot is the colour of
           * the arc it stands for, which is what lets the ring be read
           * without labels pinned to it.
           */
          <div
            /*
             * Everything inside the right 17rem, and that measurement is not
             * a taste: the overlapping card below hangs into this panel's
             * left edge by about 8rem at every breakpoint, so content there
             * is content behind a card. Ring above legend rather than beside
             * it for the same reason -- side by side needs the full width
             * and loses half the words.
             */
            className="flex justify-end pt-5"
          >
            <div className="flex w-[17rem] flex-col items-center gap-5">
              <ProfileRing count={rows.length} />
              {/*
                * The deep bottom padding is for the overlapping card, and it
                * only applies below lg. Up there the card hangs out into the
                * gutter and clears this content sideways; narrower than that
                * it tucks back under the panel and lands straight across the
                * legend, so the panel has to leave it a band of its own.
                */}
              <ul className="flex w-full flex-col gap-2.5 pb-32 lg:pb-1">
                {rows.map((row, i) => (
                  <li key={row} className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "size-2.5 shrink-0 rounded-full",
                        RING_DOTS[i % RING_DOTS.length]
                      )}
                    />
                    <span className="text-[0.8125rem] text-ink">{row}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <>
            {/* Labelled rows. The muted bar beside each is a placeholder for
                the written detail, not a measurement of anything. */}
            <ul className="flex flex-col gap-3.5 pt-5">
              {rows.map((row, i) => (
                <li key={row} className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="size-1.5 shrink-0 rounded-full bg-teal"
                  />
                  <span className="text-[0.8125rem] text-ink">{row}</span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "ml-auto h-1.5 rounded-full bg-surface",
                      ["w-14", "w-10", "w-16", "w-12"][i % 4]
                    )}
                  />
                </li>
              ))}
            </ul>

            <div aria-hidden="true" className="mt-6 border-t border-line pt-5">
              <Motif
                kind={primary?.kind ?? "report"}
                bars={bars}
                // Seeded from the card's own words, so two pages sharing a
                // motif still draw different shapes.
                seed={`${primary?.title ?? ""}|${primary?.label ?? ""}`}
              />
            </div>
          </>
        )}
      </div>

      {/* ----------------------------------------------- overlapping panel -- */}
      {chips.length > 0 && secondary ? (
        /*
         * Narrower at desktop, and nudged further out.
         *
         * It sits over the bottom-left corner, which is exactly where the
         * motif is drawn. That cost nothing while the motif was an abstract
         * shape; once it became a real chart the overlap hid the first half
         * of the line, so a rising line appeared to start halfway up.
         *
         * A bottom-anchored card this tall always covers the chart band, so
         * the fix is width, not vertical position. At 11rem with -left-12 it
         * hangs in the column gutter and clips roughly a quarter of the
         * chart instead of half. Pushing it further out is not available:
         * past about -left-16 it reaches the hero's secondary button.
         */
        <div className="absolute -bottom-8 -left-4 w-[13.5rem] rounded-card border border-line bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.10)] sm:-left-8 lg:-left-12 lg:w-[11rem]">
          <span className="text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-subtle">
            {secondary.label}
          </span>
          <p className="mt-1 font-heading text-[0.9375rem] font-bold leading-tight text-ink-strong">
            {secondary.title}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {chips.map((chip) => (
              <span
                key={chip}
                className="rounded-sm bg-surface px-2 py-1 text-[0.6875rem] font-medium text-ink"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
