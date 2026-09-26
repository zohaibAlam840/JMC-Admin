import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The supplied JMC logo, inlined.
 *
 * Source: "BW JMC Logo SVG.svg" from Wendell, a VTracer trace of the black and
 * white lockup — the JMC block on the left, the stacked "JORDAN MARKETING
 * CONSULTANTS" wordmark on the right. Run through SVGO, which collapsed 27
 * traced paths into the single path below and took it from 17KB to 3.8KB,
 * small enough to inline rather than ship as a file. Verified pixel-identical
 * against the original at both 591px and 240px.
 *
 * Inlined on purpose, for the one thing a file in /public cannot do: the
 * letters are knockouts, not white shapes, so the mark takes `currentColor`
 * and the lettering shows whatever is behind it. That is the whole light/dark
 * story — `text-brand-black` on the white header, `text-white` on the black
 * footer — with no second colourway to keep in sync, which is also why the
 * hand-drawn block this replaces is gone rather than kept as a fallback.
 */
const LOGO_PATH =
  "M29 27h273v205H29zm69 47-1 98-5 1v-15H76c-1 12.4-1 12.4 3.3 23.6 5.8 5.2 11.8 4.7 19.2 4.6 4.6-.3 7.4-1 11.5-3.2 3.8-4.6 5.1-8.4 5.1-14.2V109l-.1-35zm30 0v112h14V88l10.4 63 1.5 9 1 6 1.5 9 .5 2.7a26 26 0 0 0 2.1 8.3h9a117 117 0 0 0 4-18.9l1.5-8.7.9-5.4 3.2-20 7.4-45v98h15V74h-25l-4.3 23.2-1.4 7.8-2.1 11.4-.7 3.5-.6 3.4-.5 2.9q-.6 4.4-.4 8.8h-2l-.2-2q-.8-10.2-2.6-20.2l-.5-3.1-1.1-6.5-2.8-16-.5-3-.5-2.7-.4-2.4c-.4-2.3-.4-2.3-1.4-5.1zm86 7a35 35 0 0 0-2.3 14.5v68.8l-.1 2.3c0 5.4 1.1 9.5 3.4 14.4 6.3 5.1 11.6 5.2 19.3 5.3h2.8c5.4 0 9.3-.2 13.9-3.3a15 15 0 0 0 4.1-11.4v-8l-.1-6.6h-15l-.4 7c-.5 6.9-.5 6.9-1.6 8h-7V88h7c2.4 2.4 1.8 9 2 12h15c1-12.4 1-12.4-4-23-5.6-3-10.2-3.5-16.5-3.4H232c-7.1 0-13.4 1.5-18 7.4m111 32h11c2 6.3 3 12.5 4 19l4-19h12v33h-8l-1-10-2 10h-10l-2-10-1 10h-7zm44 41h12l3 12 1-12h8v33h-12l-3-13-1 13h-8zm128 0h12l3 11 1-11h8v33h-12l-3-13-1 13h-8zm-60-81h11l4 15V73h8v33h-11c-2-4.8-3-9-4-14l-1 14h-7zm41 40h11l4 16v-16h8v33h-12l-3-14-1 14h-7zM349.6 72.6l4 .1 2.2.1 5.2.2c2.8 5.5 3.4 9.8 3.3 16v2.3c0 5-.6 9-2.3 13.7-2.8 1.4-5.3 1.2-8.4 1.2H350c-3.1-.2-3.1-.2-6.1-2.2-1.6-4.9-1.2-9.9-1.2-15l-.1-3.3v-6.1c.6-4.8 2-6.5 6.9-7M353 79c-1.2 1-1.2 1-1.1 2.9v10.4l.1 6.7h3V80zm29 34c14.6 0 14.6 0 20 3 1.5 11.5 1.5 11.5-1 17l1 1v12h-8l-.1-2.2-.3-2.7-.2-2.8-.4-2.3-2-1v11h-9zm9 7v9l3-1v-8zm-1-47h16c4 4 4 4 4.5 6.7v6.4l-.1 3.5V93c-.1 8.6-.1 8.6-2.4 12-5.7 1.9-12 1-18 1zm9 7v19l3-1V81zm-36 74.4c2 1.6 2 1.6 3 3.6q.4 6.1.3 12.4l.1 3.5v6.3c-.5 3.5-1.7 4.7-4.4 6.8-3.1.5-3.1.5-6.6.4H352c-3-.4-3-.4-4.7-1.5-1.9-2.7-1.7-4.7-1.7-8v-11.2c.1-9.3.1-9.3 2.4-12.7 4.7-2 10.4-1.8 15 .4m-8 5.6c-1.7 3.3-1.1 7-1 10.6v8.4l3 1v-20zm12-87h15c5 5 5 5 5.6 7.5l-.2 2.6v2.5A17 17 0 0 1 385 92l2 3c.2 2.7.2 2.7.1 5.7v3l-.1 2.3h-9V95h-3v11h-8zm8 7v8h3v-8zm139.4 32.8 3.5-.1c3.1.3 3.1.3 5 1.5 1.4 2.3 1.4 3.8 1.3 6.5v2.4l-.2 1.9h-8v-5h-3v20h3v-5h-2v-7h10l.2 9.4c0 3.8 0 5.4-2.2 8.6q-7.5 2.7-15-.3c-2-1.7-2-1.7-3-4.7q-.3-5.4-.2-10.9v-8.6c.2-2.8 1-5 2.2-7.5 2.8-1.4 5.3-1.2 8.4-1.2M418 154h9v26l2-1 1-25h8l.1 13.8v3.9l.1 3.8v3.5c-.2 3-.6 4.6-2.2 7-2.7 1.3-5 1.2-8 1.3h-3c-2.9-.3-2.9-.3-4.7-1.6-2.5-3.5-2.3-6.8-2.3-10.9v-11.4zm59 0h14l2 12.6.6 3.5c.9 5.7 1.7 11.2 1.4 16.9h-8c-1.4-2.7-1-5-1-8h-4l-1 8h-8c.6-11.1 2.3-22 4-33m6 13v6h2v-5zm-77-54h8l1 8 3-8h9l-1.4 4.2-.8 2.5c-.8 2.3-.8 2.3-2 5-1.7 5.2.8 10.4 2.8 15.2l1.3 3.5 1.1 2.6h-9l-4-8-1 8h-8zm14-40.1h7.2l2.8.1 2 12 .6 3.4A87 87 0 0 1 434 106h-8l-1-8h-4v3.4c0 3.6 0 3.6-1 4.6h-8q.8-11.3 2.5-22.7l.4-2.7.4-2.5q0-1.2.3-2.3c.7-3 1.1-2.8 4.3-2.9m3 12.1-1 7h2v-7zM366 112.9h7.2l2.8.1 2.6 16.1c.9 5.7 1.7 11.2 1.4 16.9h-8l-1-8h-4v3.4c0 3.6 0 3.6-1 4.6h-8q.8-11.3 2.5-22.7l.4-2.7.4-2.5q0-1.2.3-2.3c.7-3 1.1-2.8 4.3-2.9m3 13.1-1 6h2v-6zm182.5 26.8h2.3c2.6.2 4.2.9 6.3 2.2 1.5 3 1 5.7 1 9h-8v-4l-2 1c.2 2 .2 2 1 4 1.8 1 1.8 1 4 1.4 3.8 1.3 3.8 1.3 5.5 3.9 1 5.3 1 9.8-1.5 14.7-2.7 2.7-4.2 2.3-7.9 2.4H549c-2.9-.4-2.9-.4-5.3-2.2-2.5-3.5-1.9-6-1.6-10.2h8v5h3v-6l-1.9-.5-2.5-.8-2.4-.7c-2.2-1-2.2-1-4.2-4-.3-2.3-.3-2.3-.3-5v-2.5c.3-2.7.8-4.3 2.3-6.5 2.8-1 4.6-1.2 7.4-1.2M412 153.9c2 1 2 1 3 3v7h-8v-4h-3c.5 2.6.5 2.6 2 5a41 41 0 0 0 7 3c2.9 3 2.3 5 2.4 9v3.8c-.4 3.3-.4 3.3-2 5.2a16 16 0 0 1-7.9 1.5h-2.8a9 9 0 0 1-6.7-3.4c-.4-2.3-.4-2.3-.3-4.7l.2-2.4.1-2h8v5h3v-6q-1-.1-1.9-.5l-2.5-.8-2.4-.7c-2.2-1-2.2-1-4.2-3-.3-2.6-.3-2.6-.3-5.8v-3.3c.3-2.8.3-2.8 2.3-5.8q7-2.3 14-.1m-71.6 0c1.6 1 1.6 1 2.6 3v9.1h-8v-6h-2v20h2v-6h8l.2 4.8.1 2.7c-.3 2.5-.3 2.5-1.4 4.3-2.7 1.7-4.7 1.6-7.8 1.6h-3.2c-3.6-.5-4.6-1.5-6.9-4.4-.5-2.7-.5-2.7-.5-5.7V167c.1-9.5.1-9.5 3.5-13a20 20 0 0 1 13.4-.1M429 113h15v7h-7v6h6v7h-6v7h7v6h-15zm-97-40h8l.2 12.2v10.1l.1 3.6a9 9 0 0 1-3.3 7.1c-2.6.5-2.6.5-5.5.4h-3c-2.5-.4-2.5-.4-4.3-1.6-1.6-2.4-1.5-4.1-1.4-7v-2.7l.2-2.1h7l1 5zm123 81h19v6h-5v27h-9v-27h-5zm-14 0h9v26h7v7h-16zm4-41h18v7h-5v26h-8v-26h-5zm78 41h18v6h-5v27h-8v-27h-5zm-58-41h9v33h-9z";

