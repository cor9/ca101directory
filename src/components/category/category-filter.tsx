import { sorting } from '@/lib/constants';
import { sanityClient } from '@/sanity/lib/client';
import { categoryListQuery } from '@/sanity/lib/queries';
import { Suspense } from 'react';
import Container from '@/components/shared/container';
import { SortList } from '@/components/sort-list';
import { CategoryList } from "./category-list";

export async function CategoryFilter() {
  const categoryList = await sanityClient.fetch(categoryListQuery);
  return (
    <>
      {/* Desktop View, has Container */}
      <Container className="hidden md:block">
        <div className='flex items-center justify-between gap-8 mt-4'>
          <div className="w-full">
            <Suspense fallback={null}>
              <CategoryList categoryList={categoryList} />
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

      {/* Mobile View, no Container */}
      <div className="md:hidden flex flex-col gap-8 mt-4">
        <Suspense fallback={null}>
          <CategoryList categoryList={categoryList} />
        </Suspense>

        {/* set width to full */}
        <Suspense fallback={null}>
          <SortList sortList={sorting} />
        </Suspense>
      </div>
    </>
  );
}
