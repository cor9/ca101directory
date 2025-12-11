"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { regionsList } from "@/data/regions";
import { MapPin, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface DirectoryFiltersProps {
  className?: string;
  categories?: Array<{ id: string; category_name: string }>;
  states?: string[];
}

export function DirectoryFilters({
  className,
  categories = [],
  states = [],
}: DirectoryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedState, setSelectedState] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");

  // Trust Filters
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [backgroundCheckedOnly, setBackgroundCheckedOnly] = useState(false);
  const [highRated, setHighRated] = useState(false);
  const [repeatFamilies, setRepeatFamilies] = useState(false);

  // Initialize filters from URL params
  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "all");
    setSelectedRegion(searchParams.get("region") || "all");
    setSelectedState(searchParams.get("state") || "all");
    setSelectedCity(searchParams.get("city") || "all");

    setVerifiedOnly(searchParams.get("verified") === "true");
    setBackgroundCheckedOnly(searchParams.get("bg_checked") === "true");
    setHighRated(searchParams.get("high_rated") === "true");
    setRepeatFamilies(searchParams.get("repeat") === "true");
  }, [searchParams]);

  const updateFilters = (updates: Record<string, string | boolean | null>) => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "all" || value === false) {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });

    newParams.delete("page"); // Reset to first page when filtering

    const currentPath = window.location.pathname;
    router.push(`${currentPath}?${newParams.toString()}`);
  };

  const clearAllFilters = () => {
    const currentPath = window.location.pathname;
    router.push(currentPath);
  };

  const handleNearMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // In a real implementation, we would reverse geocode to city/state
        // or pass lat/lng to the API. For now, we'll just log it.
        console.log("User location:", position.coords);
        // updates.userLat = position.coords.latitude;
        // updates.userLng = position.coords.longitude;
        alert("Location detected! (Filtering by distance coming soon)");
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location");
      },
    );
  };

  const hasActiveFilters =
    (selectedCategory && selectedCategory !== "all") ||
    (selectedRegion && selectedRegion !== "all") ||
    (selectedState && selectedState !== "all") ||
    (selectedCity && selectedCity !== "all") ||
    verifiedOnly ||
    backgroundCheckedOnly ||
    highRated ||
    repeatFamilies;

  return (
    <Card
      className={`${className} bg-[#cfe0ee] border border-[#b8cfdf] rounded-2xl shadow-[var(--shadow-cream)] relative z-[60] overflow-visible`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-[#1E1F23]">Filters</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleNearMe}
              className="rounded-full bg-[#004E89] text-white hover:bg-[#003d6d] hover:text-white border-none h-7 text-xs"
            >
              <MapPin className="h-3 w-3 mr-1" />
              Near Me
            </Button>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-paper/60 hover:text-gray-900 rounded-full h-7 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-0">
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
                  onClick={() => updateFilters({ category: "all" })}
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
                  onClick={() => updateFilters({ region: "all" })}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedState && selectedState !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                State: {selectedState}
                <button
                  type="button"
                  onClick={() => updateFilters({ state: "all" })}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {verifiedOnly && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-sky-100 text-sky-800 border-sky-200"
              >
                Verified Only
                <button
                  type="button"
                  onClick={() => updateFilters({ verified: false })}
                  className="ml-1 hover:bg-sky-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {backgroundCheckedOnly && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-green-100 text-green-800 border-green-200"
              >
                Background Checked
                <button
                  type="button"
                  onClick={() => updateFilters({ bg_checked: false })}
                  className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Primary Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              onValueChange={(value) => updateFilters({ category: value })}
            >
              <SelectTrigger
                id="category-select"
                className="bg-white/80 text-paper border-[color:var(--card-border)] rounded-full focus:ring-4 focus:ring-[color:var(--ring)] focus:outline-none"
              >
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="z-[9999] bg-white text-paper border border-gray-200 shadow-lg max-h-[300px]">
                <SelectItem value="all" className="text-paper focus:text-paper">
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
              onValueChange={(value) => updateFilters({ region: value })}
            >
              <SelectTrigger
                id="region-select"
                className="bg-white/80 text-paper border-[color:var(--card-border)] rounded-full focus:ring-4 focus:ring-[color:var(--ring)] focus:outline-none"
              >
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent className="z-[9999] bg-white text-paper border border-gray-200 shadow-lg max-h-[300px]">
                <SelectItem value="all" className="text-paper focus:text-paper">
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

          {/* State Filter */}
          <div>
            <label
              htmlFor="state-select"
              className="text-sm font-medium mb-2 block text-gray-900"
            >
              State
            </label>
            <Select
              value={selectedState}
              onValueChange={(value) => updateFilters({ state: value })}
            >
              <SelectTrigger
                id="state-select"
                className="bg-white/80 text-paper border-[color:var(--card-border)] rounded-full focus:ring-4 focus:ring-[color:var(--ring)] focus:outline-none"
              >
                <SelectValue placeholder="All States" />
              </SelectTrigger>
              <SelectContent className="z-[9999] bg-white text-paper border border-gray-200 shadow-lg max-h-[300px]">
                <SelectItem value="all" className="text-paper focus:text-paper">
                  All States
                </SelectItem>
                {states.map((state) => (
                  <SelectItem
                    key={state}
                    value={state}
                    className="text-paper focus:text-paper"
                  >
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Trust Filters */}
        <div className="pt-2 border-t border-slate-300/50">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Trust & Quality
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="verified"
                checked={verifiedOnly}
                onCheckedChange={(checked) =>
                  updateFilters({ verified: !!checked })
                }
              />
              <Label
                htmlFor="verified"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Verified Providers
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="bg-checked"
                checked={backgroundCheckedOnly}
                onCheckedChange={(checked) =>
                  updateFilters({ bg_checked: !!checked })
                }
              />
              <Label
                htmlFor="bg-checked"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Background Checked
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="high-rated"
                checked={highRated}
                onCheckedChange={(checked) =>
                  updateFilters({ high_rated: !!checked })
                }
              />
              <Label
                htmlFor="high-rated"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                4.5+ Stars
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="repeat"
                checked={repeatFamilies}
                onCheckedChange={(checked) =>
                  updateFilters({ repeat: !!checked })
                }
              />
              <Label
                htmlFor="repeat"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Trusted by Repeat Families
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
