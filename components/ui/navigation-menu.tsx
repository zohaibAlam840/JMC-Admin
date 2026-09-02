"use client";

import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Radix NavigationMenu.
 *
 * Deliberately built WITHOUT the shared Viewport. A single viewport is anchored
 * to the menu root, not to whichever trigger is open, so every dropdown opened
 * under the far-left edge of the nav instead of under its own item. Each
 * Content is instead positioned against its own (relative) Item.
 */

function NavigationMenu({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root>) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      /*
       * Build Spec §7. Without an intent delay a dropdown fires while the
       * pointer is only passing over the trigger on its way somewhere else,
       * which reads as the menu flickering at you.
       */
      delayDuration={150}
      className={cn("relative flex max-w-max flex-1 items-center", className)}
      {...props}
    >
      {children}
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn("group flex flex-1 list-none items-center gap-0.5", className)}
      {...props}
    />
  );
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      // The positioning context each dropdown anchors to.
      className={cn("relative", className)}
      {...props}
    />
  );
}

const navigationMenuTriggerStyle = cva(
  "inline-flex items-center gap-1 whitespace-nowrap rounded-pill px-2.5 py-2 text-[0.85rem] font-medium text-ink outline-none transition-colors duration-200 hover:bg-surface hover:text-teal-ink focus-visible:bg-surface data-[state=open]:bg-surface data-[state=open]:text-teal-ink xl:px-3"
);

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group/nt", className)}
      {...props}
    >
      {children}
      <ChevronDown
        size={14}
        aria-hidden="true"
        className="transition-transform duration-300 ease-out-soft group-data-[state=open]/nt:rotate-180"
      />
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        // Centred on its own trigger. The top padding is inside the element
        // rather than a margin so the gap between trigger and panel stays
        // hoverable — a margin there makes the menu close as you reach for it.
        "absolute left-1/2 top-full z-50 w-[20rem] -translate-x-1/2 pt-2.5",
        "data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-top-1",
        className
      )}
      {...props}
    >
      <div className="overflow-hidden rounded-bento border border-line bg-white p-2 shadow-lift">
        {children}
      </div>
    </NavigationMenuPrimitive.Content>
  );
}

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "flex flex-col gap-1 rounded-card px-3.5 py-2.5 text-[0.88rem] leading-snug text-ink outline-none transition-colors duration-200 hover:bg-surface hover:text-teal-ink focus-visible:bg-surface",
        className
      )}
      {...props}
    />
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
};
