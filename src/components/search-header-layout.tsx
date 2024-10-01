import { SORT_FILTER_LIST } from '@/lib/constants';
import Container from './shared/container';
import { SortFilter } from './sort-filter';
import Search, { SearchSkeleton } from './search';
import { Suspense } from 'react';

export async function SearchHeaderLayout() {
  return (
    <div>
      {/* Desktop View, has Container */}
      <Container className="hidden md:block">
        <div className='flex items-center justify-between gap-8 mt-4'>
          <div className="">
            <Suspense fallback={null}>
              <Search />
            </Suspense>
          </div>

          <div className="">
            <Suspense fallback={null}>
              <SortFilter sortList={SORT_FILTER_LIST} />
            </Suspense>
          </div>
        </div>
      </Container>

      {/* Mobile View, no Container */}
      <div className="md:hidden flex flex-col gap-8 mt-4">
        <Suspense fallback={null}>
          <Search />
        </Suspense>

        {/* set width to full */}
        <Suspense fallback={null}>
          <SortFilter sortList={SORT_FILTER_LIST} />
        </Suspense>
      </div>
    </div>
  );
}
