import { Container } from "@/components/ui/layout";

/**
 * Shown while a page is still being fetched.
 *
 * Most of this site is static and prefetched, so this rarely appears. It
 * matters in the cases where it does: a page the client has just edited in
 * /admin and whose cache has been expired, a cold serverless start, or a slow
 * connection on a phone. Without it the old page sits on screen unchanged
 * until the new one is ready, which reads as a broken link.
 *
 * A shape rather than a spinner, and roughly the shape of a hero, so the
 * transition into the real page is a fill rather than a jump. Nothing here
 * animates: Build Spec §4 rules out entrance animation, and a pulsing skeleton
 * would be exactly that.
 */
export default function Loading() {
  return (
    <section className="py-12 md:py-16 lg:py-24" aria-busy="true">
      <Container>
        <span className="sr-only">Loading</span>

        <div className="grid items-center gap-12 lg:grid-cols-[55fr_45fr] lg:gap-16">
          <div className="flex flex-col gap-5">
            <span className="h-3 w-40 rounded-pill bg-surface" />
            <span className="h-12 w-full max-w-[26rem] rounded-card bg-surface" />
            <span className="h-12 w-full max-w-[20rem] rounded-card bg-surface" />
            <div className="mt-2 flex flex-col gap-2.5">
              <span className="h-3 w-full max-w-[34rem] rounded-pill bg-surface" />
              <span className="h-3 w-full max-w-[30rem] rounded-pill bg-surface" />
              <span className="h-3 w-full max-w-[32rem] rounded-pill bg-surface" />
            </div>
            <div className="mt-3 flex gap-3">
              <span className="h-11 w-48 rounded-card bg-surface" />
              <span className="h-11 w-44 rounded-card bg-surface" />
            </div>
          </div>

          <div className="hidden rounded-bento border border-line bg-white p-6 lg:block">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <span className="h-4 w-36 rounded-pill bg-surface" />
              <span className="h-2 w-10 rounded-pill bg-surface" />
            </div>
            <div className="flex flex-col gap-3.5 pt-5">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="h-3 w-full rounded-pill bg-surface" />
              ))}
            </div>
            <div className="mt-6 h-20 rounded-card border-t border-line bg-surface-2" />
          </div>
        </div>
      </Container>
    </section>
  );
}
