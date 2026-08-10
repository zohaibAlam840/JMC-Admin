"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        "group rounded-card border border-line bg-white px-5 transition-colors duration-300 data-[state=open]:border-teal/60 data-[state=open]:shadow-soft sm:px-6",
        className
      )}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "flex flex-1 items-center justify-between gap-5 py-5 text-left font-display text-lg font-bold uppercase leading-tight text-ink-strong outline-none transition-colors hover:text-teal-ink sm:text-xl",
          className
        )}
        {...props}
      >
        {children}
        <span className="flex size-8 shrink-0 items-center justify-center rounded-pill border border-line text-teal-ink transition-all duration-300 ease-out-soft group-data-[state=open]:rotate-45 group-data-[state=open]:border-transparent group-data-[state=open]:bg-brand-black group-data-[state=open]:text-white">
          <Plus size={16} strokeWidth={2.5} aria-hidden="true" />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div
        className={cn(
          "pb-6 pr-10 text-[0.95rem] leading-relaxed text-subtle",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
