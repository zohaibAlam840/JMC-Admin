"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  FileText,
  Images,
  Inbox,
  Newspaper,
  LayoutDashboard,
  LogOut,
  Menu,
  Navigation,
  Settings,
  Share2,
  Signpost,
  Tags,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/articles", label: "Articles", icon: Newspaper },
  { href: "/admin/media", label: "Images", icon: Images },
  { href: "/admin/packages", label: "Packages & pricing", icon: Tags },
  { href: "/admin/navigation", label: "Navigation", icon: Navigation },
  { href: "/admin/leads", label: "Enquiries", icon: Inbox },
  { href: "/admin/redirects", label: "Redirects", icon: Signpost },
  { href: "/admin/sitemap", label: "Sitemap", icon: Share2 },
  { href: "/admin/settings", label: "Site details", icon: Settings },
];

export function AdminShell({
  email,
  role,
  signOutAction,
  children,
}: {
  email: string;
  role: string;
  signOutAction: () => Promise<void>;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  // Navigating on a phone should close the drawer. Driven by the click rather
  // than by watching pathname, so it never fights React's effect rules.
  const close = () => setOpen(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="flex min-h-full flex-1">
      {/* ------------------------------------------------------- sidebar -- */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[16rem] flex-col border-r border-line bg-white transition-transform duration-200 lg:translate-x-0",
          open ? "translate-x-0 shadow-lift" : "-translate-x-full"
        )}
      >
        <div className="flex h-[60px] items-center justify-between border-b border-line px-5">
          <Link
            href="/admin"
            onClick={close}
            className="font-display text-[1.05rem] font-bold uppercase leading-none text-ink-strong"
          >
            JMC <span className="gradient-text">Admin</span>
          </Link>
          <button
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="rounded-[8px] p-1.5 text-subtle hover:bg-surface lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="flex flex-col gap-0.5">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, item.exact);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    className={cn(
                      "flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-[0.85rem] font-medium transition-colors",
                      active
                        ? "bg-brand-black text-white"
                        : "text-ink hover:bg-surface hover:text-ink-strong"
                    )}
                  >
                    <Icon size={16} aria-hidden="true" className="shrink-0" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 border-t border-line pt-4">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-[0.85rem] font-medium text-subtle transition-colors hover:bg-surface hover:text-ink-strong"
            >
              <ArrowUpRight size={16} aria-hidden="true" className="shrink-0" />
              View the live site
            </a>
          </div>
        </nav>

        <div className="border-t border-line p-3">
          <p className="px-3 pb-2 text-[0.72rem] leading-tight text-subtle">
            <span className="block truncate font-medium text-ink-strong">
              {email}
            </span>
            {role}
          </p>
          <form action={signOutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2 text-[0.85rem] font-medium text-subtle transition-colors hover:bg-surface hover:text-ink-strong"
            >
              <LogOut size={16} aria-hidden="true" className="shrink-0" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {open ? (
        <button
          type="button"
          aria-label="Close menu"
          onClick={close}
          className="fixed inset-0 z-40 bg-brand-black/30 lg:hidden"
        />
      ) : null}

      {/* ------------------------------------------------------- content -- */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-[16rem]">
        <header className="sticky top-0 z-30 flex h-[60px] items-center gap-3 border-b border-line bg-white/90 px-5 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="rounded-[8px] p-1.5 text-ink-strong hover:bg-surface"
          >
            <Menu size={20} />
          </button>
          <span className="font-display text-[1rem] font-bold uppercase text-ink-strong">
            JMC Admin
          </span>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
