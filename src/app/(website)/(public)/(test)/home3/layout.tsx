import Container from "@/components/container";
import HomeHero from "@/components/home/home-hero";
import { HomeSearchFilter2 } from "@/components/home/home-search-filter-2";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";

export default function HomeLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <Container className="mt-12 mb-16 flex flex-col gap-12">
      <HomeHero />

      <div className="flex flex-col gap-8">
        <HomeSearchFilter2 urlPrefix="/home3" />

        {children}
      </div>

      <NewsletterCard />
    </Container>
  );
}
