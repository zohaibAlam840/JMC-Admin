"use client";

import * as React from "react";

/**
 * Fires a single conversion event, once.
 *
 * Page Spec 13 puts every conversion event on the site on the Thank You page
 * and nowhere else, and requires each to fire once per page load rather than
 * once per render. Three things can cause a double count and all three are
 * handled here:
 *
 * React's development double-invocation of effects, and any re-render caused
 * by a parent, are both handled by the ref — an effect with an empty dependency
 * list still runs twice under Strict Mode.
 *
 * A client-side navigation back onto this page is handled by the key: a fresh
 * mount with the same event and the same tier is the same conversion, and the
 * module-level set outlives the component.
 *
 * With no analytics loaded this does nothing at all. GA4 is a phase 4 item, so
 * the guard is not defensive programming — it is the current state of the site.
 * Wiring GA4 in should require no change here.
 */
const fired = new Set<string>();

type Gtag = (
  command: "event",
  name: string,
  params?: Record<string, string>
) => void;

export function ConversionEvent({
  event,
  tier,
}: {
  event: string;
  /** Carried through from the pricing card that started the enquiry. */
  tier?: string;
}) {
  const sent = React.useRef(false);

  React.useEffect(() => {
    if (sent.current) return;
    sent.current = true;

    const key = tier ? `${event}:${tier}` : event;
    if (fired.has(key)) return;
    fired.add(key);

    const gtag = (window as unknown as { gtag?: Gtag }).gtag;
    if (typeof gtag !== "function") return;

    gtag("event", event, tier ? { tier } : undefined);
  }, [event, tier]);

  return null;
}
