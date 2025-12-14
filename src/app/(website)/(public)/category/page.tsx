export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
import { siteConfig } from "@/config/site";
import { getCategories } from "@/data/categories";
import { getPublicListings } from "@/data/listings";
import { constructMetadata } from "@/lib/metadata";
import Link from "next/link";

export const metadata = constructMetadata({
  title: "Categories - Child Actor 101 Directory",
  description:
    "Browse acting professionals by category to find the perfect match for your child's needs",
  canonicalUrl: `${siteConfig.url}/category`,
});

// Featured Categories (homepage + top of category page) - ONLY these get color
// Locked list - must render all 8, regardless of count or existence in DB
const FEATURED_CATEGORIES = [
  "Acting Classes & Coaches",
  "Audition Prep",
  "Career Consultation",
  "Demo Reel Creators",
  "Headshot Photographers",
  "Self Tape Support",
  "Talent Agents",
  "Talent Managers",
] as const;

// Slug mapping for reliable matching
const FEATURED_CATEGORY_SLUGS = [
  "acting-classes-coaches",
  "audition-prep",
  "career-consultation",
  "demo-reel-creators",
  "headshot-photographers",
  "self-tape-support",
  "talent-agents",
  "talent-managers",
] as const;

// Category → Color Map (8-accent balanced set)
const FEATURED_CATEGORY_COLORS: Record<string, string> = {
  "Acting Classes & Coaches": "#2DD4BF", // teal - coaching/classes
  "Audition Prep": "#FB923C", // orange - audition prep
  "Career Consultation": "#84CC16", // lime green - career consultation
  "Demo Reel Creators": "#D946EF", // magenta - demo reels
  "Headshot Photographers": "#FACC15", // gold - headshots
  "Self Tape Support": "#06B6D4", // cyan - self tape support
  "Talent Agents": "#3B82F6", // blue - talent agents
  "Talent Managers": "#EF4444", // red - talent managers
};

// Normalize visual weight with opacity compensation (8-12% range for subtlety)
const CATEGORY_OPACITY: Record<string, number> = {
  "Acting Classes & Coaches": 10, // teal
  "Audition Prep": 10, // orange
  "Career Consultation": 10, // lime green
  "Demo Reel Creators": 10, // magenta
  "Headshot Photographers": 10, // gold
  "Self Tape Support": 10, // cyan
  "Talent Agents": 12, // blue (slightly more for authority)
  "Talent Managers": 10, // red
};

