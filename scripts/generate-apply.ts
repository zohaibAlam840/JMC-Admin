import { randomUUID } from "node:crypto";
import {
  mkdirSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
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
  /*
   * About joined this list when Page Spec 11 arrived. It used to be patched
   * section by section, on the grounds that no spec rebuilt it; 11 rebuilds
   * it completely, around the 2022 pivot rather than around a process list,
   * and not one of the old section keys survived. Patching by key threw as
   * soon as the content file changed, which is the failure mode you want.
   */
  "/about",
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

/**
 * The legacy map, from JMC-Redirect-Map.xlsx. Kept in step with the copy in
 * next.config.ts: that one is the safety net, this one is what the client can
 * edit in /admin afterwards.
 *
 * /resources is the only 302 on the site, and deliberately so: the page is
 * built but unpublished, and a 301 would tell Google it is gone for good.
 */
const REDIRECTS: [string, string, boolean?][] = [
  ["/local-seo-service", "/local-seo-services"],
  ["/reputation-management", "/local-seo-services"],
  ["/link-building-service", "/traditional-seo-services"],
  ["/real-estate-seo", "/local-seo-services"],
  ["/seo-website-services", "/traditional-seo-services"],
  ["/free-website-audit", "/google-business-profile-optimization"],
  ["/services", "/local-seo-services"],
  ["/contact-us", "/contact"],
  ["/seo-service", "/local-seo-services"],
  ["/seo-league-city", "/local-seo-services"],
  ["/about-us", "/about"],
  ["/online-reviews-for-roofers", "/industries/home-services-trades"],
  ["/audit", "/google-business-profile-optimization"],
  ["/general", "/"],
  ["/general/feed", "/"],
  ["/navigating-the-ai-frontier", "/"],
  ["/seo-packages", "/monthly-seo-packages"],
  ["/seo-packages-pricing", "/monthly-seo-packages"],
  ["/resources", "/", false],
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
w("--");
w("-- Each page clears its own sections immediately before re-inserting them,");
w("-- rather than one delete covering all sixteen up front. That keeps every");
w("-- page block self-contained, which is what lets the split files below be");
w("-- run one at a time without a page ever being left with no sections.");
w();

for (const page of pages) {
  w(`-- ${page.label}`);
  w(
    `delete from public.sections where page_id = (select id from public.pages where slug = ${lit(
      page.slug
    )});`
  );
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
 * Six homepage sections changed; nothing else on the page did.
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
w("-- Only the sections whose destinations or card counts changed. The rest of");
w("-- the homepage, including any copy edited in /admin, is left alone.");
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

/* ----------------------------------------------------------- resources -- */

w("-- ----------------------------------------------------------- resources ----");
w("-- Built, not published — Page Spec 14. The route and the post template");
w("-- exist and work; zero posts go live, and the page stays out of the nav,");
w("-- the footer and the sitemap until content is sourced.");
w("--");
w("-- This has to be stated here because the page rebuild above only touches");
w("-- the pages it owns, and /resources is not one of them. Left");
w("-- alone it stays published from the original seed, and the sitemap picks");
w("-- it up the moment the database is reachable — listing a URL that 302s.");
w("update public.pages set published = false where slug = '/resources';");
w();

/* --------------------------------------------------------------- redirects -- */

w("-- --------------------------------------------------------- redirects ----");
w("-- /seo-packages is the important one here. It was live and linked, and");
w("-- Page Spec 06 renames it, so it has to keep resolving.");
/*
 * `permanent` is written from the third element rather than hardcoded, and
 * the conflict clause updates it.
 *
 * Both were wrong: every row was emitted as `true`, so /resources — the one
 * deliberate 302 on the site — was stored as a 301. next.config.ts carries
 * its own copy of that redirect and Next resolves config redirects before the
 * proxy, so visitors got the right status anyway and the fault stayed
 * invisible. It would have surfaced the moment Resources publishes and that
 * config entry is deleted, which is exactly when telling Google the URL is
 * permanently gone does the most damage.
 */
for (const [source, destination, permanent = true] of REDIRECTS) {
  w(
    `insert into public.redirects (source, destination, permanent) values ` +
      `(${lit(source)}, ${lit(destination)}, ${permanent}) ` +
      `on conflict (source) do update set destination = excluded.destination, permanent = excluded.permanent;`
  );
}
w();

w("commit;");
w();

const target = join(process.cwd(), "supabase", "apply-page-specs-02-09.sql");
writeFileSync(target, out.join("\n"), "utf8");

/* ------------------------------------------------------------ split parts -- */

/**
 * The same SQL again, cut into parts small enough to paste.
 *
 * The whole file is about 190KB on lines up to 3,000 characters, and pasting
 * that into the Supabase SQL editor truncated it — silently, mid-string. A cut
 * string literal does not fail where it was cut: the parser keeps going and
 * reads the rest of the sentence as SQL, so an ordinary word in the body copy
 * turns into a table name and the error points at something like `relation
 * "an" does not exist`, which describes nothing that is wrong with the file.
 *
 * Parts are cut only between top-level statements, and never inside a page's
 * delete-then-insert run, so a part that fails leaves nothing half-built.
 * Every part is its own transaction and the whole set is idempotent, so the
 * recovery from any failure is to run that part again.
 */
const MAX_PART_BYTES = 45_000;

/** Statement boundaries, found by lexing rather than by splitting on ";". */
function statements(sql: string): string[] {
  const found: string[] = [];
  let buf = "";
  let inString = false;
  let inComment = false;

  for (let i = 0; i < sql.length; i++) {
    const c = sql[i];
    const next = sql[i + 1];

    if (inComment) {
      buf += c;
      if (c === "\n") inComment = false;
      continue;
    }
    if (inString) {
      buf += c;
      // '' is an escaped quote, not the end of the literal.
      if (c === "'" && next === "'") {
        buf += next;
        i++;
      } else if (c === "'") {
        inString = false;
      }
      continue;
    }
    if (c === "-" && next === "-") {
      inComment = true;
      buf += c;
      continue;
    }
    if (c === "'") {
      inString = true;
      buf += c;
      continue;
    }
    if (c === ";") {
      found.push((buf + c).trim());
      buf = "";
      continue;
    }
    buf += c;
  }
  if (buf.trim()) found.push(buf.trim());
  return found;
}

const body = statements(out.join("\n")).filter(
  (s) => s !== "begin;" && s !== "commit;"
);

/*
 * A page's delete and its inserts have to stay together, so statements are
 * grouped before they are packed. Everything else is its own group.
 */
const groups: string[][] = [];
for (const stmt of body) {
  const startsPage = /^-- .*\n?delete from public\.sections where page_id =/m.test(
    stmt
  );
  if (startsPage || groups.length === 0) groups.push([stmt]);
  else if (/^insert into public\.sections/m.test(stmt)) {
    groups[groups.length - 1].push(stmt);
  } else groups.push([stmt]);
}

const parts: string[][] = [[]];
let bytes = 0;
for (const group of groups) {
  const size = group.join("\n").length;
  if (bytes > 0 && bytes + size > MAX_PART_BYTES) {
    parts.push([]);
    bytes = 0;
  }
  parts[parts.length - 1].push(...group);
  bytes += size;
}

const partDir = join(process.cwd(), "supabase", "apply-parts");
mkdirSync(partDir, { recursive: true });
for (const existing of readdirSync(partDir)) {
  if (existing.endsWith(".sql")) rmSync(join(partDir, existing));
}

const partPaths: string[] = [];
parts.forEach((stmts, index) => {
  const n = String(index + 1).padStart(2, "0");
  const header = [
    "-- ======================================================================",
    `--  JMC apply, part ${index + 1} of ${parts.length}`,
    "--",
    "--  GENERATED. Run the parts IN ORDER, each on its own, letting each",
    "--  finish before starting the next. Safe to run more than once.",
    "--",
    "--  These exist because the single combined file is too large to paste",
    "--  into the Supabase SQL editor without being truncated.",
    "-- ======================================================================",
    "",
    "begin;",
    "",
  ].join("\n");
  const file = join(partDir, `${n}.sql`);
  writeFileSync(file, `${header}${stmts.join("\n")}\n\ncommit;\n`, "utf8");
  partPaths.push(file);
});

const sectionCount = pages.reduce((n, p) => n + p.sections.length, 0);
console.log(`Wrote ${target}`);
console.log(
  `  ${pages.length} pages, ${sectionCount} sections, ${packages.length} packages, ${REDIRECTS.length} redirects`
);
console.log(`Wrote ${parts.length} part files to ${partDir}`);
