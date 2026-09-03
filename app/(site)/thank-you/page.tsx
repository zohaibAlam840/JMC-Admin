import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/layout";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";

/**
 * Conversion confirmation. Noindexed — this page should never appear in search
 * results, and it is the destination where analytics conversion tracking fires
 * once GA4/GTM is wired in phase 4.
 *
 * Two variants, chosen by ?type=. The audit variant exists because Page Spec
 * 04 §4 forbids stating a turnaround anywhere on the page that offers the free
 * audit, which leaves the confirmation to do the reassuring on its own.
 * Silence on the page is acceptable; silence after submitting is not.
 */
export const metadata: Metadata = {
  title: "Thank You",
  description: "Your request has been received.",
  robots: { index: false, follow: false },
};

type Variant = {
  heading: string;
  intro: string;
  steps: { title: string; body: string }[];
  links: { label: string; href: string }[];
};

const review: Variant = {
  heading: "Request Received",
  intro:
    "Thanks for reaching out. We will review your search visibility and get back to you within one business day.",
  steps: [
    {
      title: "We review your search visibility",
      body: "Where you appear today, which terms you are missing, and who is currently taking that space.",
    },
    {
      title: "We come back with priorities",
      body: "The gaps worth acting on first, and the reasoning behind the order.",
    },
    {
      title: "We recommend a real next step",
      body: "A package, a sprint, or advice you can act on yourself, whichever actually fits.",
    },
  ],
  links: [
    { label: "View SEO Packages", href: "/monthly-seo-packages" },
    { label: "Back to Home", href: "/" },
  ],
};

/*
 * Steps, deliberately, rather than dates. No hour count, no "shortly", no
 * "within a few days" — a stated deadline would have to hold on the worst week
 * rather than the average one. What the visitor gets instead is the sequence,
 * and the fact that a person is in it.
 */
const audit: Variant = {
  heading: "Audit Request Received",
  intro:
    "Thanks. The request arrived and it is in the queue. Here is what happens to it.",
  steps: [
    {
      title: "The profile and the site get reviewed",
      body: "Categories, services, business information, listing consistency, and where the profile is visible across the area you serve.",
    },
    {
      title: "A person reads the results",
      body: "The report is not sent straight out of a tool. Wendell goes through it and writes the part that says what actually matters in it.",
    },
    {
      title: "A written audit comes back by email",
      body: "Built on the same four headings as the monthly recap: what is there, why it matters, what is working and what is not, and what to do next.",
    },
  ],
  links: [
    { label: "Explore Local SEO", href: "/local-seo-services" },
    { label: "View Launch Sprints", href: "/launch-sprints" },
  ],
};

export default async function Page({
  searchParams,
}: PageProps<"/thank-you">) {
  const { type } = await searchParams;
  const variant = type === "audit" ? audit : review;

  return (
    <section className="bg-surface-2 py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <span className="mx-auto inline-flex size-16 items-center justify-center rounded-pill bg-brand-black text-white shadow-soft ring-8 ring-white">
            <Check size={28} strokeWidth={3} aria-hidden="true" />
          </span>

          <h1 className="mt-6 text-4xl sm:text-5xl">{variant.heading}</h1>
          <p className="mt-5 text-[1.08rem] leading-relaxed text-ink">
            {variant.intro}
          </p>

          <ol className="mt-10 flex flex-col gap-4 text-left">
            {variant.steps.map((item, i) => (
              <li
                key={item.title}
                className="flex gap-4 rounded-card border border-line bg-white p-5"
              >
                <span className="gradient-text font-display text-2xl font-bold leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-heading text-base font-bold text-ink-strong">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[0.9rem] leading-relaxed text-subtle">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-8 text-[0.9rem] text-subtle">
            Need something sooner? Call{" "}
            <a
              href={site.phoneHref}
              className="font-semibold text-teal-ink hover:underline"
            >
              {site.phone}
            </a>
            .
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {variant.links.map((link) => (
              <Button key={link.href} href={link.href} variant="secondary">
                {link.label}
              </Button>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
