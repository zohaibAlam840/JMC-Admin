import { NotFoundBody } from "@/components/blocks/not-found-body";

/**
 * The 404 for the marketing site.
 *
 * This is the one that actually runs for almost every dead URL: the catch-all
 * at (site)/[...slug] matches any path, so an unknown address reaches
 * `notFound()` inside this segment rather than falling through to the root
 * boundary.
 *
 * No SiteChrome here. The (site) layout has already rendered the header and
 * footer around this, and wrapping it again printed both twice.
 */
export default function NotFound() {
  return <NotFoundBody />;
}
