import { randomUUID } from "node:crypto";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  draftPageSlugs,
  filePages,
  servicePageSlugs,
  systemPageSlugs,
} from "../content/pages";
import { packages } from "../content/packages";
import { footerNav, mainNav } from "../content/site";

/**
 * Writes supabase/apply-page-specs-02-09.sql.
 *
 * The seed file is a reset: it replaces every page, and re-running it after
 * the client has started editing throws their work away. Once a database is
 * live, a structural change needs something narrower, so this emits the same
 * SQL as the seed but only for the pages the new specs actually rebuild, plus
 * the packages, menus and redirects those pages depend on.
 *
 * Generated from the same content files as seed.sql so the two cannot drift.
 *
 *   npm run sql:apply
 */

/** Postgres string literal. Doubling the quote is the whole escape rule. */
function lit(value: string | null | undefined): string {
  if (value === null || value === undefined) return "NULL";
  return `'${value.replace(/'/g, "''")}'`;
}

function jsonb(value: unknown): string {
  return `${lit(JSON.stringify(value))}::jsonb`;
}

function textArray(values: string[]): string {
  if (values.length === 0) return "'{}'::text[]";
  return `ARRAY[${values.map(lit).join(", ")}]::text[]`;
}

/**
 * The pages the new specs rebuild or introduce.
 *
 * The homepage is not here on purpose: Page Spec 01 already has its own
 * installer, and the only change to it since is the industry card links, which
 * this file would otherwise overwrite with everything else on the page.
 */
const SLUGS = [
  "/local-seo-services",
  "/traditional-seo-services",
  "/monthly-seo-packages",
  "/launch-sprints",
  "/google-business-profile-optimization",
  "/seo-reporting",
  "/industries",
  ...filePages
    .map((p) => p.slug)
    .filter((s) => s.startsWith("/industries/")),
];

const pages = SLUGS.map((slug) => {
  const page = filePages.find((p) => p.slug === slug);
  if (!page) throw new Error(`No content file for ${slug}`);
  return page;
});

const REDIRECTS: [string, string][] = [
  ["/seo-packages", "/monthly-seo-packages"],
  ["/seo-packages-pricing", "/monthly-seo-packages"],
  ["/free-website-audit", "/google-business-profile-optimization"],
  ["/local-seo-service", "/local-seo-services"],
];

const out: string[] = [];
const w = (line = "") => out.push(line);

w("-- ==========================================================================");
w("--  JMC — apply Page Specs 02 to 09 to an EXISTING database");
w("--");
w("--  GENERATED FILE. Do not hand-edit — run `npm run sql:apply` instead.");
w("--");
w("--  Run these FIRST, each in its own separate run, and let each finish:");
w("--");
w("--      supabase/migrations/008_page_specs_02_09.sql");
w("--      supabase/migrations/009_package_positioning.sql");
w("--");
w("--  Postgres will not use a newly added enum value in the same transaction");
w("--  that added it, so 008 cannot be pasted together with this file.");
w("--");
w("--  What this does");
w("--  --------------");
w("--  Rebuilds these pages to their specs and creates the ones that are new:");
w("--");
for (const page of pages) w(`--      ${page.slug.padEnd(46)} ${page.label}`);
w("--");
w("--  It also:");
w("--");
w("--    - refreshes the packages, both menus, and the legacy redirects, since");
w("--      /seo-packages is renamed to /monthly-seo-packages and every link to");
w("--      it moved with it;");
w("--    - updates six homepage sections and one on About, which is all that");
w("--      changed on those two pages;");
w("--    - retunes every page title and description to the Build Spec lengths;");
w("--    - unpublishes Real Estate SEO and hides its two tiers, which Page");
w("--      Spec 01 §2 cuts from scope.");
w("--");
w("--  Sections on the rebuilt pages are REPLACED wholesale. Any edit made to");
w("--  one of them in /admin is overwritten. Copy on the homepage and About,");
w("--  outside the sections named above, is left alone, as are articles and");
w("--  enquiries.");
w("--");
w("--  Safe to run more than once.");
w("-- ==========================================================================");
w();
w("begin;");
w();

/* ------------------------------------------------------------------ pages -- */

w("-- ------------------------------------------------------------- pages ----");
w("-- Position is left alone on update: the client may have reordered the page");
w("-- list in /admin, and this file has no business undoing that.");
for (const page of pages) {
  const index = filePages.indexOf(page);
  w(
    `insert into public.pages (slug, label, seo_title, meta_description, published, is_service, system, position) values (` +
      `${lit(page.slug)}, ${lit(page.label)}, ${lit(page.seoTitle)}, ${lit(page.metaDescription)}, ` +
      `${!draftPageSlugs.has(page.slug)}, ${servicePageSlugs.has(page.slug)}, ${systemPageSlugs.has(page.slug)}, ${index})`
  );
  w("on conflict (slug) do update set");
  w("  label = excluded.label,");
  w("  seo_title = excluded.seo_title,");
  w("  meta_description = excluded.meta_description,");
  w("  is_service = excluded.is_service,");
  w("  system = excluded.system;");
  w();
}

