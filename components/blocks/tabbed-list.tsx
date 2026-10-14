"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A two-lane toggle: one list at a time, switched by a segmented control.
 *
 * Built for the onboarding section on Monthly SEO Packages, asked for in
 * review: "almost like a toggled scale or a toggled table, where if it's on
 * local SEO, it'll break down onboarding... and then if you toggle it over to
 * the other tab, it'll give you traditional SEO."
 *
 * Why a toggle rather than both lists side by side: the two scopes overlap by
 * about half, and printed next to each other the eye reads the overlap as
 * repetition rather than as "these are genuinely different". One at a time
 * makes each list a complete answer to "what am I paying the fee for", which
 * is the only question this section exists to answer.
 *
 * Radix rather than hand-rolled state. Two buttons and a div is easy to write
 * and easy to get wrong: arrow-key navigation, roving tabindex and the
 * aria-controls wiring are the whole reason a tab control is a component
 * rather than a pattern, and this one is already a dependency.
 *
 * Deliberately NOT an accordion. An accordion invites opening both, which
 * puts the reader back in front of two near-identical lists.
 */

export type TabPanel = {
  /** Short — it sits in a segmented control, not a heading. */
  label: string;
  items: { title: string; body?: string }[];
};

/*
 * The tab's value is a slug, not its label.
 *
 * Radix builds the trigger and panel element ids out of the value, and these
 * labels contain spaces ("Local SEO"). That produced ids with spaces in them,
 * which are invalid, and left `aria-controls` — a space-separated token list
 * — pointing at two broken references instead of one panel. Assistive tech
 * would not have followed it.
 *
 * It did not stop the control working; that was a bad test on my part, twice
 * over. Worth knowing if anyone retests this: a synthetic `.click()` never
 * switches a Radix tab, because activation is automatic and runs off
 * mousedown and focus, neither of which `.click()` dispatches. And measuring
 * the trigger right after `scrollIntoView` reads the pre-scroll position,
 * because the site sets `scroll-behavior: smooth`. Drive it with real input
 * events, after the scroll has settled.
 */
const slug = (label: string) =>
  label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function TabbedList({
  tabs,
  className,
}: {
  tabs: TabPanel[];
  className?: string;
}) {
  if (tabs.length === 0) return null;

  return (
    <TabsPrimitive.Root
      defaultValue={slug(tabs[0].label)}
      className={cn(
        "overflow-hidden rounded-bento border border-line bg-white",
        className
      )}
    >
      <TabsPrimitive.List
        className="flex border-b border-line bg-surface p-1.5"
        // The control is what the section is about, so it is not decorative
        // and does need a name for anyone arriving by keyboard.
        aria-label="Choose a service line"
      >
        {tabs.map((tab) => (
          <TabsPrimitive.Trigger
            key={tab.label}
            value={slug(tab.label)}
            className={cn(
              "flex-1 rounded-md px-4 py-2.5 font-body text-[0.875rem] font-semibold transition-colors duration-200",
              "text-subtle hover:text-ink-strong",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-ink",
              // The selected tab is a raised white chip on the tinted track —
              // the same logic as the featured pricing card, where the thing
              // in front is the thing being read.
              "data-[state=active]:bg-white data-[state=active]:text-ink-strong data-[state=active]:shadow-soft"
            )}
          >
            {tab.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>

      {tabs.map((tab) => (
        <TabsPrimitive.Content
          key={tab.label}
          value={slug(tab.label)}
          className="p-5 focus-visible:outline-none sm:p-6"
        >
          <ul className="flex flex-col gap-3.5">
            {tab.items.map((item) => (
              <li key={item.title} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-surface text-teal-ink"
                >
                  <Check size={12} strokeWidth={3} />
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="font-heading text-[0.95rem] font-bold leading-snug text-ink-strong">
                    {item.title}
                  </span>
                  {item.body ? (
                    <span className="text-[0.85rem] leading-relaxed text-subtle">
                      {item.body}
                    </span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
}
