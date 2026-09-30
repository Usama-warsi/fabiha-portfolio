import Link from "next/link";
import { Instagram, ArrowUp } from "lucide-react";
import { artist } from "@/data/artist";
import { BackToTop } from "./BackToTop";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-exhibition text-warmwhite">
      <div className="container-x py-16 sm:py-24">
        <div className="flex flex-col justify-between gap-12 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow mb-6 text-warmwhite/55">The Artist</p>
            <h2 className="font-serif text-6xl font-light leading-[0.92] sm:text-7xl lg:text-8xl">
              Fabiha
              <br />
              <span className="italic text-warmwhite/80">Shaheen</span>
            </h2>
            <p className="mt-6 font-sans text-sm tracking-wide2 text-warmwhite/50">
              Visual Artist · {artist.location}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            <nav aria-label="Footer" className="flex flex-col gap-3">
              <p className="eyebrow mb-2 text-warmwhite/55">Explore</p>
              {[
                { label: "Work", href: "/work" },
                { label: "About", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="link-underline w-fit font-sans text-sm text-warmwhite/70 hover:text-warmwhite"
                >
                  {l.label}
                </Link>
              ))}
              <a
                href={artist.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline flex w-fit items-center gap-2 font-sans text-sm text-warmwhite/70 hover:text-warmwhite"
              >
                <Instagram size={15} strokeWidth={1.5} /> Instagram
              </a>
            </nav>

            <div className="flex flex-col gap-3">
              <p className="eyebrow mb-2 text-warmwhite/55">Contact</p>
              <a
                href={`mailto:${artist.email}`}
                className="link-underline w-fit font-sans text-sm text-warmwhite/70 hover:text-warmwhite"
              >
                {artist.email}
              </a>
              <p className="font-sans text-sm text-warmwhite/50">
                {artist.instagramHandle}
              </p>
              <Link
                href="/contact"
                className="link-underline mt-2 w-fit font-serif text-lg italic text-warmwhite/90"
              >
                Commission a work →
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse items-start justify-between gap-6 border-t border-warmwhite/15 pt-8 sm:flex-row sm:items-center">
          <p className="font-sans text-xs tracking-wide2 text-warmwhite/55">
            © {year} {artist.name}. All artwork remains the property of the artist.
          </p>
          <BackToTop>
            <span className="link-underline">Back to top</span>
            <ArrowUp size={14} strokeWidth={1.5} />
          </BackToTop>
        </div>
      </div>
    </footer>
  );
}
