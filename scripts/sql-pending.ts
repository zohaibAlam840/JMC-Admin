/**
 * Which pages in the database are out of date, and the SQL to fix exactly those.
 *
 *   npm run sql:pending
 *
 * This exists because of a failure that has now happened four times on this
 * project: a page gets edited, the apply script does not get run, and the
 * site keeps showing the old version — because it renders from Postgres, not
 * from content/pages. There is no error, nothing looks broken, and the only
 * symptom is "you did not change it". Several rounds of review feedback sat
 * unapplied this way.
 *
 * So rather than asking anyone to remember which files are pending, this
 * reads the database, compares it to the content files, and tells you. If
 * anything differs it writes supabase/apply-pending.sql covering precisely
 * the pages that drifted and nothing else.
 *
 * Read-only against Supabase, using the same publishable key the site uses.
 * It cannot write: that is what the SQL editor is for.
 */

import { readFileSync, writeFileSync, existsSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { draftPageSlugs, filePages } from "../content/pages";
import type { PageContent, Section } from "../lib/types";

const SOURCE = join(process.cwd(), "supabase", "apply-page-specs-02-09.sql");
const TARGET = join(process.cwd(), "supabase", "apply-pending.sql");

/* ------------------------------------------------------------- env ------ */

function env(): { url: string; key: string } {
  const raw = readFileSync(join(process.cwd(), ".env.local"), "utf8");
  const vars: Record<string, string> = {};
  for (const line of raw.split(/\r?\n/)) {
    const i = line.indexOf("=");
    if (i > 0 && !line.trim().startsWith("#")) {
      vars[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
  }
  const url = vars.NEXT_PUBLIC_SUPABASE_URL;
  const key = vars.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.error("No Supabase URL/key in .env.local — nothing to compare against.");
    process.exit(1);
  }
  return { url, key };
}

/* -------------------------------------------------------- comparison ---- */

/**
 * Key order differs between a TypeScript object literal and what jsonb hands
 * back, so a plain JSON.stringify comparison reports every page as changed.
 * Sorting keys recursively is what makes the comparison mean anything.
 */
function stable(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, v]) => v !== undefined)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => [k, stable(v)])
    );
  }
  return value;
}

/** A section as the database stores it, for comparison only. */
function shape(section: Section, position: number) {
  const { id, tone, type, ...data } = section as Section & {
    [k: string]: unknown;
  };
  return JSON.stringify(
    stable({ key: id, type, tone: tone ?? null, position, data })
  );
}

type DbSection = {
  key: string;
  type: string;
  tone: string | null;
  position: number;
  data: Record<string, unknown>;
};

function dbShape(row: DbSection) {
  return JSON.stringify(
    stable({
      key: row.key,
      type: row.type,
      tone: row.tone,
      position: row.position,
      data: row.data,
    })
  );
}

/* --------------------------------------------------------- the check ---- */

/*
 * Wrapped in main() rather than written with top-level await: tsx runs
 * these scripts as CommonJS, where top-level await is a build error.
 */
