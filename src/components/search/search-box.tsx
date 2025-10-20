"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";

interface SearchBoxProps {
  urlPrefix: string;
}

export default function SearchBox({ urlPrefix }: SearchBoxProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("q") || "");
  const [debouncedQuery] = useDebounce(searchQuery, 300); // 300ms debounce
  const [isSearching, setIsSearching] = useState(false);
  const lastExecutedQuery = useRef(searchParams?.get("q") || "");
  const previousQueryRef = useRef("");

  useEffect(() => {
    const currentQuery = searchParams?.get("q") || "";
    if (currentQuery !== previousQueryRef.current) {
      setSearchQuery(currentQuery);
      previousQueryRef.current = currentQuery;
    }
  }, [searchParams]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (debouncedQuery !== lastExecutedQuery.current) {
      setIsSearching(true);
      const newParams = new URLSearchParams(searchParams?.toString());
      if (debouncedQuery) {
        newParams.set("q", debouncedQuery);
      } else {
        newParams.delete("q");
      }
      newParams.delete("page");
      const newUrl = createUrl(`${urlPrefix}`, newParams);
      console.log(`useEffect, newUrl: ${newUrl}`);
      lastExecutedQuery.current = debouncedQuery;
      router.push(newUrl, { scroll: false });

      // Smooth scroll to results after a short delay to allow the page to update
      if (debouncedQuery) {
        setTimeout(() => {
          const resultsElement = document.getElementById("search-results");
          if (resultsElement) {
            resultsElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
              inline: "nearest",
            });
          }
          setIsSearching(false);
        }, 100);
      } else {
        setIsSearching(false);
      }
    }
  }, [debouncedQuery, router, searchParams, urlPrefix]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex items-center justify-center">
      <Input
        type="text"
        placeholder="Search for acting coaches, photographers, editors..."
        autoComplete="off"
        value={searchQuery}
        onChange={handleSearch}
        className={cn(
          "w-[320px] sm:w-[480px] md:w-[640px] h-12 rounded-r-none bg-paper text-paper placeholder:text-paper/50",
          "focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary-orange focus:border-2 focus:border-r-0",
        )}
      />
      <Button
        type="submit"
        className="rounded-l-none size-12 bg-primary-orange hover:bg-primary-orange/90 text-paper"
        disabled={isSearching}
      >
        <SearchIcon
          className={cn("size-6", isSearching && "animate-pulse")}
          aria-hidden="true"
        />
        <span className="sr-only">
          {isSearching ? "Searching..." : "Search"}
        </span>
      </Button>
    </div>
  );
}
