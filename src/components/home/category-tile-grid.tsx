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

const categoryColors = [
  "bg-accent-teal",
  "bg-highlight",
  "bg-secondary-denim",
  "bg-primary-orange",
  "bg-info",
  "bg-success",
];

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
          const trimmedCategory = category.trim();
          categoryCounts[trimmedCategory] =
            (categoryCounts[trimmedCategory] || 0) + 1;
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

    categories = supabaseCategories.slice(0, 6).map((category, index) => ({
      name: category.category_name,
      slug: category.category_name
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, ""),
      icon: iconMap[category.category_name] || "star",
      count: categoryCounts[category.category_name] || 0,
      color: categoryColors[index % categoryColors.length],
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
                "group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                category.color,
                "hover:shadow-lg",
              )}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg text-white">
                  {category.name}
                </h3>
                {category.count > 0 && (
                  <p className="text-sm text-white/80">
                    {category.count}{" "}
                    {category.count === 1 ? "professional" : "professionals"}
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
