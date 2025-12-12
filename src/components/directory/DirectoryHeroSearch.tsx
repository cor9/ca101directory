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
import { LocateIcon, MapPinIcon, SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

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
  const [locating, setLocating] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (query.trim()) params.set("q", query.trim());
    if (category && category !== "all") params.set("category", category);
    if (state && state !== "all") params.set("state", state);
    if (city.trim()) params.set("city", city.trim());

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
            <div className="md:col-span-2 flex items-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleNearMe}
                disabled={locating}
                className="h-11 w-full md:w-auto bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-lg"
              >
                <LocateIcon className="w-4 h-4 mr-2" />
                {locating ? "Locating..." : "Near Me"}
              </Button>
            </div>
          </div>

          {/* Search Button */}
          <div className="mt-4 flex justify-center">
            <Button
              type="submit"
              className="h-12 px-8 bg-[#FF6B35] hover:bg-[#E55F2F] text-white font-semibold rounded-full text-base"
            >
              <SearchIcon className="w-5 h-5 mr-2" />
              Search Directory
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
