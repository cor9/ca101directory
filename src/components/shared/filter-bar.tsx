"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DEFAULT_QUERY,
  DEFAULT_SORT,
  QUERY_FILTER_LIST,
  SORT_FILTER_LIST,
} from "@/lib/constants";
import { categoryMap } from "@/lib/mappings";
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
  const currentCategory = searchParams.get("category") || null;
  const currentRegion = searchParams.get("region") || null;

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
    [searchParams],
  );

  const handleSortChange = (value: string) => {
    const newSort = value === "null" ? null : value;
    router.push(`/?${createQueryString("sort", newSort)}`);
  };

  const handleFilterChange = (value: string) => {
    const newFilter = value === "null" ? null : value;
    router.push(`/?${createQueryString("f", newFilter)}`);
  };

  const handleCategoryChange = (value: string) => {
    const newCategory = value === "null" ? null : value;
    router.push(`/?${createQueryString("category", newCategory)}`);
  };

  const handleRegionChange = (value: string) => {
    const newRegion = value === "null" ? null : value;
    router.push(`/?${createQueryString("region", newRegion)}`);
  };

  const handleReset = () => {
    router.push("/");
  };

  const currentSortLabel =
    SORT_FILTER_LIST.find((item) => item.slug === currentSort)?.label ||
    DEFAULT_SORT.label;
  const currentFilterLabel =
    QUERY_FILTER_LIST.find((item) => item.slug === currentFilter)?.label ||
    DEFAULT_QUERY.label;

  return (
    <div className={`flex flex-wrap items-center gap-4 ${className}`}>
      {/* Category Filter */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-muted-foreground">
          Select category:
        </label>
        <Select
          value={currentCategory || "null"}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="null">All Categories</SelectItem>
            {Object.values(categoryMap).map((category) => (
              <SelectItem
                key={category}
                value={category.toLowerCase().replace(/\s+/g, "-")}
              >
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Region Filter */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-muted-foreground">
          Select region:
        </label>
        <Select
          value={currentRegion || "null"}
          onValueChange={handleRegionChange}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Regions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="null">All Regions</SelectItem>
            <SelectItem value="Los Angeles">Los Angeles</SelectItem>
            <SelectItem value="San Francisco Bay Area">San Francisco Bay Area</SelectItem>
            <SelectItem value="San Diego">San Diego</SelectItem>
            <SelectItem value="Sacramento">Sacramento</SelectItem>
            <SelectItem value="Central Valley">Central Valley</SelectItem>
            <SelectItem value="Orange County">Orange County</SelectItem>
            <SelectItem value="Ventura County">Ventura County</SelectItem>
            <SelectItem value="Riverside County">Riverside County</SelectItem>
            <SelectItem value="San Bernardino County">San Bernardino County</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-muted-foreground">
          Filter:
        </label>
        <Select
          value={currentFilter || "null"}
          onValueChange={handleFilterChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="No Filter" />
          </SelectTrigger>
          <SelectContent>
            {QUERY_FILTER_LIST.map((filter) => (
              <SelectItem
                key={filter.slug || "null"}
                value={filter.slug || "null"}
              >
                {filter.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-muted-foreground">
          Sort by:
        </label>
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
