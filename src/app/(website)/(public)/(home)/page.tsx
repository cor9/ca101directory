import Container from '@/components/container';
import { NewsletterForm } from '@/components/newsletter/newsletter-form';
import HomeHero from '@/components/home/home-hero';
import { siteConfig } from '@/config/site';
import { constructMetadata } from '@/lib/metadata';

export const metadata = constructMetadata({
  title: "Home",
  canonicalUrl: `${siteConfig.url}/`,
});

export default async function HomePage() {

  return (
    <div>
      <HomeHero />

      {/* main content shows the list of items*/}
      <Container className="mt-8">

      </Container>

      <Container className="my-16">
        <NewsletterForm />
      </Container>
    </div>
  );
}
