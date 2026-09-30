"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Instagram } from "lucide-react";
import { navLinks } from "@/data/nav";
import { artist } from "@/data/artist";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="flex h-11 w-11 items-center justify-center text-charcoal"
      >
        <span className="relative block h-3 w-6">
          <span className="absolute left-0 top-0 h-px w-6 bg-charcoal" />
          <span className="absolute bottom-0 left-0 h-px w-6 bg-charcoal" />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-exhibition text-warmwhite"
            initial={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            animate={
              reduce ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }
            }
            exit={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="container-x flex h-16 items-center justify-between sm:h-20">
              <span className="font-sans text-[13px] uppercase tracking-wide2">
                {artist.name}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center text-warmwhite"
              >
                <span className="relative block h-4 w-6">
                  <span className="absolute left-0 top-1/2 h-px w-6 rotate-45 bg-warmwhite" />
                  <span className="absolute left-0 top-1/2 h-px w-6 -rotate-45 bg-warmwhite" />
                </span>
              </button>
            </div>

            <nav
              className="container-x flex flex-1 flex-col justify-center gap-1 pb-16"
              aria-label="Primary mobile"
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.2 + i * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="border-b border-warmwhite/15"
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 py-4"
                  >
                    <span className="font-sans text-xs tracking-label text-warmwhite/55">
                      0{i + 1}
                    </span>
                    <span className="font-serif text-4xl font-light sm:text-5xl">
                      {link.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="container-x flex items-center justify-between border-t border-warmwhite/15 py-6">
              <a
                href={`mailto:${artist.email}`}
                className="font-sans text-[13px] tracking-wide2 text-warmwhite/70"
              >
                {artist.email}
              </a>
              <a
                href={artist.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-warmwhite/70"
              >
                <Instagram size={18} strokeWidth={1.5} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