export default async function CategoryPage() {
  // Get real categories from Supabase
  let categories: Array<{
    name: string;
    slug: string;
    description: string;
    count: number;
  }> = [];

  try {
    const [supabaseCategories, listings] = await Promise.all([
      getCategories(),
      getPublicListings(),
    ]);

    console.log("CategoryPage Debug:", {
      supabaseCategoriesCount: supabaseCategories?.length || 0,
      listingsCount: listings?.length || 0,
      supabaseCategories: supabaseCategories,
      sampleListing: listings?.[0],
    });

    const normalize = (v: string) =>
      v.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    // Synonyms map to unify variant names under canonical category keys
    const synonyms: Record<string, string> = {
      // Headshots
      [normalize("Headshot Photographers")]: normalize(
        "Headshot Photographers",
      ),
      [normalize("Headshot Photographer")]: normalize("Headshot Photographers"),
      // Self Tape
      [normalize("Self Tape Support")]: normalize("Self Tape Support"),
      [normalize("Self-Tape Support")]: normalize("Self Tape Support"),
      // Demo Reel
      [normalize("Demo Reel Editors")]: normalize("Demo Reel Editors"),
      [normalize("Reel Editors")]: normalize("Demo Reel Editors"),
    };

    // Map category IDs to names for UUID-based listings
    const idToName: Record<string, string> = {};
    for (const c of supabaseCategories || []) {
      if (c?.id && c?.category_name) idToName[c.id] = c.category_name;
    }

    // Count listings per normalized canonical category (resolve UUIDs)
    const categoryCounts: Record<string, number> = {};
    const isUuidLike = (v: string) =>
      /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i.test(
        v.trim(),
      );
    for (const listing of listings) {
      const cats = listing.categories || [];
      for (const cat of cats) {
        if (!cat) continue;
        const resolvedName = isUuidLike(cat) ? idToName[cat] : cat;
        if (!resolvedName) continue;
        const keyNorm = normalize(resolvedName);
        const canonical = synonyms[keyNorm] || keyNorm;
        categoryCounts[canonical] = (categoryCounts[canonical] || 0) + 1;
      }
    }

    console.log("Category counts (normalized):", categoryCounts);

    // For accuracy, compute counts using the same filter as the category detail page
    const countsAccurate = await Promise.all(
      supabaseCategories.map(async (category) => {
        try {
          const result = await getPublicListings({
            category: category.category_name,
          });
          return { name: category.category_name, count: result.length };
        } catch {
          const key = normalize(category.category_name);
          return {
            name: category.category_name,
            count: categoryCounts[key] || 0,
          };
        }
      }),
    );
    const accurateByName: Record<string, number> = {};
    for (const { name, count } of countsAccurate) accurateByName[name] = count;

    categories = supabaseCategories.map((category) => ({
      name: category.category_name,
      slug: category.category_name
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, ""),
      description:
        category.description ||
        (() => {
          const customDescriptions: Record<string, string> = {
            "Acting Classes & Coaches": "Acting coaching services",
            "Comedy Coaches": "Comedy coaching services",
            "Vocal Coaches": "Vocal coaching services",
            "Hair/Makeup Artists": "Hair and makeup services",
            "Modeling/Print Agents":
              "Modeling and print representation services",
            "Talent Agents": "Talent representation services",
            "Influencer Agents": "Influencer representation services",
            "Talent Managers": "Talent management services",
          };
          return (
            customDescriptions[category.category_name] ||
            `${category.category_name} services`
          );
        })(),
      count:
        accurateByName[category.category_name] ??
        (() => {
          const key = normalize(category.category_name);
          return categoryCounts[key] || 0;
        })(),
    }));

    console.log("Final categories:", categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

  // Helper to generate slug from category name (matches the logic used in categories)
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  // Build featured categories - always render all 8, create placeholders if missing
  const sortedFeatured = FEATURED_CATEGORIES.map((name, index) => {
    const slug = FEATURED_CATEGORY_SLUGS[index];
    const found = categories.find(
      (cat) =>
        cat.name === name ||
        generateSlug(cat.name) === slug ||
        cat.slug === slug,
    );

    // If found, use it; otherwise create placeholder
    if (found) {
      return found;
    }

    // Placeholder - ensures all 8 always render
    return {
      name,
      slug,
      description: `${name} services`,
      count: 0,
    };
  });

  // All other categories (not in featured list)
  const otherCategories = categories.filter((cat) => {
    const catSlug = cat.slug || generateSlug(cat.name);
    return !FEATURED_CATEGORY_SLUGS.includes(catSlug as any);
  });

  return (
    <div className="bg-bg-dark min-h-screen">
      <section className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold mb-8 text-text-primary">
            Browse by Category
          </h1>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Find trusted acting professionals organized by specialty. Each
            category contains verified professionals ready to help your child
            succeed in the entertainment industry.
          </p>
        </div>

        {/* Featured Categories (8) - Colored, prominent */}
        {sortedFeatured.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-text-primary mb-6">
              Featured Categories
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {sortedFeatured.map((category) => {
                const color =
                  FEATURED_CATEGORY_COLORS[category.name] || "#2DD4BF";
                const opacity = CATEGORY_OPACITY[category.name] || 10;

                return (
                  <Link
                    key={category.slug}
                    href={`/category/${category.slug}`}
                    className="category-tile"
                    style={
                      {
                        "--accent": color,
                        "--accent-opacity": opacity,
                      } as React.CSSProperties
                    }
                  >
                    <div className="provider-count">{category.count}+</div>
                    <h3 className="category-title">{category.name}</h3>
                    {category.description && (
                      <p className="category-desc">{category.description}</p>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* All Other Categories - Neutral cards, no accent until hover */}
        {otherCategories.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-text-primary mb-6">
              All Other Categories
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {otherCategories.map((category) => {
                return (
                  <Link
                    key={category.slug}
                    href={`/category/${category.slug}`}
                    className="category-neutral-tile"
                  >
                    <div className="provider-count-neutral">
                      {category.count}+
                    </div>
                    <h3 className="category-title">{category.name}</h3>
                    {category.description && (
                      <p className="category-desc">{category.description}</p>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-card-surface border border-border-subtle rounded-xl text-center p-8">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            Don't See Your Category?
          </h2>
          <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
            We're constantly adding new categories and professionals. If you
            don't see what you're looking for, try our search feature or submit
            a listing request.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/search"
              className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium bg-transparent border border-border-subtle text-text-secondary hover:text-text-primary transition-colors"
            >
              Search All Professionals
            </Link>
            <Link
              href="/submit"
              className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium bg-transparent border border-border-subtle text-text-secondary hover:text-text-primary transition-colors"
            >
              Submit Your Listing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
