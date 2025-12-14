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

// Category → Color Map (electric, but grown-up - Patreon-adjacent)
const HOME_CATEGORY_COLORS: Record<string, string> = {
  "Acting Classes & Coaches": "#2DD4BF", // teal - trust + learning
  "Audition Prep": "#FB923C", // orange - energy + action
  "Career Consultation": "#3B82F6", // blue - authority, guidance
  "Demo Reel Creators": "#D946EF", // magenta - creative output
  "Headshot Photographers": "#FACC15", // gold - premium visual craft
  "Self Tape Support": "#84CC16", // lime green - technical + problem solving
  "Talent Agents": "#6366F1", // indigo - power + access
  "Talent Managers": "#EF4444", // crimson - strategy + leverage
};

// Normalize visual weight with opacity compensation per color type
const CATEGORY_OPACITY: Record<string, number> = {
  "Acting Classes & Coaches": 16, // teal
  "Audition Prep": 14, // orange
  "Career Consultation": 18, // blue
  "Demo Reel Creators": 15, // magenta
  "Headshot Photographers": 13, // gold
  "Self Tape Support": 16, // lime green
  "Talent Agents": 18, // indigo
  "Talent Managers": 14, // crimson
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

  // Render all 8 homepage categories, in exact order (even if not in DB)
  const categories = HOME_CATEGORIES.map((categoryName) => {
    const found = allCategories.find((c) => c.category_name === categoryName);
    // Always render all 8, even if category doesn't exist in DB yet
    return {
      id: found?.id || `placeholder-${categoryName}`,
      category_name: categoryName,
    };
  });

  return (
    <section id="categories" className="bg-bg-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const count = categoryCounts[category.category_name] || 0;
            const slug = category.category_name
              .toLowerCase()
              .replace(/[^a-z0-9\s]/g, "")
              .replace(/\s+/g, "-");

            const color =
              HOME_CATEGORY_COLORS[category.category_name] || "#2DD4BF";
            const opacity =
              CATEGORY_OPACITY[category.category_name] || 18;

            return (
              <Link
                key={category.id}
                href={`/category/${slug}`}
                className="category-tile"
                style={
                  {
                    "--accent": color,
                    "--accent-opacity": opacity,
                  } as React.CSSProperties
                }
              >
                <div className="category-title">{category.category_name}</div>
                <div className="category-count">{count}+ professionals</div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
