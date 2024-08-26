import { SearchFilter } from '@/components/search/search-filter';
import MaxWidthWrapper from '@/components/shared/max-width-wrapper';

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SearchFilter />

      <MaxWidthWrapper className="pb-16">
        {children}
      </MaxWidthWrapper>
    </>
  );
}
