import Script from "next/script";
import { Container } from "@/components/ui/layout";
import { site } from "@/content/site";
import type { Policy } from "@/lib/legal";

/**
 * The legal template — Page Spec 15, part 1.
 *
 * One template, three pages. The shell supplies the header, the body width and
 * the contact line; Termageddon supplies everything between them.
 *
 * No hero, no cards, no CTA banner, no reporting block. A legal page is a
 * document, and dressing it up as a marketing page makes it read as less
 * trustworthy rather than more.
 *
 * Two things will bite on first deploy and are worth stating here rather than
 * discovering on production:
 *
 * The content-security policy has to allow Termageddon's script and frame
 * origins. A blocked embed renders a blank legal page with no error at all, and
 * CSP is usually stricter on production than locally, so each policy needs
 * checking on the live domain and not only in dev.
 *
 * The "last updated" date comes from Termageddon's own output, inside the
 * embed. It is deliberately not rendered here from a build date or a file
 * timestamp: a legal page that claims to have been updated on every deploy is
 * making a false statement about a legal document.
 */
export function LegalPage({ policy }: { policy: Policy }) {
  return (
    <>
      {/* Plain header, reduced padding. No hero. */}
      <section className="border-b border-line bg-white py-10 sm:py-12">
        <Container>
          <div className="mx-auto max-w-[68ch]">
            <h1 className="font-display text-[2rem] leading-[1.1] sm:text-[2.375rem]">
              {policy.title}
            </h1>
          </div>
        </Container>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <Container>
          <div className="mx-auto max-w-[68ch]">
            {/*
             * Termageddon's target container. The embed writes the policy body,
             * its own heading structure and its own "last updated" line into
             * this element.
             *
             * `legal-body` is styled in globals.css rather than with utilities:
             * the markup arrives at runtime from a third party, so there is
             * nothing here to put a class on.
             */}
            <div id="policy" className="legal-body" />

            {/*
             * afterInteractive: the policy is the whole point of the page, so it
             * should not wait for everything else, but it also must not block
             * first paint on a document nobody reads top to bottom.
             *
             * NOTE: confirm this URL shape against Termageddon's current
             * integration documentation when the keys arrive. Their embed
             * method has changed before, and a wrong URL fails silently to an
             * empty page.
             */}
            <Script
              id={`termageddon-${policy.slug.replace(/\W+/g, "-")}`}
              src={`https://app.termageddon.com/api/policy/${policy.embedKey}`}
              strategy="afterInteractive"
            />
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-surface-2 py-10">
        <Container>
          <div className="mx-auto max-w-[68ch]">
            <h2 className="font-heading text-lg font-bold text-ink-strong">
              Questions about this policy
            </h2>
            {/* Email only. No phone, no street address: this line is about
                reaching someone in writing about a document. */}
            <p className="mt-2 text-[0.95rem] leading-relaxed text-subtle">
              Write to{" "}
              <a
                href={`mailto:${site.email}`}
                className="font-semibold text-teal-ink hover:underline"
              >
                {site.email}
              </a>
              .
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
