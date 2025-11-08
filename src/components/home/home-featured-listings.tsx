import { getCategories } from "@/data/categories";
import { getPublicListings } from "@/data/listings";
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
  const isUuidLike = (value: string | undefined): boolean => {
    if (!value) return false;
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
      getPublicListings(),
      getCategories(),
    ]);

    // Create a map of category IDs to names for UUID resolution
    const categoryMap = new Map<string, string>();
    for (const category of categories) {
      categoryMap.set(category.id, category.category_name);
    }

    listings = supabaseListings
      .filter((listing) => listing.featured === true) // Show only admin-selected featured listings
      .sort((a, b) =>
        (a.listing_name || "").localeCompare(b.listing_name || ""),
      ) // Alphabetical order
      .slice(0, 6) // Show 2 rows (6 items)
      .map((listing) => {
        // Resolve category UUIDs to names
        const resolvedCategories = (listing.categories || [])
          .map((cat) => {
            if (isUuidLike(cat)) {
              return categoryMap.get(cat) || cat;
            }
            return cat;
          })
          .filter((cat) => !isUuidLike(cat)); // Filter out any remaining UUIDs

        const primaryCategory = resolvedCategories[0] || "Acting Professional";

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
          slug: listing.slug || generateSlug(listing.listing_name || "", listing.id), // Use database slug or generate fallback
        };
      });
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
