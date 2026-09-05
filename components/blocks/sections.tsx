import * as React from "react";
import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import {
  Band,
  Card,
  Container,
  HeroBackdrop,
  SectionHeader,
} from "@/components/ui/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { ProcessRoadmap } from "@/components/blocks/process-roadmap";
import { Icon, IconTile } from "@/components/blocks/icon";
import { PostCard } from "@/components/blocks/post-card";
import { HeroCardStack } from "@/components/blocks/hero-card-stack";
import { ReportingBlock } from "@/components/blocks/reporting-block";
import { IndustryGrid } from "@/components/blocks/industry-grid";
import { SearchGrid } from "@/components/blocks/search-grid";
import { FourQuestions } from "@/components/blocks/four-questions";
import { RecapExample } from "@/components/blocks/recap-example";
import { AuditForm } from "@/components/blocks/audit-form";
import { WaiverMatrix } from "@/components/blocks/waiver-matrix";
import { LinkStack } from "@/components/blocks/link-stack";
import { packages as filePackages } from "@/content/packages";
import { cn } from "@/lib/utils";
import type { Package, PostSummary } from "@/lib/types";
import type {
  CalloutBannerSection,
  CardGridSection,
  FaqSection,
  FeatureSplitSection,
  FinalCtaSection,
  FullWidthTextSection,
  HeroCenteredSection,
  HeroSplitSection,
  PostListSection,
  PricingCardsSection,
  Section,
} from "@/lib/types";

/* -------------------------------------------------------------------------- */
/*  03 · HeroSplit                                                             */
/* -------------------------------------------------------------------------- */

