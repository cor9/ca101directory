import { SearchFilter } from '@/components/search/search-filter';
import MaxWidthContainer from '@/components/shared/max-width-container';

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SearchFilter />

      <MaxWidthContainer className="pb-16">
        {children}
      </MaxWidthContainer>
    </>
  );
}
