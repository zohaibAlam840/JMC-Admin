import Link from "next/link";
import { Band, SectionHeader } from "@/components/ui/layout";
import { ArrowLink } from "@/components/ui/button";
import { Icon } from "@/components/blocks/icon";
import type { IndustryGridSection } from "@/lib/types";

/**
 * Industries, bucketed — Page Spec 01 §5.
 *
 * Two labelled groups of four rather than a flat grid of eight. The spec is
 * clear about why: a flat grid reads as "we do everything", while two groups
 * each tied to a service line reinforce the routing from the growth-paths
 * section and support the argument that one method is pointed at two engines.
 *
 * The framing rule matters as much as the layout. Each line names the kind of
 * business, never a claim of expertise in it — the whole page is built on the
 * method being industry-agnostic, and "we are experts in aerospace" would
 * contradict it.
 *
 * The group header is a label and a thin rule, and nothing else. The revised
 * spec forbids naming a service line beside it: each group holds both
 * single-area operators and multi-market competitors, so a lane label would be
 * wrong for half the cards under it.
 */
export function IndustryGrid({ section }: { section: IndustryGridSection }) {
  return (
    <Band id={section.id} tone={section.tone}>
      <SectionHeader
        eyebrow={section.eyebrow}
        heading={section.heading}
        body={section.body}
        align="center"
      />

      <div className="mt-12 flex flex-col gap-12">
        {section.groups.map((group) => (
          <div key={group.label}>
            <div className="flex items-center gap-4">
              <span className="shrink-0 text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-ink-strong">
                {group.label}
              </span>
              <span aria-hidden="true" className="h-px flex-1 bg-line" />
            </div>

            {/* 4 across on desktop, 2 on tablet, 1 on mobile. */}
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {group.cards.map((card) => {
                const inner = (
                  <>
                    {card.icon ? (
                      <span className="mb-5 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-teal/12 text-teal-ink">
                        <Icon name={card.icon} size={20} />
                      </span>
                    ) : null}
                    <h3 className="text-[1.1875rem] leading-tight">
                      {card.title}
                    </h3>
                    <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-subtle">
                      {card.body}
                    </p>
                  </>
                );

                const classes =
                  "flex h-full flex-col rounded-card border border-line bg-white p-8 transition-shadow duration-200";

                // The whole card is the click target when it has a
                // destination, not just a link inside it.
                return card.href ? (
                  <Link
                    key={card.title}
                    href={card.href}
                    className={`${classes} hover:shadow-lift`}
                  >
                    {inner}
                  </Link>
                ) : (
                  <div key={card.title} className={classes}>
                    {inner}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {section.escapeHatch ? (
        <p className="mx-auto mt-12 max-w-[68ch] text-center text-[1rem] leading-relaxed text-subtle">
          {section.escapeHatch}
        </p>
      ) : null}

      {section.cta ? (
        <div className="mt-8 flex justify-center">
          <ArrowLink href={section.cta.href}>{section.cta.label}</ArrowLink>
        </div>
      ) : null}
    </Band>
  );
}
