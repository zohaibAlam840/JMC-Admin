import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HeroShowcaseCard } from "@/lib/types";

/**
 * The showcase cards under the hero copy.
 *
 * These replace the screenshots a product company would put here — built in
 * markup, no stock photography, no fabricated metrics. Every value describes
 * scope, never a result.
 *
 * All treatments share one rhythm so a row reads as a set:
 *
 *   header  — label + title, bottom rule
 *   body    — flex-1, content distributed to fill
 *   footer  — optional caption, pinned to the bottom
 *
 * The footer is min-height, never fixed height: pills and captions wrap at
 * narrow widths, and a fixed height clips them (which it previously did).
 */

function CardShell({
  card,
  body,
  footer,
}: {
  card: HeroShowcaseCard;
  body: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-bento border border-line bg-white shadow-soft transition-all duration-300 ease-out-soft hover:-translate-y-1.5 hover:border-teal/50 hover:shadow-lift">
      <div className="border-b border-line px-5 py-4">
        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-subtle">
          {card.label}
        </p>
        <p className="mt-1 font-display text-[1.05rem] font-bold uppercase leading-tight text-ink-strong">
          {card.title}
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-5 py-5">{body}</div>

      {footer ? (
        <div className="min-h-[3.25rem] border-t border-line px-5 py-3.5">
          {footer}
        </div>
      ) : null}
    </div>
  );
}

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[0.66rem] font-semibold uppercase leading-relaxed tracking-wider text-subtle">
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ stat -- */

