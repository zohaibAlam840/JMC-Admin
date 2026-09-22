import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Band, Card, Container, SectionHeader } from "@/components/ui/layout";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { ConversionEvent } from "@/components/blocks/conversion-event";

/**
 * Conversion confirmation — Page Spec 13.
 *
 * A small page carrying more load than usual. Neither form on the site states
 * a response time, because a promised turnaround has to hold on the worst week
 * rather than the average one. The consequence is that this page does the
 * reassuring instead: if it says nothing useful, a visitor is left wondering
 * whether the submission went anywhere at all.
 *
 * It also carries every conversion event on the site. If it fails to load, the
 * analytics show no conversions however many leads arrive.
 *
 * Three variants, switched on ?type=. An unrecognised value falls back to the
 * default rather than rendering an empty state.
 */
export const metadata: Metadata = {
  title: "Thank You",
  description: "Your request has been received.",
  robots: { index: false, follow: true },
};

type Variant = {
  heading: string;
  intro: string;
  /** The conversion event this variant fires. */
  event: string;
  steps: { title: string; body: string }[];
  /** Onward links so the page is not a dead end. */
  onward: { title: string; body: string; href: string }[];
};

/*
 * Default, from the Visibility Review form.
 *
 * No pricing link in the onward cards, per §3: someone who has just requested
 * a review does not need to be sold to again.
 */
const review: Variant = {
  heading: "Request Received",
  intro:
    "The request arrived and a person will read it. Here is what happens to it.",
  event: "lead_visibility_review",
  steps: [
    {
      title: "The enquiry is read",
      body: "By a person, not an autoresponder, and not the start of a sales sequence.",
    },
    {
      title: "A look at the current setup",
      body: "Reviewed before any conversation, so the call is about substance rather than about collecting basic facts.",
    },
    {
      title: "A conversation",
      body: "What is worth doing first, and the reasoning behind that order.",
    },
  ],
  onward: [
    {
      title: "How JMC reports progress",
      body: "The four questions every recap answers, and what one actually contains.",
      href: "/seo-reporting",
    },
    {
      title: "Industries JMC works with",
      body: "Eight kinds of business, and what changes between them.",
      href: "/industries",
    },
    {
      title: "About JMC",
      body: "Why the agency does one thing, and what it declines.",
      href: "/about",
    },
  ],
};

/*
 * Sprint, reached from a Launch Sprints CTA carrying ?type=sprint. A sprint
 * enquiry is a different conversation from a visibility review, and landing it
 * on the generic confirmation would describe the wrong next step.
 */
const sprint: Variant = {
  heading: "Sprint Enquiry Received",
  intro:
    "The enquiry arrived and a person will read it. A Launch Sprint is a fixed scope inside a fixed window, so the first step is agreeing exactly what is in it.",
  event: "lead_sprint_consultation",
  steps: [
    {
      title: "The enquiry is read",
      body: "By a person, along with a look at which of the three sprints matches the problem described.",
    },
    {
      title: "A look at the current foundation",
      body: "Where the site and the profile stand today, reviewed before the scope conversation rather than during it.",
    },
    {
      title: "A conversation about scope",
      body: "The deliverable list is the whole list, and it is agreed before the window opens.",
    },
  ],
  onward: [
    {
      title: "How JMC reports progress",
      body: "The four questions every recap answers, and what one actually contains.",
      href: "/seo-reporting",
    },
    {
      title: "Industries JMC works with",
      body: "Eight kinds of business, and what changes between them.",
      href: "/industries",
    },
    {
      title: "About JMC",
      body: "Why the agency does one thing, and what it declines.",
      href: "/about",
    },
  ],
};

/*
 * Audit, from the Free Visibility Audit form on the GBP page.
 *
 * The three steps here mirror the auto-reply email exactly, same content and
 * same sequence, so a visitor reading both does not find two versions of what
 * is about to happen.
 *
 * This is the one variant that links to offers, per §3: that visitor has not
 * spoken to anyone yet.
 */
