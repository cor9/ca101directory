'use client';

import { createUrl } from '@/lib/utils';
import { SearchIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const val = e.target as HTMLFormElement;
    const search = val.search as HTMLInputElement;
    const newParams = new URLSearchParams(searchParams.toString());

    if (search.value) {
      newParams.set('q', search.value);
    } else {
      newParams.delete('q');
    }

    router.push(createUrl('/search', newParams));
  }

  return (
    <div className='flex items-center justify-center md:justify-start'>
      <form onSubmit={onSubmit} className="w-80 relative">
        <input
          key={searchParams?.get('q')}
          type="text"
          name="search"
          placeholder="Search..."
          autoComplete="off"
          defaultValue={searchParams?.get('q') || ''}
          className="text-md w-full rounded-full border bg-white px-4 py-2 text-black placeholder:text-neutral-500 md:text-sm dark:border-neutral-800 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
        />
        <div className="absolute right-0 top-0 mr-4 flex h-full items-center">
          <SearchIcon className="h-4" />
        </div>
      </form>
    </div>
  );
}

export function SearchSkeleton() {
  return (
    <form className="w-full md:w-80 relative">
      <input
        placeholder="Search..."
        className="text-md w-full rounded-lg border bg-white px-4 py-2 text-sm text-black placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
      />
      <div className="absolute right-0 top-0 mr-4 flex h-full items-center">
        <SearchIcon className="h-4" />
      </div>
    </form>
  );
}
