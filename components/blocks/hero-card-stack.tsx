import { Search } from "lucide-react";

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
function hash(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

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
 * A pie, cut into one wedge per labelled item, with the first one pulled out.
 *
 * Asked for by name in review, with a reference image: solid wedges, flat
 * colour, one slice sitting proud of the others. What the reference also had
 * was a percentage printed on every slice, and those are not here.
 *
 * The omission is the point rather than an oversight. Page Spec 01 §1: no
 * fabricated metrics presented as real client data. A number on a slice is
 * the strongest possible claim a chart can make, and there is no measurement
 * behind any number that could go here -- so printing "40%" would be
 * inventing a statistic about somebody's Google Business Profile and putting
 * it on the page that sells the audit. For the same reason the wedges are
 * equal: an unequal slice is that same claim made silently.
 *
 * What survives is what the shape can honestly say: a profile is made of
 * these parts, and this is the first of them. If real figures ever exist,
 * both constraints lift together -- unequal wedges and printed values would
 * then be reporting rather than decoration.
 */
function ProfilePie({
  count,
  weights,
}: {
  count: number;
  /**
   * Optional. Without it every wedge is the same size, which is all an
   * unmeasured card is allowed to say. With it the wedges are drawn in
   * proportion, and the caller is asserting the figures are published scope
   * a reader could check -- see the `share` card in lib/types.ts.
   */
  weights?: number[];
}) {
  const slices = Math.max(2, Math.min(count || 4, 4));
  const cx = 60;
  const cy = 60;
  const r = 48;
  /** Degrees trimmed off each end of a wedge, which draws the hairline gaps. */
  const trim = 1.4;
  /**
   * How far the first wedge sits out of the pie, along its own bisector.
   *
   * Only the offset, never the radius: a bigger wedge would be a claim that
   * this part of a profile is a larger share of something, which is the one
   * thing the equal slices exist to avoid saying.
   */
  const explode = 11;

  const point = (angle: number, radius: number, dx = 0, dy = 0) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return [
      (cx + dx + radius * Math.cos(rad)).toFixed(2),
      (cy + dy + radius * Math.sin(rad)).toFixed(2),
    ];
  };

  return (
    <svg
      viewBox="0 0 120 120"
      className="size-[10.5rem] shrink-0"
      aria-hidden="true"
    >
      {(() => {
        const share = weights?.slice(0, slices);
        const total = share?.reduce((a, b) => a + b, 0) || 0;
        // Each wedge's start angle is the sum of everything before it.
        const edges = [0];
        for (let i = 0; i < slices; i++) {
          edges.push(
            edges[i] +
              (share && total > 0 ? (share[i] / total) * 360 : 360 / slices)
          );
        }
        return Array.from({ length: slices }, (_, i) => {
        const from = edges[i] + trim;
        const to = edges[i + 1] - trim;
        const mid = ((from + to) / 2 - 90) * (Math.PI / 180);
        const dx = i === 0 ? Math.cos(mid) * explode : 0;
        const dy = i === 0 ? Math.sin(mid) * explode : 0;
        const [x1, y1] = point(from, r, dx, dy);
        const [x2, y2] = point(to, r, dx, dy);
        const large = to - from > 180 ? 1 : 0;

        return (
          <path
            key={i}
            d={`M ${(cx + dx).toFixed(2)} ${(cy + dy).toFixed(2)} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`}
            fill={RING_ARCS[i % RING_ARCS.length].stroke}
            fillOpacity={RING_ARCS[i % RING_ARCS.length].opacity}
          />
        );
        });
      })()}
    </svg>
  );
}

/**
 * A bar chart of published figures, with the values printed on it.
 *
 * The one chart in this file that is allowed numbers, and only because its
 * numbers are checkable: they are the tier scope printed further down the
 * same page, not a measurement of anybody's results. See the `scale` card in
 * lib/types.ts for the rule.
 *
 * Bars are drawn in proportion from zero rather than from the smallest value,
 * which matters more than it looks: a chart baselined at the smallest figure
 * would make "up to 60" next to "up to 90" look like a threefold difference
 * instead of half as much again.
 */
