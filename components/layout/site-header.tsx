"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { ArrowRight, Menu } from "lucide-react";
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
  const { scrollY } = useScroll();

  // The header tightens and gains elevation once the hero is behind it.
  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 24);
  });

  const isActive = (href: string) => {
    const base = href.split("#")[0];
    return base === "/" ? pathname === "/" : pathname.startsWith(base);
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
      className={cn(
        "sticky top-0 z-50 transition-all duration-300 ease-out-soft",
        // Transparent at rest so the hero reads as one uncut surface. It only
        // takes a background once content is scrolling underneath it, which is
        // the point at which the nav would otherwise become unreadable.
        scrolled
          ? "border-b border-line bg-white/85 shadow-soft backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
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
      <Container
        className={cn(
          "flex items-center gap-4 transition-all duration-300 ease-out-soft",
          scrolled ? "h-[60px]" : "h-[72px]"
        )}
      >
        <div className="flex flex-1 justify-start">
          <Logo />
        </div>

        <NavigationMenu className="hidden flex-none lg:flex">
          <NavigationMenuList>
            {mainNav.map((item) =>
              item.children?.length ? (
                <NavigationMenuItem key={item.label}>
                  <NavigationMenuTrigger
                    className={cn(isActive(item.href) && "text-teal-ink")}
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
                        isActive(item.href) && "text-teal-ink"
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
                {mainNav.map((item) => (
                  <li
                    key={item.label}
                    className="border-b border-line/70 pb-2 last:border-0"
                  >
                    <SheetClose asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "block py-2.5 font-display text-lg font-bold uppercase transition-colors",
                          isActive(item.href)
                            ? "text-teal-ink"
                            : "text-ink-strong"
                        )}
                      >
                        {item.label}
                      </Link>
                    </SheetClose>

                    {item.children?.length ? (
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
                      </ul>
                    ) : null}
                  </li>
                ))}
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
    </motion.header>
  );
}
