"use client";

import { RichTextDisplay } from "@/components/ui/rich-text-display";
import type { Listing } from "@/data/listings";
import { useState } from "react";

interface ListingAboutProps {
  listing: Listing;
}

export function ListingAbout({ listing }: ListingAboutProps) {
  const [expanded, setExpanded] = useState(false);
  const description = listing.what_you_offer || listing.description || null;

  if (!description) {
    return null;
  }

  const text = (description || "").trim();
  const isLong = text.length > 280;

  return (
    <section className="bg-bg-panel/60 backdrop-blur-sm border border-white/5 rounded-xl p-6">
      <h2 className="text-xl font-bold mb-3 text-text-primary">About</h2>

      {/* Clamped preview */}
      <div className={expanded ? "hidden" : "block"}>
        <RichTextDisplay
          content={text}
          className="text-sm leading-relaxed text-text-secondary line-clamp-4"
        />
      </div>

      {/* Full content when expanded */}
      {expanded && (
        <RichTextDisplay
          content={text}
          className="text-sm leading-relaxed text-text-secondary"
        />
      )}

      {/* Read more / Read less toggle */}
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-sky-400 hover:text-sky-300 text-sm font-medium transition-colors"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </section>
  );
}
