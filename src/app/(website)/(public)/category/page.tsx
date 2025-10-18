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

    // Count listings per category
    const categoryCounts: Record<string, number> = {};
    for (const listing of listings) {
      if (listing.categories) {
        // categories is now an array, no need to split
        for (const category of listing.categories) {
          const trimmedCategory = category.trim();
          categoryCounts[trimmedCategory] =
            (categoryCounts[trimmedCategory] || 0) + 1;
        }
      }
    }

    console.log("Category counts:", categoryCounts);

    const normalize = (v: string) =>
      v.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
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

    categories = supabaseCategories.map((category) => ({
      name: category.category_name,
      slug: category.category_name
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "") // Remove special characters first
        .replace(/\s+/g, "-") // Then replace spaces with dashes
        .replace(/-+/g, "-") // Replace multiple dashes with single dash
        .replace(/^-|-$/g, ""), // Remove leading/trailing dashes
      icon: categoryIconMap[category.category_name] || "star",
      description:
        category.description ||
        `Professional ${category.category_name.toLowerCase()} services`,
      count: categoryCounts[category.category_name] || 0,
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
    <div className="container mx-auto px-4 py-8 text-surface">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="bauhaus-heading text-4xl mb-4">Browse by Category</h1>
        <p className="bauhaus-body text-xl opacity-80 max-w-3xl mx-auto">
          Find trusted acting professionals organized by specialty. Each
          category contains verified professionals ready to help your child
          succeed in the entertainment industry.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="bauhaus-grid bauhaus-grid-3 xl:grid-cols-4 gap-6 mb-12">
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
            <Link key={category.slug} href={`/category/${category.slug}`}>
              <div className="bauhaus-card h-full hover:shadow-xl transition-all duration-300">
                <div className="text-center p-6">
                  <div className="flex justify-center mb-4">
                    <div
                      className={`relative h-20 w-20 ${colors.bg} rounded-lg shadow-bauhaus overflow-hidden`}
                    >
                      {category.iconPngUrl ? (
                        <Image
                          src={category.iconPngUrl}
                          alt={category.name}
                          fill
                          className="object-contain"
                        />
                      ) : (
                        <div
                          className={`absolute inset-0 ${colors.text} flex items-center justify-center font-bold text-2xl`}
                        >
                          {category.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 className="bauhaus-heading text-xl mb-3">
                    {category.name}
                  </h3>
                  <div
                    className={`bauhaus-chip ${colors.bg} ${colors.text} mb-4`}
                  >
                    {category.count} PROFESSIONAL
                    {category.count !== 1 ? "S" : ""}
                  </div>
                  <p className="bauhaus-body text-sm opacity-80">
                    {category.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="bauhaus-card text-center p-8">
        <h2 className="bauhaus-heading text-2xl text-surface mb-4">
          Don't See Your Category?
        </h2>
        <p className="bauhaus-body text-surface mb-6 max-w-2xl mx-auto">
          We're constantly adding new categories and professionals. If you don't
          see what you're looking for, try our search feature or submit a
          listing request.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/search" className="bauhaus-btn-primary">
            SEARCH ALL PROFESSIONALS
          </Link>
          <Link href="/submit" className="bauhaus-btn-secondary">
            SUBMIT YOUR LISTING
          </Link>
        </div>
      </div>
    </div>
  );
}
