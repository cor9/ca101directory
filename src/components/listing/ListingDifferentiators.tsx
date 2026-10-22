"use client";

import { RichTextDisplay } from "@/components/ui/rich-text-display";
import type { Listing } from "@/data/listings";
import { useState } from "react";

interface ListingDifferentiatorsProps {
  listing: Listing;
}

interface ExpandableBlockProps {
  title: string;
  content: string;
}

function ExpandableBlock({ title, content }: ExpandableBlockProps) {
  const [expanded, setExpanded] = useState(false);
  const text = (content || "").trim();
  const isLong = text.length > 280;

  return (
    <div className="border border-white/10 bg-[#1B3550] rounded-xl p-6">
      <h3 className="text-base font-semibold text-white mb-2">
        {title}
      </h3>

      {/* Clamped preview */}
      <div className={expanded ? "hidden" : "block"}>
        <RichTextDisplay
          content={text}
          className="text-sm leading-relaxed text-slate-100 line-clamp-4"
        />
      </div>

      {/* Full content when expanded */}
      {expanded && (
        <RichTextDisplay
          content={text}
          className="text-sm leading-relaxed text-slate-100"
        />
      )}

      {/* Read more / Read less toggle */}
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-sky-300 hover:text-white text-sm font-medium transition-colors"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}

export function ListingDifferentiators({
  listing,
}: ListingDifferentiatorsProps) {
  const unique = listing.why_is_it_unique;
  const notes = listing.extras_notes;

  if (!unique && !notes) {
    return null;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-white">
        What Sets This Provider Apart
      </h2>

      {unique && (
        <ExpandableBlock title="What Makes Us Unique" content={unique} />
      )}

      {notes && <ExpandableBlock title="Additional Notes" content={notes} />}
    </section>
  );
}
