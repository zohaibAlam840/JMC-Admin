import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Layout wrappers that used to animate, and deliberately no longer do.
 *
 * Build Spec §4: "200ms ease-out on hover, 300ms on accordion expand. Nothing
 * else moves. No parallax, no scroll-jacking, no entrance animations." The
 * reference has no entrance animation anywhere, and that restraint is part of
 * why it reads the way it does — §1.5 lists it as one of the defining traits.
 *
 * The components survive as plain elements rather than being deleted so the
 * ~60 call sites across the section renderers keep working, and so the grid
 * and flex classes they carry stay where they are. They render a single div
 * and nothing else.
 *
 * If animation is ever reinstated, it goes back in here and nowhere else.
 */

type WrapperProps = {
  children: React.ReactNode;
  className?: string;
  /** Some call sites need a list element rather than a div. */
  as?: React.ElementType;
  /** Accepted and ignored — kept so existing call sites still typecheck. */
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
};

function Plain({ children, className, as: Tag = "div" }: WrapperProps) {
  return <Tag className={cn(className)}>{children}</Tag>;
}

export const Reveal = Plain;
export const Stagger = Plain;
export const StaggerItem = Plain;
