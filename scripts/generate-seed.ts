import { randomUUID } from "node:crypto";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { filePages, servicePageSlugs, systemPageSlugs } from "../content/pages";
import { packages } from "../content/packages";
import { footerNav, mainNav, primaryCta, site } from "../content/site";

/**
 * Writes supabase/seed.sql from the approved content files.
 *
 * The admin has an "Import launch content" button that does the same thing, but
 * that path needs a working login first. This one runs in the Supabase SQL
 * editor as the database owner, so it works on a fresh project before any
 * account exists — and it gives us a deterministic file for setting up staging
 * or re-seeding after a reset.
 *
 *   npm run seed:generate
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

const out: string[] = [];
const w = (line = "") => out.push(line);

w("-- ==========================================================================");
w("--  JMC — launch content");
w("--");
w("--  Generated from content/ by scripts/generate-seed.ts. Do not hand-edit:");
w("--  regenerate it with `npm run seed:generate` instead.");
w("--");
w("--  Run supabase/schema.sql first, then paste this into the SQL editor.");
w("--");
w("--  Re-running is safe. Pages are matched on their address and their");
w("--  sections replaced wholesale, packages and settings are upserted, and the");
w("--  menus are rebuilt. It WILL overwrite edits made in /admin, so treat it as");
w("--  a reset to the approved launch content rather than a merge.");
w("-- ==========================================================================");
w();
w("begin;");
w();

/* ------------------------------------------------------------------ pages -- */

w("-- ------------------------------------------------------------- pages ----");
filePages.forEach((page, index) => {
  w(
    `insert into public.pages (slug, label, seo_title, meta_description, published, is_service, system, position) values (` +
      `${lit(page.slug)}, ${lit(page.label)}, ${lit(page.seoTitle)}, ${lit(page.metaDescription)}, ` +
      `true, ${servicePageSlugs.has(page.slug)}, ${systemPageSlugs.has(page.slug)}, ${index})`
  );
  w("on conflict (slug) do update set");
  w("  label = excluded.label,");
  w("  seo_title = excluded.seo_title,");
  w("  meta_description = excluded.meta_description,");
  w("  is_service = excluded.is_service,");
  w("  system = excluded.system,");
  w("  position = excluded.position;");
  w();
});

/* --------------------------------------------------------------- sections -- */

w("-- ---------------------------------------------------------- sections ----");
w("-- Replaced rather than merged: a section removed from the approved content");
w("-- should disappear here too, not linger as an orphan.");
w(
  `delete from public.sections where page_id in (select id from public.pages where slug in (${filePages
    .map((p) => lit(p.slug))
    .join(", ")}));`
);
w();

for (const page of filePages) {
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
packages.forEach((pkg, position) => {
  w(
    `insert into public.packages (id, group_key, name, price, price_unit, onboarding_fee, timeline, best_fit, deliverables, cta_label, cta_href, featured, visible, pricing_pending, position) values (`
  );
  w(
    `  ${lit(pkg.id)}, ${lit(pkg.group)}, ${lit(pkg.name)}, ${lit(pkg.price)}, ` +
      `${lit(pkg.priceUnit ?? null)}, ${lit(pkg.onboardingFee ?? null)}, ${lit(pkg.timeline ?? null)},`
  );
  w(`  ${lit(pkg.bestFit)},`);
  w(`  ${textArray(pkg.deliverables)},`);
  w(
    `  ${lit(pkg.cta.label)}, ${lit(pkg.cta.href)}, ${pkg.featured ?? false}, ` +
      `${pkg.visible !== false}, ${pkg.pricingPending ?? false}, ${position})`
  );
  w("on conflict (id) do update set");
  w("  group_key = excluded.group_key, name = excluded.name, price = excluded.price,");
  w("  price_unit = excluded.price_unit, onboarding_fee = excluded.onboarding_fee,");
  w("  timeline = excluded.timeline, best_fit = excluded.best_fit,");
  w("  deliverables = excluded.deliverables, cta_label = excluded.cta_label,");
  w("  cta_href = excluded.cta_href, featured = excluded.featured,");
  w("  visible = excluded.visible, pricing_pending = excluded.pricing_pending,");
  w("  position = excluded.position;");
  w();
});

/* ------------------------------------------------------------- navigation -- */

w("-- -------------------------------------------------------- navigation ----");
w("-- Rebuilt from scratch so ordering and nesting stay exact.");
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

/* --------------------------------------------------------------- settings -- */

w("-- ----------------------------------------------------- site details ----");
w(
  `insert into public.site_settings (id, name, short_name, url, email, phone, phone_href, locality, region, positioning, footer_blurb, primary_cta_label, primary_cta_href) values (`
);
w(
  `  true, ${lit(site.name)}, ${lit(site.shortName)}, ${lit(site.url)}, ${lit(site.email)},`
);
w(
  `  ${lit(site.phone)}, ${lit(site.phoneHref)}, ${lit(site.locality)}, ${lit(site.region)},`
);
w(`  ${lit(site.positioning)},`);
w(`  ${lit(site.footerBlurb)},`);
w(`  ${lit(primaryCta.label)}, ${lit(primaryCta.href)})`);
w("on conflict (id) do update set");
w("  name = excluded.name, short_name = excluded.short_name, url = excluded.url,");
w("  email = excluded.email, phone = excluded.phone, phone_href = excluded.phone_href,");
w("  locality = excluded.locality, region = excluded.region,");
w("  positioning = excluded.positioning, footer_blurb = excluded.footer_blurb,");
w("  primary_cta_label = excluded.primary_cta_label,");
w("  primary_cta_href = excluded.primary_cta_href;");
w();

/* -------------------------------------------------------------- redirects -- */

w("-- ------------------------------------------------------- redirects ----");
w("-- The three legacy URLs named in the keyword page map. The full inventory");
w("-- from the old site is still outstanding — add the rest in /admin.");
for (const [source, destination] of [
  ["/local-seo-service", "/local-seo-services"],
  ["/seo-packages-pricing", "/seo-packages"],
  ["/contact-us", "/contact"],
]) {
  w(
    `insert into public.redirects (source, destination, permanent) values ` +
      `(${lit(source)}, ${lit(destination)}, true) on conflict (source) do nothing;`
  );
}
w();

const sectionCount = filePages.reduce((n, p) => n + p.sections.length, 0);
const navCount =
  mainNav.length +
  mainNav.reduce((n, i) => n + (i.children?.length ?? 0), 0) +
  footerNav.length +
  footerNav.reduce((n, g) => n + g.links.length, 0);

w("commit;");
w();
w(
  `-- Sanity check — expected: ${filePages.length} pages, ${sectionCount} sections, ` +
    `${packages.length} packages, ${navCount} menu items.`
);
w("select");
w("  (select count(*) from public.pages) as pages,");
w("  (select count(*) from public.sections) as sections,");
w("  (select count(*) from public.packages) as packages,");
w("  (select count(*) from public.nav_items) as nav_items;");

const target = join(process.cwd(), "supabase", "seed.sql");
writeFileSync(target, out.join("\n"), "utf8");

console.log(`Wrote ${target}`);
console.log(
  `  ${filePages.length} pages, ${sectionCount} sections, ${packages.length} packages, ${navCount} menu items`
);
