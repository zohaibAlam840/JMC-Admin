import { SiteChrome } from "@/components/layout/site-chrome";

/**
 * There is deliberately no loading.tsx beside this file, and that is a
 * decision rather than an omission.
 *
 * A loading.tsx is a Suspense fallback, and rendering one starts the response
 * body. Once streaming has begun the headers are already sent, so `notFound()`
 * further down can no longer set a status: every unmatched URL on the site was
 * answering 200 with the 404 page in the body. Page Spec 15 rules that out in
 * as many words, because Google reads a 200 "not found" as a soft 404, and the
 * redirect map's global rules require a real 404 for the same reason.
 *
 * The skeleton it replaced was there to stop a slow navigation looking like a
 * dead link. That job now belongs to the route progress bar in the header,
 * which does it without touching the response status.
 *
 * If a loading state is ever wanted back on a specific page, it belongs on
 * that page in a <Suspense> around the slow part, not on the segment that
 * every URL passes through.
 */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return <SiteChrome>{children}</SiteChrome>;
}
