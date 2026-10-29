/**
 * Generate an apply script for one page, or for every page under a prefix.
 *
 *   npm run sql:page -- /monthly-seo-packages
 *   npm run sql:page -- /industries/          # all eight, one file
 *
 * Why this exists: the full apply script is ~190KB across five part files,
 * and pasting all five into the Supabase SQL editor to change one page is
 * both slow and the main way changes have gone un-applied — a page gets
 * edited, the parts do not get run, and the site still shows the old copy
 * because it renders from the database rather than from these files.
 *
 * This slices the generated script down to the statements that touch the
 * pages asked for: their own rows, their sections, and any package their
 * pricing cards reference. Nothing else is touched.
 *
 * Run `npm run sql:apply` first — this reads that script's output rather
 * than re-deriving anything, so the two can never drift.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { filePages } from "../content/pages";

const SOURCE = join(process.cwd(), "supabase", "apply-page-specs-02-09.sql");

/**
 * Split SQL into statements, respecting single-quoted literals and the
 * doubled-quote escape, so a semicolon inside page copy never ends one.
 */
function statements(src: string): string[] {
  const out: string[] = [];
  let buf = "";
  let inString = false;

  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    buf += c;
    if (c === "'") {
      if (inString && src[i + 1] === "'") buf += src[++i];
      else inString = !inString;
    } else if (c === ";" && !inString) {
      out.push(buf);
      buf = "";
    }
  }
  if (buf.trim()) out.push(buf);
  return out;
}

/**
 * The statement without its leading banner comments.
 *
 * The splitter carries everything between the previous semicolon and this
 * one, which includes the section headers. Without stripping them the DELETE
 * reads as a comment and gets dropped — and then the inserts below it
 * duplicate every section on a second run instead of replacing them.
 */
function body(statement: string): string {
  return statement
    .split(/\r?\n/)
    .filter((l) => l.trim() && !l.trim().startsWith("--"))
    .join("\n")
    .trim();
}

const arg = process.argv[2];
if (!arg) {
  console.error("Usage: npm run sql:page -- /slug   (or /prefix/ for a set)");
  process.exit(1);
}

/*
 * Match loosely, for one annoying reason: Git Bash rewrites a leading-slash
 * argument into a Windows path, so `-- /monthly-seo-packages` arrives as
 * `C:/Program Files/Git/monthly-seo-packages`. Rather than make everyone
 * remember MSYS_NO_PATHCONV, accept the slug with a slash, without one, or
 * buried at the end of a mangled path.
 */
function recoverSlug(raw: string): string {
  const path = raw.replace(/\\/g, "/");
  if (path.startsWith("/")) return path;

  // Known first segments, e.g. "industries", "about", "contact".
  const roots = new Set(
    filePages.map((p) => p.slug.split("/").filter(Boolean)[0]).filter(Boolean)
  );
  const parts = path.split("/").filter(Boolean);
  const at = parts.findIndex((p) => roots.has(p));
  if (at < 0) return path;

  return "/" + parts.slice(at).join("/") + (path.endsWith("/") ? "/" : "");
}

const normalised = recoverSlug(arg);

/*
 * A trailing slash means "everything below this": `-- /industries/` emits one
 * file covering all eight industry pages. That matters because review notes
 * tend to apply to a whole set at once — the layout rule, the lane routing —
 * and eight files to paste is how a batch of changes ends up half-applied.
 */
const isPrefix = normalised.endsWith("/") && normalised !== "/";

type Page = (typeof filePages)[number];

const matches: Page[] = isPrefix
  ? filePages.filter(
      (p) => p.slug.startsWith(normalised) && p.slug !== normalised.slice(0, -1)
    )
  : ([
      filePages.find((p) => p.slug === normalised) ??
        filePages.find((p) => p.slug === "/" + normalised) ??
        filePages.find((p) => normalised.endsWith(p.slug)),
    ].filter(Boolean) as Page[]);

if (matches.length === 0) {
  console.error(`No page matching "${arg}". Known slugs:`);
  for (const p of filePages) console.error("  " + p.slug);
  process.exit(1);
}

/** Packages any matched page's pricing cards point at, so their rows come too. */
const packageIds = new Set<string>();
for (const page of matches) {
  for (const section of page.sections) {
    if (section.type === "pricingCards") {
      for (const id of section.packageIds) packageIds.add(id);
    }
  }
}

const slugs = matches.map((p) => p.slug);
const src = readFileSync(SOURCE, "utf8");
const kept: string[] = [];