/*
 * The rename. /seo-packages and /monthly-seo-packages would otherwise both
 * exist, one of them stale, and the sitemap would carry both.
 */
w("-- The renamed page. Its sections are rebuilt below under the new address,");
w("-- so the old row is removed rather than left behind as a duplicate.");
w("delete from public.pages where slug = '/seo-packages';");
w();

/* --------------------------------------------------------------- sections -- */

w("-- ---------------------------------------------------------- sections ----");
w("-- Replaced rather than merged: a section dropped by the new spec should");
w("-- disappear here too, not linger as an orphan.");
w(
  `delete from public.sections where page_id in (select id from public.pages where slug in (${pages
    .map((p) => lit(p.slug))
    .join(", ")}));`
);
w();

for (const page of pages) {
  w(`-- ${page.label}`);
  for (const [position, section] of page.sections.entries()) {
    const { id, type, tone, ...data } = section as typeof section & {
      tone?: "white" | "surface";
    };
    w(
      `insert into public.sections (page_id, key, type, tone, data, position) ` +
        `select id, ${lit(id)}, ${lit(type)}, ${lit(tone ?? null)}, ${jsonb(data)}, ${position} ` +
        `from public.pages where slug = ${lit(page.slug)};`
    );
  }
  w();
}

/* --------------------------------------------------------------- packages -- */

w("-- ---------------------------------------------------------- packages ----");
w("-- Upserted, not deleted and rebuilt: a tier hidden or repriced in /admin");
w("-- keeps its row, and only the fields below are refreshed.");
packages.forEach((pkg, position) => {
  w(
    `insert into public.packages (id, group_key, name, price, price_unit, onboarding_fee, term, positioning, timeline, best_fit, deliverables, cta_label, cta_href, featured, visible, pricing_pending, position) values (`
  );
  w(
    `  ${lit(pkg.id)}, ${lit(pkg.group)}, ${lit(pkg.name)}, ${lit(pkg.price)}, ` +
      `${lit(pkg.priceUnit ?? null)}, ${lit(pkg.onboardingFee ?? null)}, ` +
      `${lit(pkg.term ?? null)}, ${lit(pkg.positioning ?? null)}, ${lit(pkg.timeline ?? null)},`
  );
  w(`  ${lit(pkg.bestFit)}, ${textArray(pkg.deliverables)},`);
  w(
    `  ${lit(pkg.cta.label)}, ${lit(pkg.cta.href)}, ${Boolean(pkg.featured)}, ` +
      `${pkg.visible !== false}, ${Boolean(pkg.pricingPending)}, ${position})`
  );
  w("on conflict (id) do update set");
  w("  name = excluded.name, price = excluded.price,");
  w("  price_unit = excluded.price_unit, onboarding_fee = excluded.onboarding_fee,");
  w("  term = excluded.term, positioning = excluded.positioning,");
  w("  timeline = excluded.timeline, best_fit = excluded.best_fit,");
  w("  deliverables = excluded.deliverables,");
  w("  cta_label = excluded.cta_label, cta_href = excluded.cta_href,");
  w("  featured = excluded.featured;");
  w();
});

/* ------------------------------------------------------------------- menus -- */

w("-- ------------------------------------------------------------- menus ----");
w("-- Rebuilt wholesale. Every industry item and the Pricing dropdown changed");
w("-- address, so a merge would leave half the menu pointing at dead URLs.");
w("delete from public.nav_items;");
w();

mainNav.forEach((item, i) => {
  const id = randomUUID();
  w(
    `insert into public.nav_items (id, location, parent_id, label, href, position) values ` +
      `(${lit(id)}, 'main', null, ${lit(item.label)}, ${lit(item.href)}, ${i});`
  );
  item.children?.forEach((child, ci) => {
    w(
      `insert into public.nav_items (id, location, parent_id, label, href, position) values ` +
        `(${lit(randomUUID())}, 'main', ${lit(id)}, ${lit(child.label)}, ${lit(child.href)}, ${ci});`
    );
  });
  w();
});

footerNav.forEach((group, i) => {
  const id = randomUUID();
  w(
    `insert into public.nav_items (id, location, parent_id, label, href, position) values ` +
      `(${lit(id)}, 'footer', null, ${lit(group.heading)}, '', ${i});`
  );
  group.links.forEach((link, li) => {
    w(
      `insert into public.nav_items (id, location, parent_id, label, href, position) values ` +
        `(${lit(randomUUID())}, 'footer', ${lit(id)}, ${lit(link.label)}, ${lit(link.href)}, ${li});`
    );
  });
  w();
});

