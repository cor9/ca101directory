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

            const categoryTint =
              CATEGORY_TINTS[category.category_name] || "before:bg-accent-aqua";

            return (
              <Link
                key={category.id}
                href={`/category/${slug}`}
                className={cn(
                  "category-tile group relative rounded-xl p-5",
                  "bg-bg-dark-2 border border-white/10",
                  "hover:border-white/20 transition",
                  categoryTint,
                )}
              >
                {/* Color glow */}
                <div
                  className="absolute inset-0 rounded-xl opacity-20 blur-xl pointer-events-none"
                  aria-hidden
                />

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-white font-semibold text-lg mb-2">
                    {category.category_name}
                  </h3>
                  <p className="text-text-muted text-sm">
                    {count}+ professionals
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
