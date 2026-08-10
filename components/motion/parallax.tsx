"use client";

import * as React from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Gentle scroll-linked drift for hero compositions. Keep the range small —
 * this should read as depth, not as a moving background.
 */
export function Drift({
  children,
  className,
  distance = 40,
}: {
  children: React.ReactNode;
  className?: string;
  distance?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const raw = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const y = useSpring(raw, { stiffness: 90, damping: 22, mass: 0.4 });

  return (
    <div ref={ref} className={cn(className)}>
      <motion.div style={reduced ? undefined : { y }}>{children}</motion.div>
    </div>
  );
}

/** Thin gradient bar at the very top showing read progress. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="gradient-brand fixed inset-x-0 top-0 z-[60] h-[3px] origin-left"
    />
  );
}
