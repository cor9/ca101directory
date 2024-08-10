import { SearchHeaderLayout } from '@/components/search-header-layout';
import MaxWidthWrapper from '@/components/shared/max-width-wrapper';

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SearchHeaderLayout />

      <MaxWidthWrapper className="pb-16">
        {children}
      </MaxWidthWrapper>
    </>
  );
}
