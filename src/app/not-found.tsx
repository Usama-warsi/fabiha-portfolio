import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70svh] items-center pt-20">
      <div className="container-x">
        <p className="eyebrow text-charcoal/65">Error 404</p>
        <h1 className="mt-6 font-serif text-6xl font-light leading-none text-charcoal sm:text-8xl">
          Nothing hangs
          <br />
          <span className="italic text-charcoal/70">on this wall.</span>
        </h1>
        <p className="mt-8 max-w-md font-sans text-[15px] leading-relaxed text-charcoal/65">
          The page you&apos;re looking for isn&apos;t part of the exhibition.
          Let&apos;s find your way back to the collection.
        </p>
        <div className="mt-10 flex flex-wrap gap-6">
          <Link
            href="/"
            className="inline-flex items-center gap-3 border-b border-charcoal pb-1 font-sans text-[13px] uppercase tracking-wide2 text-charcoal"
          >
            Return home
          </Link>
          <Link
            href="/work"
            className="inline-flex items-center gap-3 border-b border-charcoal/40 pb-1 font-sans text-[13px] uppercase tracking-wide2 text-charcoal/60"
          >
            Browse works
          </Link>
        </div>
      </div>
    </div>
  );
}
