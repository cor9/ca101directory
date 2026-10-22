/**
 * SEO-rich content for category pages
 * Uses prewritten CSV content
 * Neutral white cards (matches the profile / card surfaces)
 */

import { categoryCopyData } from "@/data/category-copy";

interface CategoryContentProps {
  categoryName: string;
  listingCount: number;
  /** Name to look the prewritten copy up under (defaults to categoryName) */
  copyName?: string;
}

interface CategoryCopy {
  category_name: string;
  intro_text: string;
  why_you_need: string;
  what_to_look_for: string;
}

// --- Load category copy data ---
function loadCategoryCopy(): CategoryCopy[] {
  return categoryCopyData as CategoryCopy[];
}

// --- Convert bullet strings into arrays ---
function formatBullets(text: string): string[] {
  if (!text) return [];

  return text
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      // Remove URLs (anything starting with http)
      let cleaned = line.replace(/https?:\/\/[^\s]+/g, "").trim();
      // Remove bullet markers
      cleaned = cleaned.replace(/^[✓•]\s*/, "").trim();
      return cleaned;
    })
    .filter((line) => line.length > 0);
}

export function CategoryContent({
  categoryName,
  listingCount,
  copyName,
}: CategoryContentProps) {
  const content = getCategoryContent(copyName ?? categoryName, listingCount);

  if (!content) return null;

  return (
    <div className="mb-8 space-y-4">
      {/* Intro */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-base leading-relaxed text-zinc-800">
          {content.intro}
        </p>
      </div>

      {/* Why / What: two neutral white cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-bold text-zinc-900">
            Why You Need {categoryName}
          </h2>
          <ul className="space-y-2">
            {content.whyYouNeed.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-zinc-800"
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-base font-bold text-zinc-900"
                >
                  ✓
                </span>
                <span className="flex-1 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-bold text-zinc-900">
            What to Look For
          </h2>
          <ul className="space-y-2">
            {content.whatToLookFor.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-zinc-800"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-500"
                />
                <span className="flex-1 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function getCategoryContent(categoryName: string, listingCount: number) {
  const categories = loadCategoryCopy();
  const match = categories.find(
    (c) =>
      c.category_name &&
      c.category_name.toLowerCase() === categoryName.toLowerCase(),
  );

  if (!match) return null;

  return {
    intro: match.intro_text.replace("{{count}}", listingCount.toString()),
    whyYouNeed: formatBullets(match.why_you_need),
    whatToLookFor: formatBullets(match.what_to_look_for),
  };
}
