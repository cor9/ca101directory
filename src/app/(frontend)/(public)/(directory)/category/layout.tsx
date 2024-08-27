import { CategoryFilter } from '@/components/category/category-filter';
import MaxWidthContainer from '@/components/shared/max-width-container';

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CategoryFilter />

      <MaxWidthContainer className="pb-16">
        {children}
      </MaxWidthContainer>
    </>
  );
}