for (const statement of statements(src)) {
  const sql = body(statement);
  if (!/^(insert|update|delete)\b/i.test(sql)) continue;

  const touchesPage = slugs.some((s) => sql.includes(`slug = '${s}'`));
  const touchesPackage =
    /insert into public\.packages/i.test(sql) &&
    [...packageIds].some((id) => sql.includes(`'${id}'`));

  if (touchesPage || touchesPackage) kept.push(sql);
}

/*
 * Every page needs its own DELETE, before that page's inserts. A missing one
 * is silent and destructive: the run reports success and leaves the page with
 * two of every section.
 */
for (const slug of slugs) {
  // Home is intentionally patched section by section in the full apply file
  // so unrelated dashboard edits survive. It therefore has no wholesale
  // section DELETE to validate.
  if (slug === "/") {
    const hasSectionUpdate = kept.some(
      (s) =>
        /^update public\.sections/i.test(s) && s.includes("slug = '/'")
    );
    if (!hasSectionUpdate) {
      console.error("No homepage section updates found. Refusing to write.");
      process.exit(1);
    }
    continue;
  }

  const del = kept.findIndex(
    (s) => /^delete\b/i.test(s) && s.includes(`slug = '${slug}'`)
  );
  if (del < 0) {
    console.error(`No section DELETE for ${slug}. Refusing to write.`);
    process.exit(1);
  }
  const firstInsert = kept.findIndex(
    (s) =>
      /^insert into public\.sections/i.test(s) && s.includes(`slug = '${slug}'`)
  );
  if (firstInsert >= 0 && firstInsert < del) {
    console.error(`DELETE for ${slug} comes after its inserts. Refusing.`);
    process.exit(1);
  }

  /*
   * The focused file is sliced from the last full generated apply file. If
   * page source changed but `npm run sql:apply` was skipped, that file can be
   * stale. A wholesale DELETE followed by a stale subset is destructive: it
   * silently removes any newly restored section. Require exact section-key
   * parity with the current page source before writing.
   */
  const page = matches.find((candidate) => candidate.slug === slug);
  const expected = new Set(page?.sections.map((section) => section.id) ?? []);
  const actual = new Set(
    kept
      .filter(
        (s) =>
          /^insert into public\.sections/i.test(s) &&
          s.includes(`slug = '${slug}'`)
      )
      .map((s) => s.match(/select id, '([^']+)',/i)?.[1])
      .filter((id): id is string => Boolean(id))
  );
  const missing = [...expected].filter((id) => !actual.has(id));
  const extra = [...actual].filter((id) => !expected.has(id));
  if (missing.length || extra.length) {
    console.error(
      `Generated SQL is stale for ${slug}. Run npm run sql:apply first.`
    );
    if (missing.length) console.error(`  Missing: ${missing.join(", ")}`);
    if (extra.length) console.error(`  Extra: ${extra.join(", ")}`);
    process.exit(1);
  }
}

const sectionCount = kept.filter((s) =>
  /^(insert into|update) public\.sections/i.test(s)
).length;
const name = isPrefix
  ? normalised.replace(/^\//, "").replace(/\/$/, "").replace(/\//g, "-") + "-all"
  : matches[0].slug.replace(/^\//, "").replace(/\//g, "-") || "home";
const target = join(process.cwd(), "supabase", `apply-${name}.sql`);

const title =
  matches.length === 1
    ? `${matches[0].label} only`
    : `${matches.length} pages under ${normalised}`;

const out = [
  "-- ======================================================================",
  `--  JMC — ${title}`,
  "--",
  "--  GENERATED by `npm run sql:page`. Do not hand-edit: regenerate it.",
  "--",
  `--  A focused subset of the full apply script: ${matches.length} page row(s) and`,
  `--  ${sectionCount} sections${packageIds.size ? `, plus ${packageIds.size} packages their pricing cards use` : ""}.`,
  "--  Nothing else in the database is touched.",
  "--",
  "--  Paste and run in one go. Safe to run more than once — the deletes",
  "--  below clear each page's section rows before they are rebuilt.",
  "-- ======================================================================",
  "",
  "begin;",
  "",
  ...kept,
  "",
  "commit;",
  "",
].join("\n");

writeFileSync(target, out);
console.log(`Wrote ${target}`);
console.log(
  `  ${kept.length} statements · ${matches.length} page(s) · ${sectionCount} sections · ${packageIds.size} packages`
);
