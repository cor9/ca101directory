import { CategoryFilter } from '@/components/category/category-filter';
import Container from '@/components/shared/container';

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CategoryFilter />

      <Container className="pb-16">
        {children}
      </Container>
    </>
  );
}
