import { sorting } from '@/lib/constants';
import { sanityClient } from '@/sanity/lib/client';
import { categoryListQuery } from '@/sanity/lib/queries';
import { Suspense } from 'react';
import { CategoryList } from "./category-list";
import Container from '../shared/container';
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
      <Container className="hidden md:block">
        <div className='flex items-center justify-between gap-8 mt-4'>
          <div className="w-full">
            <Suspense fallback={null}>
              <GetCategoryList />
            </Suspense>
          </div>

          <div className="">
            {/* useSearchParams() should be wrapped in a suspense boundary at page "/category". */}
            {/* Read more: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout */}
            <Suspense fallback={null}>
              <SortList sortList={sorting} />
            </Suspense>
          </div>
        </div>
      </Container>

      {/* Mobile View, no MaxWidthWrapper */}
      <div className="md:hidden flex flex-col gap-8 mt-4">
        <Suspense fallback={null}>
          <GetCategoryList />
        </Suspense>

        {/* set width to full */}
        <Suspense fallback={null}>
          <SortList sortList={sorting} />
        </Suspense>
      </div>
    </>
  );
}
