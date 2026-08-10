import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Admin primitives.
 *
 * The public site is a marketing surface — animated, generous, display type.
 * The admin is a tool: denser, quieter, body type, no motion. It shares the
 * brand tokens so it still reads as the same product, but it deliberately does
 * not reuse the marketing components.
 */

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <h1 className="font-display text-2xl uppercase leading-none text-ink-strong">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 text-[0.88rem] leading-relaxed text-subtle">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 gap-2">{actions}</div> : null}
    </div>
  );
}

export function Panel({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section
      className={cn(
        "rounded-card border border-line bg-white p-5 shadow-soft",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}

export function PanelTitle({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-4">
      <h2 className="font-display text-[1.05rem] uppercase leading-none text-ink-strong">
        {children}
      </h2>
      {hint ? <p className="mt-1.5 text-[0.8rem] text-subtle">{hint}</p> : null}
    </div>
  );
}

/* --------------------------------------------------------------- buttons -- */

const btn =
  "inline-flex items-center justify-center gap-2 rounded-[10px] px-3.5 py-2 text-[0.83rem] font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50";

export const adminButton = {
  primary: cn(btn, "bg-brand-black text-white hover:bg-[#1f1f1f]"),
  secondary: cn(btn, "border border-line-strong bg-white text-ink-strong hover:border-ink-strong"),
  ghost: cn(btn, "text-subtle hover:bg-surface hover:text-ink-strong"),
  danger: cn(btn, "border border-destructive/30 bg-white text-destructive hover:bg-destructive/5"),
  tiny: "inline-flex items-center justify-center rounded-[8px] border border-line bg-white px-2 py-1 text-[0.72rem] font-semibold text-subtle transition-colors hover:border-ink-strong hover:text-ink-strong disabled:opacity-40",
};

/* ---------------------------------------------------------------- fields -- */

const inputBase =
  "w-full rounded-[10px] border border-line-strong bg-white px-3 py-2 text-[0.88rem] text-ink-strong outline-none transition-colors placeholder:text-subtle/70 focus:border-teal-ink";

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-subtle">
        {label}
      </span>
      {children}
      {hint ? <span className="text-[0.76rem] text-subtle">{hint}</span> : null}
    </label>
  );
}

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input className={cn(inputBase, className)} {...props} />;
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      rows={3}
      className={cn(inputBase, "resize-y leading-relaxed", className)}
      {...props}
    />
  );
}

export function Select({ className, ...props }: React.ComponentProps<"select">) {
  return <select className={cn(inputBase, "pr-8", className)} {...props} />;
}

export function Checkbox({
  label,
  hint,
  ...props
}: React.ComponentProps<"input"> & { label: string; hint?: string }) {
  return (
    <label className="flex items-start gap-2.5">
      <input
        type="checkbox"
        className="mt-0.5 size-4 shrink-0 accent-[#14707c]"
        {...props}
      />
      <span>
        <span className="block text-[0.85rem] font-medium text-ink-strong">
          {label}
        </span>
        {hint ? (
          <span className="block text-[0.76rem] leading-snug text-subtle">
            {hint}
          </span>
        ) : null}
      </span>
    </label>
  );
}

/* ---------------------------------------------------------------- notices -- */

export function Notice({
  tone = "info",
  children,
}: {
  tone?: "info" | "success" | "warning" | "error";
  children: React.ReactNode;
}) {
  const tones = {
    info: "border-line bg-surface-2 text-ink",
    success: "border-teal/40 bg-teal/10 text-teal-ink",
    warning: "border-[#e0a800]/40 bg-[#fff6dd] text-[#7a5b00]",
    error: "border-destructive/30 bg-destructive/5 text-destructive",
  } as const;

  return (
    <div
      className={cn(
        "rounded-[10px] border px-4 py-3 text-[0.84rem] leading-relaxed",
        tones[tone]
      )}
    >
      {children}
    </div>
  );
}

export function Pill({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "live" | "draft" | "hidden";
  children: React.ReactNode;
}) {
  const tones = {
    neutral: "border-line bg-surface text-subtle",
    live: "border-teal/40 bg-teal/10 text-teal-ink",
    draft: "border-[#e0a800]/40 bg-[#fff6dd] text-[#7a5b00]",
    hidden: "border-line bg-surface text-subtle line-through",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill border px-2 py-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.08em]",
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}

export function EmptyState({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-card border border-dashed border-line-strong bg-white/60 px-6 py-12 text-center">
      <p className="font-display text-[1.05rem] uppercase text-ink-strong">
        {title}
      </p>
      {children ? (
        <div className="mx-auto mt-2 max-w-md text-[0.85rem] leading-relaxed text-subtle">
          {children}
        </div>
      ) : null}
    </div>
  );
}
