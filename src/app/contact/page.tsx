import type { Metadata } from "next";
import { Instagram } from "lucide-react";
import { artist } from "@/data/artist";
import { getArtwork } from "@/data/artworks";
import { ContactForm } from "@/components/contact/ContactForm";
import { FadeUp } from "@/components/motion/FadeUp";
import { TextReveal, RevealLine } from "@/components/motion/TextReveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Commission a work, book a workshop, or simply say hello. Get in touch with visual artist Fabiha Shaheen.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ artwork?: string | string[] }> }) {
  const query = await searchParams;
  const artwork = typeof query.artwork === "string" ? getArtwork(query.artwork) : undefined;
  return (
    <div className="pb-28 pt-28 sm:pt-36">
      <div className="container-x">
        <FadeUp>
          <SectionLabel index="Contact">Commissions &amp; Enquiries</SectionLabel>
        </FadeUp>
        <TextReveal
          as="h1"
          className="mt-8 font-serif text-5xl font-light leading-[0.95] text-charcoal sm:text-7xl lg:text-8xl"
        >
          <RevealLine>Let&apos;s create</RevealLine>
          <RevealLine>
            <span className="italic text-charcoal/80">something meaningful.</span>
          </RevealLine>
        </TextReveal>
      </div>

      <div className="container-x mt-16 grid grid-cols-1 gap-x-16 gap-y-14 lg:mt-24 lg:grid-cols-12">
        {/* Details */}
        <aside className="lg:col-span-4">
          <FadeUp>
            <div className="space-y-10">
              <div>
                <p className="eyebrow text-charcoal/65">Email</p>
                <a
                  href={`mailto:${artist.email}`}
                  className="link-underline mt-2 block font-serif text-2xl text-charcoal"
                >
                  {artist.email}
                </a>
              </div>
              <div>
                <p className="eyebrow text-charcoal/65">Instagram</p>
                <a
                  href={artist.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline mt-2 inline-flex items-center gap-2 font-serif text-2xl text-charcoal"
                >
                  <Instagram size={20} strokeWidth={1.5} />
                  {artist.instagramHandle}
                </a>
              </div>
              <div>
                <p className="eyebrow text-charcoal/65">Based in</p>
                <p className="mt-2 font-serif text-2xl text-charcoal">{artist.location}</p>
              </div>
              <p className="max-w-xs font-sans text-[14px] leading-relaxed text-charcoal/60">
                Every commission begins with a conversation. Share your story and
                Fabiha will respond personally.
              </p>
            </div>
          </FadeUp>
        </aside>

        {/* Form */}
        <div className="lg:col-span-8">
          <FadeUp delay={0.1}>
            <ContactForm key={artwork?.slug ?? "general"} artworkTitle={artwork?.displayTitle} />
          </FadeUp>
        </div>
      </div>
    </div>
  );
}
