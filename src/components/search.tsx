'use client';

import { createUrl } from '@/lib/utils';
import { SearchIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useDebounce } from 'use-debounce';

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');
  const [debouncedQuery] = useDebounce(searchQuery, 300); // 300ms debounce
  const lastExecutedQuery = useRef<string | null>(null);

  const updateSearchParams = useCallback((query: string) => {
    const newParams = new URLSearchParams(searchParams?.toString() || '');
    if (query) {
      newParams.set('q', query);
    } else {
      newParams.delete('q');
    }
    newParams.delete('page');
    return newParams;
  }, [searchParams]);

  useEffect(() => {
    const currentQuery = searchParams?.get('q');
    console.log(`useEffect, currentQuery: ${currentQuery}, 
      debouncedQuery: ${debouncedQuery}, 
      lastExecutedQuery: ${lastExecutedQuery.current}`);
    if (debouncedQuery !== currentQuery && debouncedQuery !== lastExecutedQuery.current) {
      const newParams = updateSearchParams(debouncedQuery);
      const newUrl = createUrl('/search', newParams);
      console.log(`useEffect, newUrl: ${newUrl}`);
      lastExecutedQuery.current = debouncedQuery;
      router.push(newUrl, { scroll: false });
    }
  }, [debouncedQuery, router, updateSearchParams, searchParams]);

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