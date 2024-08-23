import { HomeHeaderLayout } from '@/components/home-header-layout';
import MaxWidthWrapper from '@/components/shared/max-width-wrapper';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HomeHeaderLayout />

      <MaxWidthWrapper className="pb-16">
        {children}
      </MaxWidthWrapper>
    </>
  );
}
