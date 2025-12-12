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
    <section id="categories" className="bg-bg-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* STEP 2: Category grid - proper density */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {categoryConfig.map((category) => {
            const count = categoryCounts[category.name] || 0;
            const Icon = category.icon;

            return (
              <Link
                key={category.name}
                href={`/category/${category.slug}`}
                className="
                  group
                  relative
                  bg-card-surface
                  border
                  border-border-subtle
                  rounded-xl
                  p-5
                  shadow-card
                  transition
                  hover:shadow-cardHover
                  hover:border-accent-blue/40
                "
              >
                {/* STEP 4: Category icon - visual anchor */}
                <div className="
                  w-10 h-10
                  rounded-lg
                  bg-bg-dark-3
                  flex items-center justify-center
                  text-accent-blue
                  mb-4
                ">
                  <Icon className="w-5 h-5" />
                </div>

                {/* STEP 5: Category name - headline, not metadata */}
                <h3 className="
                  text-lg
                  font-semibold
                  text-text-primary
                  group-hover:text-accent-blue
                  transition
                  mb-1
                ">
                  {category.name}
                </h3>

                {/* STEP 7: Count/signal - confidence cue */}
                <span className="
                  absolute
                  top-4
                  right-4
                  text-xs
                  font-medium
                  text-text-muted
                ">
                  {count}+ providers
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
