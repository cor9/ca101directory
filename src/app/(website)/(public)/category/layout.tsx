import { CategoryFilter } from '@/components/category/category-filter';
import Container from '@/components/shared/container';

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mt-8">
        <CategoryFilter />
      </div>

      <Container className="mt-8 pb-16">
        {children}
      </Container>
    </>
  );
}
