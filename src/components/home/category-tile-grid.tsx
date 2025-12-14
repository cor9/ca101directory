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
  tint: string;
}

// Category → Color Tint Map (Toned, Adult, Premium - Patreon-style)
const CATEGORY_TINTS: Record<string, string> = {
  "Acting Classes & Coaches": "before:bg-accent-aqua",
  "Acting Classes": "before:bg-accent-aqua",
  "Acting Coaches": "before:bg-accent-aqua",
  "Acting Schools": "before:bg-accent-blue",
  "Actor Websites": "before:bg-accent-purple",
  "Audition Prep": "before:bg-accent-orange",
  "Background Casting": "before:bg-accent-gold",
  "Branding Coaches": "before:bg-accent-rose",
  Photographers: "before:bg-accent-gold",
  "Headshot Photographers": "before:bg-accent-gold",
  Headshots: "before:bg-accent-purple",
  "Talent Agents": "before:bg-accent-blue",
  Agents: "before:bg-accent-blue",
  "Demo Reels": "before:bg-accent-rose",
  "Demo Reel Editors": "before:bg-accent-rose",
  Coaches: "before:bg-accent-aqua",
  Studios: "before:bg-accent-orange",
  Resources: "before:bg-accent-red",
  "Business of Acting": "before:bg-accent-blue",
  "Career Consulting": "before:bg-accent-aqua",
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
      tint: CATEGORY_TINTS[category.category_name] || "before:bg-accent-aqua",
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
                "category-tile group relative rounded-xl p-5",
                "bg-bg-dark-2 border border-white/10",
                "shadow-[0_10px_30px_rgba(0,0,0,0.45)]",
                "hover:shadow-[0_16px_40px_rgba(0,0,0,0.55)]",
                "hover:border-white/20 transition-all",
                category.tint,
              )}
            >
              {/* Content - z-10 to sit above the ::before glow */}
              <div className="relative z-10">
                <h3 className="text-white font-semibold text-lg mb-2">
                  {category.name}
                </h3>
                {category.count > 0 && (
                  <p className="text-white/80 text-sm">
                    {category.count}+ professionals
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
