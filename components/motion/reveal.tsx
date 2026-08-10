"use client";

import * as React from "react";
import {
  motion,
  useReducedMotion,
  type Variants,
  type HTMLMotionProps,
} from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Scroll-reveal primitives.
 *
 * These are client components that take children as a slot, so the content
 * inside them stays a Server Component. Sections pass rendered markup through;
 * only the animation wrapper ships JavaScript.
 *
 * Everything collapses to a no-op opacity fade when the visitor has asked for
 * reduced motion.
 */

const DISTANCE = 22;

function offset(direction: Direction) {
  switch (direction) {
    case "up":
      return { y: DISTANCE, x: 0 };
    case "down":
      return { y: -DISTANCE, x: 0 };
    case "left":
      return { x: DISTANCE, y: 0 };
    case "right":
      return { x: -DISTANCE, y: 0 };
    default:
      return { x: 0, y: 0 };
  }
}

type Direction = "up" | "down" | "left" | "right" | "none";

export function Reveal({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.65,
  once = true,
  as = "div",
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  duration?: number;
  once?: boolean;
  as?: "div" | "section" | "li" | "span";
} & Omit<HTMLMotionProps<"div">, "children">) {
  const reduced = useReducedMotion();
  const Cmp = motion[as] as typeof motion.div;
  const { x, y } = reduced ? { x: 0, y: 0 } : offset(direction);

  return (
    <Cmp
      className={cn(className)}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount: 0.25, margin: "0px 0px -80px 0px" }}
      transition={{
        duration: reduced ? 0.01 : duration,
        delay: reduced ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      {...rest}
    >
      {children}
    </Cmp>
  );
}

/* -------------------------------------------------------------------------- */

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: DISTANCE },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const reducedItemVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.01 } },
};

/** Parent for StaggerItem children. Cards enter in sequence, not all at once. */
export function Stagger({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol";
}) {
  const Cmp = motion[as] as typeof motion.div;
  return (
    <Cmp
      className={cn(className)}
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -60px 0px" }}
    >
      {children}
    </Cmp>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li";
}) {
  const reduced = useReducedMotion();
  const Cmp = motion[as] as typeof motion.div;
  return (
    <Cmp
      className={cn(className)}
      variants={reduced ? reducedItemVariants : itemVariants}
    >
      {children}
    </Cmp>
  );
}
