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
function Motif({
  kind,
  bars,
}: {
  kind: HeroShowcaseCard["kind"];
  bars: number[];
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

  return (
    <div className="flex h-20 items-end gap-1.5">
      {bars.map((height, i) => (
        <span
          key={i}
          style={{ height: `${height}%` }}
          className={cn(
            "flex-1 rounded-t-[3px]",
            i === bars.length - 2 ? "bg-teal" : "bg-surface"
          )}
        />
      ))}
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

        {/* Labelled rows. The muted bar beside each is a placeholder for the
            written detail, not a measurement of anything. */}
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

        <div
          aria-hidden="true"
          className="mt-6 border-t border-line pt-5"
        >
          <Motif kind={primary?.kind ?? "report"} bars={bars} />
        </div>
      </div>

      {/* ----------------------------------------------- overlapping panel -- */}
      {chips.length > 0 && secondary ? (
        <div className="absolute -bottom-8 -left-4 w-[13.5rem] rounded-card border border-line bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.10)] sm:-left-8">
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
