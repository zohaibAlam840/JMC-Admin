import { Band, SectionHeader } from "@/components/ui/layout";
import { ArrowLink } from "@/components/ui/button";
import type { FourQuestionsSection } from "@/lib/types";

/**
 * The four questions, argued — Page Spec 05 §2.
 *
 * The same four headings the Monthly Recap block carries, in the same order,
 * but this is the one page where each is explained rather than listed. Page
 * Spec 05 asks for it explicitly as a separate treatment: every other page
 * gets the compact four-card version, and repeating that here would leave the
 * pillar page saying no more than the pages that link to it.
 *
 * Two deliberate departures from the compact block. Numerals instead of icons
 * in circles, because the tinted circle is the compact treatment's motif and
 * reusing it would make the two read as the same component at two sizes. And
 * far more vertical room, because this section is the page's argument rather
 * than a summary of it.
 *
 * The headings are hard-coded for the same reason they are in the compact
 * block: §2 calls them verbatim and locked, and they also have to match the
 * Free Visibility Audit deliverable.
 */
const BLOCKS: {
  title: string;
  key: "did" | "why" | "changed" | "next";
  exampleKey: "didExample" | "whyExample" | "changedExample" | "nextExample";
}[] = [
  { title: "What We Did", key: "did", exampleKey: "didExample" },
  { title: "Why We Did It", key: "why", exampleKey: "whyExample" },
  { title: "What Changed", key: "changed", exampleKey: "changedExample" },
  { title: "Where We're Headed", key: "next", exampleKey: "nextExample" },
];

export function FourQuestions({ section }: { section: FourQuestionsSection }) {
  return (
    <Band id={section.id} tone={section.tone}>
      <SectionHeader
        eyebrow={section.eyebrow}
        heading={section.heading}
        body={section.body}
        align="center"
      />

      <div className="mx-auto mt-14 grid max-w-[1000px] gap-x-12 gap-y-12 md:grid-cols-2">
        {BLOCKS.map((block, i) => (
          <div key={block.key} className="flex flex-col">
            <div className="flex items-baseline gap-4">
              <span className="gradient-text font-display text-[2rem] font-bold leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-[1.3125rem] leading-tight sm:text-[1.5rem]">
                {block.title}
              </h3>
            </div>

            <p className="mt-4 text-[1rem] leading-relaxed text-subtle">
              {section[block.key]}
            </p>

            {section[block.exampleKey] ? (
              <p className="mt-4 border-l-2 border-teal/40 pl-4 text-[0.9rem] leading-relaxed text-ink-strong">
                {section[block.exampleKey]}
              </p>
            ) : null}
          </div>
        ))}
      </div>

      {section.cta ? (
        <div className="mt-14 flex justify-center">
          <ArrowLink href={section.cta.href}>{section.cta.label}</ArrowLink>
        </div>
      ) : null}
    </Band>
  );
}
