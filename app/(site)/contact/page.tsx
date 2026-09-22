import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Band, Card, Container, SectionHeader } from "@/components/ui/layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Icon } from "@/components/blocks/icon";
import { LeadForm } from "@/components/blocks/lead-form";
import { JsonLd, faqSchema } from "@/components/seo/json-ld";
import { getSiteConfig } from "@/lib/content";
import type { FaqItem, IconName } from "@/lib/types";

/**
 * Contact — Page Spec 12.
 *
 * Short page, the most functional complexity on the site. Three lead types
 * exist; this page handles two of them. The Visibility Review is the default,
 * a Sprint Consultation arrives as ?type=sprint from the Launch Sprints CTAs,
 * and the Free Visibility Audit lives on the GBP page and never comes here.
 *
 * Two URL parameters are read. `type` reframes the hero, the form's submit
 * button and §3. `tier` shows the package a visitor was looking at as a line
 * of context above the form, not as a preselected field they have to notice
 * and correct. Both travel through to the CRM for attribution. Neither changes
 * which fields are required, and an unrecognised value falls back to the
 * default view rather than rendering an empty state.
 *
 * The canonical is always /contact, regardless of parameters, so the six tier
 * URLs and the sprint URL never compete with it in the index.
 */
export const metadata: Metadata = {
  title: "Contact JMC | Request a Visibility Review",
  description:
    "Request a Visibility Review from Jordan Marketing Consultants, a Houston-area SEO agency in League City. A look at where your business shows up in search today, and what is worth doing first.",
  alternates: { canonical: "/contact" },
};

/*
 * The six tiers from the pricing cards. Display names, not slugs: a visitor
 * who clicked "Start with Metro" should see the word they clicked.
 *
 * Anything not on this list is ignored, which is what makes a hand-edited or
 * truncated URL harmless.
 */
const TIER_LABELS: Record<string, string> = {
  neighborhood: "Neighborhood",
  citywide: "Citywide",
  metro: "Metro",
  regional: "Regional",
  national: "National",
  "national-plus": "National+",
};

type Copy = {
  heading: string;
  intro: string;
  formHeading: string;
  submitLabel: string;
  expectationsHeading: string;
  expectationsBody: string;
  cards: { title: string; body: string; icon: IconName }[];
};

const review: Copy = {
  heading: "Request a Visibility Review",
  intro:
    "Describe the business and what is not working in search. The review looks at where it currently shows up, and comes back with the gaps worth acting on first.",
  formHeading: "Tell JMC about the business",
  submitLabel: "Request a Visibility Review",
  expectationsHeading: "What a Visibility Review Is",
  expectationsBody:
    "It is a conversation about a specific business, not a generic report with a logo dropped on it.",
  cards: [
    {
      title: "A Conversation",
      icon: "message-square",
      body: "A call, not a form response and not an automated sequence.",
    },
    {
      title: "A Look at What's There",
      icon: "search",
      body: "The current setup is reviewed before the call, so the time is spent on substance rather than on gathering facts.",
    },
    {
      title: "No Obligation",
      icon: "clipboard-check",
      body: "No commitment attached. If JMC is not the right fit, that gets said.",
    },
  ],
};

/*
 * Sprint. A sprint enquiry is a different conversation: a fixed scope inside a
 * fixed window, where the first question is which of the three sprints matches
 * the problem. Landing it on the review copy would describe the wrong thing.
 */
const sprint: Copy = {
  heading: "Request a Sprint Consultation",
  intro:
    "A Launch Sprint is a fixed scope inside a fixed window. Describe the current foundation and the consultation works out which of the three sprints fits.",
  formHeading: "Tell JMC about the business",
  submitLabel: "Request a Sprint Consultation",
  expectationsHeading: "What a Sprint Consultation Is",
  expectationsBody:
    "A conversation about scope. The point is to agree what is in the thirty days before anything starts.",
  cards: [
    {
      title: "A Conversation",
      icon: "message-square",
      body: "A call about which sprint matches the problem, not a form response.",
    },
    {
      title: "A Look at What's There",
      icon: "search",
      body: "The current foundation is reviewed first, so the scope discussion starts from what actually exists.",
    },
    {
      title: "Scope Before Commitment",
      icon: "clipboard-check",
      body: "The deliverable list is agreed in writing before the window opens. If JMC is not the right fit, that gets said.",
    },
  ],
};

