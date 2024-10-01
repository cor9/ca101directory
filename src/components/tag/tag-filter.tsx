import Container from '@/components/shared/container';
import { SORT_FILTER_LIST } from '@/lib/constants';
import { TagListQueryResult } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/fetch';
import { tagListQuery } from '@/sanity/lib/queries';
import { Suspense } from 'react';
import { SortListDesktop } from '../sort-list-desktop';
import { SortListMobile } from '../sort-list-mobile';
import { TagListDesktop } from './tag-list-desktop';
import { TagListMobile } from './tag-list-mobile';

export async function TagFilter() {
  const tagList = await sanityFetch<TagListQueryResult>({
    query: tagListQuery
  });

  return (
    <div>
      {/* Desktop View, has Container */}
      <Container className="hidden md:block">
        <div className='flex items-center justify-between gap-8'>
          <Suspense fallback={null}>
            <TagListDesktop tagList={tagList} />
          </Suspense>

          {/* pb-4 is for ScrollBar in TagListDesktop */}
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
          <TagListMobile tagList={tagList} />
        </Suspense>

        <Suspense fallback={null}>
          <SortListMobile sortList={SORT_FILTER_LIST} />
        </Suspense>
      </div>
    </div>
  );
}
