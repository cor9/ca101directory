import { sorting } from '@/lib/constants';
import { sanityClient } from '@/sanity/lib/client';
import { categoryListQuery } from '@/sanity/lib/queries';
import { Suspense } from 'react';
import { CategoryList } from "./category-list";
import MaxWidthWrapper from '../shared/max-width-wrapper';
import { SortList } from '../sort-list';

/**
 * if using sanityClient directly, the type is CategoryListQueryResult,
 * but if using sanityFetch, the type is unknown!
 */
async function GetCategoryList() {
  const categoryList = await sanityClient.fetch(categoryListQuery);
  // console.log('GetCategoryList, categoryList:', categoryList);
  return (
    <CategoryList categoryList={categoryList} />
  );
}

export async function CategoryFilter() {
  return (
    <>
      {/* Desktop View, has MaxWidthWrapper */}
      <MaxWidthWrapper className="hidden md:block">
        <div className='flex items-center justify-between gap-8 mt-4'>
          <div className="w-full">
            <Suspense fallback={null}>
              <GetCategoryList />
            </Suspense>
          </div>

          <div className="flex-shrink-0">
            <SortList sortList={sorting} />
          </div>
        </div>
      </MaxWidthWrapper>

      {/* Mobile View, no MaxWidthWrapper */}
      <div className="md:hidden flex flex-col gap-8 mt-4">
        <Suspense fallback={null}>
          <GetCategoryList />
        </Suspense>

        {/* set width to full */}
        <SortList sortList={sorting} />
      </div>
    </>
  );
}
