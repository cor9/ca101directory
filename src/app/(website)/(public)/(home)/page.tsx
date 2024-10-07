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
      <Container className="mt-8 flex flex-col items-center justify-center">
        <HomeHero />
      </Container>

      {/* main content shows the list of items*/}
      <Container className="mt-16">
        <HomeContent />
      </Container>

      <Container className="my-16">
        <NewsletterCard />
      </Container>
    </div>
  );
}
