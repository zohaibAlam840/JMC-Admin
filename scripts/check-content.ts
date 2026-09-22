import { filePages, draftPageSlugs } from "../content/pages";
import { packages } from "../content/packages";
import { footerNav, mainNav } from "../content/site";
import { APPROVED_CTAS, RETIRED_CTAS } from "../lib/cta-library";
import type { CTA, Section } from "../lib/types";

/**
 * Content QA. Catches the mistakes that only show up as a 404 in production.
 *
 *   npm run check
 *
 * Four checks, each of which has actually gone wrong on this project:
 *
 *  1. Dead internal links. A page renamed without its inbound links moving is
 *     the single most likely regression here, and /seo-packages proved it.
 *  2. Anchors pointing at a section that no longer exists on the target page.
 *  3. Meta titles over 60 characters and descriptions outside 150 to 160,
 *     which the build specs fix and which nothing else enforces.
 *  4. Links into a page that seeds as a draft, which 404s in production while
 *     working perfectly on localhost.
 *
 * Exits non-zero on a failure so it can gate a deploy later.
 */

/** Routes that exist as folders rather than as content pages. */
const HAND_BUILT = new Set(["/contact", "/thank-you", "/resources"]);

const bySlug = new Map(filePages.map((p) => [p.slug, p]));
const problems: string[] = [];
const warnings: string[] = [];

/** Every section id on a page, so an anchor can be checked against it. */
function anchors(slug: string): Set<string> {
  const page = bySlug.get(slug);
  return new Set((page?.sections ?? []).map((s) => s.id));
}

/** Walks a section and yields every href it carries, at any depth. */
function hrefsIn(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(hrefsIn);
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, v]) =>
      key === "href" && typeof v === "string" ? [v] : hrefsIn(v)
    );
  }
  return [];
}

/** Set while walking a draft page, so draft-to-draft links stay quiet. */
let fromDraftPage = false;

function checkHref(raw: string, where: string) {
  if (!raw.startsWith("/") && !raw.startsWith("#")) return; // external or tel:
  // A query string is lead attribution, not part of the route.
  const href = raw.split("?")[0];
  const [path, hash] = href.split("#");

  if (path === "") {
    // A bare "#anchor" is same-page, checked by the caller's own page.
    return;
  }

  if (!bySlug.has(path) && !HAND_BUILT.has(path)) {
    problems.push(`${where}: no page at ${path}`);
    return;
  }

  // A draft linking to a draft is fine: neither is reachable, and both
  // publish together or not at all.
  if (draftPageSlugs.has(path) && !fromDraftPage) {
    problems.push(
      `${where}: links to ${path}, which seeds as a draft and 404s in production`
    );
  }

  if (hash && bySlug.has(path) && !anchors(path).has(hash)) {
    problems.push(`${where}: ${path} has no section "#${hash}"`);
  }
}

/* ------------------------------------------------------------ page links -- */

for (const page of filePages) {
  const own = anchors(page.slug);
  fromDraftPage = draftPageSlugs.has(page.slug);

  for (const section of page.sections) {
    for (const href of hrefsIn(section as unknown as Section)) {
      if (href.startsWith("#")) {
        const id = href.slice(1);
        if (!own.has(id)) {
          problems.push(
            `${page.slug} §${section.id}: no section "#${id}" on this page`
          );
        }
        continue;
      }
      checkHref(href, `${page.slug} §${section.id}`);
    }
  }
}

fromDraftPage = false;

/* ---------------------------------------------------------- CTA library -- */

/**
 * Every CTA on the site has to be one of the approved labels — Decisions
 * Record §9. Forty labels for a dozen actions is what that library exists to
 * stop, and a rule nothing enforces drifts back within a month.
 */
const approved = new Set<string>(APPROVED_CTAS);

/** Pulls every CTA object out of a section, at any depth. */
function ctasIn(value: unknown): CTA[] {
  if (Array.isArray(value)) return value.flatMap(ctasIn);
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return Object.entries(record).flatMap(([key, v]) => {
      const isCta =
        /^(cta|primaryCta|secondaryCta)$/.test(key) &&
        v !== null &&
        typeof v === "object" &&
        typeof (v as CTA).label === "string";
      return isCta ? [v as CTA, ...ctasIn(v)] : ctasIn(v);
    });
  }
  return [];
}

for (const page of filePages) {
  /*
   * Unpublished pages are exempt. Real Estate SEO is cut from scope and its
   * CTAs were retired with it; the link hub is a profile page, not part of the
   * governed site. Rewriting copy on a page nobody can reach would be work
   * spent to quiet a checker.
   */
  if (draftPageSlugs.has(page.slug) && page.slug !== "/resources") continue;

  for (const section of page.sections) {
    for (const cta of ctasIn(section)) {
      if (approved.has(cta.label)) continue;
      const instead = RETIRED_CTAS[cta.label];
      problems.push(
        `${page.slug} §${section.id}: CTA "${cta.label}" is not in the library` +
          (instead ? `. Use "${instead}"` : "")
      );
    }
  }
}

for (const pkg of packages) {
  if (!approved.has(pkg.cta.label)) {
    const instead = RETIRED_CTAS[pkg.cta.label];
    problems.push(
      `package ${pkg.id}: CTA "${pkg.cta.label}" is not in the library` +
        (instead ? `. Use "${instead}"` : "")
    );
  }
}

/* ------------------------------------------------------ menus and prices -- */

for (const item of mainNav) {
  checkHref(item.href, "main nav");
  for (const child of item.children ?? []) checkHref(child.href, "main nav");
}
for (const group of footerNav) {
  for (const link of group.links) checkHref(link.href, `footer / ${group.heading}`);
}
for (const pkg of packages) {
  // Query strings are attribution, not routes. Strip before resolving.
  checkHref(pkg.cta.href, `package ${pkg.id}`);
}

/* ---------------------------------------------------------------- metadata -- */

for (const page of filePages) {
  if (page.seoTitle.length > 60) {
    problems.push(
      `${page.slug}: title is ${page.seoTitle.length} chars, over the 60 limit`
    );
  }
  const n = page.metaDescription.length;
  if (n < 150 || n > 160) {
    warnings.push(`${page.slug}: description is ${n} chars, outside 150 to 160`);
  }
}

/* ------------------------------------------------------- one H1 per page -- */

for (const page of filePages) {
  const heroes = page.sections.filter(
    (s) => s.type === "heroSplit" || s.type === "heroCentered"
  );
  if (heroes.length === 0 && page.slug !== "/links") {
    warnings.push(`${page.slug}: no hero, so the page has no H1`);
  }
  if (heroes.length > 1) {
    problems.push(`${page.slug}: ${heroes.length} heroes, so more than one H1`);
  }
}

/* ------------------------------------------------------------------ report -- */

const pageCount = filePages.length;
const sectionCount = filePages.reduce((n, p) => n + p.sections.length, 0);
console.log(`Checked ${pageCount} pages, ${sectionCount} sections.`);

if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`);
  for (const w of warnings) console.log(`  ~ ${w}`);
}

if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  for (const p of problems) console.log(`  x ${p}`);
  process.exit(1);
}

console.log("\nNo broken links, no oversized titles, one H1 per page.");
