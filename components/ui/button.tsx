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
  "relative inline-flex max-w-full items-center justify-center gap-2 rounded-md text-balance text-center font-body font-semibold leading-none tracking-[0.01em] transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-ink",
  {
    variants: {
      variant: {
        /**
         * Build Spec §6. Primary is the accessible blue, not flat --jmc-blue:
         * white on #5B86E5 measures 3.51:1 and fails AA at body size, while
         * white on #4D71C2 clears it at 4.71:1. Never use flat teal or flat
         * blue as a button fill with white text.
         *
         * Hover darkens the fill about 8% and lifts 1px; active presses back
         * down. Nothing else moves.
         */
        primary:
          "bg-blue-ink text-white hover:-translate-y-px hover:bg-[#4263ad]",
        dark: "bg-brand-black text-white hover:-translate-y-px hover:bg-[#1c1c1c]",
        secondary:
          "border-[1.5px] border-blue-ink bg-transparent text-blue-ink hover:-translate-y-px hover:bg-blue-ink/5",
        ghost: "text-ink hover:bg-surface hover:text-teal-ink",
        /** Inverse of primary, for the dark transparency band. */
        light:
          "bg-white text-blue-ink hover:-translate-y-px hover:bg-white/90",
        onDark:
          "border-[1.5px] border-white/70 bg-transparent text-white hover:bg-white/10",
        onBrand:
          "border-[1.5px] border-brand-black/40 bg-transparent text-brand-black hover:bg-brand-black/10",
      },
      size: {
        // 48px desktop, 52px mobile, 16px label. Build Spec §6.
        sm: "h-11 px-5 text-[0.9rem]",
        md: "h-[52px] px-8 text-base sm:h-12",
        lg: "h-[52px] px-8 text-base sm:h-12",
        icon: "size-12 rounded-md",
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
        // Text-link variant, Build Spec §6: no fill, teal-ink, underline on hover.
        "group/link inline-flex items-center gap-1.5 font-body text-[0.95rem] font-semibold text-teal-ink underline-offset-4 transition-colors hover:text-blue-ink hover:underline",
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