function ScaleChart({
  series,
  unit,
  compact = false,
}: {
  series: { label: string; value: number }[];
  unit: string;
  /** Short bars, for the collage card, where the full height collides with
   *  the hero's button row. */
  compact?: boolean;
}) {
  const bars = series.slice(0, 4);
  const peak = Math.max(...bars.map((b) => b.value), 1);

  return (
    <div className="flex flex-col gap-3">
      <div className={cn("flex items-stretch gap-3", compact ? "h-20" : "h-32")}>
        {bars.map((bar, i) => (
          <div
            key={bar.label}
            className="flex h-full flex-1 flex-col items-center gap-2"
          >
            <span
              className={cn(
                "font-heading font-bold leading-none text-ink-strong",
                compact ? "text-[0.8125rem]" : "text-[0.9375rem]"
              )}
            >
              {bar.value}
            </span>
            {/*
              The bar is positioned against this box rather than sized inside
              the column. A percentage height needs a parent with a definite
              one, and the column's height comes from its content -- so the
              first version of this resolved every bar to zero and drew a
              chart of three numbers floating over nothing.
            */}
            <div className="relative w-full flex-1">
              <span
                aria-hidden="true"
                style={{ height: `${(bar.value / peak) * 100}%` }}
                className={cn(
                  "absolute inset-x-0 bottom-0 rounded-t-[4px]",
                  i === bars.length - 1
                    ? "bg-[linear-gradient(180deg,var(--color-teal),var(--color-blue))]"
                    : "bg-teal/25"
                )}
              />
            </div>
          </div>
        ))}
      </div>
      <div aria-hidden="true" className="h-px w-full bg-line" />
      <div className="flex gap-3">
        {bars.map((bar) => (
          <span
            key={bar.label}
            className={cn(
              "flex-1 text-center text-subtle",
              compact ? "text-[0.6875rem]" : "text-[0.75rem]"
            )}
          >
            {bar.label}
          </span>
        ))}
      </div>
      <p
        className={cn(
          "text-center text-subtle",
          compact ? "text-[0.6875rem]" : "text-[0.75rem]"
        )}
      >
        {unit}
      </p>
    </div>
  );
}

