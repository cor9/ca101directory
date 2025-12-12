"use client";

import { Search } from "lucide-react";

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-bg-dark via-bg-dark-2 to-bg-dark-3" />
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_rgba(62,226,201,0.15),_transparent_60%)]" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <h1 className="text-4xl md:text-5xl font-semibold text-text-primary tracking-tight">
          Find trusted professionals for your child's acting journey
        </h1>

        <p className="mt-4 text-lg text-text-secondary max-w-2xl">
          Coaches, photographers, agents, and industry pros — vetted for
          families.
        </p>

        {/* Search Bar */}
        <div className="mt-8 max-w-3xl">
          <div className="flex items-center gap-3 bg-card-surface border border-border-subtle rounded-2xl px-4 py-4 shadow-card">
            <Search className="w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Search by service, name, or city"
              className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted outline-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
