import { RouteProgress } from "@/components/layout/route-progress";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getSiteConfig } from "@/lib/content";

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

  return (
    <>
      <RouteProgress />
      <SiteHeader nav={mainNav} primaryCta={primaryCta} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter site={site} nav={footerNav} />
    </>
  );
}
