import { Container } from "@/components/ui/layout";
import { AuditFormFields } from "@/components/blocks/audit-form-fields";
import type { AuditFormSection } from "@/lib/types";

/**
 * The Free Visibility Audit band — Page Spec 04 §4.
 *
 * Placed directly after the symptom cards: the reader has just recognised
 * problems in their own profile, and this offers a specific answer to them.
 *
 * Solid ink rather than the brand gradient. White on #2C2C2C is 13.97:1, which
 * removes the contrast question from a section that has to carry form labels,
 * helper text, and error messages — none of which survive a gradient that ends
 * in teal.
 *
 * The band states no turnaround time anywhere, by decision. A stated deadline
 * would have to hold on the worst week rather than the average one, so the
 * reassurance moves to /thank-you?type=audit instead.
 */
export function AuditForm({ section }: { section: AuditFormSection }) {
  return (
    <section id={section.id} className="scroll-mt-24 bg-ink py-16 md:py-20 lg:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          <div className="flex flex-col gap-5">
            {section.eyebrow ? (
              <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-teal">
                {section.eyebrow}
              </p>
            ) : null}

            <h2 className="text-[1.875rem] text-white sm:text-[2.25rem]">
              {section.heading}
            </h2>

            <p className="max-w-[60ch] text-[1.02rem] leading-relaxed text-white/75">
              {section.body}
            </p>

            {section.covers?.length ? (
              <ul className="mt-2 flex flex-col gap-2.5">
                {section.covers.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-[0.95rem] leading-relaxed text-white/80"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-teal"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            {section.note ? (
              <p className="mt-2 text-[0.9rem] font-semibold text-teal">
                {section.note}
              </p>
            ) : null}
          </div>

          <div className="rounded-bento border border-white/12 bg-white/[0.04] p-6 sm:p-8">
            <AuditFormFields
              submitLabel={section.submitLabel}
              profileHelp={section.profileHelp}
              source={section.source}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
