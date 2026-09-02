import { Suspense } from "react";
import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { Band, Card, Container } from "@/components/ui/layout";
import { LeadForm } from "@/components/blocks/lead-form";
import { getSiteConfig } from "@/lib/content";

export const metadata: Metadata = {
  title: "Request a Visibility Review",
  description:
    "Request a Visibility Review from Jordan Marketing Consultants. We'll look at where your business shows up in search today, where the gaps are, and what to prioritize first.",
  alternates: { canonical: "/contact" },
};

const expectations = [
  {
    title: "A look at where you show up now",
    body: "We review your current visibility across search, maps where relevant, and the terms your market is actually using.",
  },
  {
    title: "The gaps worth caring about",
    body: "Not every weakness is worth fixing. We flag the ones holding you back and explain why they matter.",
  },
  {
    title: "An honest next step",
    body: "Sometimes that's a package, sometimes a sprint, sometimes advice you can act on without hiring anyone.",
  },
];

export default async function Page() {
  // Contact details are editable in /admin, so they are read rather than
  // imported — this page is where a stale phone number costs the most.
  const { site } = await getSiteConfig();

  return (
    <>
      <section className="scroll-mt-24 border-b border-line bg-surface-2 py-16 sm:py-20">
        <Container>
          <div className="max-w-3xl">
            <p className="eyebrow">Contact</p>
            <h1 className="mt-3 text-4xl sm:text-5xl">
              Request a Visibility Review
            </h1>
            <p className="mt-5 text-[1.08rem] leading-relaxed text-ink">
              Tell us a little about your business and what you are trying to
              improve. We will review where you currently show up in search and
              come back with the gaps and priorities worth acting on first.
            </p>
          </div>
        </Container>
      </section>

      <Band tone="white">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <h2 className="text-2xl sm:text-3xl">
              Tell us about your business
            </h2>
            <div className="mt-8">
              {/*
               * The form reads ?tier= from the URL, which needs a boundary or
               * the whole page opts out of static rendering. Wrapping it here
               * keeps everything above the form prerendered.
               */}
              <Suspense fallback={null}>
                <LeadForm />
              </Suspense>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <Card className="gap-4">
              <h2 className="text-lg">Reach us directly</h2>
              <div className="flex flex-col gap-3 text-[0.92rem]">
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-start gap-2.5 text-ink transition-colors hover:text-teal-ink"
                >
                  <Mail size={16} aria-hidden="true" className="mt-1 shrink-0" />
                  <span className="break-all">{site.email}</span>
                </a>
                <a
                  href={site.phoneHref}
                  className="inline-flex items-center gap-2.5 text-ink transition-colors hover:text-teal-ink"
                >
                  <Phone size={16} aria-hidden="true" className="shrink-0" />
                  {site.phone}
                </a>
                <p className="inline-flex items-center gap-2.5 text-subtle">
                  <MapPin size={16} aria-hidden="true" className="shrink-0" />
                  {site.locality}, {site.region}
                </p>
              </div>
            </Card>

            <Card className="gap-4">
              <h2 className="text-lg">What a review includes</h2>
              <ul className="flex flex-col gap-4">
                {expectations.map((item) => (
                  <li key={item.title}>
                    <p className="font-heading text-base font-bold text-ink-strong">
                      {item.title}
                    </p>
                    <p className="mt-1 text-[0.88rem] leading-relaxed text-subtle">
                      {item.body}
                    </p>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </Band>
    </>
  );
}
