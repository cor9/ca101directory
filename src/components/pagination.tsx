'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { generatePagination } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CustomPagination({ totalPages }: { totalPages: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

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
            onClick={currentPage < totalPages ? () => handlePageChange(currentPage + 1) : undefined} 
            aria-disabled={currentPage >= totalPages}
            className={currentPage >= totalPages ? "pointer-events-none text-gray-300 dark:text-gray-600" : "cursor-pointer"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}