'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { generatePagination } from '@/lib/utils';
import { Button } from './ui/button';

/**
 * 1. Create custom pagination from Nextjs documentation, not the pageination component from shadcn/ui
 * https://github.com/vercel/next-learn/blob/main/dashboard/starter-example/app/ui/invoices/pagination.tsx
 * 2. Support Light and Dark mode
 */
export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages === 0) {
    // TODO: add a message saying there are no items
    return null;
  };

  const currentPage = Number(searchParams.get('page')) || 1;
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const allPages = generatePagination(currentPage, totalPages);

  return (
    <div className="inline-flex">
      <PaginationArrow
        direction="left"
        href={createPageURL(currentPage - 1)}
        isDisabled={currentPage <= 1}
      />

      <div className="flex -space-x-px">
        {allPages.map((page, index) => {
          let position: 'first' | 'last' | 'single' | 'middle' | undefined;

          if (index === 0) position = 'first';
          if (index === allPages.length - 1) position = 'last';
          if (allPages.length === 1) position = 'single';
          if (page === '...') position = 'middle';

          return (
            <PaginationNumber
              key={`${page}-${index}`}
              href={createPageURL(page)}
              page={page}
              position={position}
              isActive={currentPage === page}
            />
          );
        })}
      </div>

      <PaginationArrow
        direction="right"
        href={createPageURL(currentPage + 1)}
        isDisabled={currentPage >= totalPages}
      />
    </div>
  );
}

function PaginationNumber({
  page,
  href,
  isActive,
  position,
}: {
  page: number | string;
  href: string;
  position?: 'first' | 'last' | 'middle' | 'single';
  isActive: boolean;
}) {
  const className = clsx(
    'flex h-10 w-10 items-center justify-center text-sm border',
    {
      'rounded-l-md': position === 'first' || position === 'single',
      'rounded-r-md': position === 'last' || position === 'single',
      'z-10 pointer-events-none': isActive,
      'text-gray-300': position === 'middle',
    },
  );

  return isActive || position === 'middle' ? (
    <Button asChild variant={isActive ? 'default' : 'outline'}
      size='icon' className='rounded-none'>
      <div className={className}>{page}</div>
    </Button>
  ) : (
    <Button asChild variant={isActive ? 'default' : 'outline'}
      size='icon' className='rounded-none'>
      <Link href={href} className={className}>
        {page}
      </Link>
    </Button>
  );
}

function PaginationArrow({
  href,
  direction,
  isDisabled,
}: {
  href: string;
  direction: 'left' | 'right';
  isDisabled?: boolean;
}) {
  const className = clsx(
    'flex h-10 w-10 items-center justify-center rounded-md border',
    {
      'pointer-events-none text-gray-300': isDisabled,
      'mr-2 md:mr-4': direction === 'left',
      'ml-2 md:ml-4': direction === 'right',
    },
  );

  const icon = direction === 'left' ? (
    <ArrowLeft className="w-4" />
  ) : (
    <ArrowRight className="w-4" />
  );

  return isDisabled ? (
    <Button asChild variant="outline" size='icon'>
      <div className={className}>{icon}</div>
    </Button>
  ) : (
    <Button asChild variant="outline" size='icon'>
      <Link className={className} href={href}>
        {icon}
      </Link>
    </Button>
  );
}