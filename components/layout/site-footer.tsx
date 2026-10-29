import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Container } from "@/components/ui/layout";
import { Reveal } from "@/components/motion/reveal";
import type { SiteConfig } from "@/lib/content";
import { publishedPolicies } from "@/lib/legal";

export function SiteFooter({
  site,
  nav: footerNav,
}: {
  site: SiteConfig["site"];
  nav: SiteConfig["footerNav"];
}) {
  /*
   * Build Spec §8 puts the legal links in the bottom bar. They appear only for
   * policies that can actually be served: a footer link to a 404 is worse than
   * no link, and it is the kind of thing nobody clicks until a regulator does.
   */
  const policies = publishedPolicies();

  return (
    <footer className="relative isolate overflow-hidden bg-brand-black text-white/75">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[46rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(54,209,220,0.14),rgba(91,134,229,0.09),transparent)] blur-3xl"
      />

      <Container className="relative py-16 lg:py-20">
        <Reveal className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-6">
            <Logo onDark variant="lockup" />
            <p className="max-w-xs text-[0.88rem] leading-relaxed text-white/55">
              {site.footerBlurb}
            </p>

          </div>

          <div className="divide-y divide-white/10 border-y border-white/10 md:hidden">
            {footerNav.map((column) => (
              <details key={column.heading} className="group">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between py-3 font-heading text-[1rem] font-bold text-white marker:content-none">
                  {column.heading}
                  <span
                    aria-hidden="true"
                    className="text-lg text-teal transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <ul className="pb-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="flex min-h-11 items-center text-[0.9rem] text-white/65 transition-colors hover:text-teal"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>

          {footerNav.map((column) => (
            <nav
              key={column.heading}
              aria-label={column.heading}
              className="hidden md:block"
            >
              <h2 className="mb-5 font-heading text-[1rem] font-bold text-white">
                {column.heading}
              </h2>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-start gap-1 text-[0.86rem] leading-snug text-white/55 transition-colors hover:text-teal"
                    >
                      {link.label}
                      <ArrowUpRight
                        size={12}
                        aria-hidden="true"
                        className="mt-0.5 shrink-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </Reveal>
      </Container>

      <div className="relative border-t border-white/10">
        <Container className="flex flex-col gap-3 py-6 text-[0.8rem] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-2">
            <p>&copy; {site.name}</p>
            {policies.map((policy) => (
              <span key={policy.slug} className="inline-flex items-center gap-2">
                <span aria-hidden="true">&middot;</span>
                <Link
                  href={policy.slug}
                  className="inline-flex min-h-11 items-center transition-colors hover:text-teal sm:min-h-0"
                >
                  {policy.title}
                </Link>
              </span>
            ))}
          </div>
          <p>
            {site.locality}, {site.region} &middot; Serving the Greater Houston
            area
          </p>
        </Container>
      </div>
    </footer>
  );
}
