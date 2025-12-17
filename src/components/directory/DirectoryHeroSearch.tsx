"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { stateNames, statesList } from "@/data/regions";
import { LocateIcon, MapPinIcon, SearchIcon, VideoIcon, Baby, DollarSign, ChevronDown, SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

const PRICE_BUCKET_OPTIONS = [
  { value: "", label: "Any Price" },
  { value: "100", label: "Under $100" },
  { value: "250", label: "Under $250" },
  { value: "500", label: "Under $500" },
] as const;

const AGE_GROUP_OPTIONS = [
  { value: "tots", label: "Tots" },
  { value: "tweens", label: "Tweens" },
  { value: "teens", label: "Teens" },
  { value: "young_adults", label: "18+" },
] as const;

const TECHNIQUE_OPTIONS = [
  { value: "meisner", label: "Meisner" },
  { value: "method", label: "Method" },
  { value: "improv", label: "Improv" },
  { value: "classical", label: "Classical" },
] as const;

const UNION_STATUS_OPTIONS = [
  { value: "", label: "Any" },
  { value: "sag_aftra", label: "SAG-AFTRA" },
  { value: "non_union", label: "Non-Union" },
  { value: "both", label: "Both" },
] as const;

// Categories that support technique focus filter
const TECHNIQUE_CATEGORIES = [
  "Acting Classes & Coaches",
  "Acting Schools",
  "Acting Camps",
  "Casting Workshops",
];

// Categories that support union status filter
const UNION_CATEGORIES = [
  "Talent Managers",
  "Talent Agents",
  "Casting Workshops",
];

interface DirectoryHeroSearchProps {
  categories: Array<{ id: string; category_name: string }>;
}

export default function DirectoryHeroSearch({
  categories,
}: DirectoryHeroSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams?.get("q") || "");
  const [category, setCategory] = useState(searchParams?.get("category") || "");
  const [state, setState] = useState(searchParams?.get("state") || "");
  const [city, setCity] = useState(searchParams?.get("city") || "");
  const [onlineAvailable, setOnlineAvailable] = useState(searchParams?.get("online_available") === "true");
  const [ageGroups, setAgeGroups] = useState<string[]>(() => {
    const param = searchParams?.get("age_groups");
    return param ? param.split(",") : [];
  });
  const [priceMax, setPriceMax] = useState(searchParams?.get("price_max") || "");
  const [beginnerFriendly, setBeginnerFriendly] = useState(searchParams?.get("beginner_friendly") === "true");
  const [techniqueFocus, setTechniqueFocus] = useState<string[]>(() => {
    const param = searchParams?.get("technique_focus");
    return param ? param.split(",") : [];
  });
  const [unionStatus, setUnionStatus] = useState(searchParams?.get("union_status") || "");
  const [locating, setLocating] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  // Count active advanced filters
  const advancedFilterCount = [
    ageGroups.length > 0,
    priceMax !== "",
    beginnerFriendly,
    techniqueFocus.length > 0,
    unionStatus !== "",
  ].filter(Boolean).length;

  // Get selected category name for conditional filter display
  const selectedCategoryName = categories.find(c => c.id === category)?.category_name || "";
  const showTechniqueFilter = TECHNIQUE_CATEGORIES.some(tc => selectedCategoryName.includes(tc) || tc.includes(selectedCategoryName));
  const showUnionFilter = UNION_CATEGORIES.some(uc => selectedCategoryName.includes(uc) || uc.includes(selectedCategoryName));

  const toggleTechnique = (value: string) => {
    setTechniqueFocus((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    );
  };

  const toggleAgeGroup = (value: string) => {
    setAgeGroups((prev) =>
      prev.includes(value) ? prev.filter((g) => g !== value) : [...prev, value]
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (query.trim()) params.set("q", query.trim());
    if (category && category !== "all") params.set("category", category);
    if (state && state !== "all") params.set("state", state);
    if (city.trim()) params.set("city", city.trim());
    if (onlineAvailable) params.set("online_available", "true");
    if (ageGroups.length > 0) params.set("age_groups", ageGroups.join(","));
    if (priceMax) params.set("price_max", priceMax);
    if (beginnerFriendly) params.set("beginner_friendly", "true");
    if (techniqueFocus.length > 0) params.set("technique_focus", techniqueFocus.join(","));
    if (unionStatus) params.set("union_status", unionStatus);

    const queryString = params.toString();
    router.push(`/directory${queryString ? `?${queryString}` : ""}`);
  };

  // Near Me: Use browser geolocation to get user's city/state
  const handleNearMe = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Reverse geocode using free Nominatim API
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
          );
          const data = await res.json();
          const address = data?.address || {};
          // Extract city and state
          const detectedCity =
            address.city || address.town || address.village || "";
          const detectedState = address.state || "";
          // Map state name to abbreviation
          const stateAbbr =
            Object.entries(stateNames).find(
              ([, name]) => name.toLowerCase() === detectedState.toLowerCase(),
            )?.[0] || "";
          if (detectedCity) setCity(detectedCity);
          if (stateAbbr) setState(stateAbbr);
        } catch (err) {
          console.error("Reverse geocode failed", err);
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        console.error("Geolocation error", err);
        setLocating(false);
        alert("Unable to retrieve your location.");
      },
      { enableHighAccuracy: false, timeout: 10000 },
    );
  }, []);

  return (
    <div className="bg-[#0C1A2B] py-12 md:py-16 text-white">
      <div className="mx-auto max-w-6xl px-4">
        {/* Headline */}
        <h1 className="bauhaus-heading text-3xl md:text-4xl lg:text-5xl tracking-tight text-center mb-4">
          Find trusted acting coaches, photographers,
          <br className="hidden md:block" />
          and agents for your child.
        </h1>

        {/* Subline */}
        <p className="bauhaus-body text-center text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-8">
          Search by category and location. Every listing is reviewed by Child
          Actor 101.
        </p>

        {/* Search Panel */}
        <form
          onSubmit={handleSearch}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 md:p-6 max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
            {/* Search Keywords */}
            <div className="md:col-span-2">
              <label
                htmlFor="search-query"
                className="text-xs font-medium text-white/60 mb-1 block"
              >
                Search
              </label>
              <Input
                id="search-query"
                type="text"
                placeholder="Acting coach, photographer, manager..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-11 bg-white/90 text-slate-900 placeholder:text-slate-500 border-0 rounded-lg focus:ring-2 focus:ring-[#c7a163]"
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <label
                htmlFor="category-select"
                className="text-xs font-medium text-white/60 mb-1 block"
              >
                Category
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger
                  id="category-select"
                  className="h-11 bg-white/90 text-slate-900 border-0 rounded-lg focus:ring-2 focus:ring-[#c7a163]"
                >
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-white text-slate-900 border border-slate-200 shadow-lg z-[100]">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.category_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* State Dropdown */}
            <div>
              <label
                htmlFor="state-select"
                className="text-xs font-medium text-white/60 mb-1 block"
              >
                State
              </label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger
                  id="state-select"
                  className="h-11 bg-white/90 text-slate-900 border-0 rounded-lg focus:ring-2 focus:ring-[#c7a163]"
                >
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent className="bg-white text-slate-900 border border-slate-200 shadow-lg z-[100] max-h-64">
                  <SelectItem value="all">All States</SelectItem>
                  {statesList.map((st) => (
                    <SelectItem key={st} value={st}>
                      {stateNames[st]} ({st})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* City + Near Me row */}
          <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
            <div className="md:col-span-2">
              <label
                htmlFor="city-input"
                className="text-xs font-medium text-white/60 mb-1 block"
              >
                City (optional)
              </label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="city-input"
                  type="text"
                  placeholder="e.g. Los Angeles"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="h-11 pl-9 bg-white/90 text-slate-900 placeholder:text-slate-500 border-0 rounded-lg focus:ring-2 focus:ring-[#c7a163]"
                />
              </div>
            </div>
            <div className="md:col-span-1 flex items-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleNearMe}
                disabled={locating}
                className="h-11 w-full bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-lg"
              >
                <LocateIcon className="w-4 h-4 mr-2" />
                {locating ? "Locating..." : "Near Me"}
              </Button>
            </div>
            {/* Online Available Toggle */}
            <div className="md:col-span-1 flex items-end">
              <button
                type="button"
                onClick={() => setOnlineAvailable(!onlineAvailable)}
                className={`h-11 w-full flex items-center justify-center gap-2 rounded-lg border transition-colors ${
                  onlineAvailable
                    ? "bg-emerald-500/90 border-emerald-400 text-white"
                    : "bg-white/10 border-white/30 text-white hover:bg-white/20"
                }`}
              >
                <VideoIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Online Available</span>
              </button>
            </div>
          </div>

          {/* More Filters Accordion */}
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                advancedFilterCount > 0
                  ? "text-amber-300"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>
                More Filters
                {advancedFilterCount > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center h-5 w-5 rounded-full bg-amber-500 text-white text-xs font-bold">
                    {advancedFilterCount}
                  </span>
                )}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showMoreFilters ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Collapsible Advanced Filters */}
            {showMoreFilters && (
              <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
                {/* Age Groups + Price Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {/* Age Groups Multi-select */}
                  <div>
                    <label className="text-xs font-medium text-white/60 mb-2 block flex items-center gap-1">
                      <Baby className="w-3 h-3" />
                      Age Groups
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {AGE_GROUP_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => toggleAgeGroup(opt.value)}
                          className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-colors ${
                            ageGroups.includes(opt.value)
                              ? "bg-pink-500/90 border-pink-400 text-white"
                              : "bg-white/10 border-white/30 text-white hover:bg-white/20"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Filter */}
                  <div>
                    <label className="text-xs font-medium text-white/60 mb-2 block flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      Budget
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {PRICE_BUCKET_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setPriceMax(opt.value)}
                          className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-colors ${
                            priceMax === opt.value
                              ? "bg-emerald-500/90 border-emerald-400 text-white"
                              : "bg-white/10 border-white/30 text-white hover:bg-white/20"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Conditional Faceted Filters - only show when relevant category selected */}
                {(showTechniqueFilter || showUnionFilter || (category && category !== "all")) && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                    {/* Beginner Friendly Toggle - always show when category selected */}
                    {category && category !== "all" && (
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => setBeginnerFriendly(!beginnerFriendly)}
                          className={`h-10 w-full flex items-center justify-center gap-2 rounded-lg border transition-colors ${
                            beginnerFriendly
                              ? "bg-sky-500/90 border-sky-400 text-white"
                              : "bg-white/10 border-white/30 text-white hover:bg-white/20"
                          }`}
                        >
                          <span className="text-sm font-medium">Beginner Friendly</span>
                        </button>
                      </div>
                    )}

                    {/* Technique Focus - only for acting/coaching categories */}
                    {showTechniqueFilter && (
                      <div>
                        <label className="text-xs font-medium text-white/60 mb-2 block">
                          Technique Focus
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {TECHNIQUE_OPTIONS.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => toggleTechnique(opt.value)}
                              className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-colors ${
                                techniqueFocus.includes(opt.value)
                                  ? "bg-purple-500/90 border-purple-400 text-white"
                                  : "bg-white/10 border-white/30 text-white hover:bg-white/20"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Union Status - only for talent rep categories */}
                    {showUnionFilter && (
                      <div>
                        <label className="text-xs font-medium text-white/60 mb-2 block">
                          Union Status
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {UNION_STATUS_OPTIONS.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setUnionStatus(opt.value)}
                              className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-colors ${
                                unionStatus === opt.value
                                  ? "bg-amber-500/90 border-amber-400 text-white"
                                  : "bg-white/10 border-white/30 text-white hover:bg-white/20"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Search Button */}
          <div className="mt-6 flex justify-center">
            <Button
              type="submit"
              className="h-12 px-8 bg-[#FF6B35] hover:bg-[#E55F2F] text-white font-semibold rounded-full text-base"
            >
              <SearchIcon className="w-5 h-5 mr-2" />
              Show Results
            </Button>
          </div>
        </form>

        {/* Suggest Vendor Link */}
        <div className="mt-6 text-center">
          <a
            href="/suggest-vendor"
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
          >
            Know someone great? Suggest a vendor →
          </a>
        </div>
      </div>
    </div>
  );
}
