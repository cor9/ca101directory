/**
 * SEO-rich content for category pages
 * Uses prewritten CSV content
 * Bauhaus theme with proper text contrast
 */

import { categoryCopyData } from "@/data/category-copy";

interface CategoryContentProps {
  categoryName: string;
  listingCount: number;
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
}: CategoryContentProps) {
  const content = getCategoryContent(categoryName, listingCount);

  if (!content) return null;

  return (
    <div className="mb-8">
      {/* Intro Section - Full width */}
      <div className="bauhaus-card p-6 mb-4">
        <p className="bauhaus-body text-base leading-relaxed text-gray-900">
          {content.intro}
        </p>
      </div>

      {/* Two Column Grid for Why/What sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Why You Need This Section - Robin Egg Blue */}
        <div className="listing-card-blue p-6">
          <h2 className="bauhaus-heading text-xl mb-3 text-ink">
            Why You Need {categoryName}
          </h2>
          <ul className="space-y-2">
            {content.whyYouNeed.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-ink text-sm"
              >
                <span className="text-primary-orange text-lg mt-0.5 flex-shrink-0">
                  ✓
                </span>
                <span className="flex-1 bauhaus-body">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What to Look For Section - Mustard Yellow */}
        <div className="listing-card-mustard p-6">
          <h2 className="bauhaus-heading text-xl mb-3 text-charcoal">
            What to Look For
          </h2>
          <ul className="space-y-2">
            {content.whatToLookFor.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-charcoal text-sm"
              >
                <span className="text-primary-orange text-lg mt-0.5 flex-shrink-0">
                  •
                </span>
                <span className="flex-1 bauhaus-body">{item}</span>
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
