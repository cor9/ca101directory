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
  borderGradient: string;
}

// Category → Border Gradient Map (Thick accent border with dark core)
const CATEGORY_BORDERS: Record<string, string> = {
  "Acting Classes & Coaches": "bg-gradient-to-br from-accent-aqua to-[#00B8CC]",
  "Acting Classes": "bg-gradient-to-br from-accent-aqua to-[#00B8CC]",
  "Acting Coaches": "bg-gradient-to-br from-accent-aqua to-[#00B8CC]",
  "Acting Schools": "bg-gradient-to-br from-accent-blue to-[#4D4DFF]",
  "Actor Websites": "bg-gradient-to-br from-accent-purple to-[#8B2FE6]",
  "Audition Prep": "bg-gradient-to-br from-accent-orange to-[#E67700]",
  "Background Casting": "bg-gradient-to-br from-accent-gold to-[#E6C200]",
  "Branding Coaches": "bg-gradient-to-br from-accent-rose to-[#E600B8]",
  Photographers: "bg-gradient-to-br from-accent-gold to-[#E6C200]",
  "Headshot Photographers": "bg-gradient-to-br from-accent-gold to-[#E6C200]",
  Headshots: "bg-gradient-to-br from-accent-purple to-[#8B2FE6]",
  "Talent Agents": "bg-gradient-to-br from-accent-blue to-[#4D4DFF]",
  Agents: "bg-gradient-to-br from-accent-blue to-[#4D4DFF]",
  "Demo Reels": "bg-gradient-to-br from-accent-rose to-[#E600B8]",
  "Demo Reel Editors": "bg-gradient-to-br from-accent-rose to-[#E600B8]",
  Coaches: "bg-gradient-to-br from-accent-aqua to-[#00B8CC]",
  Studios: "bg-gradient-to-br from-accent-orange to-[#E67700]",
  Resources: "bg-gradient-to-br from-accent-red to-[#E60000]",
  "Business of Acting": "bg-gradient-to-br from-accent-blue to-[#4D4DFF]",
  "Career Consulting": "bg-gradient-to-br from-accent-aqua to-[#00B8CC]",
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
      borderGradient:
        CATEGORY_BORDERS[category.category_name] ||
        "bg-gradient-to-br from-accent-aqua to-[#00B8CC]",
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
                "relative rounded-2xl p-[3px]",
                category.borderGradient,
              )}
            >
              <div
                className={cn(
                  "rounded-[14px] bg-[#0E1117] p-6",
                  "shadow-[0_6px_18px_rgba(0,0,0,0.45)]",
                  "transition-transform hover:-translate-y-1",
                )}
              >
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
