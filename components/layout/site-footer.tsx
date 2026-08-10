import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Container } from "@/components/ui/layout";
import { Reveal } from "@/components/motion/reveal";
import type { SiteConfig } from "@/lib/content";

export function SiteFooter({
  site,
  nav: footerNav,
}: {
  site: SiteConfig["site"];
  nav: SiteConfig["footerNav"];
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden bg-brand-black text-white/75">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[46rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(54,209,220,0.14),rgba(91,134,229,0.09),transparent)] blur-3xl"
      />

      <Container className="relative py-16 lg:py-20">
        <Reveal className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-6">
            <Logo onDark />
            <p className="max-w-xs text-[0.88rem] leading-relaxed text-white/55">
              {site.footerBlurb}
            </p>

            <div className="flex flex-col gap-2.5 text-[0.88rem]">
              <a
                href={`mailto:${site.email}`}
                className="group inline-flex items-start gap-2.5 text-white/75 transition-colors hover:text-teal"
              >
                <Mail size={15} aria-hidden="true" className="mt-1 shrink-0" />
                <span className="break-all">{site.email}</span>
              </a>
              <a
                href={site.phoneHref}
                className="inline-flex items-center gap-2.5 text-white/75 transition-colors hover:text-teal"
              >
                <Phone size={15} aria-hidden="true" className="shrink-0" />
                {site.phone}
              </a>
              <p className="inline-flex items-center gap-2.5 text-white/45">
                <MapPin size={15} aria-hidden="true" className="shrink-0" />
                {site.locality}, {site.region}
              </p>
            </div>
          </div>

          {footerNav.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="mb-5 font-display text-[0.95rem] font-bold uppercase tracking-[0.1em] text-white">
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
          <p>
            &copy; {year} {site.name}. All rights reserved.
          </p>
          <p>
            {site.locality}, {site.region} &middot; Serving the Greater Houston
            area
          </p>
        </Container>
      </div>
    </footer>
  );
}
