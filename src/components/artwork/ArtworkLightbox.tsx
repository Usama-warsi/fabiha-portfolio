"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import type Lenis from "lenis";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, ChevronLeft, ChevronRight, Expand, ZoomIn, ZoomOut } from "lucide-react";
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
  const [zoom, setZoom] = useState(1);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);

  const art = works[index];
  const current = works[startIndex];

  const next = useCallback(
    () => { setZoom(1); setIndex((i) => (i + 1) % works.length); },
    [works.length]
  );
  const prev = useCallback(
    () => { setZoom(1); setIndex((i) => (i - 1 + works.length) % works.length); },
    [works.length]
  );

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const lenis = (window as unknown as { lenis?: Lenis }).lenis;
    const wasStopped = lenis?.isStopped;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Tab") {
        const controls = dialogRef.current?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)");
        if (!controls?.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      if (!wasStopped) lenis?.start();
      window.removeEventListener("keydown", onKey);
      triggerRef.current?.focus();
    };
  }, [open, next, prev]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        data-no-splash
        onClick={() => {
          setIndex(startIndex);
          setZoom(1);
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

      {open && createPortal(
      <AnimatePresence>
          <motion.div
            ref={dialogRef}
            data-lenis-prevent
            role="dialog"
            aria-modal="true"
            aria-label={`${art.displayTitle} — full screen viewer`}
            className="fixed inset-0 z-[200] flex flex-col bg-black/75 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onTouchStart={(e) => (touchX.current = zoom === 1 && e.touches.length === 1 ? e.touches[0].clientX : null)}
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
              <div className="flex items-center gap-2">
                <button type="button" data-no-splash disabled={zoom <= 1} onClick={() => setZoom((value) => Math.max(1, value - 0.5))} aria-label="Zoom out" className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30"><ZoomOut size={20} /></button>
                <button type="button" data-no-splash onClick={() => setZoom(1)} aria-label="Reset zoom" className="h-11 min-w-14 rounded px-2 text-xs tabular-nums hover:bg-white/10">{Math.round(zoom * 100)}%</button>
                <button type="button" data-no-splash disabled={zoom >= 3} onClick={() => setZoom((value) => Math.min(3, value + 0.5))} aria-label="Zoom in" className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30"><ZoomIn size={20} /></button>
              <button
                ref={closeRef}
                type="button"
                data-no-splash
                onClick={() => setOpen(false)}
                aria-label="Close viewer"
                className="ml-2 flex h-11 items-center justify-center gap-2 rounded-full border border-white/40 bg-black/50 px-3 text-warmwhite hover:bg-white/20"
              >
                <X size={22} strokeWidth={1.5} />
                <span className="hidden text-xs sm:inline">Close</span>
              </button>
              </div>
            </div>

            <div className="relative min-h-0 flex-1 px-4 pb-4 sm:px-16">
              <button
                type="button"
                data-no-splash
                onClick={prev}
                aria-label="Previous work"
                className="absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-warmwhite hover:bg-black/80 sm:left-6"
              >
                <ChevronLeft size={30} strokeWidth={1.2} />
              </button>

              <ZoomableArtwork key={art.slug} art={art} zoom={zoom} />

              <button
                type="button"
                data-no-splash
                onClick={next}
                aria-label="Next work"
                className="absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-warmwhite hover:bg-black/80 sm:right-6"
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
              {zoom > 1 && <p className="mt-2 text-xs text-warmwhite/65">Drag to explore · Click the percentage to reset</p>}
            </div>
          </motion.div>
      </AnimatePresence>, document.body)}
    </>
  );
}

function ZoomableArtwork({ art, zoom }: { art: Artwork; zoom: number }) {
  const viewport = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: number; x: number; y: number; panX: number; panY: number } | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const fit = Math.min(size.width / art.width, size.height / art.height);
  const width = art.width * fit * zoom;
  const height = art.height * fit * zoom;
  const limitX = Math.max(0, (width - size.width) / 2);
  const limitY = Math.max(0, (height - size.height) / 2);
  const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value));

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const measure = () => setSize({ width: element.clientWidth, height: element.clientHeight });
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    measure();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setPan({ x: 0, y: 0 });
    drag.current = null;
    setDragging(false);
  }, [zoom]);

  return (
    <div
      ref={viewport}
      className="relative h-full w-full select-none overflow-hidden"
      style={{ touchAction: zoom > 1 ? "none" : "pan-y", cursor: zoom > 1 ? dragging ? "grabbing" : "grab" : "default" }}
      onPointerDown={(event) => {
        if (zoom <= 1 || !event.isPrimary || event.button !== 0) return;
        drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, panX: clamp(pan.x, limitX), panY: clamp(pan.y, limitY) };
        event.currentTarget.setPointerCapture(event.pointerId);
        setDragging(true);
      }}
      onPointerMove={(event) => {
        const start = drag.current;
        if (!start || start.id !== event.pointerId) return;
        setPan({ x: clamp(start.panX + event.clientX - start.x, limitX), y: clamp(start.panY + event.clientY - start.y, limitY) });
      }}
      onPointerUp={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
        drag.current = null;
        setDragging(false);
      }}
      onPointerCancel={() => { drag.current = null; setDragging(false); }}
      onLostPointerCapture={() => { drag.current = null; setDragging(false); }}
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2" style={{
        width, height,
        transform: `translate(calc(-50% + ${clamp(pan.x, limitX)}px), calc(-50% + ${clamp(pan.y, limitY)}px))`,
      }}>
        <Image src={art.image} alt={art.alt} fill sizes={`${Math.round(zoom * 100)}vw`} draggable={false} className="object-contain" />
      </div>
    </div>
  );
}
