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
    <div>
      {/* hero section */}
      <Container className="mt-8">
        <HomeHero />
      </Container>

      {/* home content */}
      <Container className="mt-8">
        <HomeContent />
      </Container>

      {/* newsletter */}
      <Container className="my-16">
        <NewsletterCard />
      </Container>
    </div>
  );
}
