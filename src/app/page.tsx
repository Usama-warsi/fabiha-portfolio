import { ScrollExpandHero } from "@/components/home/ScrollExpandHero";
import { SelectedWorks } from "@/components/home/SelectedWorks";
import { FeaturedStory } from "@/components/home/FeaturedStory";
import { Practice } from "@/components/home/Practice";
import { Recognition } from "@/components/home/Recognition";
import { Services } from "@/components/home/Services";
import { CommissionCTA } from "@/components/home/CommissionCTA";
import { PersonJsonLd } from "@/components/seo/JsonLd";

export default function HomePage() {
  return (
    <>
      <PersonJsonLd />
      <ScrollExpandHero />
      <SelectedWorks />
      <FeaturedStory />
      <Practice />
      <Recognition />
      <Services />
      <CommissionCTA />
    </>
  );
}
