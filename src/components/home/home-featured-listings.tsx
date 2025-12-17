import { getCategories } from "@/data/categories";
import { getFeaturedListings } from "@/data/listings";
import { getListingImageUrl } from "@/lib/image-urls";
import { generateSlug } from "@/lib/slug-utils";
import FeaturedListingsClient from "./featured-listings-client";

interface FeaturedListing {
  id: string;
  name: string;
  description: string;
  image: string;
  website: string;
  category: string;
  categorySlug: string;
  tags: string[];
  featured?: boolean;
  isFallback?: boolean;
  slug: string;
}

// Fallback featured listings if no Airtable data
const fallbackListings: FeaturedListing[] = [
  {
    id: "1",
    name: "Young Actors Studio",
    description:
      "Professional acting classes for children and teens. Specializing in on-camera technique and audition preparation.",
    image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&fit=crop",
    website: "https://youngactorsstudio.com",
    category: "Acting Classes & Coaches",
    categorySlug: "acting-classes-coaches",
    tags: ["On-Camera", "Audition Prep", "Teens"],
    featured: true,
    isFallback: true,
    slug: "young-actors-studio",
  },
  {
    id: "2",
    name: "Spotlight Headshots",
    description:
      "Award-winning headshot photographer specializing in child and teen actors. Creating compelling portfolio images.",
    image:
      "https://images.unsplash.com/photo-1529634310410-0c3c5188c374?w=400&h=300&fit=crop",
    website: "https://spotlightheadshots.com",
    category: "Headshot Photographers",
    categorySlug: "headshot-photographers",
    tags: ["Portfolio", "Professional", "Child-Friendly"],
    isFallback: true,
    slug: "spotlight-headshots",
  },
  {
    id: "3",
    name: "Coaching with Corey",
    description:
      "Comprehensive acting coaching including private sessions, self-tape services, and career consultations.",
    image: "/coachingwithcorey.png",
    website: "https://coaching.childactor101.com",
    category: "Acting Classes & Coaches",
    categorySlug: "acting-classes-coaches",
    tags: ["Private Coaching", "Self-Tape", "Career Guidance"],
    featured: true,
    isFallback: true,
    slug: "coaching-with-corey",
  },
];

export default async function HomeFeaturedListings() {
  // Get real listings from Supabase
  let listings: FeaturedListing[] = [];

  // Helper function to check if a value looks like a UUID
  const isUuidLike = (value: unknown): boolean => {
    if (typeof value !== "string") return false;
    return /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i.test(
      value.trim(),
    );
  };

  // Helper function to generate category slug
  const generateCategorySlug = (categoryName: string): string => {
    return categoryName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "") // Remove special characters first
      .replace(/\s+/g, "-") // Then replace spaces with dashes
      .replace(/-+/g, "-") // Replace multiple dashes with single dash
      .replace(/^-|-$/g, ""); // Remove leading/trailing dashes
  };

  try {
    const [supabaseListings, categories] = await Promise.all([
      getFeaturedListings(),
      getCategories(),
    ]);
    // Debug: log count of public listings and featured subset
    console.log(
      "[HomeFeatured] featured fetch count:",
      supabaseListings.length,
    );

    // Create a map of category IDs to names for UUID resolution
    const categoryMap = new Map<string, string>();
    for (const category of categories) {
      categoryMap.set(category.id, category.category_name);
    }

    // Weight plans for featured ordering
    const planWeight = (plan?: string | null) => {
      const p = (plan || "").toLowerCase();
      if (p.includes("premium")) return 4;
      if (p.includes("pro")) return 3;
      if (p.includes("standard")) return 2;
      return 1;
    };

    // Include explicitly featured OR PRO/comped listings
    const isPro = (l: typeof supabaseListings[0]) => {
      if (l.comped) return true;
      const p = (l.plan || "").toLowerCase();
      return p.includes("pro") || p.includes("premium");
    };
    const featuredSource = supabaseListings.filter(
      (l) => l.featured === true || isPro(l)
    );
    console.log(
      "[HomeFeatured] featured candidates:",
      featuredSource.map((l) => `${l.listing_name} (${l.id})`),
    );

    listings = featuredSource
      // Sort: explicit featured first, then by plan weight, then name
      .sort((a, b) => {
        // Explicit featured always first
        const fa = a.featured === true ? 1 : 0;
        const fb = b.featured === true ? 1 : 0;
        if (fb !== fa) return fb - fa;
        const pa = (a.priority ?? 0) as number;
        const pb = (b.priority ?? 0) as number;
        if (pb !== pa) return pb - pa;
        const wa = planWeight(a.plan);
        const wb = planWeight(b.plan);
        if (wb !== wa) return wb - wa;
        return (a.listing_name || "").localeCompare(b.listing_name || "");
      })
      .slice(0, 12) // Show up to 12 items to reduce accidental trimming
      .map((listing) => {
        // Normalize categories to string[] first
        const normalizedCategories = (listing.categories || []).filter(
          (cat): cat is string => typeof cat === "string",
        );

        // Resolve category UUIDs to names
        const resolvedCategories = normalizedCategories
          .map((cat) => {
            if (isUuidLike(cat)) {
              return categoryMap.get(cat) || cat;
            }
            return cat;
          })
          .filter((cat) => !isUuidLike(cat)); // Filter out any remaining UUIDs

        const primaryCategory = resolvedCategories[0] || "Acting Professional";
        // Sanitize slug: trim whitespace and strip any leading slashes
        const rawSlug =
          listing.slug || generateSlug(listing.listing_name || "", listing.id);
        const safeSlug = typeof rawSlug === "string" ? rawSlug.trim().replace(/^\/+/, "") : "";

        return {
          id: listing.id,
          name: listing.listing_name || "Untitled Listing",
          description: (
            listing.what_you_offer || "Professional acting services"
          )
            .replace(/<[^>]*>/g, " ")
            .replace(/\s+/g, " ")
            .trim(),
          image: listing.profile_image
            ? getListingImageUrl(listing.profile_image)
            : "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&fit=crop",
          website: listing.website || "#",
          category: primaryCategory,
          categorySlug: generateCategorySlug(primaryCategory),
          tags: listing.age_range || [], // age_range is now an array
          featured: listing.featured || false,
          slug: safeSlug, // Use sanitized database slug or sanitized fallback
        };
      });
    console.log(
      "[HomeFeatured] final featured ids:",
      listings.map((l) => l.id),
    );
  } catch (error) {
    console.error("Error fetching featured listings:", error);
  }

  // Use fallback if no Supabase listings
  if (listings.length === 0) {
    listings = fallbackListings.map((listing) => ({
      ...listing,
      categorySlug: generateCategorySlug(listing.category),
    }));
  }
  return <FeaturedListingsClient listings={listings} />;
}
