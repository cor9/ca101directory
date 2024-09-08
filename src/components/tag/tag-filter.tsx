import { sorting } from '@/lib/constants';
import { TagListQueryResult } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/fetch';
import { tagListQuery } from '@/sanity/lib/queries';
import Container from '../shared/container';
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
      {/* Desktop View, has Container */}
      <Container className="hidden md:block">
        <div className='flex items-center justify-between gap-8 mt-4'>
          <div className="w-full">
            <Suspense fallback={null}>
              <GetTagList />
            </Suspense>
          </div>

          <div className="">
            <Suspense fallback={null}>
              <SortList sortList={sorting} />
            </Suspense>
          </div>
        </div>
      </Container>

      {/* Mobile View, no Container */}
      <div className="md:hidden flex flex-col gap-8 mt-4">
        <Suspense fallback={null}>
          <GetTagList />
        </Suspense>

        {/* set width to full */}
        <Suspense fallback={null}>
          <SortList sortList={sorting} />
        </Suspense>
      </div>
    </>
  );
}
