import { HomeFilter } from '@/components/home/home-filter';
import { HomeHero } from '@/components/home/home-hero';
import MaxWidthContainer from '@/components/shared/max-width-container';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* hero section with search component */}
      {/* <HomeHero /> */}

      {/* filter layout with filter components */}
      {/* <HomeFilter /> */}

      {/* main content shows the list of items*/}
      <MaxWidthContainer className="pb-16">
        {children}
      </MaxWidthContainer>
    </>
  );
}
