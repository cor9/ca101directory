import { CategoryFilter } from '@/components/category/category-filter';
import Container from '@/components/shared/container';
import { HeaderSection } from '@/components/shared/header-section';

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="mt-8">
        <div className="w-full flex flex-col items-center justify-center gap-8">
          <HeaderSection
            label="Category"
            title="Explore by categories"
          />

          <div className="w-full">
            <CategoryFilter />
          </div>
        </div>
      </div>

      <Container className="mt-8 pb-16">
        {children}
      </Container>
    </div>
  );
}
