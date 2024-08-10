import { CategoryListQueryResult } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/fetch';
import { categoryListQuery } from '@/sanity/lib/queries';
import { SortList } from './sort-list';
import { CategoryList } from "./category-list";
import MaxWidthWrapper from './shared/max-width-wrapper';
import { sorting } from '@/lib/constants';

// TODO: change to Suspense
async function getCategoryList() {
  const categoryList = await sanityFetch<CategoryListQueryResult>({
    query: categoryListQuery
  });
  console.log('getCategoryList, categoryList:', categoryList);
  return categoryList;
}

export async function CategoryHeaderLayout() {
  const categoryList = await getCategoryList();

  return (
    <>
      {/* show in desktop, has MaxWidthWrapper */}
      <MaxWidthWrapper className="hidden md:block">
        <div className='grid grid-cols-[1fr_150px] gap-8 items-center justify-between'>
          <div className="w-full min-w-0 mt-4">
            <CategoryList categoryList={categoryList} />
          </div>

          {/* set width to 150px */}
          <div className="mt-4">
            <SortList sortList={sorting} />
          </div>
        </div>
      </MaxWidthWrapper>

      {/* show in mobile, no MaxWidthWrapper */}
      <div className="md:hidden flex flex-col gap-8">
        <div className='w-full mt-4'>
          <CategoryList categoryList={categoryList} />
        </div>

        {/* set width to full */}
        <div className="w-full mb-8">
          <SortList sortList={sorting} />
        </div>
      </div>
    </>
  );
}
