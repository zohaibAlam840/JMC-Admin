import { readFileSync, readdirSync } from "node:fs";

/**
 * Finds first-person voice in page copy.
 *
 * The Page Checklist §B forbids it "anywhere, including About". This reads
 * string literals only, so a comment explaining why something is written a
 * certain way never trips it, and it skips the four Monthly Recap headings,
 * which the page specs lock verbatim and are the one sanctioned exception.
 *
 *   npx tsx scripts/check-voice.ts
 */

const LOCKED = [
  "What We Did",
  "Why We Did It",
  "What Changed",
  "Where We're Headed",
];

const files = [
  ...readdirSync("content/pages")
    .filter((f) => f.endsWith(".ts"))
    .map((f) => `content/pages/${f}`),
  "content/site.ts",
  "content/packages.ts",
];

const STRING = /"((?:[^"\\]|\\.)*)"/g;
const PERSON = /\b(we|we're|we'll|our|ours|us)\b/i;

let found = 0;

for (const file of files) {
  const source = readFileSync(file, "utf8");
  const lines = source.split("\n");

  lines.forEach((line, i) => {
    for (const match of line.matchAll(STRING)) {
      const text = match[1];
      if (!PERSON.test(text)) continue;

      // Remove the locked headings before judging the rest of the string, so a
      // sentence that only contains one is not reported.
      let rest = text;
      for (const heading of LOCKED) rest = rest.split(heading).join("");
      if (!PERSON.test(rest)) continue;

      found++;
      console.log(`${file}:${i + 1}`);
      console.log(`   ${text.slice(0, 140)}`);
    }
  });
}

console.log(
  found === 0
    ? "\nNo first-person voice in page copy."
    : `\n${found} string(s) using first-person voice.`
);
