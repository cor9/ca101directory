"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
    <section className="pb-10">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight max-w-3xl text-text-primary leading-tight">
        Find Trusted Acting Professionals for Your Child
      </h1>

      <p className="mt-4 text-text-secondary max-w-xl leading-relaxed text-lg">
        Over 12,000 families rely on Child Actor 101 to discover verified coaches, photographers,
        agents, and industry pros who understand the youth entertainment world.
      </p>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mt-8">
        <div className="flex items-center bg-bg-dark-2 border border-border-subtle rounded-2xl px-5 py-4 max-w-2xl hover-glow transition">
          <Search className="h-5 w-5 text-text-muted mr-3 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by service, city, or professional name"
            className="bg-transparent outline-none flex-1 text-text-primary placeholder:text-text-muted text-base"
          />
        </div>
        <p className="mt-2 text-xs text-text-muted text-center">
          Results are curated for youth performers and families.
        </p>
      </form>

      {/* Suggest Vendor CTA */}
      <Link
        href="/suggest-vendor"
        className="inline-block mt-6 text-accent-lemon font-semibold text-lg hover:underline hover:scale-[1.02] transition active-press"
      >
        Know someone great? Suggest a vendor →
      </Link>
    </section>
  );
}
