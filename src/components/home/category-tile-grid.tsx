import { Icons } from "@/components/icons/icons";
import { getCategories } from "@/data/categories";
import { getPublicListings } from "@/data/listings";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface CategoryTile {
  name: string;
  slug: string;
  icon: keyof typeof Icons;
  count: number;
  color: string;
}

// Category → Color Map (NON-NEGOTIABLE - Patreon-style)
const CATEGORY_COLORS: Record<string, string> = {
  "Acting Classes": "bg-accent-aqua",
  Photographers: "bg-accent-gold",
  "Talent Agents": "bg-accent-blue",
  Headshots: "bg-accent-purple",
  "Demo Reels": "bg-accent-rose",
  Coaches: "bg-accent-aqua",
  Studios: "bg-accent-orange",
  Resources: "bg-accent-red",
  // Aliases for variations
  "Acting Classes & Coaches": "bg-accent-aqua",
  "Acting Coaches": "bg-accent-aqua",
  "Headshot Photographers": "bg-accent-gold",
  "Demo Reel Editors": "bg-accent-rose",
  Agents: "bg-accent-blue",
};

export default async function CategoryTileGrid() {
  let categories: CategoryTile[] = [];

  try {
    const [supabaseCategories, listings] = await Promise.all([
      getCategories(),
      getPublicListings(),
    ]);

    // Count listings per category
    const categoryCounts: Record<string, number> = {};
    for (const listing of listings) {
      if (listing.categories) {
        for (const category of listing.categories) {
          // Only process string categories, skip UUIDs and other types
          if (typeof category === "string" && category.trim()) {
            const trimmedCategory = category.trim();
            categoryCounts[trimmedCategory] =
              (categoryCounts[trimmedCategory] || 0) + 1;
          }
        }
      }
    }

    // Icon mapping
    const iconMap: Record<string, keyof typeof Icons> = {
      "Acting Classes & Coaches": "theater",
      "Headshot Photographers": "camera",
      "Demo Reel Editors": "video",
      "Talent Agents": "users",
      "Casting Directors": "star",
      "Voice Coaches": "mic",
    };

    categories = supabaseCategories.slice(0, 6).map((category) => ({
      name: category.category_name,
      slug: category.category_name
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, ""),
      icon: iconMap[category.category_name] || "star",
      count: categoryCounts[category.category_name] || 0,
      color: CATEGORY_COLORS[category.category_name] || "bg-accent-aqua",
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

  return (
    <section className="py-8">
      <h2 className="text-2xl font-semibold text-text-primary mb-6">
        Browse by Category
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => {
          const Icon = Icons[category.icon];
          return (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className={cn(
                "group relative rounded-xl p-6 shadow-card transition hover:shadow-cardHover",
                category.color,
                "text-black", // Text on colored surface
              )}
            >
              <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
              {category.count > 0 && (
                <p className="opacity-80 text-sm">
                  {category.count}+ professionals
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
