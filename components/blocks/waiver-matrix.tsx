import { Container } from "@/components/ui/layout";
import { Reveal } from "@/components/motion/reveal";
import { ArrowLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { WaiverMatrixSection } from "@/lib/types";

/**
 * The onboarding-fee waiver — Page Spec 06 §7 and Page Spec 07 §6.
 *
 * The same three rows appear on both pages, read from opposite sides: the
 * packages page shows what a sprint waives, the sprints page shows what a
 * sprint unlocks. Both must state identical terms, so the rows are content and
 * only the column headings change.
 *
 * A table rather than a fourth pricing card, by instruction. A card would set
 * a one-time fee beside three monthly ones and invite a comparison between two
 * things that are not comparable. It also has to stay scannable at a glance,
 * which is why the desktop layout is a real table and the mobile one is three
 * labelled blocks rather than a table that scrolls sideways.
 */
export function WaiverMatrix({ section }: { section: WaiverMatrixSection }) {
  const hasPrice = Boolean(
    section.priceHeading && section.rows.some((r) => r.price)
  );

  return (
    <section
      id={section.id}
      className={cn(
        "scroll-mt-24 py-12 md:py-16 lg:py-24",
        section.tone === "surface" ? "bg-surface-2" : "bg-white"
      )}
    >
      <Container>
        <Reveal className="mx-auto flex max-w-[900px] flex-col gap-4 text-center">
          {section.eyebrow ? (
            <p className="eyebrow eyebrow-dot mx-auto">{section.eyebrow}</p>
          ) : null}
          <h2 className="text-[1.875rem] sm:text-[2.25rem] lg:text-[2.625rem]">
            {section.heading}
          </h2>
          {section.body ? (
            <p className="mx-auto max-w-[68ch] text-[1.02rem] leading-relaxed text-subtle">
              {section.body}
            </p>
          ) : null}
        </Reveal>

        <div className="mx-auto mt-12 max-w-[900px] overflow-hidden rounded-bento border border-line bg-white">
          {/* Desktop: a real table, so the three rows line up column by column
              and the mapping is readable in one pass. */}
          <table className="hidden w-full border-collapse text-left sm:table">
            <thead>
              <tr className="border-b border-line bg-surface">
                <th
                  scope="col"
                  className="px-6 py-3.5 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-strong"
                >
                  {section.sprintHeading}
                </th>
                {hasPrice ? (
                  <th
                    scope="col"
                    className="px-6 py-3.5 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-strong"
                  >
                    {section.priceHeading}
                  </th>
                ) : null}
                <th
                  scope="col"
                  className="px-6 py-3.5 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-strong"
                >
                  {section.waivesHeading}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {section.rows.map((row) => (
                <tr key={row.sprint}>
                  <th
                    scope="row"
                    className="px-6 py-5 font-heading text-[0.95rem] font-bold text-ink-strong"
                  >
                    {row.sprint}
                  </th>
                  {hasPrice ? (
                    <td className="px-6 py-5 font-heading text-[0.95rem] font-bold tabular-nums text-teal-ink">
                      {row.price}
                    </td>
                  ) : null}
                  <td className="px-6 py-5 text-[0.92rem] leading-snug text-subtle">
                    {row.waives}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile: three labelled blocks. A three-column table at 360px
              either becomes unreadable or scrolls sideways, and this has to be
              scannable at a glance on both. */}
          <div className="divide-y divide-line sm:hidden">
            {section.rows.map((row) => (
              <div key={row.sprint} className="flex flex-col gap-2 px-5 py-5">
                <p className="font-heading text-[0.95rem] font-bold text-ink-strong">
                  {row.sprint}
                </p>
                {hasPrice && row.price ? (
                  <p className="font-heading text-[0.95rem] font-bold text-teal-ink">
                    {section.priceHeading}: {row.price}
                  </p>
                ) : null}
                <p className="text-[0.9rem] leading-snug text-subtle">
                  <span className="font-semibold text-ink-strong">
                    {section.waivesHeading}:
                  </span>{" "}
                  {row.waives}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="mx-auto mt-5 max-w-[68ch] text-center text-[0.88rem] leading-relaxed text-subtle">
          {section.condition}
        </p>

        {section.cta ? (
          <div className="mt-8 flex justify-center">
            <ArrowLink href={section.cta.href}>{section.cta.label}</ArrowLink>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
