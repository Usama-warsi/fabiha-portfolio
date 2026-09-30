"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type Lenis from "lenis";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Instagram } from "lucide-react";
import { navLinks } from "@/data/nav";
import { artist } from "@/data/artist";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const bodyOverflow = document.body.style.overflow;
    const htmlOverflow = document.documentElement.style.overflow;
    const lenis = (window as unknown as { lenis?: Lenis }).lenis;
    const wasStopped = lenis?.isStopped;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = htmlOverflow;
      if (!wasStopped) lenis?.start();
      window.removeEventListener("resize", onResize);
      triggerRef.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        const controls = dialogRef.current?.querySelectorAll<HTMLElement>("button, a[href]");
        if (!controls?.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        data-no-splash
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

      {mounted && createPortal(<AnimatePresence>
        {open && (
          <motion.div
            ref={dialogRef}
            data-lenis-prevent
            className="fixed inset-0 z-[210] flex h-[100dvh] flex-col overflow-y-auto overscroll-contain bg-exhibition text-warmwhite"
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
            <div className="container-x flex h-16 shrink-0 items-center justify-between sm:h-20">
              <span className="font-sans text-[13px] uppercase tracking-wide2">
                {artist.name}
              </span>
              <button
                ref={closeRef}
                data-no-splash
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
                    onClick={() => {
                      (window as unknown as { lenis?: Lenis }).lenis?.start();
                      setOpen(false);
                    }}
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

            <div className="container-x flex shrink-0 items-center justify-between border-t border-warmwhite/15 py-6">
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
      </AnimatePresence>, document.body)}
    </div>
  );
}