/*
 * Steps rather than dates, matching the form's right-hand column and the
 * confirmation page. Neither form states a response time, so nothing here may
 * imply one either.
 */
const NEXT_STEPS = [
  {
    title: "The enquiry is read by a person",
    body: "Not an autoresponder, and not a sales sequence.",
  },
  {
    title: "A short look at the current setup",
    body: "The site, the profile, and where the business currently appears.",
  },
  {
    title: "A conversation about what is worth doing first",
    body: "Priorities in order, with the reasoning behind the order.",
  },
];

const faqItems: FaqItem[] = [
  {
    question: "What happens after this form is sent?",
    answer:
      "The enquiry is read by a person. The current setup gets a short review before any conversation, so the call is spent on priorities rather than on collecting basic facts. Then a conversation about what is worth doing first.",
  },
  {
    question: "Is the Visibility Review free?",
    answer:
      "Yes, and there is no obligation attached to it. It is the first step on every engagement, and it is useful even when it ends in advice rather than a contract.",
  },
  {
    question: "What is the difference between this and the free audit?",
    answer:
      "The Visibility Review is a conversation. The Free Visibility Audit is a written report on a Google Business Profile that arrives by email with no call required. If a call is not what you want right now, the audit is the better starting point.",
  },
  {
    question: "Does JMC work outside the Houston area?",
    answer:
      "Yes. JMC is based in League City and Local SEO clients are often nearby, but Traditional SEO clients compete regionally and nationally. The work is built around where your customers are, not around where JMC is.",
  },
];

