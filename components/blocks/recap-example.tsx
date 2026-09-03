import { Band, SectionHeader } from "@/components/ui/layout";
import type { RecapExampleSection } from "@/lib/types";

/**
 * A worked example of a monthly recap — Page Spec 05 §3.
 *
 * The most important section on the reporting page, and the one with the
 * tightest constraints. Drawn in HTML rather than shown as a screenshot, it
 * names no client, and it contains no numbers at all.
 *
 * The last point is the one worth defending. The obvious version of this
 * section is a realistic dashboard with impressive figures, and it would be
 * the worst contradiction on the site: invented metrics on the page whose
 * whole subject is honest reporting, and easy for a sharp prospect to spot.
 * The spec's own answer is that structure persuades better than numbers here.
 * The argument is that you will always know what was done and why, and the
 * shape of the document makes that case on its own.
 *
 * "Example" appears twice, in the panel header and in the caption below it, so
 * the framing survives a screenshot of the section.
 */
const ROWS: { title: string; key: "did" | "why" | "changed" | "next" }[] = [
  { title: "What We Did", key: "did" },
  { title: "Why We Did It", key: "why" },
  { title: "What Changed", key: "changed" },
  { title: "Where We're Headed", key: "next" },
];

export function RecapExample({ section }: { section: RecapExampleSection }) {
  return (
    <Band id={section.id} tone={section.tone}>
      <SectionHeader
        eyebrow={section.eyebrow}
        heading={section.heading}
        body={section.body}
        align="center"
      />

      <figure className="mx-auto mt-12 max-w-[860px]">
        <div className="overflow-hidden rounded-bento border border-line bg-white shadow-soft">
          {/* Styled as a document title bar, so the panel reads as a report
              rather than as one more card grid. */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface px-6 py-4 sm:px-8">
            <div>
              <p className="font-heading text-[1.0625rem] font-bold text-ink-strong">
                {section.panelTitle}
              </p>
              {section.panelMeta ? (
                <p className="mt-0.5 text-[0.8rem] text-subtle">
                  {section.panelMeta}
                </p>
              ) : null}
            </div>
            <span className="rounded-pill border border-teal/40 bg-teal/12 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-teal-ink">
              Example
            </span>
          </div>

          <div className="divide-y divide-line">
            {ROWS.map((row) => (
              <div
                key={row.key}
                className="grid gap-3 px-6 py-6 sm:grid-cols-[210px_1fr] sm:gap-8 sm:px-8"
              >
                <h3 className="text-[1rem] leading-tight sm:text-[1.0625rem]">
                  {row.title}
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {section[row.key].map((line) => (
                    <li
                      key={line}
                      className="flex gap-3 text-[0.92rem] leading-relaxed text-subtle"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-teal"
                      />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <figcaption className="mx-auto mt-4 max-w-[68ch] text-center text-[0.85rem] leading-relaxed text-subtle">
          {section.caption}
        </figcaption>
      </figure>
    </Band>
  );
}
