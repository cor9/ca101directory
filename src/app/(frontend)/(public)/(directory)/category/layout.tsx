import { CategoryHeaderLayout } from '@/components/category-header-layout';
import MaxWidthWrapper from '@/components/shared/max-width-wrapper';

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CategoryHeaderLayout />

      {/* min-h-screen */}
      <MaxWidthWrapper className="">
        {children}
      </MaxWidthWrapper>
    </>
  );
}
