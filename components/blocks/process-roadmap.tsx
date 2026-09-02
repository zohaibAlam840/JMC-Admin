import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/layout";
import { Button } from "@/components/ui/button";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import type { ProcessStepsSection } from "@/lib/types";

/**
 * The process section, drawn as a roadmap.
 *
 * A process is a sequence, so it gets a route: markers alternate high and low
 * along a winding path, which is the one structural device on this site that
 * genuinely encodes something — the order you move through the work.
 *
 * The path is generated from the marker positions rather than hand-authored,
 * so it stays correct whether a page has three steps or four.
 */

const MARKER = 48; // px
const DROP = 56; // vertical offset applied to every second column
const HI = MARKER / 2; // y of a marker centre in a non-offset column
const LO = DROP + MARKER / 2; // y of a marker centre in an offset column
const VIEW_W = 1000;
const VIEW_H = LO + MARKER / 2;

function buildPath(count: number) {
  const step = VIEW_W / count;
  const points = Array.from({ length: count }, (_, i) => ({
    x: step * (i + 0.5),
    y: i % 2 === 0 ? HI : LO,
  }));

  // Run in from the left edge, S-curve between each marker, run out to the right.
  let d = `M 0 ${points[0].y} L ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1];
    const curr = points[i];
    const mid = (prev.x + curr.x) / 2;
    d += ` C ${mid} ${prev.y}, ${mid} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  d += ` L ${VIEW_W} ${points[points.length - 1].y}`;
  return d;
}

export function ProcessRoadmap({ section }: { section: ProcessStepsSection }) {
  const count = section.steps.length;
  const path = buildPath(count);

  return (
    <section
      id={section.id}
      className="relative isolate scroll-mt-28 overflow-hidden bg-brand-black py-20 text-white/70 sm:py-24 lg:py-28"
    >
      {/* Contour wash — depth without an image. */}
      <div
        aria-hidden="true"
        className="grid-backdrop-dark pointer-events-none absolute inset-0 [mask-image:radial-gradient(80%_70%_at_50%_40%,black,transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[54rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(54,209,220,0.18),rgba(91,134,229,0.10),transparent)] blur-3xl"
      />

      <Container className="relative">
        <Reveal className="flex max-w-3xl flex-col gap-4">
          {section.eyebrow ? (
            // Written out rather than reusing the `eyebrow` utility: that one
            // hard-codes the dark teal used on light bands, which is unreadable
            // here, and relying on a later text-* utility to win is fragile.
            <p className="inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-teal">
              <span
                aria-hidden="true"
                className="gradient-brand size-1.5 rounded-pill"
              />
              {section.eyebrow}
            </p>
          ) : null}
          <h2 className="text-[2.1rem] leading-[0.98] text-white sm:text-[2.75rem] lg:text-[3.25rem]">
            {section.heading}
          </h2>
          {section.body ? (
            <p className="max-w-2xl text-[1.02rem] leading-relaxed text-white/55">
              {section.body}
            </p>
          ) : null}
        </Reveal>

        <div className="relative mt-16 lg:mt-20">
          {/* The route. Stretched to the grid width, so marker centres in the
              flow line up with the path's control points exactly. */}
          <svg
            aria-hidden="true"
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            preserveAspectRatio="none"
            className="absolute inset-x-0 top-0 hidden w-full lg:block"
            style={{ height: VIEW_H }}
          >
            <path
              d={path}
              fill="none"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="2"
              strokeDasharray="7 7"
              strokeLinecap="round"
            />
          </svg>

          {/* Mobile connector: a straight rail behind the markers. */}
          <span
            aria-hidden="true"
            className="absolute bottom-6 left-6 top-6 w-px border-l border-dashed border-white/20 lg:hidden"
          />

          <Stagger
            as="ol"
            className={cn(
              "relative grid gap-10 lg:gap-6",
              count === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
            )}
          >
            {section.steps.map((step, i) => (
              <StaggerItem
                as="li"
                key={step.title}
                className={cn(
                  "flex gap-5 lg:flex-col lg:gap-0",
                  // Every second column drops, which is what turns the path
                  // into a route instead of a straight line.
                  i % 2 === 1 && "lg:mt-14"
                )}
              >
                <span
                  className="relative z-10 flex shrink-0 items-center justify-center rounded-pill bg-white font-display text-base font-bold leading-none shadow-lift ring-8 ring-brand-black"
                  style={{ width: MARKER, height: MARKER }}
                >
                  <span className="gradient-text">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </span>

                <div className="rounded-bento border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm transition-colors duration-300 hover:border-teal/40 hover:bg-white/[0.07] lg:mt-7">
                  <h3 className="text-[1.15rem] leading-tight text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-[0.92rem] leading-relaxed text-white/55">
                    {step.body}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        {section.cta ? (
          <Reveal className="mt-14">
            <Button
              href={section.cta.href}
              variant="light"
              size="lg"
              className="group"
            >
              {section.cta.label}
              <ArrowRight
                size={16}
                aria-hidden="true"
                className="transition-transform duration-300 ease-out-soft group-hover:translate-x-1"
              />
            </Button>
          </Reveal>
        ) : null}
      </Container>
    </section>
  );
}
