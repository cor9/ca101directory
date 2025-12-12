"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createUrl } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";

interface SearchBoxProps {
  urlPrefix: string;
}

export default function HomeSearchBox({ urlPrefix }: SearchBoxProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("q") || "");
  const [debouncedQuery] = useDebounce(searchQuery, 300); // 300ms debounce
  const [isSearching, setIsSearching] = useState(false);
  const lastExecutedQuery = useRef(searchParams?.get("q") || "");
  const previousQueryRef = useRef("");
  const isUserTypingRef = useRef(false);

  useEffect(() => {
    const currentQuery = searchParams?.get("q") || "";
    if (currentQuery !== previousQueryRef.current && !isUserTypingRef.current) {
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
    isUserTypingRef.current = true;
    setSearchQuery(e.target.value);

    // Reset the flag to allow updates after URL changes (but give enough time to complete the current input)
    setTimeout(() => {
      isUserTypingRef.current = false;
    }, 500);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-center">
        <Input
          type="text"
          placeholder="Search by service, name, city, or specialty"
          autoComplete="off"
          value={searchQuery}
          onChange={handleSearch}
          className={cn(
            "w-[320px] sm:w-[480px] md:w-[640px] h-12 rounded-r-none",
            "bg-bg-2 border-border-subtle text-text-primary placeholder:text-text-muted",
            "focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary-orange focus:border-2 focus:border-r-0",
          )}
        />
        <Button
          type="submit"
          className="rounded-l-none size-12 btn-primary"
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
      <p className="mt-2 text-xs text-text-muted">
        Results are curated for youth performers and families.
      </p>
    </div>
  );
}
