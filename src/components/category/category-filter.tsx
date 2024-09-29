import Container from '@/components/shared/container';
import { SortFilter } from '@/components/sort-filter';
import { sorting } from '@/lib/constants';
import { CategoryListQueryResult } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/fetch';
import { categoryListQuery } from '@/sanity/lib/queries';
import { Suspense } from 'react';
import { CategoryList } from "./category-list";

export async function CategoryFilter() {
  const categoryList = await sanityFetch<CategoryListQueryResult>({
    query: categoryListQuery
  });
  return (
    <>
      {/* Desktop View, has Container */}
      <Container className="hidden md:block">
        <div className='flex items-center justify-between gap-8 mt-4'>
          <div className="flex-1">
            <Suspense fallback={null}>
              <CategoryList categoryList={categoryList} />
            </Suspense>
          </div>

          <div className="">
            {/* useSearchParams() should be wrapped in a suspense boundary at page "/category". */}
            {/* Read more: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout */}
            <Suspense fallback={null}>
              <SortFilter sortList={sorting} />
            </Suspense>
          </div>
        </div>
      </Container>

      {/* Mobile View, no Container */}
      <div className="md:hidden flex flex-col gap-8 mt-4">
        <Suspense fallback={null}>
          <CategoryList categoryList={categoryList} />
        </Suspense>

        {/* set width to full */}
        <Suspense fallback={null}>
          <SortFilter sortList={sorting} />
        </Suspense>
      </div>
    </>
  );
}
