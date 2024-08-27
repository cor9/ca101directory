import { sorting } from '@/lib/constants';
import MaxWidthContainer from './shared/max-width-container';
import { SortList } from './sort-list';
import Search, { SearchSkeleton } from './search';
import { Suspense } from 'react';

export async function SearchHeaderLayout() {
  return (
    <>
      {/* Desktop View, has MaxWidthWrapper */}
      <MaxWidthContainer className="hidden md:block">
        <div className='flex items-center justify-between gap-8 mt-4'>
          <div className="">
            <Suspense fallback={null}>
              <Search />
            </Suspense>
          </div>

          <div className="">
            <Suspense fallback={null}>
              <SortList sortList={sorting} />
            </Suspense>
          </div>
        </div>
      </MaxWidthContainer>

      {/* Mobile View, no MaxWidthWrapper */}
      <div className="md:hidden flex flex-col gap-8 mt-4">
        <Suspense fallback={null}>
          <Search />
        </Suspense>

        {/* set width to full */}
        <Suspense fallback={null}>
          <SortList sortList={sorting} />
        </Suspense>
      </div>
    </>
  );
}