const audit: Variant = {
  heading: "Audit Request Received",
  intro:
    "The request arrived and it is in the queue. A written audit comes back by email.",
  event: "lead_free_audit",
  steps: [
    {
      title: "The profile and site are reviewed",
      body: "A person reviews it, not a tool alone. Categories, services, business information, listing consistency, and where the profile is visible across the area served.",
    },
    {
      title: "The audit is written",
      body: "Structured around what was found and what it means, on the same four headings as the monthly recap.",
    },
    {
      title: "It arrives by email",
      body: "No call required, and no obligation attached to reading it.",
    },
  ],
  onward: [
    {
      title: "Local SEO services",
      body: "What ongoing local visibility work covers, month to month.",
      href: "/local-seo-services",
    },
    {
      title: "Launch Sprints",
      body: "Fixed scope inside a fixed window, for a foundation that needs building once.",
      href: "/launch-sprints",
    },
    {
      title: "How JMC reports progress",
      body: "The four questions every recap answers, and what one actually contains.",
      href: "/seo-reporting",
    },
  ],
};

export default async function Page({ searchParams }: PageProps<"/thank-you">) {
  const params = await searchParams;
  const type = typeof params.type === "string" ? params.type : "";
  const tier = typeof params.tier === "string" ? params.tier : undefined;

  const variant = type === "audit" ? audit : type === "sprint" ? sprint : review;

  return (
    <>
      <ConversionEvent event={variant.event} tier={tier} />

      {/*
       * A clear statement, set well. No confetti, no animated checkmark: the
       * visitor has just been told a person will read what they sent, and a
       * celebration graphic is the wrong register for that promise.
       */}
      <section className="scroll-mt-24 bg-white py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-[680px] text-center">
            <span className="mx-auto inline-flex size-14 items-center justify-center rounded-pill bg-brand-black text-white">
              <Check size={24} strokeWidth={3} aria-hidden="true" />
            </span>

            <h1 className="mt-6 font-display text-[2.125rem] leading-[1.05] sm:text-[2.625rem]">
              {variant.heading}
            </h1>
            <p className="mt-4 text-[1.06rem] leading-relaxed text-subtle">
              {variant.intro}
            </p>
          </div>
        </Container>
      </section>

      {/*
       * The section that replaces a response-time promise, so it has to be
       * concrete. Steps, never dates: no hour count, no "shortly", nothing in
       * the cards and nothing in a caption either.
       */}
      <Band tone="surface">
        <SectionHeader eyebrow="What happens next" heading="Three Steps, No Dates" />

        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {variant.steps.map((step, i) => (
            <StaggerItem key={step.title} className="h-full">
              <Card className="gap-3">
                <span className="inline-flex size-11 items-center justify-center rounded-card border border-line bg-surface font-display text-base font-bold leading-none">
                  <span className="gradient-text">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </span>
                <h2 className="text-[1.1875rem] leading-tight">{step.title}</h2>
                <p className="text-[0.9rem] leading-relaxed text-subtle">
                  {step.body}
                </p>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </Band>

      {/* Plain cards, no buttons. Low-key, so the page is not a dead end
          without becoming another pitch. */}
      <Band tone="white">
        <SectionHeader
          eyebrow="While you're here"
          heading="Worth a Look"
        />

        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {variant.onward.map((link) => (
            <StaggerItem key={link.href} className="h-full">
              <Card interactive href={link.href} className="group gap-2.5">
                <h2 className="text-[1.1875rem] leading-tight">{link.title}</h2>
                <p className="text-[0.9rem] leading-relaxed text-subtle">
                  {link.body}
                </p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-5 font-body text-[0.9rem] font-semibold text-teal-ink">
                  Read on
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    &rarr;
                  </span>
                </span>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </Band>
    </>
  );
}
