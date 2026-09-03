import type { PageContent } from "@/lib/types";
import { homePage } from "./home";
import { localSeoPage } from "./local-seo";
import { traditionalSeoPage } from "./traditional-seo";
import { realEstateSeoPage } from "./real-estate-seo";
import { seoPackagesPage } from "./monthly-seo-packages";
import { launchSprintsPage } from "./launch-sprints";
import { aboutPage } from "./about";
import { resourcesPage } from "./resources";
import { linksPage } from "./links";
import { seoReportingPage } from "./seo-reporting";
import { gbpOptimizationPage } from "./gbp-optimization";
import { industriesIndexPage, industryPages } from "./industries";

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
  linksPage,
  seoReportingPage,
  gbpOptimizationPage,
  industriesIndexPage,
  ...industryPages,
];

/** Pages that emit Service structured data. */
export const servicePageSlugs = new Set([
  "/local-seo-services",
  "/traditional-seo-services",
  "/real-estate-seo",
  "/google-business-profile-optimization",
]);

/*
 * Deliberately absent from the set above: /seo-reporting and every industry
 * page. Page Specs 05 and 09 both forbid Service schema on them, because one
 * describes a method and the others describe an audience. Neither is something
 * you can buy, and marking them up as a service would claim otherwise.
 */

/**
 * Pages that seed as drafts rather than live.
 *
 * The link hub carries placeholder social addresses until Wendell confirms the
 * real ones, and the Master Brief forbids placeholder content on a live page.
 *
 * Real Estate SEO is cut from scope by Page Spec 01 §2. Unpublished rather than
 * deleted: the cut comes from a Decisions Record we have only seen quoted, and
 * the page plus its two packages come straight back if that changes.
 */
export const draftPageSlugs = new Set(["/links", "/real-estate-seo"]);

/** Pages whose route is hand-built, so the slug must never change. */
export const systemPageSlugs = new Set(["/", "/links"]);

const bySlug = new Map(filePages.map((p) => [p.slug, p]));

export function getFilePage(slug: string): PageContent | undefined {
  return bySlug.get(slug);
}
