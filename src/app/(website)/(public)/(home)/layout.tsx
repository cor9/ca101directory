import { NewsletterForm } from '@/components/emails/newsletter-form';
import HomeHero from '@/components/home/home-hero';
import Container from '@/components/container';
import React from 'react';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* hero section with search component */}
      {/* <HomeHero /> */}

      {/* filter layout with filter components */}
      {/* <div className="mt-8">
        <HomeFilter />
      </div> */}

      <HomeHero />

      {/* <div className="mt-8">
        <div className="w-full flex flex-col items-center justify-center gap-8">
          <HeaderSection
            label="Home"
            title="Explore curated collections"
          />

          <div className="w-full">
            <SearchFilter />
          </div>
        </div>
      </div> */}

      {/* main content shows the list of items*/}
      <Container className="mt-8">
        {children}
      </Container>

      <Container className="my-16">
        <NewsletterForm />
      </Container>
    </div>
  );
}
