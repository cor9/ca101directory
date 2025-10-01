"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCategories } from "@/data/categories";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface ListingFiltersProps {
  className?: string;
}

interface Category {
  id: string;
  category_name: string;
}

export function ListingFilters({ className = "" }: ListingFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);

  const currentCategory = searchParams.get("category") || null;
  const currentRegion = searchParams.get("region") || null;
  const currentState = searchParams.get("state") || null;
  const currentApproved101 = searchParams.get("approved101") === "true";

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    loadCategories();
  }, []);

  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || value === "") {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams],
  );

  const handleCategoryChange = (value: string) => {
    const newCategory = value === "all" ? null : value;
    router.push(`/?${createQueryString("category", newCategory)}`);
  };

  const handleRegionChange = (value: string) => {
    const newRegion = value === "all" ? null : value;
    router.push(`/?${createQueryString("region", newRegion)}`);
  };

  const handleStateChange = (value: string) => {
    const newState = value === "all" ? null : value;
    router.push(`/?${createQueryString("state", newState)}`);
  };

  const handleApproved101Change = (checked: boolean) => {
    router.push(
      `/?${createQueryString("approved101", checked ? "true" : null)}`,
    );
  };

  const handleReset = () => {
    router.push("/");
  };

  const hasActiveFilters =
    currentCategory || currentRegion || currentState || currentApproved101;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={handleReset}>
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Category Filter */}
        <div className="space-y-2">
          <label htmlFor="category-filter" className="text-sm font-medium">
            Category
          </label>
          <Select
            value={currentCategory || "all"}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger id="category-filter">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.category_name}>
                  {category.category_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Region Filter */}
        <div className="space-y-2">
          <label htmlFor="region-filter" className="text-sm font-medium">
            Region
          </label>
          <Select
            value={currentRegion || "all"}
            onValueChange={handleRegionChange}
          >
            <SelectTrigger id="region-filter">
              <SelectValue placeholder="All Regions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="Los Angeles">Los Angeles</SelectItem>
              <SelectItem value="San Francisco Bay Area">
                San Francisco Bay Area
              </SelectItem>
              <SelectItem value="San Diego">San Diego</SelectItem>
              <SelectItem value="Sacramento">Sacramento</SelectItem>
              <SelectItem value="Central Valley">Central Valley</SelectItem>
              <SelectItem value="Orange County">Orange County</SelectItem>
              <SelectItem value="Ventura County">Ventura County</SelectItem>
              <SelectItem value="Riverside County">Riverside County</SelectItem>
              <SelectItem value="San Bernardino County">
                San Bernardino County
              </SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* State Filter */}
        <div className="space-y-2">
          <label htmlFor="state-filter" className="text-sm font-medium">
            State
          </label>
          <Select
            value={currentState || "all"}
            onValueChange={handleStateChange}
          >
            <SelectTrigger id="state-filter">
              <SelectValue placeholder="All States" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              <SelectItem value="CA">California</SelectItem>
              <SelectItem value="NY">New York</SelectItem>
              <SelectItem value="GA">Georgia</SelectItem>
              <SelectItem value="IL">Illinois</SelectItem>
              <SelectItem value="TX">Texas</SelectItem>
              <SelectItem value="FL">Florida</SelectItem>
              <SelectItem value="Virtual">Virtual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 101 Approved Badge Filter */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="approved101"
            checked={currentApproved101}
            onCheckedChange={handleApproved101Change}
          />
          <label
            htmlFor="approved101"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            101 Approved Badge Only
          </label>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="pt-4 border-t">
          <div className="flex flex-wrap gap-2">
            {currentCategory && (
              <Badge variant="secondary" className="text-xs">
                Category: {currentCategory}
                <button
                  type="button"
                  onClick={() => handleCategoryChange("all")}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
            {currentRegion && (
              <Badge variant="secondary" className="text-xs">
                Region: {currentRegion}
                <button
                  type="button"
                  onClick={() => handleRegionChange("all")}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
            {currentState && (
              <Badge variant="secondary" className="text-xs">
                State: {currentState}
                <button
                  type="button"
                  onClick={() => handleStateChange("all")}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
            {currentApproved101 && (
              <Badge variant="secondary" className="text-xs">
                101 Approved
                <button
                  type="button"
                  onClick={() => handleApproved101Change(false)}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
