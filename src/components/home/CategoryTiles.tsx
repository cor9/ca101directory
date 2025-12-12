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
    <section id="categories" className="bg-bg-dark pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categoryConfig.map((category) => {
            const count = categoryCounts[category.name] || 0;
            const Icon = category.icon;

            return (
              <Link
                key={category.name}
                href={`/category/${category.slug}`}
                className="
                  group
                  bg-bg-dark-3
                  border border-border-subtle
                  rounded-tile
                  p-6
                  shadow-card
                  hover:shadow-cardHover
                  hover:border-accent-teal/40
                  transition
                "
              >
                <div className="mb-4">
                  <Icon className="w-6 h-6 text-text-muted group-hover:text-accent-teal transition-colors" />
                </div>

                <h3 className="text-text-primary font-medium mb-2">
                  {category.name}
                </h3>

                <p className="text-text-muted text-sm">
                  {count} {count === 1 ? "professional" : "professionals"}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
