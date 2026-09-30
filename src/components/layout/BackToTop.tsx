"use client";

import type { ReactNode } from "react";

export function BackToTop({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
        })
      }
      className="flex items-center gap-2 font-sans text-xs tracking-wide2 text-warmwhite/60 hover:text-warmwhite"
    >
      {children}
    </button>
  );
}
