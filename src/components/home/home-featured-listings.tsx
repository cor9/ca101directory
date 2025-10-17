"use client";

import { Icons } from "@/components/icons/icons";
import { getCategories } from "@/data/categories";
import { getPublicListings } from "@/data/listings";
import { getListingImageUrl } from "@/lib/image-urls";
import { generateSlug } from "@/lib/slug-utils";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

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
      .slice(0, 3) // Limit to 3
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
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="bauhaus-heading text-3xl mb-4 text-paper">
          Featured Professionals
        </h2>
        <p className="bauhaus-body text-lg max-w-2xl mx-auto text-paper">
          Hand-picked professionals trusted by families across the industry
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="surface overflow-hidden hover:shadow-hover hover:border-secondary-denim transition-all duration-300"
          >
            <div className="relative aspect-[3/2]">
              <Image
                src={listing.image}
                alt={listing.name}
                width={400}
                height={267}
                className={`w-full h-full object-cover ${
                  listing.name === "Coaching with Corey" ? "bg-muted p-4" : ""
                }`}
              />
              {listing.featured && (
                <div className="absolute top-4 left-4">
                  <span className="chip chip-cat">Featured</span>
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="bauhaus-heading text-lg">{listing.name}</h3>
                <Icons.externalLink className="h-4 w-4" />
              </div>

              <p className="bauhaus-body text-sm mb-4 line-clamp-4">
                {listing.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {listing.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="chip chip-attr">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <Link
                  href={`/category/${listing.categorySlug}`}
                  className="bauhaus-body text-secondary-denim hover:text-primary-orange transition-colors"
                >
                  {listing.category}
                </Link>
                <Link
                  href={
                    listing.isFallback
                      ? listing.website
                      : `/listing/${listing.slug}`
                  }
                  className="text-secondary-denim hover:text-primary-orange text-sm font-semibold transition-colors"
                  target={listing.isFallback ? "_blank" : undefined}
                >
                  View Listing →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          href="/directory"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-secondary-denim to-primary-orange text-paper rounded-xl hover:from-secondary-denim-600 hover:to-primary-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
        >
          View All Listings
          <Icons.arrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
