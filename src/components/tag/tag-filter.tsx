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
        <div className='flex items-center justify-between gap-8 mt-4'>
          <div className="w-full">
            <Suspense fallback={null}>
              <GetTagList />
            </Suspense>
          </div>

          <div className="">
            <SortList sortList={sorting} />
          </div>
        </div>
      </MaxWidthWrapper>

      {/* Mobile View, no MaxWidthWrapper */}
      <div className="md:hidden flex flex-col gap-8 mt-4">
        <Suspense fallback={null}>
          <GetTagList />
        </Suspense>

        {/* set width to full */}
        <SortList sortList={sorting} />
      </div>
    </>
  );
}
