import { sorting } from '@/lib/constants';
import { Suspense } from 'react';
import HomeSearch from './home-search';
import { SearchSkeleton } from './search';
import MaxWidthWrapper from './shared/max-width-wrapper';
import { SortList } from './sort-list';

export async function HomeHeaderLayout() {
  return (
    <>
      {/* Desktop View, has MaxWidthWrapper */}
      <MaxWidthWrapper className="hidden md:block">
        <div className='grid grid-cols-[1fr_150px] gap-8 items-center justify-between'>
          <div className="w-full min-w-0 mt-4">
            <Suspense fallback={<SearchSkeleton />}>
              <HomeSearch />
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
        <div className='w-full min-w-0 mt-4'>
          <Suspense fallback={<SearchSkeleton />}>
            <HomeSearch />
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
