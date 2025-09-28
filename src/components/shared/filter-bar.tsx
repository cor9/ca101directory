"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SORT_FILTER_LIST, DEFAULT_SORT, QUERY_FILTER_LIST, DEFAULT_QUERY } from "@/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface FilterBarProps {
  className?: string;
}

export default function FilterBar({ className = "" }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || null;
  const currentFilter = searchParams.get("f") || null;
  const currentTag = searchParams.get("tag") || null;

  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null) {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleSortChange = (value: string) => {
    const newSort = value === "null" ? null : value;
    router.push(`/?${createQueryString("sort", newSort)}`);
  };

  const handleFilterChange = (value: string) => {
    const newFilter = value === "null" ? null : value;
    router.push(`/?${createQueryString("f", newFilter)}`);
  };

  const handleTagChange = (value: string) => {
    const newTag = value === "null" ? null : value;
    router.push(`/?${createQueryString("tag", newTag)}`);
  };

  const handleReset = () => {
    router.push("/");
  };

  const currentSortLabel = SORT_FILTER_LIST.find(item => item.slug === currentSort)?.label || DEFAULT_SORT.label;
  const currentFilterLabel = QUERY_FILTER_LIST.find(item => item.slug === currentFilter)?.label || DEFAULT_QUERY.label;

  return (
    <div className={`flex flex-wrap items-center gap-4 ${className}`}>
      {/* Tag Filter */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-muted-foreground">Select tags:</label>
        <Select value={currentTag || "null"} onValueChange={handleTagChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Tags" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="null">All Tags</SelectItem>
            <SelectItem value="5-8">Ages 5-8</SelectItem>
            <SelectItem value="9-12">Ages 9-12</SelectItem>
            <SelectItem value="13-17">Ages 13-17</SelectItem>
            <SelectItem value="18">Ages 18+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-muted-foreground">Filter:</label>
        <Select value={currentFilter || "null"} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="No Filter" />
          </SelectTrigger>
          <SelectContent>
            {QUERY_FILTER_LIST.map((filter) => (
              <SelectItem key={filter.slug || "null"} value={filter.slug || "null"}>
                {filter.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-muted-foreground">Sort by:</label>
        <Select value={currentSort || "null"} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by Time (dsc)" />
          </SelectTrigger>
          <SelectContent>
            {SORT_FILTER_LIST.map((sort) => (
              <SelectItem key={sort.slug || "null"} value={sort.slug || "null"}>
                {sort.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Reset Button */}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleReset}
        className="ml-auto"
      >
        Reset
      </Button>
    </div>
  );
}
