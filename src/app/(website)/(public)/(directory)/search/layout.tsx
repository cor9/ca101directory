import { SearchFilter } from '@/components/search/search-filter';
import Container from '@/components/shared/container';

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mt-8">
        <SearchFilter />
      </div>

      <Container className="mt-8 pb-16">
        {children}
      </Container>
    </>
  );
}
