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

// Category configuration with color assignments
const categoryConfig = [
  {
    name: "Acting Classes & Coaches",
    slug: "acting-classes-coaches",
    icon: Users,
    accentColor: "accent-teal",
    hoverBg: "bg-accent-teal/10",
    iconColor: "text-accent-teal",
  },
  {
    name: "Acting Schools",
    slug: "acting-schools",
    icon: GraduationCap,
    accentColor: "accent-lemon",
    hoverBg: "bg-accent-lemon/10",
    iconColor: "text-accent-lemon",
  },
  {
    name: "Actor Websites",
    slug: "actor-websites",
    icon: Globe,
    accentColor: "accent-blue",
    hoverBg: "bg-accent-blue/10",
    iconColor: "text-accent-blue",
  },
  {
    name: "Audition Prep",
    slug: "audition-prep",
    icon: Star,
    accentColor: "accent-salmon",
    hoverBg: "bg-accent-salmon/10",
    iconColor: "text-accent-salmon",
  },
  {
    name: "Background Casting",
    slug: "background-casting",
    icon: Camera,
    accentColor: "accent-purple",
    hoverBg: "bg-accent-purple/10",
    iconColor: "text-accent-purple",
  },
  {
    name: "Branding Coaches",
    slug: "branding-coaches",
    icon: Sparkles,
    accentColor: "accent-cranberry",
    hoverBg: "bg-accent-cranberry/10",
    iconColor: "text-accent-cranberry",
  },
];

export default async function CategoryTiles() {
  // Fetch all listings to count per category
  let categoryCounts: Record<string, number> = {};

  try {
    const listings = await getPublicListings();

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
    console.error("Error fetching category counts:", error);
  }

  return (
    <section id="categories" className="max-w-6xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryConfig.map((category) => {
          const count = categoryCounts[category.name] || 0;
          const Icon = category.icon;

          return (
            <Link
              key={category.name}
              href={`/category/${category.slug}`}
              className="
                group relative rounded-card p-6
                bg-bg-dark-3
                border border-border-subtle
                shadow-card
                transition
                hover:-translate-y-1 hover:shadow-cardHover
              "
            >
              <div className={cn("absolute top-0 left-0 right-0 h-1 rounded-t-card", category.hoverBg)} />

              <div
                className={cn(
                  "absolute inset-0 rounded-card opacity-0 group-hover:opacity-100 transition",
                  category.hoverBg,
                )}
              />

              <div className="relative">
                <div className={cn("mb-4", category.iconColor)}>
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-semibold text-text-primary">
                  {category.name}
                </h3>

                <p className="mt-2 text-sm text-text-muted">
                  {count} {count === 1 ? "professional" : "professionals"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
