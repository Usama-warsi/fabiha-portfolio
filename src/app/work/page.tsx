import type { Metadata } from "next";
import { artworks } from "@/data/artworks";
import { ArchiveGallery } from "@/components/artwork/ArchiveGallery";
import { FadeUp } from "@/components/motion/FadeUp";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const metadata: Metadata = {
  title: "Work",
  description:
    "The complete collection of works by Fabiha Shaheen — oil, acrylic, watercolour and mixed-media paintings exploring emotion, identity and human experience.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <div className="container-x pb-28 pt-28 sm:pt-36">
      <FadeUp>
        <SectionLabel index="The Archive">All Works</SectionLabel>
      </FadeUp>
      <FadeUp delay={0.05}>
        <h1 className="mt-6 font-serif text-6xl font-light leading-[0.9] text-charcoal sm:text-7xl lg:text-8xl">
          Work
        </h1>
      </FadeUp>
      <FadeUp delay={0.1}>
        <p className="mt-6 max-w-prose2 font-sans text-[15px] leading-relaxed text-charcoal/65">
          A growing collection of paintings and studies. Each work begins with a
          story — of emotion, identity, struggle or quiet hope — and finds its
          form in the medium that serves it best.
        </p>
      </FadeUp>

      <div className="mt-14 lg:mt-20">
        <ArchiveGallery works={artworks} />
      </div>
    </div>
  );
}
