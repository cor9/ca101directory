import Container from '@/components/container';
import { HomeContent } from '@/components/home/home-content';
import HomeHero from '@/components/home/home-hero';
import { NewsletterCard } from '@/components/newsletter/newsletter-card';
import { siteConfig } from '@/config/site';
import { constructMetadata } from '@/lib/metadata';

export const metadata = constructMetadata({
  title: "Home",
  canonicalUrl: `${siteConfig.url}/`,
});

export default async function HomePage() {
  return (
    <div className="mb-16">
      {/* hero section */}
      <Container className="mt-8">
        <HomeHero />
      </Container>

      {/* content section */}
      <Container className="mt-8">
        <HomeContent />
      </Container>

      {/* newsletter section */}
      <Container className="mt-16">
        <NewsletterCard />
      </Container>
    </div>
  );
}
