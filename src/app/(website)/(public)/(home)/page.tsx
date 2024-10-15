import Container from "@/components/container";
import { HomeContent } from "@/components/home/home-content";
import HomeHero from "@/components/home/home-hero";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Home",
  canonicalUrl: `${siteConfig.url}/`,
});

export default async function HomePage() {
  return (
    <Container className="mt-12 mb-16 flex flex-col gap-12">
      <HomeHero />

      <HomeContent />

      <NewsletterCard />
    </Container>
  );
}
