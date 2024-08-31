"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { useRouter, useSearchParams } from "next/navigation";

export default function BlogPagination({
  pageIndex,
  isFirstPage,
  isLastPage
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  // Define functions for navigating to the next and previous pages
  // These functions update the page query parameter in the URL
  const handleNextPage = () => {
    params.set("page", (pageIndex + 1).toString());
    const query = params.toString();

    router.push(`/blog?${query}`);
  };

  const handlePrevPage = () => {
    params.set("page", (pageIndex - 1).toString());
    const query = params.toString();

    router.push(`/blog?${query}`);
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={handlePrevPage}
            aria-disabled={isFirstPage}
            className={isFirstPage ? "pointer-events-none text-gray-300 dark:text-gray-600" : "cursor-pointer"}
          />
        </PaginationItem>


        <PaginationItem>
          <PaginationNext
            onClick={handleNextPage}
            aria-disabled={isLastPage}
            className={isLastPage ? "pointer-events-none text-gray-300 dark:text-gray-600" : "cursor-pointer"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