/*
 * Two crops of the one path. The wordmark sits outside the mark viewBox and is
 * clipped away by the SVG viewport, so both variants share the same `d` and
 * neither costs a second copy of the geometry.
 *
 * Both boxes are the trace's true content bounds rather than its 591x260
 * canvas: VTracer left uneven margins, and cropping to the ink is what lets
 * `h-9 w-auto` mean the same optical size here as anywhere else.
 */
const VIEW_BOX = {
  mark: "29 27 273 205",
  lockup: "29 27 534 205",
} as const;

type LogoVariant = keyof typeof VIEW_BOX;

/** The artwork on its own, for places that are already a link (or aren't one). */
export function LogoArt({
  variant = "mark",
  className,
}: {
  variant?: LogoVariant;
  className?: string;
}) {
  return (
    <svg
      viewBox={VIEW_BOX[variant]}
      aria-hidden="true"
      focusable="false"
      // w-auto reads the intrinsic ratio off the viewBox, so height is the only
      // dimension any caller has to set.
      className={cn("w-auto", className)}
    >
      <path d={LOGO_PATH} fill="currentColor" />
    </svg>
  );
}

export function Logo({
  className,
  onDark = false,
  variant = "mark",
}: {
  className?: string;
  onDark?: boolean;
  variant?: LogoVariant;
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
        "inline-flex w-fit shrink-0 items-center transition-transform duration-300 ease-out-soft hover:-translate-y-0.5",
        onDark ? "text-white" : "text-brand-black",
        className
      )}
    >
      <LogoArt
        variant={variant}
        // The lockup runs taller because its wordmark is three stacked lines:
        // at the mark's height those lines land near 7px and stop being
        // readable, which is why the header keeps the mark and only the footer,
        // where there is column to spare, gets the full lockup.
        className={variant === "lockup" ? "h-14" : "h-9"}
      />
    </Link>
  );
}
