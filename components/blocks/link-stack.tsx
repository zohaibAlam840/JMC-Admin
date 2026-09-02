import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/layout";
import { Icon } from "@/components/blocks/icon";
import { SOCIAL_LABELS, SocialIcon } from "@/components/blocks/social-icon";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import type { LinkStackSection } from "@/lib/types";

/**
 * The link-in-bio stack.
 *
 * Built for one context: a thumb, on a phone, arriving from a social profile.
 * So the buttons are full width and tall enough to hit without aiming, the
 * whole thing sits in the middle of the screen, and the social marks are a
 * small row rather than six more buttons competing with the real one.
 *
 * The dark treatment is the default because this page has to read as a
 * profile, not as another page of the marketing site. White on the brand
 * gradient would fail contrast, so the dark theme lays the gradient over brand
 * black and uses it as a glow rather than as the background itself.
 *
 * External links open in a new tab — someone arriving from Instagram should
 * still have this page behind them when they come back.
 */
export function LinkStack({ section }: { section: LinkStackSection }) {
  const dark = (section.theme ?? "dark") === "dark";
  const socials = section.socials ?? [];

  return (
    <section
      id={section.id}
      className={cn(
        "relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden py-14",
        dark ? "bg-brand-black text-white" : "bg-white"
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 [mask-image:radial-gradient(80%_60%_at_50%_20%,black,transparent)]",
          dark ? "grid-backdrop-dark opacity-90" : "grid-backdrop opacity-70"
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -top-40 left-1/2 h-[32rem] w-[40rem] -translate-x-1/2 rounded-full blur-3xl",
          dark
            ? "bg-[radial-gradient(closest-side,rgba(54,209,220,0.30),rgba(91,134,229,0.20),transparent)]"
            : "bg-[radial-gradient(closest-side,rgba(54,209,220,0.20),rgba(91,134,229,0.12),transparent)]"
        )}
      />

      <Container className="relative">
        <div className="mx-auto flex w-full max-w-md flex-col items-center text-center">
          {/* ------------------------------------------------------ avatar -- */}
          <Reveal direction="none" duration={0.5}>
            {section.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={section.avatarUrl}
                alt={section.avatarAlt ?? ""}
                className="size-24 rounded-full object-cover shadow-lift"
              />
            ) : (
              /*
               * The mark as a gradient disc. Black on the brand gradient is
               * about 7:1, and this is a logo lockup rather than a control —
               * which is why the gradient is allowed to carry type here and
               * nowhere else.
               */
              <span className="gradient-brand inline-flex size-24 items-center justify-center rounded-full shadow-lift">
                <span className="font-heading text-[1.75rem] font-bold leading-none tracking-wide text-brand-black">
                  JMC
                </span>
              </span>
            )}
          </Reveal>

          {section.eyebrow ? (
            <Reveal delay={0.05} className="mt-5">
              <p
                className={cn(
                  "font-body text-[0.72rem] font-semibold uppercase tracking-[0.16em]",
                  dark ? "text-teal" : "text-teal-ink"
                )}
              >
                {section.eyebrow}
              </p>
            </Reveal>
          ) : null}

          <Reveal delay={0.1} className="mt-3">
            <h1
              className={cn(
                "text-[1.9rem] uppercase leading-[0.98] sm:text-[2.3rem]",
                dark && "text-white"
              )}
            >
              {section.heading}
            </h1>
          </Reveal>

          {section.body ? (
            <Reveal delay={0.15} className="mt-3">
              <p
                className={cn(
                  "text-[0.95rem] leading-relaxed",
                  dark ? "text-white/70" : "text-subtle"
                )}
              >
                {section.body}
              </p>
            </Reveal>
          ) : null}

          {/* ----------------------------------------------- social marks -- */}
          {socials.length > 0 ? (
            <Reveal delay={0.18} className="mt-6">
              <ul className="flex items-center justify-center gap-4">
                {socials.map((social) => (
                  <li key={`${social.platform}-${social.href}`}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={SOCIAL_LABELS[social.platform] ?? social.platform}
                      className={cn(
                        "inline-flex size-11 items-center justify-center rounded-full transition-all duration-300 ease-out-soft hover:-translate-y-0.5",
                        dark
                          ? "text-white/70 hover:bg-white/10 hover:text-white"
                          : "text-ink-strong hover:bg-surface hover:text-teal-ink"
                      )}
                    >
                      <SocialIcon platform={social.platform} />
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : null}

          {/* ---------------------------------------------------- buttons -- */}
          <Stagger className="mt-8 flex w-full flex-col gap-3">
            {section.links.map((link) => {
              const external = /^(https?:|mailto:|tel:)/i.test(link.href);

              const inner = (
                <>
                  {link.icon ? (
                    <span
                      className={cn(
                        "inline-flex size-9 shrink-0 items-center justify-center rounded-full transition-colors",
                        link.featured
                          ? "bg-brand-black/10 text-brand-black"
                          : dark
                            ? "bg-white/10 text-teal"
                            : "bg-surface text-teal-ink"
                      )}
                    >
                      <Icon name={link.icon} size={17} />
                    </span>
                  ) : null}

                  <span className="min-w-0 flex-1 text-left">
                    <span className="block font-heading text-[0.98rem] font-bold leading-tight tracking-wide">
                      {link.label}
                    </span>
                    {link.description ? (
                      <span
                        className={cn(
                          "mt-0.5 block text-[0.78rem] font-normal normal-case leading-snug",
                          link.featured
                            ? "text-brand-black/65"
                            : dark
                              ? "text-white/55"
                              : "text-subtle"
                        )}
                      >
                        {link.description}
                      </span>
                    ) : null}
                  </span>

                  {external ? (
                    <ArrowUpRight
                      size={15}
                      aria-hidden="true"
                      className="shrink-0 opacity-40 transition-opacity group-hover/link:opacity-100"
                    />
                  ) : null}
                </>
              );

              const classes = cn(
                "group/link flex w-full items-center gap-3.5 rounded-pill border px-5 py-3.5 transition-all duration-300 ease-out-soft hover:-translate-y-0.5 hover:shadow-lift",
                link.featured
                  ? dark
                    ? "gradient-brand border-transparent text-brand-black shadow-soft"
                    : "border-transparent bg-brand-black text-white shadow-soft hover:bg-[#1c1c1c]"
                  : dark
                    ? "border-white/25 bg-white/[0.04] text-white hover:border-white/50 hover:bg-white/[0.08]"
                    : "border-line bg-white text-ink-strong hover:border-teal/50"
              );

              return (
                <StaggerItem key={`${link.label}-${link.href}`}>
                  {external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className={classes}
                    >
                      {inner}
                    </a>
                  ) : (
                    <Link href={link.href} className={classes}>
                      {inner}
                    </Link>
                  )}
                </StaggerItem>
              );
            })}
          </Stagger>

          {section.footnote ? (
            <Reveal delay={0.22} className="mt-10">
              <p
                className={cn(
                  "text-[0.78rem]",
                  dark ? "text-white/40" : "text-subtle"
                )}
              >
                {section.footnote}
              </p>
            </Reveal>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
