import * as React from "react";
import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * shadcn/ui Button, restyled to the JMC system.
 *
 * Extends the standard API with an optional `href`, which renders a next/link
 * instead of a <button>. Most CTAs on this site are navigation, not actions.
 */
const buttonVariants = cva(
  // No whitespace-nowrap in the base: long CTA labels ("Request Team/Brokerage
  // SEO Review") are wider than a 390px viewport and force the page to scroll
  // sideways. Labels wrap and centre instead; the header CTA opts back into
  // nowrap where there is room for it.
  "relative inline-flex max-w-full items-center justify-center gap-2 text-balance text-center font-display font-bold uppercase tracking-wide leading-tight transition-all duration-300 ease-out-soft disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-ink",
  {
    variants: {
      variant: {
        /**
         * Filled controls are solid brand black with white text — 21:1 contrast,
         * and it reads as more premium than a colored fill. The brand gradient
         * is deliberately NOT used behind button text: white on #36D1DC is only
         * ~1.9:1 and fails AA, and black-on-gradient looks cheap. The gradient
         * lives on text-free surfaces instead (rules, bars, glows, progress).
         */
        primary:
          "bg-brand-black text-white shadow-soft hover:-translate-y-0.5 hover:bg-[#1c1c1c] hover:shadow-lift",
        dark: "bg-brand-black text-white shadow-soft hover:-translate-y-0.5 hover:bg-[#1c1c1c] hover:shadow-lift",
        secondary:
          "border border-line-strong bg-white text-ink-strong hover:-translate-y-0.5 hover:border-teal hover:text-teal-ink hover:shadow-soft",
        ghost: "text-ink hover:bg-surface hover:text-teal-ink",
        /** Inverse of `primary`, for use on the dark roadmap band. */
        light:
          "bg-white text-brand-black shadow-soft hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-lift",
        onDark:
          "border border-white/60 bg-transparent text-white hover:bg-white/10",
        onBrand:
          "border border-brand-black/35 bg-transparent text-brand-black hover:bg-brand-black/10",
      },
      size: {
        sm: "rounded-pill px-4 py-2.5 text-[0.82rem]",
        md: "rounded-pill px-5 py-3 text-[0.9rem]",
        lg: "rounded-pill px-7 py-4 text-[0.95rem]",
        icon: "size-11 rounded-pill",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

type BaseProps = VariantProps<typeof buttonVariants> & {
  className?: string;
  children?: React.ReactNode;
};

type ButtonProps = BaseProps &
  Omit<React.ComponentProps<"button">, "color"> & {
    href?: string;
    asChild?: boolean;
  };

function Button({
  className,
  variant,
  size,
  href,
  asChild = false,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  const Comp = asChild ? Slot : "button";
  return (
    <Comp data-slot="button" className={classes} {...props}>
      {children}
    </Comp>
  );
}

/** Card-level link. Used where a button would compete with the section CTA. */
function ArrowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group/link inline-flex items-center gap-1.5 font-display text-[0.92rem] font-bold uppercase tracking-wide text-teal-ink transition-colors hover:text-blue-ink",
        className
      )}
    >
      {children}
      <span
        aria-hidden="true"
        className="transition-transform duration-300 ease-out-soft group-hover/link:translate-x-1"
      >
        &rarr;
      </span>
    </Link>
  );
}

export { Button, ArrowLink, buttonVariants };
