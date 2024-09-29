import { Suspense } from 'react';
import { sorting } from '@/lib/constants';
import { TagListQueryResult } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/fetch';
import { tagListQuery } from '@/sanity/lib/queries';
import Container from '@/components/shared/container';
import { SortFilter } from '@/components/sort-filter';
import { TagList } from './tag-list';

export async function TagFilter() {
  const tagList = await sanityFetch<TagListQueryResult>({
    query: tagListQuery
  });

  return (
    <>
      {/* Desktop View, has Container */}
      <Container className="hidden md:block">
        <div className='flex items-center justify-between gap-8 mt-4'>
          <div className="w-full">
            <Suspense fallback={null}>
              <TagList tagList={tagList} />
            </Suspense>
          </div>

          <div className="">
            <Suspense fallback={null}>
              <SortFilter sortList={sorting} />
            </Suspense>
          </div>
        </div>
      </Container>

      {/* Mobile View, no Container */}
      <div className="md:hidden flex flex-col gap-8 mt-4">
        <Suspense fallback={null}>
          <TagList tagList={tagList} />
        </Suspense>

        {/* set width to full */}
        <Suspense fallback={null}>
          <SortFilter sortList={sorting} />
        </Suspense>
      </div>
    </>
  );
}
