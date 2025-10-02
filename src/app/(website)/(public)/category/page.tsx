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
    icon: keyof typeof Icons;
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

    // Count listings per category
    const categoryCounts: Record<string, number> = {};
    for (const listing of listings) {
      if (listing.categories) {
        const categoryList = listing.categories.split(",");
        for (const category of categoryList) {
          const trimmedCategory = category.trim();
          categoryCounts[trimmedCategory] =
            (categoryCounts[trimmedCategory] || 0) + 1;
        }
      }
    }

    console.log("Category counts:", categoryCounts);

    categories = supabaseCategories.map((category) => ({
      name: category.category_name,
      slug: category.category_name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
      icon: categoryIconMap[category.category_name] || "star",
      description:
        category.description ||
        `Professional ${category.category_name.toLowerCase()} services`,
      count: categoryCounts[category.category_name] || 0,
    }));

    console.log("Final categories:", categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Browse by Category
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Find trusted acting professionals organized by specialty. Each
          category contains verified professionals ready to help your child
          succeed in the entertainment industry.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {categories.map((category, index) => {
          const IconComponent = Icons[category.icon];
          // Create a color palette for variety
          const colorVariants = [
            { bg: "bg-gradient-to-br from-brand-blue to-blue-600", text: "text-brand-blue", border: "border-brand-blue/20 hover:border-brand-blue/40" },
            { bg: "bg-gradient-to-br from-brand-orange to-orange-600", text: "text-brand-orange", border: "border-brand-orange/20 hover:border-brand-orange/40" },
            { bg: "bg-gradient-to-br from-brand-yellow to-yellow-600", text: "text-brand-yellow", border: "border-brand-yellow/20 hover:border-brand-yellow/40" },
            { bg: "bg-gradient-to-br from-purple-500 to-purple-700", text: "text-purple-600", border: "border-purple-500/20 hover:border-purple-500/40" },
            { bg: "bg-gradient-to-br from-green-500 to-green-700", text: "text-green-600", border: "border-green-500/20 hover:border-green-500/40" },
            { bg: "bg-gradient-to-br from-pink-500 to-pink-700", text: "text-pink-600", border: "border-pink-500/20 hover:border-pink-500/40" },
            { bg: "bg-gradient-to-br from-indigo-500 to-indigo-700", text: "text-indigo-600", border: "border-indigo-500/20 hover:border-indigo-500/40" },
            { bg: "bg-gradient-to-br from-teal-500 to-teal-700", text: "text-teal-600", border: "border-teal-500/20 hover:border-teal-500/40" },
          ];
          const colors = colorVariants[index % colorVariants.length];
          
          return (
            <Link key={category.slug} href={`/category/${category.slug}`}>
              <Card className={`h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${colors.border}`}>
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-2">
                    <div className={`p-3 ${colors.bg} rounded-xl shadow-lg`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <CardTitle className={`text-lg ${colors.text} font-bold`}>
                    {category.name}
                  </CardTitle>
                  <Badge className={`w-fit mx-auto ${colors.bg} text-white hover:opacity-90`}>
                    {category.count} professional
                    {category.count !== 1 ? "s" : ""}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-muted-foreground">
                    {category.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="text-center bg-gradient-to-r from-brand-orange/5 via-brand-yellow/5 to-brand-blue/5 rounded-2xl p-8 border border-brand-blue/20">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Don't See Your Category?
        </h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          We're constantly adding new categories and professionals. If you don't
          see what you're looking for, try our search feature or submit a
          listing request.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/search"
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-brand-blue text-brand-blue font-semibold rounded-lg hover:bg-brand-blue hover:text-white transition-colors"
          >
            Search All Professionals
          </Link>
          <Link
            href="/submit"
            className="inline-flex items-center justify-center px-6 py-3 bg-brand-orange text-white font-semibold rounded-lg hover:bg-brand-orange-dark transition-colors"
          >
            Submit Your Listing
          </Link>
        </div>
      </div>
    </div>
  );
}
