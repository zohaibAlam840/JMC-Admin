import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1200px] px-6", className)}>
      {children}
    </div>
  );
}

/**
 * Section band. Bands alternate tone down the page so the eye gets a rhythm
 * without any single section needing decoration.
 */
export function Band({
  id,
  tone = "white",
  children,
  className,
}: {
  id?: string;
  tone?: "white" | "surface" | "mist";
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        // 48 / 64 / 96px vertical, Build Spec §4. Generous space between
        // sections is the single trait the reference is most defined by.
        "scroll-mt-24 py-12 md:py-16 lg:py-24",
        // #FAFBFC. Build Spec §2 reserves the darker #F4F6F9 for cards,
        // callouts and pricing panels, not for band alternation.
        tone === "surface" && "bg-surface-2",
        tone === "mist" && "bg-mist",
        tone === "white" && "bg-white",
        className
      )}
    >
      <Container>{children}</Container>
    </section>
  );
}

/**
 * Eyebrow, headline and one line of supporting copy. Every content section
 * opens with one.
 *
 * Centred by default, per Build Spec §1.5: the reference opens almost every
 * section this way, and the consistency is a large part of why it reads the way
 * it does. Pass align="left" for the handful of split layouts where the heading
 * sits beside its content rather than above it.
 */
export function SectionHeader({
  eyebrow,
  heading,
  body,
  align = "center",
  className,
}: {
  eyebrow?: string;
  heading: string;
  body?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "mx-auto max-w-3xl items-center text-center" : "max-w-3xl",
        className
      )}
    >
      {eyebrow ? <p className="eyebrow eyebrow-dot">{eyebrow}</p> : null}
      <h2 className="text-[1.875rem] sm:text-[2.25rem] lg:text-[2.625rem]">
        {heading}
      </h2>
      {/*
        A blank line in the copy means a new paragraph, rather than being
        welded into the same block. Section bodies are a sentence or two
        almost everywhere, so this changes nothing on most of the site -- it
        matters where a section has to explain something before it lists it,
        and a six-line wall was the thing being complained about.
      */}
      {body
        ? body.split(/\n\s*\n/).map((paragraph, i) => (
            <p
              key={i}
              className="max-w-2xl text-[1.02rem] leading-relaxed text-subtle"
            >
              {paragraph}
            </p>
          ))
        : null}
    </Reveal>
  );
}

/**
 * Base surface card.
 *
 * Defined by a hairline border rather than a shadow, per Build Spec §1.5; the
 * shadow appears on hover and nowhere else.
 *
 * Given an `href` the whole card becomes the click target, which §10 requires:
 * "entire card is the click target when href is present, not just the link
 * text". Anything inside it must therefore not be a link of its own.
 */
export function Card({
  children,
  className,
  interactive = false,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  href?: string;
}) {
  const classes = cn(
    "flex h-full flex-col rounded-card border border-line bg-white p-6 transition-shadow duration-200 sm:p-7",
    interactive && "hover:shadow-lift",
    className
  );

  return href ? (
    <Link href={href} className={classes}>
      {children}
    </Link>
  ) : (
    <div className={classes}>{children}</div>
  );
}

/** Hairline grid + brand glow used behind hero sections. */
/**
 * A reporting chart drawn behind a hero, for the words to sit on top of.
 *
 * Asked for on the SEO Reporting page: "we could put almost the same kind of
 * jagged chart that looks like a reporting kind of graphic behind it ...
 * behind the words and have the words as an overlay."
 *
 * Decoration, and held to the rule every hero motif here is held to: no
 * axis labels, no scale, no numbers, nothing that could be read as a result.
 * What it is allowed to look like is a report -- gridlines, plotted points,
 * a measured series and a second fainter one behind it -- because looking
 * like one is the whole job.
 *
 * Drawn at a fixed aspect with preserveAspectRatio slice rather than
 * stretched to the hero's width. Stretching keeps the line's shape but turns
 * every plotted point into an ellipse, and the points are most of what makes
 * this read as a chart instead of a swoosh.
 */
const CHART_W = 1440;
const CHART_H = 520;

/** Rising, with pullbacks. A line that only climbs reads as a drawing. */
const CHART_SERIES = [440, 408, 422, 352, 370, 302, 258, 278, 208, 172, 186, 132, 104];
/** The same shape, flatter and further back. Depth, and a thing to beat. */
const CHART_BEHIND = [455, 440, 448, 412, 420, 396, 372, 382, 352, 334, 342, 312, 296];

/**
 * Plot the series across the frame, inset at both ends.
 *
 * The left end runs off the edge, which is what makes it read as a series
 * continuing from before the viewport. The right end must not: the final
 * point carries the emphasised marker, and at x = width exactly half of it
 * was being clipped by the edge of the band.
 */
const CHART_INSET_LEFT = -120;
// Generous, because "slice" scales the drawing to cover the band and then
// crops the overflow. On a wide viewport that crop is horizontal and eats
// roughly 75px a side, so a 74px inset put the end marker back on the edge.
const CHART_INSET_RIGHT = 200;

