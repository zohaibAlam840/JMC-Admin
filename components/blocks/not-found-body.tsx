import { Band, Card, Container, SectionHeader } from "@/components/ui/layout";
import { Button } from "@/components/ui/button";

/**
 * The 404's content — Page Spec 15, part 2.
 *
 * Separate from the route files because there are two of them and only one of
 * them supplies the chrome. `app/not-found.tsx` catches URLs that match no
 * segment at all and renders against the bare root layout, so it wraps this in
 * SiteChrome. `app/(site)/not-found.tsx` catches `notFound()` thrown inside the
 * marketing segment, which is almost every real 404 on this site, and that one
 * is already inside the (site) layout's chrome — wrapping it again printed the
 * header twice.
 *
 * Plain and short. No search box, because there is nothing on the site to
 * search at launch, and no mascot or joke: the restraint is the house style.
 */
const links = [
  {
    title: "Local SEO",
    body: "Visibility in a defined city or service area.",
    href: "/local-seo-services",
  },
  {
    title: "Traditional SEO",
    body: "Regional, national, and industrial search visibility.",
    href: "/traditional-seo-services",
  },
  {
    title: "Industries",
    body: "Eight kinds of business, and what changes between them.",
    href: "/industries",
  },
];

export function NotFoundBody() {
  return (
    <>
      {/*
       * noindex, set here rather than through the metadata API: a not-found
       * boundary cannot export metadata, and React hoists this into the head.
       */}
      <meta name="robots" content="noindex" />

      <section className="bg-white py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-[680px] text-center">
            <p className="eyebrow">404</p>
            <h1 className="mt-3 font-display text-[2.125rem] leading-[1.05] sm:text-[2.625rem]">
              This Page Doesn&apos;t Exist
            </h1>
            <p className="mt-4 text-[1.02rem] leading-relaxed text-subtle">
              The address may have changed, or it may never have been a page
              here. Everything the site does is one link away below.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button href="/" size="lg">
                Back to Home
              </Button>
              <Button href="/contact" variant="secondary" size="lg">
                Request a Visibility Review
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <Band tone="surface">
        <SectionHeader
          eyebrow="Useful links"
          heading="Where Most People Are Going"
        />

        <div className="mx-auto mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <Card
              key={link.href}
              interactive
              href={link.href}
              className="group gap-2.5"
            >
              <h2 className="text-[1.1875rem] leading-tight">{link.title}</h2>
              <p className="text-[0.9rem] leading-relaxed text-subtle">
                {link.body}
              </p>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-5 font-body text-[0.9rem] font-semibold text-teal-ink">
                Go there
                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  &rarr;
                </span>
              </span>
            </Card>
          ))}
        </div>
      </Band>
    </>
  );
}
