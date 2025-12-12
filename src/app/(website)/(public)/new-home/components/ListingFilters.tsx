"use client";

 

import { useState } from "react";

import { Filter, X, ChevronDown } from "lucide-react";

 

interface FilterOption {

  value: string;

  label: string;

}

 

interface ListingFiltersProps {

  categories?: FilterOption[];

  locations?: FilterOption[];

  onFilterChange?: (filters: {

    category: string;

    location: string;

    verified: boolean;

    sortBy: string;

  }) => void;

}

 

const sortOptions: FilterOption[] = [

  { value: "newest", label: "Newest" },

  { value: "popular", label: "Most Popular" },

  { value: "rating", label: "Highest Rated" },

  { value: "az", label: "A-Z" },

];

 

export default function ListingFilters({

  categories = [],

  locations = [],

  onFilterChange,

}: ListingFiltersProps) {

  const [selectedCategory, setSelectedCategory] = useState("");

  const [selectedLocation, setSelectedLocation] = useState("");

  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const [sortBy, setSortBy] = useState("newest");

  const [showFilters, setShowFilters] = useState(false);

 

  const handleFilterChange = (updates: Partial<{

    category: string;

    location: string;

    verified: boolean;

    sortBy: string;

  }>) => {

    const newFilters = {

      category: updates.category ?? selectedCategory,

      location: updates.location ?? selectedLocation,

      verified: updates.verified ?? verifiedOnly,

      sortBy: updates.sortBy ?? sortBy,

    };

 

    if (updates.category !== undefined) setSelectedCategory(updates.category);

    if (updates.location !== undefined) setSelectedLocation(updates.location);

    if (updates.verified !== undefined) setVerifiedOnly(updates.verified);

    if (updates.sortBy !== undefined) setSortBy(updates.sortBy);

 

    onFilterChange?.(newFilters);

  };

 

  const clearFilters = () => {

    setSelectedCategory("");

    setSelectedLocation("");

    setVerifiedOnly(false);

    setSortBy("newest");

    onFilterChange?.({

      category: "",

      location: "",

      verified: false,

      sortBy: "newest",

    });

  };

 

  const hasActiveFilters = selectedCategory || selectedLocation || verifiedOnly;

 

  return (

    <div className="mb-8">

      {/* Filter Toggle for Mobile */}

      <div className="flex items-center justify-between mb-4 lg:hidden">

        <button

          onClick={() => setShowFilters(!showFilters)}

          className="flex items-center gap-2 px-4 py-2 bg-bg-dark-2 border border-border-subtle rounded-xl text-text-secondary hover:text-text-primary transition"

        >

          <Filter className="w-4 h-4" />

          <span>Filters</span>

          {hasActiveFilters && (

            <span className="w-2 h-2 bg-accent-teal rounded-full" />

          )}

        </button>

 

        {/* Sort Dropdown (Always Visible) */}

        <div className="relative">

          <select

            value={sortBy}

            onChange={(e) => handleFilterChange({ sortBy: e.target.value })}

            className="appearance-none px-4 py-2 pr-8 bg-bg-dark-2 border border-border-subtle rounded-xl text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-teal/50 cursor-pointer"

          >

            {sortOptions.map((option) => (

              <option key={option.value} value={option.value}>

                {option.label}

              </option>

            ))}

          </select>

          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />

        </div>

      </div>

 

      {/* Desktop Filters Bar */}

      <div className={`${showFilters ? "block" : "hidden"} lg:block`}>

        <div className="flex flex-wrap items-center gap-4 p-4 bg-bg-dark-2 border border-border-subtle rounded-2xl">

          {/* Category Filter */}

          <div className="relative flex-1 min-w-[180px]">

            <select

              value={selectedCategory}

              onChange={(e) => handleFilterChange({ category: e.target.value })}

              className="w-full appearance-none px-4 py-2.5 pr-8 bg-bg-dark-3 border border-border-subtle rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-teal/50 cursor-pointer"

            >

              <option value="">All Categories</option>

              {categories.map((cat) => (

                <option key={cat.value} value={cat.value}>

                  {cat.label}

                </option>

              ))}

            </select>

            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />

          </div>

 

          {/* Location Filter */}

          <div className="relative flex-1 min-w-[180px]">

            <select

              value={selectedLocation}

              onChange={(e) => handleFilterChange({ location: e.target.value })}

              className="w-full appearance-none px-4 py-2.5 pr-8 bg-bg-dark-3 border border-border-subtle rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-teal/50 cursor-pointer"

            >

              <option value="">All Locations</option>

              {locations.map((loc) => (

                <option key={loc.value} value={loc.value}>

                  {loc.label}

                </option>

              ))}

            </select>

            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />

          </div>

 

          {/* Verified Toggle */}

          <label className="flex items-center gap-3 cursor-pointer group">

            <div className="relative">

              <input

                type="checkbox"

                checked={verifiedOnly}

                onChange={(e) => handleFilterChange({ verified: e.target.checked })}

                className="sr-only peer"

              />

              <div className="w-10 h-6 bg-bg-dark-3 border border-border-subtle rounded-full peer-checked:bg-accent-teal/30 transition-colors" />

              <div className="absolute left-1 top-1 w-4 h-4 bg-text-muted rounded-full peer-checked:translate-x-4 peer-checked:bg-accent-teal transition-all" />

            </div>

            <span className="text-sm text-text-secondary group-hover:text-text-primary transition">

              Verified Only

            </span>

          </label>

 

          {/* Sort (Desktop) */}

          <div className="relative hidden lg:block min-w-[150px]">

            <select

              value={sortBy}

              onChange={(e) => handleFilterChange({ sortBy: e.target.value })}

              className="w-full appearance-none px-4 py-2.5 pr-8 bg-bg-dark-3 border border-border-subtle rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-teal/50 cursor-pointer"

            >

              {sortOptions.map((option) => (

                <option key={option.value} value={option.value}>

                  {option.label}

                </option>

              ))}

            </select>

            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />

          </div>

 

          {/* Clear Filters */}

          {hasActiveFilters && (

            <button

              onClick={clearFilters}

              className="flex items-center gap-1 px-3 py-2 text-sm text-accent-salmon hover:text-accent-salmon/80 transition"

            >

              <X className="w-4 h-4" />

              Clear

            </button>

          )}

        </div>

      </div>

    </div>

  );

}

