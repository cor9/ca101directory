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
import { getCategories } from "@/data/categories";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// US States for the dropdown
const states = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

// Common regions (can be expanded)
const regions = [
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
}

export function DirectoryFilters({ className }: DirectoryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [categories, setCategories] = useState<
    Array<{ id: string; category_name: string }>
  >([]);

  // Load categories from database
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats || []);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    loadCategories();
  }, []);

  // Initialize filters from URL params
  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "");
    setSelectedState(searchParams.get("state") || "");
    setSelectedRegion(searchParams.get("region") || "");
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

  const hasActiveFilters = selectedCategory || selectedState || selectedRegion;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {selectedCategory && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Category:{" "}
                {categories.find((cat) => cat.id === selectedCategory)
                  ?.category_name || selectedCategory}
                <button
                  type="button"
                  onClick={() => updateFilters("category", "")}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedState && (
              <Badge variant="secondary" className="flex items-center gap-1">
                State: {selectedState}
                <button
                  type="button"
                  onClick={() => updateFilters("state", "")}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedRegion && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Region: {selectedRegion}
                <button
                  type="button"
                  onClick={() => updateFilters("region", "")}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Filter Controls */}
        <div className="space-y-4">
          {/* Category Filter */}
          <div>
            <label
              htmlFor="category-select"
              className="text-sm font-medium mb-2 block"
            >
              Category
            </label>
            <Select
              value={selectedCategory}
              onValueChange={(value) => updateFilters("category", value)}
            >
              <SelectTrigger id="category-select">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.category_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* State Filter */}
          <div>
            <label
              htmlFor="state-select"
              className="text-sm font-medium mb-2 block"
            >
              State
            </label>
            <Select
              value={selectedState}
              onValueChange={(value) => updateFilters("state", value)}
            >
              <SelectTrigger id="state-select">
                <SelectValue placeholder="All States" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All States</SelectItem>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Region Filter */}
          <div>
            <label
              htmlFor="region-select"
              className="text-sm font-medium mb-2 block"
            >
              Region
            </label>
            <Select
              value={selectedRegion}
              onValueChange={(value) => updateFilters("region", value)}
            >
              <SelectTrigger id="region-select">
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Regions</SelectItem>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
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
