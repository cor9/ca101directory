import { Icons } from "@/components/icons/icons";
import { getCategories } from "@/data/categories";
import { getPublicListings } from "@/data/listings";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Category {
  name: string;
  slug: string;
  icon: keyof typeof Icons;
  description: string;
  count?: number;
}

// Fallback categories if no Airtable data
const fallbackCategories: Category[] = [
  {
    name: "Acting Classes & Coaches",
    slug: "acting-classes-coaches",
    icon: "theater",
    description: "Professional acting instruction and coaching",
    count: 12,
  },
  {
    name: "Headshot Photographers",
    slug: "headshot-photographers",
    icon: "camera",
    description: "Professional headshot and portfolio photography",
    count: 8,
  },
  {
    name: "Demo Reel Editors",
    slug: "demo-reel-editors",
    icon: "video",
    description: "Video editing and demo reel production",
    count: 6,
  },
  {
    name: "Talent Agents",
    slug: "talent-agents",
    icon: "users",
    description: "Licensed talent representation",
    count: 15,
  },
  {
    name: "Casting Directors",
    slug: "casting-directors",
    icon: "star",
    description: "Professional casting services",
    count: 9,
  },
  {
    name: "Voice Coaches",
    slug: "voice-coaches",
    icon: "mic",
    description: "Voice training and accent coaching",
    count: 7,
  },
];

// Icon mapping for categories
const categoryIconMap: Record<string, keyof typeof Icons> = {
  "Acting Classes & Coaches": "theater",
  "Headshot Photographers": "camera",
  "Demo Reel Editors": "video",
  "Talent Agents": "users",
  "Casting Directors": "star",
  "Voice Coaches": "mic",
  "Acting Coaches": "theater",
  Photographers: "camera",
  Editors: "video",
  Agents: "users",
  Directors: "star",
  Coaches: "mic",
};

// Helper function to get category-specific accent color
const getCategoryAccentColor = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes("coach") || name.includes("acting")) return "retro-blue";
  if (name.includes("photo") || name.includes("headshot"))
    return "mustard-gold";
  if (name.includes("edit") || name.includes("reel") || name.includes("video"))
    return "muted-teal";
  if (
    name.includes("studio") ||
    name.includes("space") ||
    name.includes("venue")
  )
    return "tomato-red";
  return "retro-blue"; // default
};

export default async function HomeCategoryGrid() {
  // Get real categories from Supabase
  let categories: Category[] = [];

  try {
    const [supabaseCategories, listings] = await Promise.all([
      getCategories(),
      getPublicListings(),
    ]);

    // Count listings per category
    const categoryCounts: Record<string, number> = {};
    for (const listing of listings) {
      if (listing.categories) {
        const categoryList = listing.categories;
        for (const category of categoryList) {
          const trimmedCategory = category.trim();
          categoryCounts[trimmedCategory] =
            (categoryCounts[trimmedCategory] || 0) + 1;
        }
      }
    }

    categories = supabaseCategories
      .slice(0, 6) // Limit to 6 categories
      .map((category) => ({
        name: category.category_name,
        slug: category.category_name
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, "") // Remove special characters first
          .replace(/\s+/g, "-") // Then replace spaces with dashes
          .replace(/-+/g, "-") // Replace multiple dashes with single dash
          .replace(/^-|-$/g, ""), // Remove leading/trailing dashes
        icon: categoryIconMap[category.category_name] || "star",
        description: `Professional ${category.category_name.toLowerCase()} services`,
        count: categoryCounts[category.category_name] || 0,
      }));
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

  // Use fallback if no Supabase categories
  if (categories.length === 0) {
    categories = fallbackCategories;
  }
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
        <p className="text-lg text-surface max-w-2xl mx-auto">
          Find the perfect professional for your child's acting journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {categories.map((category) => {
          const IconComponent = Icons[category.icon];
          const accentColor = getCategoryAccentColor(category.name);
          return (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group"
            >
              <div className="bg-cream border border-cream rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-retro-blue hover:bg-cream/90">
                <div className="flex items-center mb-4">
                  <div
                    className={`p-3 bg-${accentColor} rounded-lg group-hover:bg-${accentColor}/90 transition-colors`}
                  >
                    <IconComponent className="h-6 w-6 text-cream" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3
                      className={`font-semibold text-lg text-charcoal group-hover:text-${accentColor} transition-colors`}
                    >
                      {category.name}
                    </h3>
                    {category.count && (
                      <p className="text-sm text-charcoal/60">
                        {category.count} professionals
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-charcoal/70 text-sm">
                  {category.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="text-center mt-12">
        <Link
          href="/category"
          className="inline-flex items-center px-6 py-3 bg-brand-blue text-white rounded-lg hover:bg-brand-blue-dark transition-colors font-semibold"
        >
          View All Categories
          <Icons.arrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
