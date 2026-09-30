/**
 * Very subtle film grain over the whole page for a gallery/print texture.
 * Pure CSS (SVG turbulence), pointer-events-none, respects reduced motion
 * via the global media query that neutralises the animation.
 */
export function GrainOverlay() {
  const svg =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`
    );

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed -inset-[20%] z-[80] opacity-[0.04] mix-blend-multiply will-change-transform motion-safe:animate-grain"
      style={{
        backgroundImage: `url("${svg}")`,
        backgroundSize: "180px 180px",
      }}
    />
  );
}