/* ---------------------------------------------------------- homepage bits -- */

/*
 * Four homepage sections changed address, and nothing else on it did.
 *
 * The homepage is not rebuilt wholesale here on purpose: Page Spec 01 has its
 * own installer and the client may have edited copy since. These four are
 * updated in place instead, so a link that now has a real destination stops
 * pointing at an anchor on the homepage itself.
 */
const HOME_SECTIONS = [
  "hero",           // "See How JMC Reports SEO Progress" now has a page
  "growth-paths",   // Real Estate card removed, so this is two cards now
  "transparency",   // same CTA as the hero, same reason
  "services",       // its CTA moved off the industries hub
  "industries",     // eight cards now point at eight industry pages
  "monthly-recap",  // same CTA again
];

w("-- ------------------------------------------------------ homepage links ----");
w("-- Only the four sections whose destinations changed. The rest of the");
w("-- homepage, including any copy edited in /admin, is left alone.");
const home = filePages.find((p) => p.slug === "/");
if (!home) throw new Error("No homepage in content/pages");
for (const key of HOME_SECTIONS) {
  const section = home.sections.find((s) => s.id === key);
  if (!section) throw new Error(`Homepage has no "${key}" section`);
  const { id, type, tone, ...data } = section as typeof section & {
    tone?: "white" | "surface";
  };
  void id;
  void type;
  void tone;
  w(
    `update public.sections set data = ${jsonb(data)} ` +
      `where key = ${lit(key)} and page_id = (select id from public.pages where slug = '/');`
  );
}
w();

/* ---------------------------------------------------------- about page -- */

/*
 * One section, for the same reason as the homepage: About is not rebuilt by
 * any of the new specs, but its service-lane grid carried a Real Estate card
 * that is about to point at an unpublished page.
 */
w("-- --------------------------------------------------------- about page ----");
const about = filePages.find((p) => p.slug === "/about");
const specialties = about?.sections.find((s) => s.id === "specialties");
if (about && specialties) {
  const { id, type, tone, ...data } = specialties as typeof specialties & {
    tone?: "white" | "surface";
  };
  void id;
  void type;
  void tone;
  w(
    `update public.sections set data = ${jsonb(data)} ` +
      `where key = 'specialties' and page_id = (select id from public.pages where slug = '/about');`
  );
}
w();

/* ------------------------------------------------------------ page meta -- */

w("-- ---------------------------------------------------------- page meta ----");
w("-- Titles and descriptions only, on every page. Sections are untouched here,");
w("-- so this cannot disturb copy edited in /admin. Descriptions are retuned to");
w("-- the 150 to 160 characters Build Spec §14 asks for.");
for (const page of filePages) {
  w(
    `update public.pages set seo_title = ${lit(page.seoTitle)}, ` +
      `meta_description = ${lit(page.metaDescription)} where slug = ${lit(page.slug)};`
  );
}
w();

/* ------------------------------------------------------- real estate seo -- */

w("-- --------------------------------------------------- real estate seo ----");
w("-- Cut from scope by Page Spec 01 §2. Unpublished rather than deleted: the");
w("-- decision comes from a Decisions Record we have only seen quoted, and the");
w("-- page and its two tiers come straight back if that changes.");
w("--");
w("-- Nothing links to it any more. The homepage and About both carried a Real");
w("-- Estate card and both now show two service lanes instead of three.");
w("update public.pages set published = false where slug = '/real-estate-seo';");
w("update public.packages set visible = false where group_key = 'realEstate';");
w();

/* --------------------------------------------------------------- redirects -- */

w("-- --------------------------------------------------------- redirects ----");
w("-- /seo-packages is the important one here. It was live and linked, and");
w("-- Page Spec 06 renames it, so it has to keep resolving.");
for (const [source, destination] of REDIRECTS) {
  w(
    `insert into public.redirects (source, destination, permanent) values ` +
      `(${lit(source)}, ${lit(destination)}, true) ` +
      `on conflict (source) do update set destination = excluded.destination;`
  );
}
w();

w("commit;");
w();

const target = join(process.cwd(), "supabase", "apply-page-specs-02-09.sql");
writeFileSync(target, out.join("\n"), "utf8");

const sectionCount = pages.reduce((n, p) => n + p.sections.length, 0);
console.log(`Wrote ${target}`);
console.log(
  `  ${pages.length} pages, ${sectionCount} sections, ${packages.length} packages, ${REDIRECTS.length} redirects`
);
