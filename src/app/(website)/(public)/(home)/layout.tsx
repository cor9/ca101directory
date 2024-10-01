import { NewsletterForm } from '@/components/emails/newsletter-form';
import { HomeFilter } from '@/components/home/home-filter';
import { HomeHero } from '@/components/home/home-hero';
import { SearchFilter } from '@/components/search/search-filter';
import Container from '@/components/shared/container';
import { HeaderSection } from '@/components/shared/header-section';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* hero section with search component */}
      {/* <HomeHero /> */}

      {/* filter layout with filter components */}
      {/* <div className="mt-8">
        <HomeFilter />
      </div> */}

      <div className="mt-8">
        <div className="w-full flex flex-col items-center justify-center gap-8">
          <HeaderSection
            label="Home"
            title="Explore curated collections"
          />

          <div className="w-full">
            <SearchFilter />
          </div>
        </div>
      </div>

      {/* main content shows the list of items*/}
      <Container className="mt-8 mb-16">
        {children}
      </Container>

      <Container className="pb-16">
        <NewsletterForm />
      </Container>
    </>
  );
}
