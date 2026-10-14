"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * Navigation feedback: a bar across the top, and a skeleton over the content.
 *
 * Both are CLIENT-SIDE ONLY, and that is the whole design constraint rather
 * than a stylistic choice. The obvious way to do a skeleton in the App Router
 * is a loading.tsx beside the layout, and this site cannot have one: a
 * loading.tsx is a Suspense fallback, rendering it starts the response body,
 * and once streaming begins `notFound()` can no longer set a status. That bug
 * shipped once already and made every unmatched URL on the site answer 200
 * with the 404 page in it. See the comment in app/(site)/layout.tsx. Anything
 * that runs after hydration cannot touch the response status, so this is the
 * safe place for it.
 *
 * Started from a click rather than a router event, because the App Router
 * exposes pending state per Link and this has to cover every link on the page
 * including the ones inside cards. Finished when the new path is on screen.
 */

const MINIMUM_VISIBLE_MS = 420;

type Phase = "idle" | "running" | "done";

/**
 * True from a same-origin link click until the new path has rendered.
 *
 * Both consumers below run their own listener. That is deliberate: sharing
 * one through context would mean a provider wrapping the tree for two pieces
 * of chrome, and a capture-phase click listener costs nothing.
 */
function useNavigationPhase(minimumVisibleMs: number) {
  const pathname = usePathname();
  const [phase, setPhase] = React.useState<Phase>("idle");
  const startedAt = React.useRef(0);
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = React.useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  React.useEffect(() => {
    function onClick(event: MouseEvent) {
      // Anything that is not a plain left click is the browser's business:
      // modifier clicks open tabs and never navigate this document.
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (
        !anchor ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download")
      ) {
        return;
      }

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      // Off-site links hand over to the browser's own loading indicator, and a
      // link to the current page is a jump to an anchor, not a navigation.
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;

      clearTimers();
      startedAt.current = Date.now();
      setPhase("running");
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      clearTimers();
    };
  }, [clearTimers]);

  // The new page is on screen. Finish — but not before it has been visible
  // long enough to have been seen.
  React.useEffect(() => {
    if (phase !== "running") return;

    const elapsed = Date.now() - startedAt.current;
    const wait = Math.max(0, minimumVisibleMs - elapsed);

    timers.current.push(
      setTimeout(() => {
        setPhase("done");
        timers.current.push(setTimeout(() => setPhase("idle"), 260));
      }, wait)
    );

    return clearTimers;
    // Intentionally keyed on the path: this is what "the navigation finished"
    // looks like from here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return phase;
}

export function RouteProgress() {
  const phase = useNavigationPhase(MINIMUM_VISIBLE_MS);
  if (phase === "idle") return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"
    >
      <div
        className="route-progress-bar gradient-brand h-full origin-left"
        data-state={phase}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Bar({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "block h-3 rounded-full bg-line/70",
        // motion-safe, so the blocks hold still for anyone who has asked the
        // operating system to reduce motion. The skeleton still shows.
        "motion-safe:animate-pulse",
        className
      )}
    />
  );
}

/**
 * A skeleton of the page shape, over the content while a navigation runs.
 *
 * Asked for in review, and the reason is worth recording because it is not
 * the usual one. This site is almost entirely static and prefetched, so a
 * click normally swaps the page inside a frame. That speed is the problem:
 * the eight industry pages share a layout, so moving between two of them
 * changes a heading and some body copy and nothing else, and it reads as a
 * click that did nothing. The thin progress bar was the first attempt at
 * this and is too easy to miss.
 *
 * The honest trade: this shows for a fixed ~360ms even when the page is
 * already in memory, so it is adding perceived latency to a site that does
 * not have any. That is a real cost, accepted deliberately in exchange for
 * the navigation being unmistakable. If it starts to feel slow, the floor is
 * the number to lower, and removing the component is a one-line change in
 * site-chrome.
 *
 * Under prefers-reduced-motion the blocks stop pulsing but the skeleton
 * still appears — the point is the page changing, not the animation, and
 * somebody who turns motion down still needs to know their click landed.
 */
const SKELETON_VISIBLE_MS = 360;

export function RouteSkeleton() {
  const phase = useNavigationPhase(SKELETON_VISIBLE_MS);
  if (phase === "idle") return null;

  return (
    <div
      // Not a live region and not announced: screen readers already get the
      // new page on navigation, and narrating a decorative placeholder would
      // be noise on top of that.
      aria-hidden="true"
      // A plain hook to assert on. The Tailwind classes here are all escaped
      // (`motion-safe:`), which makes them miserable to select from a test.
      data-route-skeleton=""
      className={cn(
        // Starts below the 72px header, so the chrome stays put and only the
        // part of the screen that is actually changing is covered.
        "pointer-events-none fixed inset-x-0 bottom-0 top-[72px] z-40 bg-white",
        "transition-opacity duration-200",
        phase === "done" ? "opacity-0" : "opacity-100"
      )}
    >
      <div className="mx-auto w-full max-w-[1200px] px-6 py-12 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Hero copy: eyebrow, two heading lines, three body lines, buttons. */}
          <div className="flex flex-col gap-5">
            <Bar className="h-2.5 w-32" />
            <div className="flex flex-col gap-3">
              <Bar className="h-9 w-full" />
              <Bar className="h-9 w-4/5" />
            </div>
            <div className="mt-2 flex flex-col gap-2.5">
              <Bar className="h-3 w-full" />
              <Bar className="h-3 w-11/12" />
              <Bar className="h-3 w-3/4" />
            </div>
            <div className="mt-4 flex gap-3">
              <Bar className="h-12 w-48 rounded-md" />
              <Bar className="h-12 w-44 rounded-md" />
            </div>
          </div>

          {/* The hero panel on the right, which every page in this layout has. */}
          <div className="hidden rounded-bento border border-line p-6 lg:block">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div className="flex flex-col gap-2">
                <Bar className="h-2.5 w-24" />
                <Bar className="h-4 w-36" />
              </div>
              <Bar className="h-2 w-10" />
            </div>
            <div className="flex flex-col gap-4 pt-5">
              {["w-40", "w-52", "w-44", "w-48"].map((w) => (
                <Bar key={w} className={cn("h-3", w)} />
              ))}
            </div>
            <div className="mt-6 border-t border-line pt-5">
              <Bar className="h-20 rounded-card" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
