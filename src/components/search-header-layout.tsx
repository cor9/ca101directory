import { sorting } from '@/lib/constants';
import MaxWidthWrapper from './shared/max-width-wrapper';
import { SortList } from './sort-list';
import Search, { SearchSkeleton } from './search';
import { Suspense } from 'react';
import HomeSearch from './home/home-search';

export async function SearchHeaderLayout() {
  return (
    <>
      {/* Desktop View, has MaxWidthWrapper */}
      <MaxWidthWrapper className="hidden md:block">
        <div className='flex items-center justify-between gap-8 mt-4'>
          <div className="">
            {/* <HomeSearch /> */}
            <Search />
          </div>

          <div className="">
            <SortList sortList={sorting} />
          </div>
        </div>
      </MaxWidthWrapper>

      {/* Mobile View, no MaxWidthWrapper */}
      <div className="md:hidden flex flex-col gap-8 mt-4">
        <HomeSearch />

        {/* set width to full */}
        <SortList sortList={sorting} />
      </div>
    </>
  );
}
