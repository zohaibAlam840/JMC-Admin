import { RouteProgress } from "@/components/layout/route-progress";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Analytics } from "@/components/analytics/analytics";
import { CookieConsent } from "@/components/analytics/cookie-consent";
import { getSiteConfig } from "@/lib/content";
import { publishedPolicies } from "@/lib/legal";

/**
 * The public site's chrome.
 *
 * Lives in its own component rather than in the root layout because /admin
 * shares the root layout (fonts, tokens) but must not inherit the marketing
 * header, footer, or intro loader. It is also reused by the global 404, which
 * Next renders against the root layout and would otherwise show unstyled.
 *
 * Navigation and contact details are read here once per request and handed down
 * as props, so the client can rename a nav item in /admin without a deploy.
 *
 * The intro loader and the scroll-progress bar were removed with the rest of
 * the motion work: Build Spec §4 allows movement on hover and on the accordion,
 * and nothing else. The route progress bar below is not a reversal of that. It
 * is navigation feedback, in the same family as the spinner on the enquiry
 * form, and no page content moves because of it.
 */
export async function SiteChrome({ children }: { children: React.ReactNode }) {
  const { site, primaryCta, mainNav, footerNav } = await getSiteConfig();

  /*
   * Same rule the footer's legal links follow: a policy with no Termageddon
   * key behind it is a 404, and pointing a consent banner at a 404 cookie
   * policy is worse than pointing at nothing.
   */
  const cookiePolicy = publishedPolicies().find(
    (p) => p.slug === "/cookie-policy"
  );

  return (
    <>
      <RouteProgress />
      <SiteHeader nav={mainNav} primaryCta={primaryCta} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter site={site} nav={footerNav} />
      {/*
       * Analytics hangs off the public chrome rather than the root layout, so
       * /admin is outside it. That is deliberate and not just tidiness: the
       * client is the heaviest user of his own site, and counting his sessions
       * in the numbers his monthly recap reports would corrupt the one metric
       * the whole service is sold on. Both render nothing without a GA4
       * Measurement ID.
       */}
      <Analytics />
      <CookieConsent cookiePolicyHref={cookiePolicy?.slug} />
    </>
  );
}
