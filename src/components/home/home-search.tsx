'use client';

import { createUrl } from '@/lib/utils';
import { SearchIcon } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';

export default function HomeSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');
  const [debouncedQuery] = useDebounce(searchQuery, 300); // 300ms debounce
  const lastExecutedQuery = useRef(searchParams?.get('q') || '');

  useEffect(() => {
    const currentQuery = searchParams?.get('q') || '';
    if (currentQuery !== searchQuery) {
      setSearchQuery(currentQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    if (debouncedQuery !== lastExecutedQuery.current) {
      const newParams = new URLSearchParams(searchParams?.toString());
      if (debouncedQuery) {
        newParams.set('q', debouncedQuery);
      } else {
        newParams.delete('q');
      }
      newParams.delete('page');
      const newUrl = createUrl('/', newParams);
      console.log(`useEffect, newUrl: ${newUrl}`);
      lastExecutedQuery.current = debouncedQuery;
      router.push(newUrl, { scroll: false });
    }
  }, [debouncedQuery, router, searchParams, searchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className='flex items-center justify-start'>
      <div className="w-full relative">
        <input
          type="text"
          name="search"
          placeholder="Search..."
          autoComplete="off"
          value={searchQuery}
          onChange={handleSearch}
          className="w-full rounded-none md:rounded-lg border px-4 py-2 text-sm"
        />
        <div className="absolute right-0 top-0 mr-4 flex h-full items-center">
          <SearchIcon className="h-4" />
        </div>
      </div>
    </div>
  );
}

export function HomeSearchSkeleton() {
  return (
    <form className="w-full md:w-80 relative">
      <input
        placeholder="Search..."
        className="w-full rounded-lg border px-4 py-2 text-sm"
      />
      <div className="absolute right-0 top-0 mr-4 flex h-full items-center">
        <SearchIcon className="h-4" />
      </div>
    </form>
  );
}