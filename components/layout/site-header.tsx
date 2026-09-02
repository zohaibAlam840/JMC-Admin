"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, Menu } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/layout";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/types";

/**
 * Navigation arrives as props rather than being imported: it is editable in
 * /admin, so the server resolves it once per request and hands it down.
 */
/*
 * The current section's nav item carries a persistent teal underline, per
 * Build Spec §7. decoration-2 with an offset so it reads as a deliberate rule
 * rather than as a default link underline.
 */
const ACTIVE_LINK =
  "text-teal-ink underline decoration-teal decoration-2 underline-offset-[6px]";

export function SiteHeader({
  nav: mainNav,
  primaryCta,
}: {
  nav: NavItem[];
  primaryCta: { label: string; href: string };
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  /*
   * The only thing scroll drives here is the bottom border, at 40px, per Build
   * Spec §7. A plain listener rather than a motion value: the header no longer
   * animates, so pulling in an animation library for one boolean would be the
   * tail wagging the dog.
   */
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => {
    const base = href.split("#")[0];
    return base === "/" ? pathname === "/" : pathname.startsWith(base);
  };

  return (
    <header
      className={cn(
        // Fixed 72px, solid white, with the border appearing after 40px of
        // scroll. Build Spec §7. It no longer shrinks or animates in.
        "sticky top-0 z-50 border-b bg-white transition-colors duration-200",
        scrolled ? "border-line" : "border-transparent"
      )}
    >
      {/*
       * Three zones, as in the reference: mark left, nav centred, actions right.
       *
       * The outer zones are flex-1 (basis 0), so they take equal width and the
       * nav lands on the true centre. Done with flex rather than absolute
       * positioning on purpose: an absolutely centred nav cannot reflow, so at
       * ~1024px the links would slide underneath the CTA button.
       */}
      <Container className="flex h-[72px] items-center gap-4">
        <div className="flex flex-1 justify-start">
          <Logo />
        </div>

        <NavigationMenu className="hidden flex-none lg:flex">
          <NavigationMenuList>
            {mainNav.map((item) =>
              item.children?.length ? (
                <NavigationMenuItem key={item.label}>
                  <NavigationMenuTrigger
                    className={cn(isActive(item.href) && ACTIVE_LINK)}
                  >
                    {item.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-full gap-0.5">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <NavigationMenuLink asChild>
                            <Link href={child.href}>{child.label}</Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={item.label}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        isActive(item.href) && ACTIVE_LINK
                      )}
                    >
                      {item.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            )}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex flex-1 items-center justify-end">
          <div className="hidden lg:block">
            <Button
              href={primaryCta.href}
              size="sm"
              className="group whitespace-nowrap"
            >
              {primaryCta.label}
              <ArrowRight
                size={15}
                aria-hidden="true"
                className="transition-transform duration-300 ease-out-soft group-hover:translate-x-1"
              />
            </Button>
          </div>

          {/* ---------------------------------------------------- mobile nav -- */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            aria-label="Open menu"
            className="rounded-pill p-2 text-ink-strong transition-colors hover:bg-surface lg:hidden"
          >
            <Menu size={22} aria-hidden="true" />
          </SheetTrigger>

          <SheetContent side="right" className="w-full max-w-sm">
            <SheetTitle className="sr-only">Main menu</SheetTitle>

            <div className="flex items-center border-b border-line px-6 py-5">
              <Logo />
            </div>

            <nav
              aria-label="Mobile"
              className="flex-1 overflow-y-auto px-6 py-6"
            >
              <ul className="flex flex-col gap-1">
                {mainNav.map((item) =>
                  item.children?.length ? (
                    /*
                     * Build Spec §7: tapping a dropdown parent must expand it
                     * in place and never navigate. A <details> does that with
                     * no state and keeps working with the keyboard.
                     */
                    <li
                      key={item.label}
                      className="border-b border-line/70 pb-2 last:border-0"
                    >
                      <details>
                        <summary
                          className={cn(
                            "flex cursor-pointer items-center justify-between py-2.5 font-heading text-lg font-bold",
                            isActive(item.href) ? "text-teal-ink" : "text-ink-strong"
                          )}
                        >
                          {item.label}
                          <ChevronDown
                            size={18}
                            aria-hidden="true"
                            className="shrink-0 transition-transform"
                          />
                        </summary>

                        <ul className="flex flex-col gap-0.5 pb-2 pl-3">
                          {item.children.map((child) => (
                            <li key={child.label}>
                              <SheetClose asChild>
                                <Link
                                  href={child.href}
                                  className="block py-1.5 text-[0.88rem] text-subtle transition-colors hover:text-teal-ink"
                                >
                                  {child.label}
                                </Link>
                              </SheetClose>
                            </li>
                          ))}

                          {/* Industries gets both a chevron and a way through
                              to the overview, so the parent is never a
                              dead end on a phone. */}
                          {item.href && item.href !== "#" ? (
                            <li>
                              <SheetClose asChild>
                                <Link
                                  href={item.href}
                                  className="block py-1.5 text-[0.88rem] font-semibold text-teal-ink"
                                >
                                  View all {item.label.toLowerCase()}
                                </Link>
                              </SheetClose>
                            </li>
                          ) : null}
                        </ul>
                      </details>
                    </li>
                  ) : (
                    <li
                      key={item.label}
                      className="border-b border-line/70 pb-2 last:border-0"
                    >
                      <SheetClose asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "block py-2.5 font-heading text-lg font-bold transition-colors",
                            isActive(item.href) ? "text-teal-ink" : "text-ink-strong"
                          )}
                        >
                          {item.label}
                        </Link>
                      </SheetClose>
                    </li>
                  )
                )}
              </ul>
            </nav>

            <div className="border-t border-line p-6">
              <SheetClose asChild>
                <Button href={primaryCta.href} size="lg" className="w-full">
                  {primaryCta.label}
                </Button>
              </SheetClose>
            </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
