'use client';

import { usePathname, useSearchParams } from 'next/navigation';
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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  if (totalPages <= 1) {
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" aria-disabled="true" className="cursor-not-allowed">
              <PaginationLink>Previous</PaginationLink>
            </PaginationPrevious>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" aria-disabled="true" className="cursor-not-allowed">
              <PaginationLink>Next</PaginationLink>
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  }

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const allPages = generatePagination(currentPage, totalPages);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            href={currentPage > 1 ? createPageURL(currentPage - 1) : undefined} 
            aria-disabled={currentPage === 1}
            className={currentPage === 1 ? "cursor-not-allowed" : ""}
          />
        </PaginationItem>
        {allPages.map((page, index) => (
          <PaginationItem key={`${page}-${index}`}>
            {page === '...' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href={createPageURL(page)}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext 
            href={currentPage < totalPages ? createPageURL(currentPage + 1) : undefined} 
            aria-disabled={currentPage === totalPages}
            className={currentPage === totalPages ? "cursor-not-allowed" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}