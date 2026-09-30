"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, ChevronLeft, ChevronRight, Expand } from "lucide-react";
import type { Artwork } from "@/data/artworks";
import { WebGLArtwork } from "@/components/webgl/WebGLArtwork";

/**
 * Accessible fullscreen artwork viewer. The primary detail image acts as the
 * trigger; the dialog supports ESC / ← / → and touch swipe, and returns focus.
 */
export function ArtworkLightbox({
  works,
  startSlug,
}: {
  works: Artwork[];
  startSlug: string;
}) {
  const startIndex = Math.max(0, works.findIndex((w) => w.slug === startSlug));
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(startIndex);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);

  const art = works[index];
  const current = works[startIndex];

  const next = useCallback(
    () => setIndex((i) => (i + 1) % works.length),
    [works.length]
  );
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + works.length) % works.length),
    [works.length]
  );

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, next, prev]);

  useEffect(() => {
    if (!open) triggerRef.current?.focus();
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setIndex(startIndex);
          setOpen(true);
        }}
        data-cursor="view"
        aria-label={`View ${current.displayTitle} full screen`}
        className="group relative block w-full cursor-zoom-in overflow-hidden bg-stone/30"
        style={{ aspectRatio: `${current.width} / ${current.height}` }}
      >
        <WebGLArtwork
          src={current.image}
          alt={current.alt}
          width={current.width}
          height={current.height}
          priority
          sizes="(max-width: 1024px) 100vw, 70vw"
          imgClassName="object-contain"
          grain={0.05}
        />
        <span className="absolute bottom-4 right-4 z-10 flex items-center gap-2 bg-charcoal/80 px-3 py-1.5 font-sans text-[10px] uppercase tracking-label text-warmwhite opacity-0 backdrop-blur-sm transition-opacity duration-500 group-hover:opacity-100">
          <Expand size={12} strokeWidth={1.5} /> Expand
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${art.displayTitle} — full screen viewer`}
            className="fixed inset-0 z-[90] flex flex-col bg-black/97"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (dx > 50) prev();
              else if (dx < -50) next();
              touchX.current = null;
            }}
          >
            <div className="flex items-center justify-between px-5 py-4 text-warmwhite sm:px-8">
              <span className="font-sans text-[11px] uppercase tracking-label text-warmwhite/60">
                {String(index + 1).padStart(2, "0")} / {String(works.length).padStart(2, "0")}
              </span>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close viewer"
                className="flex h-11 w-11 items-center justify-center text-warmwhite/80 hover:text-warmwhite"
              >
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            <div className="relative flex flex-1 items-center justify-center px-4 pb-4 sm:px-16">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous work"
                className="absolute left-2 z-10 flex h-12 w-12 items-center justify-center text-warmwhite/60 hover:text-warmwhite sm:left-6"
              >
                <ChevronLeft size={30} strokeWidth={1.2} />
              </button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={art.slug}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative flex h-full max-h-[78vh] w-full max-w-5xl items-center justify-center"
                >
                  <Image
                    src={art.image}
                    alt={art.alt}
                    width={art.width}
                    height={art.height}
                    sizes="90vw"
                    className="max-h-[78vh] w-auto object-contain"
                  />
                </motion.div>
              </AnimatePresence>

              <button
                type="button"
                onClick={next}
                aria-label="Next work"
                className="absolute right-2 z-10 flex h-12 w-12 items-center justify-center text-warmwhite/60 hover:text-warmwhite sm:right-6"
              >
                <ChevronRight size={30} strokeWidth={1.2} />
              </button>
            </div>

            <div className="px-5 py-5 text-center sm:px-8">
              <p className="font-serif text-xl text-warmwhite" dir="auto">
                {art.displayTitle}
              </p>
              <p className="mt-1 font-sans text-[11px] uppercase tracking-wide2 text-warmwhite/50">
                {[art.medium, art.dimensions].filter(Boolean).join(" · ")}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
