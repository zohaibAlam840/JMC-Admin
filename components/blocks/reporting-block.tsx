import { Band, SectionHeader } from "@/components/ui/layout";
import { ArrowLink } from "@/components/ui/button";
import { Icon } from "@/components/blocks/icon";
import type { IconName, ReportingBlockSection } from "@/lib/types";

/**
 * The Monthly Recap — Build Spec §12.
 *
 * Four cards, this order, on every page that carries the block. The titles are
 * hard-coded rather than passed in: §12 says they never change per page, and
 * the spec exists specifically to replace five conflicting versions found
 * across the old wireframes. Making them data would reintroduce the drift it
 * was written to stop.
 *
 * Only the supporting sentence under each title varies, and only where a page
 * spec says so.
 *
 * Built on the standard card treatment so it reads as part of the same system
 * as every other grid on the site — §1.5 is explicit that repetition is the
 * aesthetic, and a bespoke layout here would break it.
 */
const CARDS: { title: string; key: "did" | "why" | "changed" | "next"; icon: IconName }[] = [
  { title: "What We Did", key: "did", icon: "clipboard-check" },
  { title: "Why We Did It", key: "why", icon: "compass" },
  { title: "What Changed", key: "changed", icon: "trending-up" },
  { title: "Where We're Headed", key: "next", icon: "target" },
];

export function ReportingBlock({
  section,
}: {
  section: ReportingBlockSection;
}) {
  return (
    <Band id={section.id} tone={section.tone}>
      <SectionHeader
        eyebrow={section.eyebrow}
        heading={section.heading}
        body={section.body}
        align="center"
      />

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((card) => {
          const supporting = section[card.key];

          return (
            <div
              key={card.title}
              className="group flex h-full flex-col rounded-card border border-line bg-white p-8 transition-shadow duration-200 hover:shadow-lift"
            >
              {/* 40px icon in a teal-tinted circle — the recurring card motif,
                  Build Spec §10. */}
              <span className="mb-5 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-teal/12 text-teal-ink">
                <Icon name={card.icon} size={20} />
              </span>

              <h3 className="text-[1.3125rem] leading-tight sm:text-[1.5rem]">
                {card.title}
              </h3>

              {supporting ? (
                <p className="mt-3 text-[0.95rem] leading-relaxed text-subtle">
                  {supporting}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      {section.cta ? (
        <div className="mt-12 flex justify-center">
          <ArrowLink href={section.cta.href}>{section.cta.label}</ArrowLink>
        </div>
      ) : null}
    </Band>
  );
}
