"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";

const SESSION_KEY = "jmc-intro-seen";
const INTRO_MS = 1100;

/**
 * Branded intro loader.
 *
 * Deliberately constrained:
 * - It overlays content that is already in the DOM, so crawlers and screen
 *   readers get the full page regardless. It is aria-hidden throughout.
 * - It plays once per session. A loader on every navigation stops being a nice
 *   touch and becomes a tax.
 * - Reduced-motion visitors and returning visitors dismiss on the first frame.
 * - It never waits on the network, so it cannot become the reason a visitor
 *   bounces.
 *
 * Initial state is `true` on both server and client so hydration matches;
 * the decision to keep it up is made in the effect, where sessionStorage and
 * matchMedia are actually available.
 */
export function PageLoader() {
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const seen = sessionStorage.getItem(SESSION_KEY) !== null;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Returning visitors and reduced-motion visitors skip straight through.
    const duration = seen || reduced ? 0 : INTRO_MS;

    if (duration > 0) document.body.dataset.loading = "true";

    const timer = window.setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, "1");
      setVisible(false);
      delete document.body.dataset.loading;
    }, duration);

    return () => {
      window.clearTimeout(timer);
      delete document.body.dataset.loading;
    };
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          aria-hidden="true"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
        >
          <motion.div
            className="flex flex-col items-center gap-6"
            exit={{ y: -14, opacity: 0, transition: { duration: 0.4 } }}
          >
            <motion.span
              className="inline-flex items-center justify-center rounded-[4px] bg-brand-black px-4 py-3"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="gradient-text font-display text-3xl font-bold leading-none tracking-wide">
                JMC
              </span>
            </motion.span>

            {/* Sweep is tied to the fixed timeout above, so it always
                completes rather than stalling at 90%. */}
            <span className="relative h-[3px] w-40 overflow-hidden rounded-pill bg-line">
              <motion.span
                className="gradient-brand absolute inset-y-0 left-0 w-full origin-left rounded-pill"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: INTRO_MS / 1000, ease: [0.4, 0, 0.2, 1] }}
              />
            </span>

            <motion.p
              className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-subtle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              Jordan Marketing Consultants
            </motion.p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
