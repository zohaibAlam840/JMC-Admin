import { NotFoundBody } from "@/components/blocks/not-found-body";
import { SiteChrome } from "@/components/layout/site-chrome";

/**
 * The root 404, for a URL that matches no segment at all.
 *
 * Next renders this against the root layout, which carries no chrome, so it
 * pulls the header and footer in itself — a visitor who has landed on a dead
 * URL needs the full nav more than anyone.
 *
 * Most real 404s on this site do not come through here. Every marketing URL
 * matches the catch-all under (site), so `notFound()` there hits
 * app/(site)/not-found.tsx, which is already inside the (site) chrome.
 *
 * It returns a real 404 status because it is the `not-found` convention rather
 * than a route that renders a message with a 200. A "not found" page returning
 * 200 is a soft 404 and gets indexed, and the redirect map's global rules rule
 * out the other common shortcut — a blanket redirect to the homepage, which
 * Google also reads as a soft 404.
 */
export default function NotFound() {
  return (
    <SiteChrome>
      <NotFoundBody />
    </SiteChrome>
  );
}