async function main() {

  const { url, key } = env();
  const headers = { apikey: key, Authorization: `Bearer ${key}` };

  const pageRows: { id: string; slug: string }[] = await (
    await fetch(`${url}/rest/v1/pages?select=id,slug`, { headers })
  ).json();

  if (!Array.isArray(pageRows)) {
    console.error("Could not read pages from Supabase:", pageRows);
    process.exit(1);
  }

  const bySlug = new Map(pageRows.map((p) => [p.slug, p.id]));
  const drifted: { page: PageContent; reason: string }[] = [];
  const unreadable: string[] = [];

  for (const page of filePages) {
    const id = bySlug.get(page.slug);
    if (!id) {
      /*
       * Unpublished pages are invisible here. Row level security only exposes
       * published content to the publishable key, so a draft always looks
       * missing. Report it as unreadable rather than as a difference — saying
       * "/links is not in the database" would be plain wrong.
       */
      if (draftPageSlugs.has(page.slug)) unreadable.push(page.slug);
      else drifted.push({ page, reason: "not in the database at all" });
      continue;
    }

    const rows: DbSection[] = await (
      await fetch(
        `${url}/rest/v1/sections?page_id=eq.${id}&select=key,type,tone,position,data&order=position`,
        { headers }
      )
    ).json();

    if (rows.length !== page.sections.length) {
      drifted.push({
        page,
        reason: `${rows.length} sections in the database, ${page.sections.length} in the file`,
      });
      continue;
    }

    const differing = page.sections
      .map((s, i) => (shape(s, i) === dbShape(rows[i]) ? null : s.id))
      .filter(Boolean) as string[];

    if (differing.length > 0) {
      drifted.push({
        page,
        reason: `${differing.length} section(s) differ: ${differing.join(", ")}`,
      });
    }
  }

  if (drifted.length === 0) {
    console.log("The database matches the content files. Nothing to apply.");
    if (existsSync(TARGET)) {
      unlinkSync(TARGET);
      console.log("Removed a stale supabase/apply-pending.sql.");
    }
    process.exit(0);
  }

  console.log(`${drifted.length} page(s) out of date in the database:\n`);
  for (const { page, reason } of drifted) {
    console.log(`  ${page.slug}`);
    console.log(`      ${reason}`);
  }

  /* ------------------------------------------------- the SQL to fix it ---- */

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

  function body(statement: string): string {
    return statement
      .split(/\r?\n/)
      .filter((l) => l.trim() && !l.trim().startsWith("--"))
      .join("\n")
      .trim();
  }

  const slugs = drifted.map((d) => d.page.slug);
  const packageIds = new Set<string>();
  for (const { page } of drifted) {
    for (const section of page.sections) {
      if (section.type === "pricingCards") {
        for (const pid of section.packageIds) packageIds.add(pid);
      }
    }
  }

  const src = readFileSync(SOURCE, "utf8");
  const kept: string[] = [];
  for (const statement of statements(src)) {
    const sql = body(statement);
    if (!/^(insert|update|delete)\b/i.test(sql)) continue;
    const touchesPage = slugs.some((s) => sql.includes(`slug = '${s}'`));
    const touchesPackage =
      /insert into public\.packages/i.test(sql) &&
      [...packageIds].some((pid) => sql.includes(`'${pid}'`));
    if (touchesPage || touchesPackage) kept.push(sql);
  }

  /*
   * Two different shapes of statement live in the apply script, and they need
   * different checks.
   *
   * Most pages are rebuilt wholesale: a DELETE then one INSERT per section.
   * There the DELETE has to be present and first, or a second run leaves the
   * page with two of every section.
   *
   * The homepage is patched instead — targeted UPDATEs on the handful of
   * sections whose destinations changed — specifically so a client's edits in
   * /admin survive. There is no DELETE and should not be, so requiring one
   * made this refuse to write anything at all.
   */
  const uncovered: string[] = [];

  for (const slug of slugs) {
    const inserts = kept.findIndex(
      (s) =>
        /^insert into public\.sections/i.test(s) && s.includes(`slug = '${slug}'`)
    );
    const del = kept.findIndex(
      (s) => /^delete\b/i.test(s) && s.includes(`slug = '${slug}'`)
    );

    if (inserts >= 0) {
      if (del < 0 || del > inserts) {
        console.error(
          `\nSection inserts for ${slug} without a DELETE before them. Refusing to write.`
        );
        process.exit(1);
      }
      continue;
    }

    /*
     * A patched page needs checking section by section, not page by page.
     * The homepage has six UPDATE statements, so "does anything touch this
     * slug" says yes while the sections that actually drifted may be none of
     * the six — which would have this report success and change nothing.
     */
    const entry = drifted.find((d) => d.page.slug === slug);
    const sectionIds = entry?.reason.match(/differ: (.+)$/)?.[1]?.split(", ") ?? [];
    const missing = sectionIds.filter(
      (sectionId) =>
        !kept.some(
          (s) =>
            s.includes(`slug = '${slug}'`) && s.includes(`key = '${sectionId}'`)
        )
    );
    if (missing.length > 0) uncovered.push(`${slug} (${missing.join(", ")})`);
  }

  /*
   * Split once it gets big.
   *
   * A 190KB paste into the Supabase SQL editor silently truncated on this
   * project once, and the error it produced — `relation "an" does not exist`
   * — pointed nowhere near the cause, because the parser had started reading
   * prose as SQL. The five-part files that replaced it were 29–45KB each and
   * pasted without trouble, so that is the size being matched here.
   *
   * Pages are kept whole within a part. A page's DELETE and its inserts must
   * land in the same transaction, or a part that fails between them leaves
   * that page with no sections at all.
   */
  const MAX_PART_BYTES = 45_000;

  const groups: string[][] = [];
  for (const statement of kept) {
    const isPageStart = /^delete\b/i.test(statement);
    if (isPageStart || groups.length === 0) groups.push([statement]);
    else groups[groups.length - 1].push(statement);
  }

  const parts: string[][] = [];
  let current: string[] = [];
  let size = 0;
  for (const group of groups) {
    const groupSize = group.reduce((n, s) => n + s.length + 1, 0);
    if (current.length > 0 && size + groupSize > MAX_PART_BYTES) {
      parts.push(current);
      current = [];
      size = 0;
    }
    current.push(...group);
    size += groupSize;
  }
  if (current.length > 0) parts.push(current);

  const header = (index: number) => [
    "-- ======================================================================",
    `--  JMC — everything the database is currently missing${parts.length > 1 ? `, part ${index + 1} of ${parts.length}` : ""}`,
    "--",
    "--  GENERATED by `npm run sql:pending`, which compared the database to",
    "--  the content files. It covers exactly the pages that differ:",
    ...slugs.map((s) => `--    ${s}`),
    "--",
    parts.length > 1
      ? "--  Run the parts IN ORDER, each on its own. Safe to run more than once."
      : "--  Paste and run in one go. Safe to run more than once.",
    "-- ======================================================================",
    "",
    "begin;",
    "",
  ];

  const written: string[] = [];
  parts.forEach((statements, index) => {
    const name =
      parts.length === 1
        ? "apply-pending.sql"
        : `apply-pending-${index + 1}.sql`;
    const path = join(process.cwd(), "supabase", name);
    writeFileSync(
      path,
      [...header(index), ...statements, "", "commit;", ""].join("\n")
    );
    written.push(name);
  });

  // Clear any parts left behind by a previous, larger run.
  for (let i = parts.length; i < 20; i++) {
    const stale = join(process.cwd(), "supabase", `apply-pending-${i + 1}.sql`);
    if (existsSync(stale)) unlinkSync(stale);
  }
  if (parts.length > 1 && existsSync(TARGET)) unlinkSync(TARGET);

  console.log("");
  for (const name of written) {
    const bytes = readFileSync(join(process.cwd(), "supabase", name)).length;
    console.log(`Wrote supabase/${name}  (${(bytes / 1024).toFixed(0)}KB)`);
  }
  console.log(`  ${kept.length} statements in total.`);
  console.log(`  Run in the Supabase SQL editor, then re-run this to confirm.`);

  if (unreadable.length > 0) {
    console.log(`\nNot checked — unpublished, so invisible to the public key:`);
    for (const slug of unreadable) console.log(`  ${slug}`);
  }

  if (uncovered.length > 0) {
    console.log(`\nDrifted, but the apply script has nothing that fixes them:`);
    for (const slug of uncovered) console.log(`  ${slug}`);
    console.log(
      `  These are patched section-by-section rather than rebuilt, so a\n` +
        `  section the generator does not patch cannot be corrected from here.\n` +
        `  Either add it to the generator or edit that section in /admin.`
    );
  }

}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
