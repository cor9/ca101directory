import { getCategories } from "@/data/categories";
import { getPublicListings } from "@/data/listings";
import { cn } from "@/lib/utils";
import {
  Camera,
  Globe,
  GraduationCap,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";

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
  "Acting Schools": "bg-accent-aqua",
  "Actor Websites": "bg-accent-blue",
  "Audition Prep": "bg-accent-orange",
  "Background Casting": "bg-accent-purple",
  "Branding Coaches": "bg-accent-rose",
};

// Icon mapping
const categoryIcons: Record<string, typeof Users> = {
  "Acting Classes & Coaches": Users,
  "Acting Schools": GraduationCap,
  "Actor Websites": Globe,
  "Audition Prep": Star,
  "Background Casting": Camera,
  "Branding Coaches": Sparkles,
  "Headshot Photographers": Camera,
  "Talent Agents": Users,
  "Demo Reels": Camera,
  Studios: Camera,
  Resources: Globe,
};

export default async function CategoryTiles() {
  // Fetch categories and listings
  let categories: Array<{ id: string; category_name: string }> = [];
  let categoryCounts: Record<string, number> = {};

  try {
    const [supabaseCategories, listings] = await Promise.all([
      getCategories(),
      getPublicListings(),
    ]);

    categories = supabaseCategories.slice(0, 8); // Top 8 categories

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

  return (
    <section id="categories" className="bg-bg-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const count = categoryCounts[category.category_name] || 0;
            const categoryColor =
              CATEGORY_COLORS[category.category_name] || "bg-accent-aqua";
            const Icon = categoryIcons[category.category_name] || Users;
            const slug = category.category_name
              .toLowerCase()
              .replace(/[^a-z0-9\s]/g, "")
              .replace(/\s+/g, "-");

            return (
              <Link
                key={category.id}
                href={`/category/${slug}`}
                className={cn(
                  "group relative rounded-xl p-6 shadow-card transition hover:shadow-cardHover",
                  categoryColor,
                  "text-black", // Text on colored surface
                )}
              >
                <h3 className="text-lg font-semibold mb-2">
                  {category.category_name}
                </h3>
                <p className="opacity-80 text-sm">{count}+ professionals</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
