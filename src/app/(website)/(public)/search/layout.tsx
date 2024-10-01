import { SearchFilter } from '@/components/search/search-filter';
import Container from '@/components/shared/container';
import { HeaderSection } from '@/components/shared/header-section';

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mt-8">
        <div className="w-full flex flex-col items-center justify-center gap-8">
          <HeaderSection
            label="Search"
            title="Search for your needs"
          />

          <div className="w-full">
            <SearchFilter />
          </div>
        </div>
      </div>

      <Container className="mt-8 pb-16">
        {children}
      </Container>
    </>
  );
}
