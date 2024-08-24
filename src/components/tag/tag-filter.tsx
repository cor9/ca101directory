import { sorting } from '@/lib/constants';
import { TagListQueryResult } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/fetch';
import { tagListQuery } from '@/sanity/lib/queries';
import MaxWidthWrapper from '../shared/max-width-wrapper';
import { SortList } from '../sort-list';
import { TagList } from './tag-list';
import { Suspense } from 'react';

async function GetTagList() {
  const tagList = await sanityFetch<TagListQueryResult>({
    query: tagListQuery
  });
  // console.log('GetTagList, tagList:', tagList);
  return (
    <TagList tagList={tagList} />
  );
}

export async function TagFilter() {
  return (
    <>
      {/* Desktop View, has MaxWidthWrapper */}
      <MaxWidthWrapper className="hidden md:block">
        <div className='grid grid-cols-[1fr_150px] gap-8 items-center justify-between'>
          <div className="w-full min-w-0 mt-4">
            <Suspense fallback={null}>
              <GetTagList />
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
            <GetTagList />
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
