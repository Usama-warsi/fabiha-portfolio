"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Instagram } from "lucide-react";
import { navLinks } from "@/data/nav";
import { artist } from "@/data/artist";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500 ${
        scrolled
          ? "border-b border-charcoal/10 bg-warmwhite/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between sm:h-20">
        <Link
          href="/"
          className="font-sans text-[13px] font-medium uppercase tracking-wide2 text-charcoal"
          aria-label={`${artist.name} — home`}
          data-cursor="nav"
        >
          {artist.name}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="link-underline font-sans text-[13px] tracking-wide2 text-charcoal/80 hover:text-charcoal"
              data-cursor="nav"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={artist.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-charcoal/70 transition-colors hover:text-charcoal"
            data-cursor="nav"
          >
            <Instagram size={18} strokeWidth={1.5} />
          </a>
        </nav>

        {/* Mobile */}
        <MobileMenu />
      </div>
    </header>
  );
}
