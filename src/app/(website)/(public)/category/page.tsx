export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
import { Icons } from "@/components/icons/icons";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { getCategories, getCategoryIconsMap } from "@/data/categories";
import { getPublicListings } from "@/data/listings";
import { getCategoryIconUrl } from "@/lib/image-urls";
import { constructMetadata } from "@/lib/metadata";
import Image from "next/image";
import Link from "next/link";

export const metadata = constructMetadata({
  title: "Categories - Child Actor 101 Directory",
  description:
    "Browse acting professionals by category to find the perfect match for your child's needs",
  canonicalUrl: `${siteConfig.url}/category`,
});

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
  "Mental Health for Performers": "shieldCheck",
  "Branding Coaches": "star",
  "Talent Managers": "users",
  "Reels Editors": "video",
  "Voiceover Studios": "mic",
  "Wardrobe Stylists": "sparkles",
};

export default async function CategoryPage() {
  // Get real categories from Airtable
  let categories: Array<{
    name: string;
    slug: string;
    description: string;
    icon?: keyof typeof Icons;
    iconPngUrl?: string | null;
    count: number;
  }> = [];

  try {
    const [supabaseCategories, listings, iconMap] = await Promise.all([
      getCategories(),
      getPublicListings(),
      getCategoryIconsMap(),
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
    const pngByName: Record<string, string | undefined> = {};
    const pngById: Record<string, string | undefined> = {};
    const uuidLike = (v: string) =>
      /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i.test(
        v.trim(),
      );
    for (const [key, value] of Object.entries(iconMap || {})) {
      if (!value) continue;
      if (uuidLike(key)) {
        pngById[key] = value;
      } else {
        pngByName[normalize(key)] = value;
      }
    }

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
      icon: categoryIconMap[category.category_name] || "star",
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
      iconPngUrl: (() => {
        const byId = pngById[category.id];
        if (byId) return getCategoryIconUrl(byId);
        const key = normalize(category.category_name);
        const byName = pngByName[key];
        return byName ? getCategoryIconUrl(byName) : null;
      })(),
    }));

    console.log("Final categories:", categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

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

      {/* STEP 2: Categories Grid - proper density */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
        {categories.map((category, index) => {
          const IconComponent = category.icon
            ? Icons[category.icon]
            : Icons.star;
          // Use consistent Bauhaus colors instead of rainbow
          const bauhausColors = [
            {
              bg: "bg-bauhaus-mustard",
              text: "text-bauhaus-charcoal",
              border:
                "border-bauhaus-mustard/20 hover:border-bauhaus-mustard/40",
            },
            {
              bg: "bg-bauhaus-orange",
              text: "text-white",
              border: "border-bauhaus-orange/20 hover:border-bauhaus-orange/40",
            },
            {
              bg: "bg-bauhaus-blue",
              text: "text-white",
              border: "border-bauhaus-blue/20 hover:border-bauhaus-blue/40",
            },
          ];
          const colors = bauhausColors[index % bauhausColors.length];

          return (
            <Link
              key={category.slug}
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
                {category.iconPngUrl ? (
                  <Image
                    src={category.iconPngUrl}
                    alt={category.name}
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                ) : (
                  <IconComponent className="w-5 h-5" />
                )}
              </div>

              {/* STEP 5: Category name - headline */}
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

              {/* STEP 6: Category description - optional, short */}
              {category.description && (
                <p className="
                  mt-1
                  text-sm
                  text-text-muted
                  line-clamp-2
                ">
                  {category.description}
                </p>
              )}

              {/* STEP 7: Count/signal - confidence cue */}
              <span className="
                absolute
                top-4
                right-4
                text-xs
                font-medium
                text-text-muted
              ">
                {category.count}+ providers
              </span>
            </Link>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="bg-card-surface border border-border-subtle rounded-xl text-center p-8">
        <h2 className="text-2xl font-semibold mb-4 text-text-primary">
          Don't See Your Category?
        </h2>
        <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
          We're constantly adding new categories and professionals. If you don't
          see what you're looking for, try our search feature or submit a
          listing request.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/search"
            className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium bg-accent-teal text-bg-dark hover:opacity-90 transition-colors"
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