/** Big figures with small labels. Used where real scope numbers exist. */
function StatCard({
  card,
}: {
  card: Extract<HeroShowcaseCard, { kind: "stat" }>;
}) {
  return (
    <CardShell
      card={card}
      body={
        <dl className="flex flex-1 flex-col justify-center divide-y divide-line">
          {card.stats.map((s) => (
            <div
              key={s.label}
              className="flex items-baseline justify-between gap-4 py-3 first:pt-0 last:pb-0"
            >
              <dt className="text-[0.84rem] leading-snug text-subtle">
                {s.label}
              </dt>
              <dd className="font-display text-[1.6rem] font-bold leading-none tabular-nums text-ink-strong">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      }
      footer={card.footnote ? <Caption>{card.footnote}</Caption> : undefined}
    />
  );
}

/* ---------------------------------------------------------------- report -- */

function ReportCard({
  card,
}: {
  card: Extract<HeroShowcaseCard, { kind: "report" }>;
}) {
  return (
    <CardShell
      card={card}
      body={
        <ul className="flex flex-1 flex-col justify-center gap-3.5">
          {card.items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 text-[0.86rem] leading-snug text-ink"
            >
              <span className="mt-0.5 inline-flex size-[18px] shrink-0 items-center justify-center rounded-pill bg-surface text-teal-ink">
                <Check size={10} strokeWidth={3.5} aria-hidden="true" />
              </span>
              {item}
            </li>
          ))}
        </ul>
      }
      footer={
        <div aria-hidden="true" className="flex h-6 items-end gap-1.5">
          {[30, 44, 38, 58, 50, 70, 64, 84].map((h, i) => (
            <span
              key={i}
              style={{ height: `${h * 0.28}px` }}
              className={cn(
                "w-full rounded-sm",
                i > 5 ? "gradient-brand" : "bg-line"
              )}
            />
          ))}
        </div>
      }
    />
  );
}

/* -------------------------------------------------------------- coverage -- */

/**
 * Contribution-style grid. Three intensity levels rather than on/off, which
 * reads as coverage varying across an area instead of a pass/fail score.
 */
const INTENSITY: Record<number, string> = {
  0: "bg-surface",
  1: "bg-teal/25",
  2: "bg-teal/55",
  3: "gradient-brand",
};

// Fixed pattern — deliberately partial. Coverage is a scope, not a score.
const PATTERN = [
  0, 0, 1, 0, 0, 0, 1, 0, 1, 2, 3, 1, 0, 2, 1, 3, 2, 3, 2, 1, 0, 0, 2, 3, 1, 2,
  0, 1, 0, 1, 0, 0, 1, 0, 0,
];

function CoverageCard({
  card,
}: {
  card: Extract<HeroShowcaseCard, { kind: "coverage" }>;
}) {
  return (
    <CardShell
      card={card}
      body={
        <div className="flex flex-1 flex-col justify-center gap-4">
          <div aria-hidden="true" className="grid grid-cols-7 gap-1.5">
            {PATTERN.map((level, i) => (
              <span
                key={i}
                className={cn("aspect-square rounded-[4px]", INTENSITY[level])}
              />
            ))}
          </div>

          {/* Legend, as on a contribution graph. */}
          <div
            aria-hidden="true"
            className="flex items-center justify-end gap-1.5"
          >
            <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-subtle">
              Less
            </span>
            {[0, 1, 2, 3].map((l) => (
              <span
                key={l}
                className={cn("size-2.5 rounded-[3px]", INTENSITY[l])}
              />
            ))}
            <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-subtle">
              More
            </span>
          </div>
        </div>
      }
      footer={
        <ul className="flex flex-wrap gap-1.5">
          {card.items.map((item) => (
            <li
              key={item}
              className="rounded-pill border border-line px-2.5 py-1 text-[0.64rem] font-semibold uppercase tracking-wider text-subtle"
            >
              {item}
            </li>
          ))}
        </ul>
      }
    />
  );
}

/* -------------------------------------------------------------- channels -- */

/** Row of surfaces with a confirmed state, like a weekday strip. */
function ChannelsCard({
  card,
}: {
  card: Extract<HeroShowcaseCard, { kind: "channels" }>;
}) {
  return (
    <CardShell
      card={card}
      body={
        <ul className="flex flex-1 flex-col justify-center gap-2.5">
          {card.items.map((item) => (
            <li
              key={item}
              className="flex items-center justify-between gap-3 rounded-card border border-line bg-surface-2 px-3.5 py-2.5"
            >
              <span className="text-[0.84rem] leading-snug text-ink">
                {item}
              </span>
              <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-pill bg-brand-black text-white">
                <Check size={10} strokeWidth={3.5} aria-hidden="true" />
              </span>
            </li>
          ))}
        </ul>
      }
      footer={card.footnote ? <Caption>{card.footnote}</Caption> : undefined}
    />
  );
}

/* --------------------------------------------------------------- roadmap -- */

function RoadmapCard({
  card,
}: {
  card: Extract<HeroShowcaseCard, { kind: "roadmap" }>;
}) {
  return (
    <CardShell
      card={card}
      body={
        <ol className="relative flex flex-1 flex-col justify-center gap-6">
          <span
            aria-hidden="true"
            className="absolute bottom-4 left-[11px] top-4 w-px border-l border-dashed border-line-strong"
          />
          {card.items.map((item, i) => (
            <li key={item} className="relative flex items-center gap-3">
              <span className="relative z-10 inline-flex size-6 shrink-0 items-center justify-center rounded-pill border border-line bg-white font-display text-[0.7rem] font-bold leading-none">
                <span className="gradient-text">{i + 1}</span>
              </span>
              <span className="text-[0.86rem] leading-snug text-ink">
                {item}
              </span>
            </li>
          ))}
        </ol>
      }
      footer={
        <Caption>{card.footnote ?? "Reviewed and re-prioritized monthly"}</Caption>
      }
    />
  );
}

export function ShowcaseCard({ card }: { card: HeroShowcaseCard }) {
  switch (card.kind) {
    case "stat":
      return <StatCard card={card} />;
    case "coverage":
      return <CoverageCard card={card} />;
    case "channels":
      return <ChannelsCard card={card} />;
    case "roadmap":
      return <RoadmapCard card={card} />;
    default:
      return <ReportCard card={card} />;
  }
}
