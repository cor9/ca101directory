"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const quickCategories = [
  "Acting Classes",
  "Photographers",
  "Talent Agents",
  "Headshot Photographers",
  "Demo Reel Creators",
  "Coaches",
];

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Main Headline */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
        <span className="text-white">The #1 Directory</span>
        <br />
        <span className="text-white">for </span>
        <span className="text-[#E4572E]">Child Actor</span>
        <br />
        <span className="text-[#E4572E]">Vendors</span>
        <span className="text-white"> & </span>
        <span className="text-[#3A76A6]">Industry</span>
        <br />
        <span className="text-[#3A76A6]">Professionals</span>
      </h1>

      {/* Subtext */}
      <p className="text-gray-300 text-lg max-w-xl">
        12,000+ families rely on Child Actor 101 for connections to acting
        coaches, photographers, agents, and other trusted industry
        professionals—making the path less confusing and more accessible.
      </p>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="w-full max-w-xl">
        <div className="relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for acting coaches, photographers, edit..."
            className="w-full bg-[#1A1F2E] border border-gray-700 rounded-lg py-3 px-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3A76A6] focus:border-transparent"
          />
          <button
            type="submit"
            className="absolute right-2 bg-[#3A76A6] hover:bg-[#2E5E85] text-white p-2 rounded-md transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Quick Category Pills */}
      <div className="flex flex-wrap gap-2 max-w-xl">
        {quickCategories.map((category) => (
          <Link
            key={category}
            href={`/category/${category.toLowerCase().replace(/\s+/g, "-")}`}
            className="px-4 py-2 bg-[#1A1F2E] border border-gray-700 rounded-full text-sm text-gray-300 hover:bg-[#252B3B] hover:border-gray-600 transition-colors"
          >
            {category}
          </Link>
        ))}
      </div>
    </div>
  );
}
