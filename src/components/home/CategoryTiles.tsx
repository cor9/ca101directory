import { getCategories } from "@/data/categories";
import { getPublicListings } from "@/data/listings";
import Link from "next/link";

// Homepage Featured Categories (exact order, parent-facing, revenue-driving)
const HOME_CATEGORIES = [
  "Acting Classes & Coaches",
  "Audition Prep",
  "Career Consultation",
  "Demo Reel Creators",
  "Headshot Photographers",
  "Self Tape Support",
  "Talent Agents",
  "Talent Managers",
] as const;

// Category → Color Map (high-chroma, electric, modern)
const HOME_CATEGORY_COLORS: Record<string, string> = {
  "Acting Classes & Coaches": "#00E5FF",     // electric aqua
  "Audition Prep": "#FF8C1A",               // hot orange
  "Career Consultation": "#00D6A3",         // energized mint
  "Demo Reel Creators": "#FF4FD8",          // clean neon rose
  "Headshot Photographers": "#FFD400",      // studio gold
  "Self Tape Support": "#5B6CFF",            // electric blue
  "Talent Agents": "#9B5CFF",               // modern violet
  "Talent Managers": "#FF3B3B",             // assertive red
};

export default async function CategoryTiles() {
  // Fetch categories and listings
  let allCategories: Array<{ id: string; category_name: string }> = [];
  let categoryCounts: Record<string, number> = {};

  try {
    const [supabaseCategories, listings] = await Promise.all([
      getCategories(),
      getPublicListings(),
    ]);

    allCategories = supabaseCategories;

    // Count listings per category
    const counts: Record<string, number> = {};
    for (const listing of listings) {
      if (listing.categories) {
        for (const category of listing.categories) {
          if (typeof category === "string" && category.trim()) {
            const categoryName = category.trim();
            counts[categoryName] = (counts[categoryName] || 0) + 1;
          }
        }
      }
    }
    categoryCounts = counts;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

  // Filter to only the 8 homepage categories, in exact order
  const categories = HOME_CATEGORIES.map((categoryName) => {
    const found = allCategories.find(
      (c) => c.category_name === categoryName,
    );
    return found
      ? { id: found.id, category_name: found.category_name }
      : null;
  }).filter((c): c is { id: string; category_name: string } => c !== null);

  return (
    <section id="categories" className="bg-bg-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const count = categoryCounts[category.category_name] || 0;
            const slug = category.category_name
              .toLowerCase()
              .replace(/[^a-z0-9\s]/g, "")
              .replace(/\s+/g, "-");

            const color =
              HOME_CATEGORY_COLORS[category.category_name] || "#00E5FF";

            return (
              <Link
                key={category.id}
                href={`/category/${slug}`}
                className="category-tile"
                style={{ "--accent": color } as React.CSSProperties}
              >
                <div className="category-title">{category.category_name}</div>
                <div className="category-count">
                  {count}+ professionals
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
