"use client";

import Link from "next/link";

interface RelatedLinksProps {
  categoryNames?: string[];
}

/**
 * Internal linking component for SEO
 * Related category pills + a way back to the directory.
 * (Provider recommendations live in a single section on the listing page.)
 */
export function RelatedLinks({ categoryNames = [] }: RelatedLinksProps) {
  return (
    <div className="mt-8 space-y-8">
      {/* Category Navigation - NAVY BACKGROUND WITH VARIED ACCENT BUTTONS */}
      {categoryNames && categoryNames.length > 1 && (
        <div className="rounded-lg p-6" style={{ backgroundColor: "#0d1b2a" }}>
          <h3 className="text-xl font-bold mb-4" style={{ color: "#fafaf4" }}>
            Related Categories
          </h3>
          <div className="flex flex-wrap gap-3">
            {categoryNames.map((categoryName, index) => {
              const slug = categoryName
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "");

              // Rotate through accent colors: orange, mustard, denim
              const colors = [
                { bg: "#e4572e", text: "#fafaf4", hover: "#e4a72e" }, // Orange
                { bg: "#e4a72e", text: "#0f1113", hover: "#e4572e" }, // Mustard
                { bg: "#3a76a6", text: "#fafaf4", hover: "#e4572e" }, // Denim
              ];
              const colorSet = colors[index % colors.length];

              return (
                <Link
                  key={`${categoryName}-${index}`}
                  href={`/category/${slug}`}
                  className="inline-block px-5 py-2 rounded-md transition-all text-sm font-bold"
                  style={{
                    backgroundColor: colorSet.bg,
                    color: colorSet.text,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colorSet.hover;
                    e.currentTarget.style.color = "#fafaf4";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colorSet.bg;
                    e.currentTarget.style.color = colorSet.text;
                  }}
                >
                  {categoryName}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Back to Directory CTA - CLAPPER ORANGE */}
      <div className="text-center">
        <Link
          href="/directory"
          className="inline-block px-8 py-4 rounded-md transition-all font-bold text-lg hover:shadow-lg"
          style={{
            backgroundColor: "#e4572e",
            color: "#fafaf4",
          }}
        >
          ← Browse All Professionals
        </Link>
      </div>
    </div>
  );
}
