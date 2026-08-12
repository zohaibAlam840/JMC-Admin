import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Concatenates schema.sql and every migration into supabase/setup.sql.
 *
 * Generated rather than hand-maintained on purpose: a second copy of the schema
 * that someone has to remember to update is a copy that will be wrong within a
 * month. The individual files stay the source of truth for an existing
 * database; this bundle is the one-paste path for a brand new project.
 *
 *   npm run sql:bundle
 */

const root = join(process.cwd(), "supabase");
const migrationsDir = join(root, "migrations");

const migrations = readdirSync(migrationsDir)
  .filter((f) => f.endsWith(".sql"))
  .sort();

const parts: string[] = [
  `-- ============================================================================
--  JMC — complete database setup
--
--  GENERATED FILE. Do not edit — run \`npm run sql:bundle\` instead.
--  Sources: supabase/schema.sql${migrations.map((m) => `, migrations/${m}`).join("")}
--
--  For a brand new Supabase project: paste this whole file into the SQL editor
--  and run it once. Then run supabase/seed.sql to load the launch content.
--
--  Safe to run more than once. It creates structure only — it never writes or
--  deletes page content.
-- ============================================================================
`,
  readFileSync(join(root, "schema.sql"), "utf8"),
];

for (const file of migrations) {
  parts.push(
    `\n-- ############################################################################\n` +
      `-- ##  ${file}\n` +
      `-- ############################################################################\n`
  );
  parts.push(readFileSync(join(migrationsDir, file), "utf8"));
}

const target = join(root, "setup.sql");
writeFileSync(target, parts.join("\n"), "utf8");

console.log(`Wrote ${target}`);
console.log(`  schema.sql + ${migrations.length} migration(s): ${migrations.join(", ")}`);
