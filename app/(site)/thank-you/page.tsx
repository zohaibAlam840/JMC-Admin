import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/layout";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";

/**
 * Conversion confirmation. Noindexed — this page should never appear in search
 * results, and it is the destination where analytics conversion tracking fires
 * once GA4/GTM is wired in phase 4.
 */
export const metadata: Metadata = {
  title: "Thank You",
  description: "Your Visibility Review request has been received.",
  robots: { index: false, follow: false },
};

const next = [
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
    body: "A package, a sprint, or advice you can act on yourself — whichever actually fits.",
  },
];

export default function Page() {
  return (
    <section className="bg-surface-2 py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <span className="mx-auto inline-flex size-16 items-center justify-center rounded-pill bg-brand-black text-white shadow-soft ring-8 ring-white">
            <Check size={28} strokeWidth={3} aria-hidden="true" />
          </span>

          <h1 className="mt-6 text-4xl uppercase sm:text-5xl">
            Request Received
          </h1>
          <p className="mt-5 text-[1.08rem] leading-relaxed text-ink">
            Thanks for reaching out. We will review your search visibility and
            get back to you within one business day.
          </p>

          <ol className="mt-10 flex flex-col gap-4 text-left">
            {next.map((item, i) => (
              <li
                key={item.title}
                className="flex gap-4 rounded-card border border-line bg-white p-5"
              >
                <span className="gradient-text font-display text-2xl font-bold leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-display text-base font-bold uppercase text-ink-strong">
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
            <Button href="/seo-packages" variant="secondary">
              View SEO Packages
            </Button>
            <Button href="/" variant="secondary">
              Back to Home
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
