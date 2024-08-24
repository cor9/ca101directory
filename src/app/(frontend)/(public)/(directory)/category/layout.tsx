import { CategoryFilter } from '@/components/category/category-filter';
import MaxWidthWrapper from '@/components/shared/max-width-wrapper';

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CategoryFilter />

      <MaxWidthWrapper className="pb-16">
        {children}
      </MaxWidthWrapper>
    </>
  );
}