function HeroSplit({ section }: { section: HeroSplitSection }) {
  return (
    <section
      id={section.id}
      className="relative isolate scroll-mt-24 overflow-hidden py-12 md:py-16 lg:py-24"
    >
      <HeroBackdrop />

      <Container className="relative">
        {/*
         * 55 / 45, Build Spec §9A. The copy comes first in the DOM, so below
         * 768px it stacks to a single column with the visual underneath —
         * which is the order Page Spec 01 §1 asks for, without needing an
         * order utility to reshuffle it.
         */}
        <div className="grid items-center gap-12 lg:grid-cols-[55fr_45fr] lg:gap-16">
          <div className="flex flex-col items-start gap-6">
            <p className="eyebrow">{section.eyebrow}</p>

            {/*
             * 56px at desktop rather than the 64px in Build Spec §3.
             *
             * Anton has one weight and is very condensed, so at 64px a headline
             * of any length stops reading as type and becomes a solid block —
             * which is the opposite of the air §1.5 asks for. 56px keeps the
             * display voice the spec wants while letting the hero breathe.
             * Everything else about the H1 is as specified: Anton, weight 400,
             * line-height 1.05, tracking -0.01em.
             */}
            <h1 className="font-display text-[2.375rem] leading-[1.05] sm:text-[3rem] lg:text-[3.5rem]">
              {section.heading}
            </h1>

            <p className="max-w-[68ch] text-[1.1875rem] leading-relaxed text-subtle">
              {section.body}
            </p>

            <div className="mt-1 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button href={section.primaryCta.href} size="lg" className="group">
                {section.primaryCta.label}
                <ArrowRight
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Button>
              {section.secondaryCta ? (
                <Button
                  href={section.secondaryCta.href}
                  variant="secondary"
                  size="lg"
                >
                  {section.secondaryCta.label}
                </Button>
              ) : null}
            </div>
          </div>

          <div className="pb-10 lg:pb-0">
            <HeroCardStack cards={section.showcase} />
          </div>
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  04 · HeroCentered                                                          */
/* -------------------------------------------------------------------------- */

function HeroCentered({ section }: { section: HeroCenteredSection }) {
  return (
    <section
      id={section.id}
      className="relative isolate scroll-mt-28 overflow-hidden bg-surface-2 pb-20 pt-16 sm:pb-24 sm:pt-20 lg:pb-28"
    >
      <HeroBackdrop />

      <Container className="relative">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <Reveal direction="none" duration={0.5}>
            <Badge variant="soft" size="md">
              <Sparkles size={11} strokeWidth={2.5} aria-hidden="true" />
              {section.eyebrow}
            </Badge>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="font-display text-[2.375rem] leading-[1.05] sm:text-[3rem] lg:text-[3.5rem]">
              {section.heading}
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="text-[1.06rem] leading-relaxed text-subtle">
              {section.body}
            </p>
          </Reveal>

          {section.primaryCta ? (
            <Reveal delay={0.18} className="mt-1">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  href={section.primaryCta.href}
                  size="lg"
                  className="group"
                >
                  {section.primaryCta.label}
                  <ArrowRight
                    size={16}
                    aria-hidden="true"
                    className="transition-transform duration-300 ease-out-soft group-hover:translate-x-1"
                  />
                </Button>
                {section.secondaryCta ? (
                  <Button
                    href={section.secondaryCta.href}
                    variant="secondary"
                    size="lg"
                  >
                    {section.secondaryCta.label}
                  </Button>
                ) : null}
              </div>
            </Reveal>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  05 · CardGrid — carries roughly 30 sections across the site                 */
/* -------------------------------------------------------------------------- */

/**
 * The arrow label at the foot of a card.
 *
 * Rendered as a span rather than a link, because the card around it is already
 * the click target. Nesting an anchor inside an anchor is invalid HTML and
 * browsers unnest it silently, which breaks the outer link.
 */
function CardShell({
  href,
  className,
  children,
}: {
  href?: string;
  className: string;
  children: React.ReactNode;
}) {
  return href ? (
    <Link href={href} className={className}>
      {children}
    </Link>
  ) : (
    <div className={className}>{children}</div>
  );
}

function CardArrow({ label }: { label: string }) {
  return (
    <span className="mt-auto inline-flex items-center gap-1.5 pt-6 font-body text-[0.95rem] font-semibold text-teal-ink">
      {label}
      <span
        aria-hidden="true"
        className="transition-transform duration-200 group-hover:translate-x-0.5"
      >
        &rarr;
      </span>
    </span>
  );
}

const columnClass: Record<2 | 3 | 4 | 5, string> = {
  // Capped and centred, per Page Spec 01 §2: two cards across a 1200px
  // container stretch thin and stop reading as a pair of choices.
  2: "sm:grid-cols-2 mx-auto max-w-[960px]",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
  // Six tracks, each card spanning two. That is what makes 3 + 2 possible:
  // the fourth card starts one track in and the last row centres itself.
  5: "sm:grid-cols-2 lg:grid-cols-6 mx-auto max-w-[1100px]",
};

/**
 * Per-card class for the five-column layout.
 *
 * Page Spec 02 §4: five across at full width leaves every card too narrow to
 * read, so a five lays out as 3 + 2 centred. Padding to six with a filler card
 * is explicitly forbidden, which is why this is a layout problem rather than a
 * content one.
 */
function cellClass(columns: number, index: number, total: number) {
  if (columns !== 5) return "h-full";
  return cn(
    "h-full lg:col-span-2",
    total === 5 && index === 3 && "lg:col-start-2"
  );
}

/**
 * A full-width label inside the grid, marking the start of a run of cards.
 * Spans every column so it reads as a divider rather than as a seventh card.
 */
function GroupLabel({ label }: { label: string }) {
  return (
    <div className="col-span-full flex items-center gap-4 pt-2 first:pt-0">
      <span className="shrink-0 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-strong">
        {label}
      </span>
      <span aria-hidden="true" className="h-px flex-1 bg-line" />
    </div>
  );
}

function CardGrid({ section }: { section: CardGridSection }) {
  const variant = section.variant ?? "cards";
  // Coerced, because the admin repeater stores every field as a string and
  // "3" would never match the numeric index it is meant to sit before.
  const labelAt = new Map(
    (section.groupLabels ?? []).map((g) => [Number(g.at), g.label])
  );

  /* -- split: borderless rows with rules. No card chrome at all. ----------- */
  if (variant === "split") {
    return (
      <Band id={section.id} tone={section.tone}>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeader
            eyebrow={section.eyebrow}
            heading={section.heading}
            body={section.body}
            className="lg:sticky lg:top-28 lg:self-start"
          />

          <Stagger className="flex flex-col divide-y divide-line border-y border-line">
            {section.cards.map((card) => (
              <StaggerItem key={card.title}>
                <CardShell
                  href={card.cta?.href}
                  className="group flex items-start gap-5 py-6"
                >
                  {card.icon ? (
                    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-card border border-line bg-white text-teal-ink transition-colors duration-300 group-hover:border-transparent group-hover:bg-brand-black group-hover:text-white">
                      <Icon name={card.icon} size={19} />
                    </span>
                  ) : null}
                  <div>
                    <h3 className="text-[1.1875rem] leading-tight">
                      {card.title}
                    </h3>
                    {card.body ? (
                      <p className="mt-1.5 text-[0.9rem] leading-relaxed text-subtle">
                        {card.body}
                      </p>
                    ) : null}
                    {card.cta ? <CardArrow label={card.cta.label} /> : null}
                  </div>
                </CardShell>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        {section.cta ? (
          <Reveal className="mt-12">
            <Button href={section.cta.href} size="lg">
              {section.cta.label}
            </Button>
          </Reveal>
        ) : null}
      </Band>
    );
  }

  /* -- compact: dense tiles, icon inline with the title. ------------------- */
  if (variant === "compact") {
    return (
      <Band id={section.id} tone={section.tone}>
        <SectionHeader
          eyebrow={section.eyebrow}
          heading={section.heading}
          body={section.body}
        />

        <Stagger className={cn("mt-12 grid gap-3", columnClass[section.columns])}>
          {section.cards.map((card, i) => (
            <React.Fragment key={card.title + i}>
            {labelAt.has(i) ? <GroupLabel label={labelAt.get(i)!} /> : null}
            <StaggerItem
              className={cellClass(section.columns, i, section.cards.length)}
            >
              <CardShell
                href={card.cta?.href}
                className="group flex h-full flex-col rounded-card border border-line bg-white p-5 transition-shadow duration-200 hover:shadow-lift"
              >
                <div className="flex items-center gap-3">
                  {card.icon ? (
                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-surface text-teal-ink transition-colors duration-300 group-hover:bg-brand-black group-hover:text-white">
                      <Icon name={card.icon} size={18} />
                    </span>
                  ) : null}
                  <h3 className="text-[1.1875rem] leading-tight">
                    {card.title}
                  </h3>
                </div>
                {card.body ? (
                  <p className="mt-3 text-[0.85rem] leading-relaxed text-subtle">
                    {card.body}
                  </p>
                ) : null}
                {card.cta ? <CardArrow label={card.cta.label} /> : null}
              </CardShell>
            </StaggerItem>
            </React.Fragment>
          ))}
        </Stagger>

        {section.cta ? (
          <Reveal className="mt-12">
            <Button href={section.cta.href} size="lg" className="group">
              {section.cta.label}
              <ArrowRight
                size={16}
                aria-hidden="true"
                className="transition-transform duration-300 ease-out-soft group-hover:translate-x-1"
              />
            </Button>
          </Reveal>
        ) : null}
      </Band>
    );
  }

  /* -- cards + numbered ---------------------------------------------------- */
  return (
    <Band id={section.id} tone={section.tone}>
      <SectionHeader
        eyebrow={section.eyebrow}
        heading={section.heading}
        body={section.body}
      />

      <Stagger className={cn("mt-12 grid gap-5", columnClass[section.columns])}>
        {section.cards.map((card, i) => (
          <React.Fragment key={card.title + i}>
          {labelAt.has(i) ? <GroupLabel label={labelAt.get(i)!} /> : null}
          <StaggerItem
            className={cellClass(section.columns, i, section.cards.length)}
          >
            <Card
              interactive
              href={card.cta?.href}
              className={cn(
                "group relative overflow-hidden",
                // Reporting sections are the site's differentiator, so they get
                // the gradient rule rather than a generic border.
                section.emphasis && "shadow-soft"
              )}
            >
              {section.emphasis ? (
                <span
                  aria-hidden="true"
                  className="gradient-brand absolute inset-x-0 top-0 h-1"
                />
              ) : null}

              {variant === "numbered" ? (
                <span className="mb-5 inline-flex size-11 items-center justify-center rounded-card border border-line bg-surface font-display text-base font-bold leading-none transition-colors duration-300 group-hover:border-transparent group-hover:bg-brand-black">
                  <span className="gradient-text">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </span>
              ) : card.icon ? (
                <IconTile name={card.icon} />
              ) : null}

              <h3 className="text-[1.3125rem] leading-tight sm:text-[1.5rem]">
                {card.title}
              </h3>

              {card.meta ? (
                <p className="mt-2 font-heading text-[1.0625rem] font-bold text-teal-ink">
                  {card.meta}
                </p>
              ) : null}

              {card.body ? (
                <p className="mt-3 max-w-[68ch] text-[0.92rem] leading-relaxed text-subtle">
                  {card.body}
                </p>
              ) : null}

              {card.visual === "searchGrid" ? <SearchGrid /> : null}

              {card.cta ? <CardArrow label={card.cta.label} /> : null}
            </Card>
          </StaggerItem>
          </React.Fragment>
        ))}
      </Stagger>

      {section.cta ? (
        <Reveal className="mt-12">
          <Button href={section.cta.href} size="lg" className="group">
            {section.cta.label}
            <ArrowRight
              size={16}
              aria-hidden="true"
              className="transition-transform duration-300 ease-out-soft group-hover:translate-x-1"
            />
          </Button>
        </Reveal>
      ) : null}
    </Band>
  );
}

/* -------------------------------------------------------------------------- */
/*  06 · ProcessSteps                                                          */
/* -------------------------------------------------------------------------- */

/** Rendered by ProcessRoadmap — a dark band with the steps drawn as a route. */

/* -------------------------------------------------------------------------- */
/*  07 · FullWidthText                                                         */
/* -------------------------------------------------------------------------- */

function FullWidthText({ section }: { section: FullWidthTextSection }) {
  /*
   * Page Spec 01 §3. Solid ink, not the gradient: white on #2C2C2C is 13.97:1,
   * which removes the contrast constraint entirely, and a flat dark band suits
   * a statement about clarity better than a gradient does. Teal is available
   * here only as a rule or an accent mark.
   *
   * No cards and no icons, by instruction. This band is the visual peak of the
   * page it sits on, and the whitespace is doing the work.
   */
  if (section.treatment === "statement") {
    return (
      <section
        id={section.id}
        className="scroll-mt-24 bg-ink py-20 text-white md:py-28 lg:py-32"
      >
        <Container>
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
            {section.eyebrow ? (
              <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-teal">
                {section.eyebrow}
              </p>
            ) : null}

            <span
              aria-hidden="true"
              className="h-[3px] w-16 rounded-full bg-[linear-gradient(135deg,var(--color-teal),var(--color-blue))]"
            />

            <h2 className="text-[1.875rem] text-white sm:text-[2.5rem] lg:text-[3rem]">
              {section.heading}
            </h2>

            <p className="max-w-[60ch] text-[1.0625rem] leading-relaxed text-white/75">
              {section.body}
            </p>

            {section.cta ? (
              <Link
                href={section.cta.href}
                className="mt-2 text-[0.95rem] font-semibold text-teal underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                {section.cta.label}
              </Link>
            ) : null}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <Band
      id={section.id}
      tone={section.tone}
      className="relative isolate overflow-hidden"
    >
      <Reveal className="relative mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
        {section.eyebrow ? (
          <p className="eyebrow eyebrow-dot">{section.eyebrow}</p>
        ) : null}
        <h2 className="text-[1.875rem] sm:text-[2.25rem] lg:text-[2.625rem]">
          {section.heading}
        </h2>
        <p className="max-w-[68ch] text-[1.0625rem] leading-relaxed text-subtle">
          {section.body}
        </p>
        {section.cta ? (
          <div className="mt-3">
            <Button href={section.cta.href} variant="secondary" size="lg">
              {section.cta.label}
            </Button>
          </div>
        ) : null}
      </Reveal>
    </Band>
  );
}
/* -------------------------------------------------------------------------- */
/*  08 · FeatureSplit                                                          */
/* -------------------------------------------------------------------------- */

function FeatureSplit({ section }: { section: FeatureSplitSection }) {
  const copyFirst = section.align !== "right";
  /*
   * This is the one section whose copy regularly runs to two paragraphs, and
   * a blank line typed in the admin has to survive as one. Rendered into a
   * single <p> it collapses to a wall of text, which is exactly what the
   * longer sections here are trying not to be.
   */
  const paragraphs = section.body.split(/\n\s*\n/).filter(Boolean);

  return (
    <Band id={section.id} tone={section.tone}>
      <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal
          direction={copyFirst ? "right" : "left"}
          className={cn("flex flex-col gap-5", !copyFirst && "lg:order-2")}
        >
          {section.eyebrow ? (
            <p className="eyebrow eyebrow-dot">{section.eyebrow}</p>
          ) : null}
          <h2 className="text-[1.875rem] sm:text-[2.25rem] lg:text-[2.625rem]">
            {section.heading}
          </h2>
          <div className="flex flex-col gap-4">
            {paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="text-[1.02rem] leading-relaxed text-subtle"
              >
                {paragraph}
              </p>
            ))}
          </div>
          {section.cta ? (
            <div className="mt-2">
              <Button href={section.cta.href} size="lg" className="group">
                {section.cta.label}
                <ArrowRight
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-300 ease-out-soft group-hover:translate-x-1"
                />
              </Button>
            </div>
          ) : null}
        </Reveal>

        {section.tableHeadings && section.tableRows ? (
          /*
           * A real table, not a grid of cards. Both sections that use it are
           * making an argument out of the alignment: "this stays the same,
           * that changes" on the industries hub, and "here is how coverage
           * grows by tier" before the Traditional pricing cards. Cards would
           * let the eye read down one column without ever lining the two up.
           */
          <Reveal
            className={cn(
              "overflow-x-auto rounded-bento border border-line bg-white",
              !copyFirst && "lg:order-1"
            )}
          >
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-line bg-surface">
                  {section.tableHeadings.map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="px-4 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-ink-strong sm:px-5"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {section.tableRows.map((row) => (
                  <tr key={row.cells[0]}>
                    {row.cells.map((cell, i) => (
                      <th
                        key={cell + i}
                        scope={i === 0 ? "row" : undefined}
                        className={cn(
                          "px-4 py-4 text-[0.88rem] leading-snug sm:px-5",
                          i === 0
                            ? "font-heading font-bold text-ink-strong"
                            : "font-normal tabular-nums text-subtle"
                        )}
                      >
                        {cell}
                      </th>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        ) : (
        <Stagger
          className={cn(
            "grid gap-4 sm:grid-cols-2",
            !copyFirst && "lg:order-1"
          )}
        >
          {section.groups.map((group, i) => (
            <StaggerItem key={group.title} className="h-full">
              <div
                className={cn(
                  "h-full rounded-bento border border-line bg-white p-5 transition-all duration-300 ease-out-soft hover:-translate-y-1.5 hover:border-teal/50 hover:shadow-lift",
                  // Offset alternate cards so the group reads as a composition
                  // rather than a plain grid.
                  i % 2 === 1 && "sm:translate-y-6"
                )}
              >
                {group.icon ? (
                  <span className="mb-4 inline-flex size-10 items-center justify-center rounded-card bg-surface text-teal-ink">
                    <Icon name={group.icon} size={18} />
                  </span>
                ) : null}
                <h3 className="text-[1.1875rem] leading-tight">
                  {group.title}
                </h3>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-subtle">
                  {group.body}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
        )}
      </div>
    </Band>
  );
}

/* -------------------------------------------------------------------------- */
/*  09 · PricingCards                                                          */
/* -------------------------------------------------------------------------- */

function PricingCards({
  section,
  packages,
}: {
  section: PricingCardsSection;
  packages: Package[];
}) {
  // Resolved against the live package list rather than duplicated in the
  // section, so a price edited once in /admin updates every page showing it.
  // Ids that no longer exist — or that have been hidden — simply drop out.
  const byId = new Map(packages.map((p) => [p.id, p]));
  const items = section.packageIds
    .map((id) => byId.get(id))
    .filter((p): p is Package => Boolean(p));

  return (
    <Band id={section.id} tone={section.tone}>
      <SectionHeader
        eyebrow={section.eyebrow}
        heading={section.heading}
        body={section.body}
      />

      <Stagger
        className={cn(
          "mt-12 grid items-stretch gap-5",
          items.length === 2
            ? "sm:grid-cols-2"
            : items.length >= 4
              ? "sm:grid-cols-2 lg:grid-cols-4"
              : "sm:grid-cols-2 lg:grid-cols-3"
        )}
      >
        {items.map((pkg) => {
          // Sprints run 8 to 10 deliverables against a monthly tier's 5 or 6.
          // In one column that is a card twice the height of the ones beside
          // it, so Page Spec 07 §4 splits the list in two on desktop.
          const isSprint = pkg.group === "sprint";
          return (
          <StaggerItem key={pkg.id} className="h-full">
            <div
              className={cn(
                "relative flex h-full flex-col rounded-bento border bg-white p-7 transition-all duration-300 ease-out-soft hover:-translate-y-1.5 hover:shadow-lift",
                pkg.featured
                  ? "border-teal shadow-lift lg:-my-3 lg:py-10"
                  : "border-line"
              )}
            >
              {pkg.featured ? (
                <Badge
                  variant="brand"
                  size="sm"
                  className="absolute -top-2.5 left-7 shadow-soft"
                >
                  Most chosen
                </Badge>
              ) : null}

              <h3 className="text-[1.3125rem] leading-tight sm:text-[1.5rem]">
                {pkg.name}
              </h3>

              {pkg.positioning ? (
                <p className="mt-1.5 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-teal-ink">
                  {pkg.positioning}
                </p>
              ) : null}

              <p className="mt-4 flex items-baseline gap-1.5">
                <span
                  className={cn(
                    "font-display font-bold leading-none text-ink-strong",
                    pkg.pricingPending ? "text-[1.35rem]" : "text-[2.75rem]"
                  )}
                >
                  {pkg.price}
                </span>
                {pkg.priceUnit ? (
                  <span className="text-[0.86rem] text-subtle">
                    {pkg.priceUnit}
                  </span>
                ) : null}
              </p>

              {pkg.onboardingFee ? (
                <p className="mt-1.5 text-[0.82rem] text-subtle">
                  + {pkg.onboardingFee} onboarding
                </p>
              ) : null}
              {pkg.timeline ? (
                <p className="mt-1.5 text-[0.82rem] text-subtle">
                  Completed within {pkg.timeline}
                </p>
              ) : null}
              {pkg.term ? (
                <p className="mt-1.5 text-[0.82rem] text-subtle">{pkg.term}</p>
              ) : null}

              <p className="mt-5 border-t border-line pt-5 text-[0.88rem] leading-relaxed text-subtle">
                {pkg.bestFit}
              </p>

              <ul
                className={cn(
                  "mt-5 flex-1 gap-2.5",
                  isSprint
                    ? "grid content-start sm:grid-cols-2 sm:gap-x-5"
                    : "flex flex-col"
                )}
              >
                {pkg.deliverables.map((d) => (
                  <li key={d} className="flex gap-2.5 text-[0.86rem] leading-snug">
                    <span className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-pill bg-surface text-teal-ink">
                      <Check size={10} strokeWidth={3.5} aria-hidden="true" />
                    </span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>

              <Button
                href={pkg.cta.href}
                variant={pkg.featured ? "primary" : "secondary"}
                className="mt-7 w-full"
              >
                {pkg.cta.label}
              </Button>
            </div>
          </StaggerItem>
        );
      })}
      </Stagger>

      {section.cta ? (
        <Reveal className="mt-12">
          <Button href={section.cta.href} variant="secondary" size="lg">
            {section.cta.label}
          </Button>
        </Reveal>
      ) : null}
    </Band>
  );
}

/* -------------------------------------------------------------------------- */
/*  10 · CalloutBanner                                                         */
/* -------------------------------------------------------------------------- */

function CalloutBanner({ section }: { section: CalloutBannerSection }) {
  return (
    <Band id={section.id} tone={section.tone}>
      <Reveal>
        <div className="relative overflow-hidden rounded-bento border border-line bg-white p-8 shadow-soft lg:p-12">
          <span
            aria-hidden="true"
            className="gradient-brand absolute inset-y-0 left-0 w-1.5"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-[radial-gradient(closest-side,rgba(54,209,220,0.16),transparent)]"
          />

          <div className="relative flex flex-col items-start gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-[1.875rem] sm:text-[2.25rem]">
                {section.heading}
              </h2>
              <p className="mt-3 text-[0.98rem] leading-relaxed text-subtle">
                {section.body}
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Button href={section.primaryCta.href}>
                {section.primaryCta.label}
              </Button>
              {section.secondaryCta ? (
                <Button href={section.secondaryCta.href} variant="secondary">
                  {section.secondaryCta.label}
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </Reveal>
    </Band>
  );
}

/* -------------------------------------------------------------------------- */
/*  11 · FAQ                                                                   */
/* -------------------------------------------------------------------------- */

function Faq({ section }: { section: FaqSection }) {
  return (
    <Band id={section.id} tone={section.tone}>
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal direction="right" className="lg:sticky lg:top-28 lg:self-start">
          <div className="flex flex-col gap-4">
            {section.eyebrow ? (
              <p className="eyebrow eyebrow-dot">{section.eyebrow}</p>
            ) : null}
            <h2 className="text-[1.875rem] sm:text-[2.25rem] lg:text-[2.625rem]">
              {section.heading}
            </h2>
            {section.cta ? (
              <div className="mt-3 hidden lg:block">
                <Button href={section.cta.href} className="group">
                  {section.cta.label}
                  <ArrowRight
                    size={16}
                    aria-hidden="true"
                    className="transition-transform duration-300 ease-out-soft group-hover:translate-x-1"
                  />
                </Button>
              </div>
            ) : null}
          </div>
        </Reveal>

        <Reveal direction="left" delay={0.08}>
          {/* One item open at a time, first item open on load. §11. */}
          <Accordion
            type="single"
            collapsible
            defaultValue="item-0"
            className="flex flex-col gap-3"
          >
            {section.items.map((item, i) => (
              <AccordionItem key={item.question} value={`item-${i}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {section.cta ? (
            <div className="mt-8 lg:hidden">
              <Button href={section.cta.href} size="lg" className="w-full">
                {section.cta.label}
              </Button>
            </div>
          ) : null}
        </Reveal>
      </div>
    </Band>
  );
}

/* -------------------------------------------------------------------------- */
/*  12 · FinalCta                                                              */
/* -------------------------------------------------------------------------- */

function FinalCta({ section }: { section: FinalCtaSection }) {
  return (
    <section
      id={section.id}
      className="gradient-brand relative isolate scroll-mt-28 overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="grid-backdrop pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(70%_70%_at_50%_50%,black,transparent)]"
      />
      <Container className="relative py-20 sm:py-24">
        <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
          <h2 className="text-[1.875rem] text-brand-black sm:text-[2.25rem] lg:text-[2.625rem]">
            {section.heading}
          </h2>
          <p className="text-[1.05rem] leading-relaxed text-brand-black/80">
            {section.body}
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <Button
              href={section.primaryCta.href}
              variant="dark"
              size="lg"
              className="group"
            >
              {section.primaryCta.label}
              <ArrowRight
                size={16}
                aria-hidden="true"
                className="transition-transform duration-300 ease-out-soft group-hover:translate-x-1"
              />
            </Button>
            {section.secondaryCta ? (
              <Button
                href={section.secondaryCta.href}
                variant="onBrand"
                size="lg"
              >
                {section.secondaryCta.label}
              </Button>
            ) : null}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  13 · PostList                                                              */
/* -------------------------------------------------------------------------- */

function PostList({
  section,
  posts,
}: {
  section: PostListSection;
  posts: PostSummary[];
}) {
  // Filtered here rather than in a second query: the caller fetches one page of
  // recent posts, and a page carrying two of these blocks should not mean two
  // round trips.
  const items = (
    section.category
      ? posts.filter((p) => p.category === section.category)
      : posts
  ).slice(0, section.limit ?? 3);

  return (
    <Band id={section.id} tone={section.tone}>
      <SectionHeader
        eyebrow={section.eyebrow}
        heading={section.heading}
        body={section.body}
      />

      {items.length === 0 ? (
        <Reveal className="mt-10">
          <p className="rounded-bento border border-dashed border-line-strong px-6 py-12 text-center text-[0.95rem] text-subtle">
            {section.emptyMessage ??
              "The first articles are being written now — check back shortly."}
          </p>
        </Reveal>
      ) : (
        <Stagger
          className={cn(
            "mt-12 grid items-stretch gap-5",
            items.length === 1
              ? "sm:max-w-xl"
              : items.length === 2
                ? "sm:grid-cols-2"
                : "sm:grid-cols-2 lg:grid-cols-3"
          )}
        >
          {items.map((post) => (
            <StaggerItem key={post.slug} className="h-full">
              <PostCard post={post} />
            </StaggerItem>
          ))}
        </Stagger>
      )}

      {section.cta ? (
        <Reveal className="mt-12">
          <Button href={section.cta.href} variant="secondary" size="lg">
            {section.cta.label}
          </Button>
        </Reveal>
      ) : null}
    </Band>
  );
}

/* -------------------------------------------------------------------------- */
/*  Renderer                                                                    */
/* -------------------------------------------------------------------------- */

function renderSection(
  section: Section,
  packages: Package[],
  posts: PostSummary[]
) {
  switch (section.type) {
    case "heroSplit":
      return <HeroSplit key={section.id} section={section} />;
    case "heroCentered":
      return <HeroCentered key={section.id} section={section} />;
    case "cardGrid":
      return <CardGrid key={section.id} section={section} />;
    case "processSteps":
      return <ProcessRoadmap key={section.id} section={section} />;
    case "fullWidthText":
      return <FullWidthText key={section.id} section={section} />;
    case "featureSplit":
      return <FeatureSplit key={section.id} section={section} />;
    case "pricingCards":
      return (
        <PricingCards key={section.id} section={section} packages={packages} />
      );
    case "calloutBanner":
      return <CalloutBanner key={section.id} section={section} />;
    case "faq":
      return <Faq key={section.id} section={section} />;
    case "finalCta":
      return <FinalCta key={section.id} section={section} />;
    case "industryGrid":
      return <IndustryGrid key={section.id} section={section} />;
    case "reportingBlock":
      return <ReportingBlock key={section.id} section={section} />;
    case "linkStack":
      return <LinkStack key={section.id} section={section} />;
    case "fourQuestions":
      return <FourQuestions key={section.id} section={section} />;
    case "recapExample":
      return <RecapExample key={section.id} section={section} />;
    case "auditForm":
      return <AuditForm key={section.id} section={section} />;
    case "waiverMatrix":
      return <WaiverMatrix key={section.id} section={section} />;
    case "postList":
      return <PostList key={section.id} section={section} posts={posts} />;
    default: {
      /*
       * Compile time: assigning to `never` means adding a type to the union
       * without a renderer here is a type error rather than a blank space on
       * the page. That part was always right and stays.
       *
       * Run time: render nothing. Returning `_never` returned the section
       * object itself, React refused it as a child, and the exception took
       * the whole page down as a 500 — which is exactly what happened to
       * /monthly-seo-packages, /seo-reporting and /industries when the
       * database was migrated ahead of the deploy that could draw the new
       * blocks.
       *
       * The database is edited independently of this code and will run ahead
       * of it again: a migration lands before its deploy, or a rollback puts
       * old code in front of a new database. A block this build cannot draw
       * should cost that block, not the page around it.
       */
      const _never: never = section;
      void _never;
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[sections] no renderer for type "${(section as Section).type}" — skipped`
        );
      }
      return null;
    }
  }
}

export function Sections({
  sections,
  packages,
  posts = [],
}: {
  sections: Section[];
  /** Live package list. Falls back to the content file when not supplied. */
  packages?: Package[];
  /** Recent articles, for any "Latest articles" block on the page. */
  posts?: PostSummary[];
}) {
  const resolved = packages ?? filePackages.filter((p) => p.visible !== false);
  return (
    <>{sections.map((section) => renderSection(section, resolved, posts))}</>
  );
}
