"use client";

import { useState } from "react";
import { RichTextDisplay } from "./rich-text-display";

interface ExpandableTextProps {
  content: string;
  title?: string;
  maxLength?: number;
  className?: string;
}

/**
 * Expandable text block with clamp + "Read more" toggle.
 * Uses <details> for accessibility and no JS dependencies.
 */
export function ExpandableText({
  content,
  title,
  maxLength = 280,
  className = "",
}: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);
  const text = (content || "").trim();

  if (!text) return null;

  const isLong = text.length > maxLength;

  return (
    <div
      className={`rounded-2xl border border-white/5 bg-bg-panel/60 backdrop-blur-sm p-5 ${className}`}
    >
      {title && (
        <h3 className="text-text-primary font-semibold mb-2">{title}</h3>
      )}

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
    </div>
  );
}
