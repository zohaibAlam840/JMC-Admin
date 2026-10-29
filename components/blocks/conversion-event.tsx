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
 * React's development double-invocation of effects and parent re-renders are
 * handled by the ref.
 *
 * A client-side navigation back onto this page is handled by the committed lead
 * id: a fresh mount for the same stored lead is still the same conversion. The
 * module-level set and session storage both outlive the component.
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
  conversionId,
  event,
  tier,
}: {
  /** The committed lead id, supplied only after the signed marker verifies. */
  conversionId: string;
  event: string;
  /** Carried through from the pricing card that started the inquiry. */
  tier?: string;
}) {
  const sent = React.useRef(false);

  React.useEffect(() => {
    if (sent.current) return;
    sent.current = true;

    const key = `jmc-conversion:${conversionId}`;
    if (fired.has(key)) return;

    try {
      if (window.sessionStorage.getItem(key)) return;
    } catch {
      // Storage can be unavailable in privacy modes; the in-memory guard still
      // prevents Strict Mode and client-navigation duplicates.
    }

    const gtag = (window as unknown as { gtag?: Gtag }).gtag;
    if (typeof gtag !== "function") return;

    fired.add(key);
    try {
      window.sessionStorage.setItem(key, "1");
    } catch {
      // See the storage note above.
    }

    gtag("event", event, tier ? { tier } : undefined);
  }, [conversionId, event, tier]);

  return null;
}