export default async function Page({ searchParams }: PageProps<"/contact">) {
  const params = await searchParams;
  const rawType = typeof params.type === "string" ? params.type : "";
  const rawTier = typeof params.tier === "string" ? params.tier : "";

  const copy = rawType === "sprint" ? sprint : review;
  const tierLabel = TIER_LABELS[rawTier] ?? null;

  // Contact details are editable in /admin, so they are read rather than
  // imported. This page is where a stale phone number costs the most, and §4
  // has to match the Google Business Profile listing character for character.
  const { site } = await getSiteConfig();

  return (
    <>
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: copy.heading,
          description: metadata.description,
          url: `${site.url}/contact`,
          mainEntity: { "@id": `${site.url}/#organization` },
        }}
      />

      {/*
       * Reduced vertical padding compared with every other page, per §1. The
       * form has to be visible without scrolling on a standard laptop: someone
       * who navigated to Contact wants to contact.
       */}
      <section className="scroll-mt-24 border-b border-line bg-white py-10 sm:py-12">
        <Container>
          <div className="mx-auto max-w-[680px] text-center">
            <p className="eyebrow">Contact</p>
            <h1 className="mt-3 font-display text-[2.125rem] leading-[1.05] sm:text-[2.625rem]">
              {copy.heading}
            </h1>
            <p className="mt-4 text-[1.02rem] leading-relaxed text-subtle">
              {copy.intro}
            </p>
          </div>
        </Container>
      </section>

      <Band tone="surface">
        {/* items-start, so the short "what happens next" card keeps its own
            height instead of stretching to match the form beside it. */}
        <div className="grid items-start gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <h2 className="text-2xl sm:text-3xl">{copy.formHeading}</h2>

            {/*
             * The tier context line. A short statement of which package
             * prompted the enquiry, so a visitor does not have to restate it —
             * and not a preselected dropdown, so they are not locked into it
             * either.
             */}
            {tierLabel ? (
              <p className="mt-5 inline-flex items-center gap-2.5 rounded-card border border-line bg-white px-4 py-3 text-[0.9rem] text-ink">
                <Icon name="clipboard-check" size={16} />
                About the {tierLabel} package
              </p>
            ) : null}

            <div className="mt-8">
              {/*
               * The form reads ?type= and ?tier= from the URL, which needs a
               * boundary of its own so a slow parse of the query never holds
               * up the page around it.
               */}
              <Suspense fallback={null}>
                <LeadForm
                  sourceCta={copy.submitLabel}
                  submitLabel={copy.submitLabel}
                />
              </Suspense>
            </div>
          </div>

          <div>
            <Card className="gap-5">
              <h2 className="text-lg">What happens next</h2>
              <ol className="flex flex-col gap-5">
                {NEXT_STEPS.map((step, i) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="gradient-text font-display text-xl font-bold leading-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="font-heading text-[0.98rem] font-bold leading-snug text-ink-strong">
                        {step.title}
                      </p>
                      <p className="mt-1 text-[0.85rem] leading-relaxed text-subtle">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </Card>
          </div>
        </div>
      </Band>

      <Band tone="white">
        <SectionHeader
          eyebrow="Before the call"
          heading={copy.expectationsHeading}
          body={copy.expectationsBody}
        />

        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {copy.cards.map((card) => (
            <StaggerItem key={card.title} className="h-full">
              <Card className="gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-card bg-surface text-teal-ink">
                  <Icon name={card.icon} size={19} />
                </span>
                <h3 className="text-[1.1875rem] leading-tight">{card.title}</h3>
                <p className="text-[0.9rem] leading-relaxed text-subtle">
                  {card.body}
                </p>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>

        {/*
         * A text link, not a button, per §3: it offers an alternative to the
         * form without competing with it. It exists because a visitor who is
         * not ready for a call would otherwise simply leave, and a written
         * audit keeps the lead.
         */}
        <Reveal className="mt-10 text-center">
          <p className="text-[0.95rem] text-subtle">
            Prefer a written audit instead of a call?{" "}
            <Link
              href="/google-business-profile-optimization#free-audit"
              className="font-semibold text-teal-ink underline decoration-teal/40 underline-offset-4 transition-colors hover:decoration-teal"
            >
              Get a Free Visibility Audit
            </Link>
          </p>
        </Reveal>
      </Band>

      {/*
       * Name, phone and email, and nothing else. No service-area line, no city
       * list, no street address, no map.
       *
       * JMC sells NAP consistency, so its own has to be exact. These three
       * strings, the footer, and the LocalBusiness schema all read from the
       * same source for that reason: any difference between them is precisely
       * the error the service exists to fix.
       */}
      <Band tone="surface">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow eyebrow-dot justify-center">Other ways to reach JMC</p>
          <p className="mt-4 font-heading text-xl font-bold text-ink-strong">
            {site.name}
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-x-8 gap-y-3 sm:flex-row">
            <a
              href={site.phoneHref}
              className="inline-flex items-center gap-2.5 text-[1.02rem] font-semibold text-ink transition-colors hover:text-teal-ink"
            >
              <Icon name="phone" size={17} />
              {site.phone}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="inline-flex items-center gap-2.5 break-all text-[1.02rem] font-semibold text-ink transition-colors hover:text-teal-ink"
            >
              <Icon name="envelope" size={17} />
              {site.email}
            </a>
          </div>
        </div>
      </Band>

      <Band tone="white">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal
            direction="right"
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <div className="flex flex-col gap-4">
              <p className="eyebrow eyebrow-dot">Questions</p>
              <h2 className="text-[1.875rem] sm:text-[2.25rem] lg:text-[2.625rem]">
                Before You Send It
              </h2>
            </div>
          </Reveal>

          <Reveal direction="left" delay={0.08}>
            {/*
             * Four items, first open. Answers are in the DOM and collapsed with
             * CSS rather than withheld server-side, so the FAQPage schema above
             * describes content a crawler can actually read.
             */}
            <Accordion
              type="single"
              collapsible
              defaultValue="item-0"
              className="flex flex-col gap-3"
            >
              {faqItems.map((item, i) => (
                <AccordionItem key={item.question} value={`item-${i}`}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </Band>
    </>
  );
}
