import { CategoryListLayout } from '@/components/category-list-layout';
import CategoryList from '@/components/layout/category-list';
import SortList from '@/components/layout/sort-list';
import MaxWidthWrapper from '@/components/shared/max-width-wrapper';

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <>
        <CategoryListLayout />
        <MaxWidthWrapper className="">
          <div className="mx-auto flex flex-col gap-8 px-4 pb-4 text-black md:flex-row dark:text-white">
            {/* <div className="order-first w-full flex-none md:max-w-[125px]">
              <CategoryList />
            </div> */}
            <div className="order-last min-h-screen w-full md:order-none">
              {children}
            </div>
            <div className="order-none flex-none md:order-last md:w-[125px]">
              <SortList />
            </div>
          </div>
        </MaxWidthWrapper>
      </>
    </>
  );
}
