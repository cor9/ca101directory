import { HomeFilter } from '@/components/home/home-filter';
import { HomeHero } from '@/components/home/home-hero';
import MaxWidthWrapper from '@/components/shared/max-width-wrapper';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* hero section with search component */}
      {/* <HomeHero /> */}

      {/* filter layout with filter components */}
      {/* <HomeFilter /> */}

      {/* main content shows the list of items*/}
      <MaxWidthWrapper className="pb-16">
        {children}
      </MaxWidthWrapper>
    </>
  );
}
