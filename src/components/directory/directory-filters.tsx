"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Removed states array - using regions only

// Common regions (can be expanded)
export const regionsList = [
  "Los Angeles County",
  "Orange County",
  "San Diego County",
  "San Francisco Bay Area",
  "Sacramento Area",
  "Central Valley",
  "New York City",
  "Long Island",
  "Westchester County",
  "Atlanta Metro",
  "Miami-Dade County",
  "Broward County",
  "Chicago Metro",
  "Dallas-Fort Worth",
  "Houston Metro",
  "Phoenix Metro",
  "Denver Metro",
  "Seattle Metro",
  "Portland Metro",
  "Online/Virtual",
];

interface DirectoryFiltersProps {
  className?: string;
  categories?: Array<{ id: string; category_name: string }>;
}

export function DirectoryFilters({
  className,
  categories = [],
}: DirectoryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");

  // Initialize filters from URL params
  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "all");
    setSelectedRegion(searchParams.get("region") || "all");
  }, [searchParams]);

  const updateFilters = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (value && value !== "all") {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }

    newParams.delete("page"); // Reset to first page when filtering

    // Use current pathname instead of hardcoded /directory
    const currentPath = window.location.pathname;
    router.push(`${currentPath}?${newParams.toString()}`);
  };

  const clearAllFilters = () => {
    // Use current pathname instead of hardcoded /directory
    const currentPath = window.location.pathname;
    router.push(currentPath);
  };

  const hasActiveFilters =
    (selectedCategory && selectedCategory !== "all") ||
    (selectedRegion && selectedRegion !== "all");

  return (
    <Card
      className={`${className} bg-paper border border-surface/20 rounded-2xl shadow-[var(--shadow-cream)] relative z-[60] overflow-visible`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-gray-900">Filters</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-paper/60 hover:text-gray-900 rounded-full"
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {selectedCategory && selectedCategory !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Category:{" "}
                {categories.find((cat) => cat.id === selectedCategory)
                  ?.category_name || selectedCategory}
                <button
                  type="button"
                  onClick={() => updateFilters("category", "all")}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedRegion && selectedRegion !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Region: {selectedRegion}
                <button
                  type="button"
                  onClick={() => updateFilters("region", "all")}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category Filter */}
          <div>
            <label
              htmlFor="category-select"
              className="text-sm font-medium mb-2 block text-gray-900"
            >
              Category
            </label>
            <Select
              value={selectedCategory}
              onValueChange={(value) => updateFilters("category", value)}
            >
              <SelectTrigger
                id="category-select"
                className="bg-white/80 text-paper border-[color:var(--card-border)] rounded-full focus:ring-4 focus:ring-[color:var(--ring)] focus:outline-none"
              >
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="z-[9999] bg-white text-paper border border-gray-200 shadow-lg">
                <SelectItem
                  value="all"
                  className="text-paper focus:text-paper"
                >
                  All Categories
                </SelectItem>
                {categories.map((category) => (
                  <SelectItem
                    key={category.id}
                    value={category.id}
                    className="text-paper focus:text-paper"
                  >
                    {category.category_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Region Filter */}
          <div>
            <label
              htmlFor="region-select"
              className="text-sm font-medium mb-2 block text-gray-900"
            >
              Region
            </label>
            <Select
              value={selectedRegion}
              onValueChange={(value) => updateFilters("region", value)}
            >
              <SelectTrigger
                id="region-select"
                className="bg-white/80 text-paper border-[color:var(--card-border)] rounded-full focus:ring-4 focus:ring-[color:var(--ring)] focus:outline-none"
              >
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent className="z-[9999] bg-white text-paper border border-gray-200 shadow-lg">
                <SelectItem
                  value="all"
                  className="text-paper focus:text-paper"
                >
                  All Regions
                </SelectItem>
                {regionsList.map((region) => (
                  <SelectItem
                    key={region}
                    value={region}
                    className="text-paper focus:text-paper"
                  >
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
