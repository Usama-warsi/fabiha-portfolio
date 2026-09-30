/**
 * Route-transition loader. App Router shows this instantly on navigation while
 * the destination segment loads — a calm, gallery-styled takeover so slow loads
 * never feel broken. Pure CSS (reduced-motion neutralised globally).
 */
export default function Loading() {
  return (
    <div className="fixed inset-0 z-[120] flex flex-col items-center justify-center gap-7 bg-warmwhite">
      <span className="font-serif text-2xl font-light tracking-wide text-charcoal">
        Fabiha <span className="italic text-charcoal/70">Shaheen</span>
      </span>

      <span className="relative block h-px w-44 overflow-hidden bg-charcoal/10">
        <span className="animate-loadsweep absolute inset-y-0 left-0 w-1/3 bg-terracotta" />
      </span>

      <span className="font-sans text-[10px] uppercase tracking-label text-charcoal/50">
        Loading
      </span>
    </div>
  );
}