function chartPoints(series: number[]) {
  const span = CHART_W - CHART_INSET_RIGHT - CHART_INSET_LEFT;
  const step = span / (series.length - 1);
  return series.map((y, i) => [CHART_INSET_LEFT + i * step, y] as const);
}

function ChartBackdrop() {
  const main = chartPoints(CHART_SERIES);
  const behind = chartPoints(CHART_BEHIND);
  const toPath = (pts: readonly (readonly [number, number])[]) =>
    pts.map(([x, y]) => `${x},${y}`).join(" ");
  const last = main[main.length - 1];

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${CHART_W} ${CHART_H}`}
      preserveAspectRatio="xMidYMax slice"
      /*
       * Phones do not get this. The drawing is scaled to cover the band and
       * cropped, and at 390px the crop leaves about a quarter of it -- a
       * diagonal passing through, which reads as a stray line rather than
       * as a chart. Below sm the hero keeps the plain grid wash it has
       * everywhere else.
       */
      className="pointer-events-none absolute inset-0 hidden size-full sm:block"
    >
      <defs>
        <linearGradient id="hero-chart-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-teal)" stopOpacity="0.22" />
          <stop offset="60%" stopColor="var(--color-blue)" stopOpacity="0.08" />
          <stop offset="100%" stopColor="var(--color-blue)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hero-chart-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-teal)" />
          <stop offset="100%" stopColor="var(--color-blue)" />
        </linearGradient>
        {/* Fades the whole drawing out at the edges so it sits in the band
            rather than being cropped by it. */}
        <radialGradient id="hero-chart-mask" cx="50%" cy="62%" r="78%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="68%" stopColor="white" stopOpacity="0.85" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="hero-chart-vignette">
          <rect width={CHART_W} height={CHART_H} fill="url(#hero-chart-mask)" />
        </mask>
      </defs>

      <g mask="url(#hero-chart-vignette)">
        {/* Plot gridlines. One per plotted point, plus three rules across. */}
        <g stroke="var(--color-blue)" strokeOpacity="0.07" strokeWidth="1">
          {main.map(([x]) => (
            <line key={`v${x}`} x1={x} y1="0" x2={x} y2={CHART_H} />
          ))}
          {[0.25, 0.5, 0.75].map((f) => (
            <line
              key={`h${f}`}
              x1="0"
              y1={CHART_H * f}
              x2={CHART_W}
              y2={CHART_H * f}
            />
          ))}
        </g>

        <polyline
          points={toPath(behind)}
          fill="none"
          stroke="var(--color-blue)"
          strokeOpacity="0.18"
          strokeWidth="2"
          strokeDasharray="7 7"
          strokeLinejoin="round"
        />

        <polygon
          /* Closes under the last plotted point, not at the frame edge.
             Running it out to the edge drew a hard diagonal from the marker
             down to the corner, which reads as a rendering fault rather
             than as part of the chart. */
          points={`${CHART_INSET_LEFT},${CHART_H} ${toPath(main)} ${last[0]},${CHART_H}`}
          fill="url(#hero-chart-fill)"
        />
        <polyline
          points={toPath(main)}
          fill="none"
          stroke="url(#hero-chart-line)"
          strokeOpacity="0.75"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {main.map(([x, y], i) => (
          <circle
            key={`p${x}`}
            cx={x}
            cy={y}
            r={i === main.length - 1 ? 0 : 5}
            fill="white"
            stroke="var(--color-teal)"
            strokeOpacity="0.5"
            strokeWidth="2.5"
          />
        ))}

        {/* The latest point, picked out the way a dashboard picks one out. */}
        <circle cx={last[0]} cy={last[1]} r="22" fill="var(--color-teal)" fillOpacity="0.12" />
        <circle cx={last[0]} cy={last[1]} r="8" fill="var(--color-blue)" />
        <circle cx={last[0]} cy={last[1]} r="8" fill="none" stroke="white" strokeWidth="3" />
      </g>
    </svg>
  );
}

export function HeroBackdrop({ chart = false }: { chart?: boolean }) {
  return (
    <>
      {chart ? (
        <>
          <ChartBackdrop />
          {/* A soft white pool under the copy. The chart is faint, but a
              gridline crossing a line of body text is still the kind of
              thing you notice once and cannot stop noticing. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[26rem] w-[58rem] max-w-[115%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(255,255,255,0.92),rgba(255,255,255,0.72)_55%,transparent)] sm:block"
          />
        </>
      ) : null}
      <div
        aria-hidden="true"
        className="grid-backdrop pointer-events-none absolute inset-0 [mask-image:radial-gradient(75%_60%_at_50%_35%,black,transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-14rem] h-[32rem] w-[52rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(54,209,220,0.20),rgba(91,134,229,0.13),transparent)] blur-3xl"
      />
    </>
  );
}
