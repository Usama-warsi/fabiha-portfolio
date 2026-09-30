"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Artwork } from "@/data/artworks";
import { ArtworkCard } from "./ArtworkCard";

const FILTERS = ["All", "Oil", "Acrylic", "Watercolour", "Mixed Media", "Colour Pencil"] as const;

export function ArchiveGallery({ works }: { works: Artwork[] }) {
  const [filter, setFilter] = useState<string>("All");

  // Only surface filters that actually have works behind them.
  const available = useMemo(() => {
    const present = new Set(works.map((w) => w.mediumTag).filter(Boolean));
    return FILTERS.filter((f) => f === "All" || present.has(f as Artwork["mediumTag"]));
  }, [works]);

  const filtered = useMemo(
    () => (filter === "All" ? works : works.filter((w) => w.mediumTag === filter)),
    [works, filter]
  );

  return (
    <div>
      {available.length > 2 && (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-charcoal/15 py-5">
          {available.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`font-sans text-[12px] uppercase tracking-wide2 transition-colors ${
                filter === f
                  ? "text-charcoal"
                  : "text-charcoal/65 hover:text-charcoal/70"
              }`}
              aria-pressed={filter === f}
            >
              {f}
              {filter === f && (
                <motion.span
                  layoutId="filter-underline"
                  className="mt-1 block h-px bg-charcoal"
                />
              )}
            </button>
          ))}
          <span className="ml-auto font-sans text-[12px] tracking-wide2 text-charcoal/65">
            {filtered.length} {filtered.length === 1 ? "work" : "works"}
          </span>
        </div>
      )}

      <motion.div
        layout
        className="mt-12 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-20"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((art, i) => (
            <motion.div
              key={art.slug}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className={i % 5 === 0 ? "sm:mt-0 lg:mt-0" : i % 3 === 2 ? "lg:mt-16" : ""}
            >
              <ArtworkCard art={art} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
