import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit items-center gap-1.5 rounded-pill border font-semibold uppercase tracking-[0.12em] transition-colors",
  {
    variants: {
      variant: {
        default: "border-line bg-white text-teal-ink",
        brand: "border-transparent bg-brand-black text-white",
        soft: "border-transparent bg-surface text-teal-ink",
        outline: "border-line-strong bg-transparent text-ink",
        pending: "border-amber-300 bg-amber-50 text-amber-800",
      },
      size: {
        sm: "px-2.5 py-1 text-[0.62rem]",
        md: "px-3 py-1.5 text-[0.68rem]",
      },
    },
    defaultVariants: { variant: "default", size: "sm" },
  }
);

function Badge({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