function Motif({
  kind,
  bars,
  seed,
  idScope = "panel",
}: {
  kind: HeroShowcaseCard["kind"];
  bars: number[];
  /** Varies the drawn shape between pages that share a motif. */
  seed: string;
  /**
   * Distinguishes two instances of the SAME card, which the collage hero
   * has by construction: it renders every card twice, once floating for
   * lg and once stacked below it. Seeding the gradient ids from the card
   * alone gave both copies the same id, the visible one referenced the
   * hidden one's definition, and the line did not paint -- leaving the
   * endpoint dot, which is an HTML span, hanging on its own.
   */
  idScope?: string;
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
    /*
     * Gradient ids are per instance, not fixed strings.
     *
     * The collage hero renders its cards twice -- once absolutely
     * positioned for lg and once as a grid below it -- and only one of the
     * two is ever displayed. With a fixed id both copies declared the same
     * gradient, the second referenced the first, and on a phone the first
     * is inside a `hidden` subtree: the line simply did not paint. The
     * endpoint dot is an HTML span, so it still showed, which made it look
     * like a chart with its data missing.
     */
    const uid = hash(seed + "|" + idScope);
    const lineId = `jmc-growth-line-${uid}`;
    const fillId = `jmc-growth-fill-${uid}`;
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
            <linearGradient id={lineId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="var(--color-teal)" />
              <stop offset="1" stopColor="var(--color-blue)" />
            </linearGradient>
            <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0"
                stopColor="var(--color-teal)"
                stopOpacity="0.22"
              />
              <stop offset="1" stopColor="var(--color-teal)" stopOpacity="0" />
            </linearGradient>
          </defs>

          <polygon points={`0,72 ${line} 200,72`} fill={`url(#${fillId})`} />
          <polyline
            points={line}
            fill="none"
            stroke={`url(#${lineId})`}
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
  const isScale = primary?.kind === "scale";
  const isShare = primary?.kind === "share";

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

        {isShare && primary?.kind === "share" ? (
          /*
           * The proportional pie: same column and same legend as the equal
           * one, with each wedge's figure printed beside its label. The
           * figures are the reason the wedges are allowed to differ, so
           * showing them is not decoration -- it is what makes the shape
           * checkable against the pricing page.
           */
          <div className="flex justify-end pt-5">
            <div className="flex w-[17rem] flex-col items-center gap-5">
              <ProfilePie
                count={primary.series.length}
                weights={primary.series.map((x) => x.value)}
              />
              <ul className="flex w-full flex-col gap-2.5">
                {primary.series.slice(0, 4).map((item, i) => (
                  <li key={item.label} className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "size-2.5 shrink-0 rounded-full",
                        RING_DOTS[i % RING_DOTS.length]
                      )}
                    />
                    <span className="text-[0.8125rem] text-ink">
                      {item.label}
                    </span>
                    <span className="ml-auto font-heading text-[0.8125rem] font-bold text-ink-strong">
                      {item.value}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="w-full pb-32 text-[0.75rem] text-subtle lg:pb-1">
                {primary.unit}
              </p>
            </div>
          </div>
        ) : isScale && primary?.kind === "scale" ? (
          /*
           * Like the pie, the chart replaces the row list rather than sitting
           * in a band beneath it -- the client's note on the row-list layout
           * was that it reads as a dashboard. Same 17rem right-hand column,
           * for the same reason: the overlapping card covers this panel's
           * left edge.
           */
          <div className="flex justify-end pt-5">
            <div className="w-[17rem] pb-32 lg:pb-1">
              <ScaleChart series={primary.series} unit={primary.unit} />
            </div>
          </div>
        ) : isRing ? (
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
              <ProfilePie count={rows.length} />
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

/* -------------------------------------------------------------------------- */

/**
 * One small floating panel in the collage hero.
 *
 * Deliberately smaller and plainer than the main hero panel: five of these
 * surround a headline, so each one is a glance rather than something to read.
 */
/** A grey placeholder bar, standing in for a line of text in a wireframe. */
function Ghost({ className }: { className?: string }) {
  return <span className={cn("block rounded-full bg-surface-2", className)} />;
}

/**
 * A wireframe of a search results page.
 *
 * The centrepiece of the collage, and the thing that makes the hero read as
 * being about search rather than about dashboards. Everything in it is
 * structure: a field, one result, a map pack. The body copy is grey bars
 * rather than invented sentences.
 *
 * No third-party marks anywhere in it. The reference leans on Google's logo
 * and colours, which are not JMC's to use and would imply an association
 * that does not exist.
 */
function SerpMock({ card }: { card: HeroShowcaseCard & { kind: "serp" } }) {
  const [title, url, ...rows] = card.items;

  return (
    <div className="w-full overflow-hidden rounded-bento border border-line bg-white shadow-[0_18px_44px_rgba(16,24,40,0.14)]">
      {/* The search field. */}
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <Search size={14} className="shrink-0 text-subtle" aria-hidden="true" />
        <Ghost className="h-2 w-28" />
        <span
          aria-hidden="true"
          className="ml-auto size-5 rounded-full bg-[linear-gradient(135deg,var(--color-teal),var(--color-blue))]"
        />
      </div>

      <div className="flex flex-col gap-3 p-4">
        {/* One organic result. */}
        <div>
          <p className="text-[0.8125rem] font-semibold leading-tight text-blue-ink">
            {title}
          </p>
          <p className="mt-0.5 text-[0.6875rem] text-teal-ink">{url}</p>
          <div className="mt-2 flex flex-col gap-1.5">
            <Ghost className="h-1.5 w-full" />
            <Ghost className="h-1.5 w-4/5" />
          </div>
        </div>

        {/* The map pack under it. */}
        {rows.length ? (
          <div className="rounded-card border border-line">
            {rows.map((row, i) => (
              <div
                key={row}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2",
                  i > 0 && "border-t border-line"
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-1.5 shrink-0 rounded-full",
                    RING_DOTS[i % RING_DOTS.length]
                  )}
                />
                <span className="text-[0.6875rem] text-ink">{row}</span>
                <Ghost className="ml-auto h-1.5 w-10" />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/**
 * One floating panel in the collage.
 *
 * Each kind gets its own treatment rather than all of them being a title
 * over a bullet list. That was the first version, and the client's note on
 * it was that the reference is "not cards that we are showing" -- the panels
 * there are each a different sort of widget, which is what stops the
 * composition reading as a grid that happens to be scattered.
 */
function CollageCard({
  card,
  scope,
}: {
  card: HeroShowcaseCard;
  /** Which of the two collage layouts this copy belongs to. */
  scope: string;
}) {
  if (card.kind === "serp") return <SerpMock card={card} />;

  const rows = "items" in card ? card.items.slice(0, 3) : [];
  /* A tinted header strip, as on the reference's one coloured panel. */
  const crowned = card.kind === "coverage";

  return (
    <div className="w-full overflow-hidden rounded-card border border-line bg-white shadow-[0_10px_30px_rgba(16,24,40,0.10)]">
      {crowned ? (
        <div className="bg-[linear-gradient(135deg,var(--color-teal),var(--color-blue))] px-3.5 py-1.5">
          <span className="text-[0.5625rem] font-semibold uppercase tracking-[0.08em] text-white">
            {card.label}
          </span>
        </div>
      ) : null}

      <div className="p-3.5">
        {crowned ? null : (
          <span className="text-[0.5625rem] font-semibold uppercase tracking-[0.08em] text-subtle">
            {card.label}
          </span>
        )}
        <p
          className={cn(
            "font-heading text-[0.8125rem] font-bold leading-tight text-ink-strong",
            crowned ? "" : "mt-1"
          )}
        >
          {card.title}
        </p>

        {card.kind === "share" ? (
          <div className="mt-3 flex items-center gap-3">
            <div className="shrink-0 [&>svg]:size-12">
              <ProfilePie
                count={card.series.length}
                weights={card.series.map((x) => x.value)}
              />
            </div>
            <ul className="flex flex-col gap-1">
              {card.series.slice(0, 3).map((item, i) => (
                <li key={item.label} className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "size-1.5 shrink-0 rounded-full",
                      RING_DOTS[i % RING_DOTS.length]
                    )}
                  />
                  <span className="text-[0.6875rem] text-ink">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : card.kind === "scale" ? (
          <div className="mt-3">
            <ScaleChart series={card.series} unit={card.unit} compact />
          </div>
        ) : card.kind === "growth" ? (
          /* A rising line, the way the reference's small stat panels carry
             one. No axis and no figure: direction is all it claims. */
          <div className="mt-3 flex flex-col gap-2">
            <Motif kind="growth" bars={[]} seed={card.title} idScope={scope} />
            <div className="flex flex-wrap gap-1">
              {rows.map((row) => (
                <span
                  key={row}
                  className="rounded-sm bg-surface px-1.5 py-0.5 text-[0.625rem] font-medium text-ink"
                >
                  {row}
                </span>
              ))}
            </div>
          </div>
        ) : card.kind === "channels" ? (
          /* Chips, so this panel is not another bullet list. */
          <div className="mt-3 flex flex-wrap gap-1.5">
            {rows.map((row) => (
              <span
                key={row}
                className="rounded-sm bg-surface px-2 py-1 text-[0.6875rem] font-medium text-ink"
              >
                {row}
              </span>
            ))}
          </div>
        ) : card.kind === "roadmap" ? (
          /* Numbered, with a rule down the side: a sequence, not a list. */
          <ol className="mt-3 flex flex-col gap-2 border-l border-line pl-3">
            {rows.map((row, i) => (
              <li key={row} className="flex items-center gap-2">
                <span className="font-heading text-[0.625rem] font-bold text-teal-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[0.6875rem] text-ink">{row}</span>
              </li>
            ))}
          </ol>
        ) : rows.length ? (
          <ul className="mt-3 flex flex-col gap-1.5">
            {rows.map((row, i) => (
              <li key={row} className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-1.5 shrink-0 rounded-full",
                    RING_DOTS[i % RING_DOTS.length]
                  )}
                />
                <span className="text-[0.6875rem] text-ink">{row}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Cards scattered around a centred headline.
 *
 * The client sent a reference for the homepage: a headline in the middle
 * with small panels floating either side of it, which is a livelier opening
 * than a block of copy beside one big panel.
 *
 * Two layouts rather than one set of positions. At lg the cards are placed
 * absolutely down the left and right gutters, which is what produces the
 * scattered look and also what makes it unusable narrower than that -- there
 * are no gutters on a phone. Below lg they become an ordinary two-column
 * grid underneath the copy, in the same order.
 *
 * The copy sits above them in the stacking order and the cards do not take
 * pointer events, so a long headline can overlap a card without the card
 * eating a click meant for the button.
 */
/*
 * Four around the copy and one below it, pushed into the container's own
 * padding so they clear the headline and the button row. The lower pair sit
 * past the halfway mark on purpose: above that they land on the buttons, and
 * although the cards ignore pointer events so the buttons still work, a card
 * sitting across a CTA looks like a bug.
 */
/*
 * Four corners, and nothing under the buttons.
 *
 * There was a fifth slot centred below the copy, holding the search
 * mock. The client took it out: it sat directly under the two CTAs and
 * pushed the fold down by most of a card. The slots are also narrower
 * than they were, on the same note -- the panels should read as small
 * things orbiting the headline, not as a second column of content.
 */
const COLLAGE_SLOTS = [
  "lg:-left-8 lg:top-[2%] lg:w-[11.5rem]",
  "lg:-left-4 lg:top-[56%] lg:w-[11rem]",
  "lg:-right-8 lg:top-[1%] lg:w-[11.5rem]",
  "lg:-right-4 lg:top-[53%] lg:w-[11rem]",
];

/**
 * The floating layer: cards placed around the copy, lg and up only.
 *
 * Rendered before the copy so it sits behind it, and absolutely
 * positioned so it takes no space in the flow.
 */
export function HeroCollageFloating({ cards }: { cards: HeroShowcaseCard[] }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden lg:block"
    >
      {cards.slice(0, COLLAGE_SLOTS.length).map((card, i) => (
        <div key={card.title} className={cn("absolute", COLLAGE_SLOTS[i])}>
          <CollageCard card={card} scope="float" />
        </div>
      ))}
    </div>
  );
}

/**
 * The same cards as an ordinary stack, below lg.
 *
 * A separate component from the floating layer, and that is the whole
 * point: it has to render AFTER the hero copy. When both layouts lived in
 * one component the stacked cards came out above the headline, so a phone
 * opened the site on four panels with the H1 somewhere below them.
 */
export function HeroCollageStack({ cards }: { cards: HeroShowcaseCard[] }) {
  return (
    <div className="mt-12 grid w-full gap-4 sm:grid-cols-2 lg:hidden">
      {cards.slice(0, COLLAGE_SLOTS.length).map((card) => (
        <CollageCard key={card.title} card={card} scope="stack" />
      ))}
    </div>
  );
}
