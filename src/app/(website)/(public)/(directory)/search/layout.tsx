import { SearchFilter } from '@/components/search/search-filter';
import Container from '@/components/shared/container';

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SearchFilter />

      <Container className="pb-16">
        {children}
      </Container>
    </>
  );
}
