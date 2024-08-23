'use client';

import { createUrl } from '@/lib/utils';
import { SearchIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';

export default function HomeSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');
  const [debouncedQuery] = useDebounce(searchQuery, 300); // 300ms debounce
  const lastExecutedQuery = useRef(searchParams?.get('q') || '');

  useEffect(() => {
    if (debouncedQuery !== lastExecutedQuery.current) {
      const newParams = new URLSearchParams(searchParams?.toString());
      if (debouncedQuery) {
        newParams.set('q', debouncedQuery);
      } else {
        newParams.delete('q');
      }
      newParams.delete('page');
      // const newUrl = createUrl('/search', newParams);
      const newUrl = createUrl('/', newParams); // TODO: differ from search.tsx
      console.log(`useEffect, newUrl: ${newUrl}`);
      lastExecutedQuery.current = debouncedQuery;
      router.push(newUrl, { scroll: false });
    }
  }, [debouncedQuery, router, searchParams]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className='flex items-center justify-center md:justify-start'>
      <div className="w-80 relative">
        <input
          type="text"
          name="search"
          placeholder="Search..."
          autoComplete="off"
          value={searchQuery}
          onChange={handleSearch}
          className="text-md w-full rounded-full border bg-white px-4 py-2 text-black placeholder:text-neutral-500 md:text-sm dark:border-neutral-800 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
        />
        <div className="absolute right-0 top-0 mr-4 flex h-full items-center">
          <SearchIcon className="h-4" />
        </div>
      </div>
    </div>
  );
}

export function SearchSkeleton() {
  return (
    <form className="w-full md:w-80 relative">
      <input
        placeholder="Search..."
        className="text-md w-full rounded-full border bg-white px-4 py-2 text-sm text-black placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
      />
      <div className="absolute right-0 top-0 mr-4 flex h-full items-center">
        <SearchIcon className="h-4" />
      </div>
    </form>
  );
}