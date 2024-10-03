import Container from '@/components/container';
import { SORT_FILTER_LIST } from '@/lib/constants';
import { CategoryListQueryResult } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/fetch';
import { categoryListQuery } from '@/sanity/lib/queries';
import { Suspense } from 'react';
import { SortListDesktop } from '../shared/sort-list-desktop';
import { SortListMobile } from '../shared/sort-list-mobile';
import { CategoryListDesktop } from "./category-list-desktop";
import { CategoryListMobile } from './category-list-mobile';

export async function CategoryFilter() {
  const categoryList = await sanityFetch<CategoryListQueryResult>({
    query: categoryListQuery
  });

  return (
    <div>
      {/* Desktop View, has Container */}
      <Container className="hidden md:block">
        <div className='flex items-center justify-between gap-8'>
          <Suspense fallback={null}>
            <CategoryListDesktop categoryList={categoryList} />
          </Suspense>

          {/* pb-4 is for ScrollBar in CategoryListDesktop */}
          {/* Read more: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout */}
          <div className='pb-4'>
            <Suspense fallback={null}>
              <SortListDesktop sortList={SORT_FILTER_LIST} />
            </Suspense>
          </div>
        </div>
      </Container>

      {/* Mobile View, no Container */}
      <div className="md:hidden flex flex-col gap-8">
        <Suspense fallback={null}>
          <CategoryListMobile categoryList={categoryList} />
        </Suspense>

        <Suspense fallback={null}>
          <SortListMobile sortList={SORT_FILTER_LIST} />
        </Suspense>
      </div>
    </div>
  );
}
