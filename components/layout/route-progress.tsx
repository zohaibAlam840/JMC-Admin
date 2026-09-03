"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

/**
 * A thin bar across the top of the window while a page is being navigated to.
 *
 * Most of this site is static and prefetched, so a click usually swaps the
 * page in the same frame. That speed is the problem this solves rather than a
 * reason not to: the eight industry pages share a layout, and moving between
 * two of them with no feedback at all reads as a click that did nothing. The
 * bar is the confirmation that the address changed.
 *
 * Deliberately not an entrance animation. Build Spec §4 allows movement on
 * hover and on the accordion and nothing else, and it means the content: this
 * is interface feedback in the same family as the spinner already on the
 * enquiry form, and no page content moves because of it.
 *
 * Started from a click rather than from a router event, because the App Router
 * exposes pending state per Link and this has to cover every link on the page
 * including the ones inside cards. Finished when the new path is on screen,
 * held to a floor so an instant navigation still registers as one.
 */
const MINIMUM_VISIBLE_MS = 420;

export function RouteProgress() {
  const pathname = usePathname();
  const [state, setState] = React.useState<"idle" | "running" | "done">("idle");
  const startedAt = React.useRef(0);
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

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
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) {
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
      setState("running");
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      clearTimers();
    };
  }, []);

  // The new page is on screen. Fill the bar, then take it away — but not
  // before it has been visible long enough to have been seen.
  React.useEffect(() => {
    if (state !== "running") return;

    const elapsed = Date.now() - startedAt.current;
    const wait = Math.max(0, MINIMUM_VISIBLE_MS - elapsed);

    timers.current.push(
      setTimeout(() => {
        setState("done");
        timers.current.push(setTimeout(() => setState("idle"), 260));
      }, wait)
    );

    return clearTimers;
    // Intentionally keyed on the path: this is what "the navigation finished"
    // looks like from here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (state === "idle") return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"
    >
      <div
        className="route-progress-bar gradient-brand h-full origin-left"
        data-state={state}
      />
    </div>
  );
}
