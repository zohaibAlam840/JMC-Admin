/**
 * The local search grid, drawn — Page Spec 02 §4.
 *
 * Most agencies report one blended ranking number. A grid shows visibility
 * changing block to block across a service area, which is the strongest
 * differentiator on the Local SEO page, so it earns a picture rather than a
 * sentence.
 *
 * Built in code on purpose, and the spec is firm about it. A real heatmap
 * screenshot is client data, JMC is not naming clients at launch, and a real
 * capture invites questions about whose account it is and whether it is
 * typical. It also carries no numbers, no place names and no scale — it shows
 * the shape of the measurement, not a result, and says so on its face.
 */

const SIZE = 5;
const CENTRE = (SIZE - 1) / 2;

/**
 * Strength falls off from the centre of the notional service area.
 *
 * Euclidean rather than Chebyshev distance, so the falloff reads as a circle
 * sitting inside a square grid rather than as concentric boxes — a business is
 * strongest around its own address, not around a rectangle.
 */
function strength(row: number, col: number) {
  const d = Math.hypot(row - CENTRE, col - CENTRE);
  const max = Math.hypot(CENTRE, CENTRE);
  return 1 - d / max;
}

export function SearchGrid({ label = "Illustration only." }: { label?: string }) {
  const dots = [];
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      const s = strength(row, col);
      dots.push(
        <span
          key={`${row}-${col}`}
          className="aspect-square rounded-full"
          style={{
            // Teal at the centre moving to blue at the edges, tracking the
            // brand gradient rather than inventing a third hue.
            background: `color-mix(in oklab, var(--color-teal) ${Math.round(
              s * 100
            )}%, var(--color-blue))`,
            opacity: 0.25 + s * 0.75,
          }}
        />
      );
    }
  }

  return (
    <figure className="mt-6">
      <div
        role="img"
        aria-label="Illustration of local visibility measured across a service area, strongest at the centre and weaker toward the edges."
        className="grid gap-1.5 rounded-[10px] border border-line bg-surface-2 p-4"
        style={{ gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))` }}
      >
        {dots}
      </div>
      <figcaption className="mt-2.5 text-[0.75rem] uppercase tracking-[0.08em] text-subtle">
        {label}
      </figcaption>
    </figure>
  );
}
