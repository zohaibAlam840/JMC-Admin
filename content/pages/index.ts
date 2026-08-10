import type { PageContent } from "@/lib/types";
import { homePage } from "./home";
import { localSeoPage } from "./local-seo";
import { traditionalSeoPage } from "./traditional-seo";
import { realEstateSeoPage } from "./real-estate-seo";
import { seoPackagesPage } from "./seo-packages";
import { launchSprintsPage } from "./launch-sprints";
import { aboutPage } from "./about";
import { resourcesPage } from "./resources";

/**
 * The launch content, as approved.
 *
 * Two jobs now that the site is database-driven:
 *  1. It seeds Postgres — /admin/setup imports these objects on first run.
 *  2. It is the fallback. If Supabase is unconfigured or unreachable, the site
 *     renders from here instead of erroring, so the marketing site cannot be
 *     taken down by a database outage.
 *
 * Once content has been seeded, edits happen in /admin and these files stop
 * being the source of truth. They are kept as the known-good baseline.
 */
export const filePages: PageContent[] = [
  homePage,
  localSeoPage,
  traditionalSeoPage,
  realEstateSeoPage,
  seoPackagesPage,
  launchSprintsPage,
  aboutPage,
  resourcesPage,
];

/** Pages that emit Service structured data. */
export const servicePageSlugs = new Set([
  "/local-seo-services",
  "/traditional-seo-services",
  "/real-estate-seo",
]);

/** Pages whose route is hand-built, so the slug must never change. */
export const systemPageSlugs = new Set(["/"]);

const bySlug = new Map(filePages.map((p) => [p.slug, p]));

export function getFilePage(slug: string): PageContent | undefined {
  return bySlug.get(slug);
}
