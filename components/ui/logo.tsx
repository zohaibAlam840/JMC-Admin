import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The JMC mark: a black block holding the gradient "JMC" lettering.
 *
 * Mark only — the stacked "Jordan Marketing Consultants" wordmark used to sit
 * beside it and was dropped for a cleaner header. The full name still reaches
 * screen readers through the accessible label, and appears in text in the
 * footer, so nothing is lost for SEO or accessibility.
 *
 * Rebuilt in markup rather than an image so it stays crisp at any size.
 * Swap in the supplied SVG when that asset arrives.
 */
export function Logo({
  className,
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="Jordan Marketing Consultants — home"
      className={cn(
        // w-fit stops the mark stretching when it sits in a flex column (the
        // footer), since an explicit width beats align-items: stretch. Do NOT
        // add self-start for that — it also overrides the header's
        // align-items: center and pins the mark to the top of the bar.
        "inline-flex w-fit shrink-0 items-center rounded-[4px] px-2.5 py-2 transition-transform duration-300 ease-out-soft hover:-translate-y-0.5",
        onDark ? "bg-white" : "bg-brand-black",
        className
      )}
    >
      <span className="gradient-text font-display text-xl leading-none font-bold tracking-wide">
        JMC
      </span>
    </Link>
  );
}
