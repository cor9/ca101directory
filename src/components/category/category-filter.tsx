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
  // const categoryList = await sanityFetch({
  //   query: categoryListQuery
  // });

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
        <div className='grid grid-cols-[1fr_150px] gap-8 items-center justify-between'>
          <div className="w-full min-w-0 mt-4">
            <Suspense fallback={null}>
              <GetCategoryList />
            </Suspense>
          </div>

          {/* set width to 150px */}
          <div className="mt-4">
            <Suspense fallback={null}>
              <SortList sortList={sorting} />
            </Suspense>
          </div>
        </div>
      </MaxWidthWrapper>

      {/* Mobile View, no MaxWidthWrapper */}
      <div className="md:hidden flex flex-col gap-8">
        <div className='w-full mt-4'>
          <Suspense fallback={null}>
            <GetCategoryList />
          </Suspense>
        </div>

        {/* set width to full */}
        <div className="w-full mb-8">
          <Suspense fallback={null}>
            <SortList sortList={sorting} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
