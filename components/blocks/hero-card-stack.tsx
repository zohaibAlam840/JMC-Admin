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

        {/* One simple bar shape, as the spec describes. No axis, no values. */}
        <div
          aria-hidden="true"
          className="mt-6 flex h-20 items-end gap-1.5 border-t border-line pt-5"
        >
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
