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
            const Icon = categoryIcons[category.category_name] || Users;
            const slug = category.category_name
              .toLowerCase()
              .replace(/[^a-z0-9\s]/g, "")
              .replace(/\s+/g, "-");

            const borderGradient =
              CATEGORY_BORDERS[category.category_name] ||
              "bg-gradient-to-br from-accent-aqua to-[#00B8CC]";

            return (
              <Link
                key={category.id}
                href={`/category/${slug}`}
                className={cn(
                  "relative rounded-2xl p-[3px]",
                  borderGradient,
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
                    {category.category_name}
                  </h3>
                  <p className="text-white/80 text-sm">
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
