"use client";

import * as React from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { analyticsConfigured, gaMeasurementId } from "@/lib/analytics";

/**
 * GA4, loaded under Consent Mode v2.
 *
 * Renders nothing at all until NEXT_PUBLIC_GA_MEASUREMENT_ID is set, so the
 * site currently ships with no tag, no cookies and no banner. Wiring it up is
 * one environment variable and a redeploy.
 *
 * Why the defaults are region-scoped rather than a single global "denied":
 *
 * Denying analytics storage everywhere until someone clicks Accept is the
 * European answer to a European law, and applying it to Houston traffic throws
 * away most of the data the reporting is built on — on a site whose entire
 * product is a monthly report about that data. So the defaults say denied for
 * the EEA, the UK and Switzerland, where opt-in consent is the rule, and
 * granted elsewhere. Google does the region matching itself, from the same
 * geo signal it already resolves the hit with, so this needs no IP lookup and
 * no geo header from the edge.
 *
 * Every ad-related signal is denied everywhere and never asked about. JMC runs
 * no paid advertising — it is on the "what JMC doesn't do" list on the About
 * page — so there is no remarketing to consent to, and asking for permission
 * the site has no use for is the kind of thing this site's whole positioning
 * argues against.
 *
 * wait_for_update holds hits briefly so a visitor who accepts within the first
 * half second is not recorded as a denied session, which is what produces the
 * "direct / none" traffic that makes a channel report useless.
 */

const CONSENT_DENIED_REGIONS = [
  // EEA
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IE", "IS", "IT", "LV", "LI", "LT", "LU", "MT", "NL", "NO", "PL",
  "PT", "RO", "SK", "SI", "ES", "SE",
  // Plus the two that kept the same rule after leaving it
  "GB", "CH",
];

/*
 * The URL GA4 has already been told about, held at module scope rather than in
 * a ref.
 *
 * A ref is not enough. React runs an effect setup, cleanup, then setup again
 * under Strict Mode, and the ref survives that — so a "skip the first run"
 * ref flips on the discarded pass and the second pass sends a page_view for
 * the landing the config call has already reported. That double-counts every
 * session's first page, which is the one number that feeds bounce rate and
 * landing-page reports.
 *
 * Starting at null and treating the first effect as "record, do not send" is
 * correct because gtag('config', …, { send_page_view: true }) has already sent
 * exactly one page_view for whatever URL the tag loaded on. Module scope
 * outlives the component, so both Strict Mode passes see the same value —
 * the same reasoning as the `fired` set in ConversionEvent.
 */
let reportedUrl: string | null = null;

export function Analytics() {
  const pathname = usePathname();

  React.useEffect(() => {
    if (!analyticsConfigured) return;

    /*
     * Read off location rather than useSearchParams(). Subscribing to search
     * params from a component this high in the tree opts every page on the
     * site out of static rendering unless it is wrapped in Suspense, and the
     * only thing wanted here is the string in the address bar — which includes
     * ?type=sprint on the thank-you page, the one query this site reports on.
     */
    const url = window.location.pathname + window.location.search;

    // First run: the config call already reported this one.
    if (reportedUrl === null) {
      reportedUrl = url;
      return;
    }
    if (reportedUrl === url) return;
    reportedUrl = url;

    const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void })
      .gtag;
    if (typeof gtag !== "function") return;

    gtag("event", "page_view", {
      page_path: url,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname]);

  if (!analyticsConfigured) return null;

  return (
    <>
      {/*
       * A plain <script>, not next/script, and that is the whole point.
       *
       * next/script injects an inline script from the client after hydration,
       * which puts the consent defaults AFTER gtag.js has loaded and possibly
       * already sent the first hit — the one case Consent Mode exists to
       * prevent. Rendered as ordinary markup it ships inside the HTML and runs
       * the moment the parser reaches it, so the defaults are in dataLayer
       * before the library below is fetched, let alone executed.
       *
       * Everything it does is queue-safe: gtag() only pushes onto an array, so
       * running before the library is loaded is the documented pattern rather
       * than a race.
       */}
      <script
        id="ga-init"
        dangerouslySetInnerHTML={{
          __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  region: ${JSON.stringify(CONSENT_DENIED_REGIONS)},
  wait_for_update: 500
});
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'granted'
});
gtag('js', new Date());
gtag('config', ${JSON.stringify(gaMeasurementId)}, { send_page_view: true });
`.trim(),
        }}
      />
      <Script
        id="ga-tag"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
      />
    </>
  );
}
