'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { generatePagination } from '@/lib/utils';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function CustomPagination({ totalPages }: { totalPages: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const handlePageChange = (page: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`/?${params.toString()}`); // 使用 router.push 进行导航
  };

  const allPages = generatePagination(currentPage, totalPages);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            // href={currentPage > 1 ? createPageURL(currentPage - 1) : undefined} 
            onClick={currentPage > 1 ? () => handlePageChange(currentPage - 1) : undefined} 
            aria-disabled={currentPage <= 1}
            className={currentPage <= 1 ? "pointer-events-none text-gray-300 dark:text-gray-600" : "cursor-pointer"}
          />
        </PaginationItem>
        {allPages.map((page, index) => (
          <PaginationItem key={`${page}-${index}`}>
            {page === '...' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                // href={createPageURL(page)}
                onClick={() => handlePageChange(page)}
                isActive={currentPage === page}
                className={currentPage === page ? "" : "cursor-pointer"}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext 
            // href={currentPage < totalPages ? createPageURL(currentPage + 1) : undefined} 
            onClick={currentPage < totalPages ? () => handlePageChange(currentPage + 1) : undefined} 
            aria-disabled={currentPage >= totalPages}
            className={currentPage >= totalPages ? "pointer-events-none text-gray-300 dark:text-gray-600" : "cursor-pointer"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}