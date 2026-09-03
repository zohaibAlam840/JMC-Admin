import { filePages, draftPageSlugs } from "../content/pages";
import { packages } from "../content/packages";
import { footerNav, mainNav } from "../content/site";
import type { Section } from "../lib/types";

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

  if (draftPageSlugs.has(path)) {
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
