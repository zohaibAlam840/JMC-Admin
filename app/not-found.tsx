import { Container } from "@/components/ui/layout";
import { Button } from "@/components/ui/button";
import { SiteChrome } from "@/components/layout/site-chrome";

/**
 * Global 404. Next renders this against the root layout, which carries no
 * chrome, so it pulls the header and footer in itself.
 */
export default function NotFound() {
  return (
    <SiteChrome>
      <section className="bg-surface-2 py-24 sm:py-32">
        <Container>
          <div className="mx-auto max-w-xl text-center">
            <p className="eyebrow">404</p>
            <h1 className="mt-3 text-4xl sm:text-5xl">
              That Page Isn&apos;t Here
            </h1>
            <p className="mt-5 text-[1.02rem] leading-relaxed text-ink">
              The page may have moved during our site rebuild. Here are the
              places most people are looking for.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
              <Button href="/">Home</Button>
              <Button href="/seo-packages" variant="secondary">
                SEO Packages
              </Button>
              <Button href="/contact" variant="secondary">
                Contact
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </SiteChrome>
  );
}
