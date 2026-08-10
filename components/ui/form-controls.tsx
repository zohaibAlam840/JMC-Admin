"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

/**
 * shadcn/ui Input, Textarea, and Label, restyled to the JMC system.
 * Grouped in one file because they are only ever used together, by the
 * Visibility Review form.
 */

const fieldBase =
  "w-full rounded-card border border-line bg-white px-4 py-3 text-[0.95rem] text-ink-strong shadow-xs outline-none transition-all duration-200 placeholder:text-subtle/70 focus-visible:border-teal focus-visible:ring-4 focus-visible:ring-teal/15 aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive/15 disabled:opacity-60";

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "text-[0.76rem] font-semibold uppercase tracking-[0.12em] text-ink-strong",
        className
      )}
      {...props}
    />
  );
}

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(fieldBase, className)}
      {...props}
    />
  );
}

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(fieldBase, "min-h-28 resize-y", className)}
      {...props}
    />
  );
}

/**
 * Native select rather than the Radix one. A form that posts through a Server
 * Action needs a real form control in the DOM, and the native element is also
 * the better mobile experience.
 */
function Select({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      data-slot="select"
      className={cn(fieldBase, "appearance-none pr-10", className)}
      {...props}
    />
  );
}

export { Input, Textarea, Select, Label };
