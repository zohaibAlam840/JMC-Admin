"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { analyticsConfigured } from "@/lib/analytics";

/**
 * Cookie notice.
 *
 * Shown only when there is something to consent to. With no GA4 Measurement ID
 * the site sets no analytics cookie at all, and a banner asking permission for
 * cookies that do not exist is theatre — the exact thing the rest of this site
 * is built not to do.
 *
 * The choice lives in localStorage rather than a cookie, so recording that
 * someone declined cookies does not itself require setting one.
 *
 * Declining is a real button with the same weight as accepting, not a link
 * hidden under "manage preferences". On a site that sells telling clients the
 * truth about their own data, a dark pattern in the consent banner would be
 * the single most expensive sentence on it.
 *
 * Note what this deliberately does NOT do: it never grants consent on scroll,
 * on navigation, or on a timer. Under Consent Mode the visitor already has a
 * default appropriate to their region (components/analytics/analytics.tsx), so
 * dismissing the banner without choosing leaves that default in place and the
 * banner returns on the next visit.
 */

const STORAGE_KEY = "jmc.cookie-consent";

type Choice = "granted" | "denied";
/** "unknown" is the server's answer, and the only state that renders nothing. */
type State = Choice | "undecided" | "unknown";

/*
 * Read through useSyncExternalStore rather than an effect that calls setState.
 *
 * localStorage does not exist during the server render, so the banner's
 * visibility genuinely differs between server and client and has to be read
 * after hydration. useSyncExternalStore is the API built for exactly that: the
 * server snapshot is "unknown", which renders nothing and therefore matches the
 * HTML, and the client snapshot takes over on hydration without a render pass
 * that React has to throw away.
 */
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function getSnapshot(): State {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "granted" || v === "denied" ? v : "undecided";
  } catch {
    // Private mode, or storage blocked. Treat it as undecided: the regional
    // default still applies, so nobody is tracked against the rule covering
    // them, and the visitor still gets the choice.
    return "undecided";
  }
}

function getServerSnapshot(): State {
  return "unknown";
}

/** Pushes a decision into Consent Mode. No-ops if the tag never loaded. */
function applyConsent(choice: Choice) {
  const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  if (typeof gtag !== "function") return;

  gtag("consent", "update", {
    analytics_storage: choice,
    // Unchanged and unasked. JMC runs no advertising, so there is no version
    // of this banner where these turn on.
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

export function CookieConsent({
  /** Rendered only when the Cookie Policy has a Termageddon key behind it. */
  cookiePolicyHref,
}: {
  cookiePolicyHref?: string;
}) {
  const state = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  /*
   * Re-apply a stored decision on every load. Consent Mode state does not
   * survive a page load, so without this a returning visitor who accepted last
   * week is back on their regional default. This is the effect's proper job —
   * pushing React state out to an external system — rather than the setState
   * the previous version did here.
   */
  React.useEffect(() => {
    if (!analyticsConfigured) return;
    if (state === "granted" || state === "denied") applyConsent(state);
  }, [state]);

  function choose(choice: Choice) {
    try {
      window.localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // Nothing to do. The choice still applies to this page load, it just
      // will not be remembered for the next one.
    }
    applyConsent(choice);
    listeners.forEach((l) => l());
  }

  if (!analyticsConfigured || state !== "undecided") return null;

  return (
    <div
      // Not a dialog and not modal: it takes no focus, traps none, and the page
      // underneath stays fully usable while it is open. A consent notice that
      // blocks the page is a consent notice that gets accepted without reading.
      role="region"
      aria-label="Cookie notice"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white p-4 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] sm:p-5"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-[0.88rem] leading-relaxed text-ink">
          This site uses Google Analytics to count visits and see which pages
          people read. No advertising cookies, and nothing is sold on.{" "}
          {cookiePolicyHref ? (
            <Link
              href={cookiePolicyHref}
              className="font-semibold text-teal-ink underline underline-offset-2"
            >
              Cookie Policy
            </Link>
          ) : null}
        </p>

        <div className="flex shrink-0 gap-2.5">
          <Button size="sm" variant="secondary" onClick={() => choose("denied")}>
            Decline
          </Button>
          <Button size="sm" variant="dark" onClick={() => choose("granted")}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
