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
      {body ? (
        <p className="max-w-2xl text-[1.02rem] leading-relaxed text-subtle">
          {body}
        </p>
      ) : null}
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
export function HeroBackdrop() {
  return (
    <>
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
