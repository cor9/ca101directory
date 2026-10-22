"use client";

import { RichTextDisplay } from "@/components/ui/rich-text-display";
import type { Listing } from "@/data/listings";
import { useState } from "react";

const RICH_LIGHT =
  "text-base leading-relaxed [&_*]:!text-zinc-800 [&_a]:!text-[#B8431F] [&_p]:mb-3";

export function ListingAbout({
  listing,
  title = "About",
}: {
  listing: Listing;
  title?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const text = (listing.what_you_offer || listing.description || "").trim();
  if (!text) return null;
  const isLong = text.length > 600;

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-zinc-900">{title}</h2>
      <div className={!expanded && isLong ? "relative max-h-48 overflow-hidden" : ""}>
        <RichTextDisplay content={text} className={RICH_LIGHT} />
        {!expanded && isLong && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
        )}
      </div>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-4 rounded-full border border-zinc-300 px-5 py-1.5 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-100"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}
