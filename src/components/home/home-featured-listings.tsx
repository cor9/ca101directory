import { Icons } from "@/components/icons/icons";
import { getPublicListings } from "@/data/listings";
import { getListingImageUrl } from "@/lib/image-urls";
import { cn } from "@/lib/utils";
import { generateSlug } from "@/lib/slug-utils";
import Image from "next/image";
import Link from "next/link";

interface FeaturedListing {
  id: string;
  name: string;
  description: string;
  image: string;
  website: string;
  category: string;
  tags: string[];
  featured?: boolean;
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
    tags: ["On-Camera", "Audition Prep", "Teens"],
    featured: true,
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
    tags: ["Portfolio", "Professional", "Child-Friendly"],
  },
  {
    id: "3",
    name: "Coaching with Corey",
    description:
      "Comprehensive acting coaching including private sessions, self-tape services, and career consultations.",
    image: "/coachingwithcorey.png",
    website: "https://coaching.childactor101.com",
    category: "Acting Classes & Coaches",
    tags: ["Private Coaching", "Self-Tape", "Career Guidance"],
    featured: true,
  },
];

export default async function HomeFeaturedListings() {
  // Get real listings from Supabase
  let listings: FeaturedListing[] = [];

  try {
    const supabaseListings = await getPublicListings();
    listings = supabaseListings
      .filter((listing) => listing.featured === true) // Show only admin-selected featured listings
      .sort((a, b) =>
        (a.listing_name || "").localeCompare(b.listing_name || ""),
      ) // Alphabetical order
      .slice(0, 3) // Limit to 3
      .map((listing) => ({
        id: listing.id,
        name: listing.listing_name || "Untitled Listing",
        description: (listing.what_you_offer || "Professional acting services").replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(),
        image: listing.profile_image
          ? getListingImageUrl(listing.profile_image)
          : "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&fit=crop",
        website: listing.website || "#",
        category: listing.categories?.[0] || "Acting Professional", // categories is now an array
        tags: listing.age_range || [], // age_range is now an array
        featured: listing.featured || false,
      }));
  } catch (error) {
    console.error("Error fetching featured listings:", error);
  }

  // Use fallback if no Supabase listings
  if (listings.length === 0) {
    listings = fallbackListings;
  }
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4" style={{ color: "#1B1F29" }}>
          Featured Professionals
        </h2>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: "#1B1F29" }}>
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
                <h3
                  className="font-semibold text-lg"
                  style={{ color: "#1B1F29" }}
                >
                  {listing.name}
                </h3>
                <Icons.externalLink
                  className="h-4 w-4"
                  style={{ color: "#1B1F29" }}
                />
              </div>

              <p
                className="text-sm mb-4 line-clamp-4"
                style={{ color: "#1B1F29" }}
              >
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
                <span style={{ color: "#1B1F29" }}>
                  {listing.category}
                </span>
                <Link
                  href={`/listing/${generateSlug(listing.name, listing.id)}`}
                  className="text-secondary-denim hover:text-primary-orange text-sm font-semibold transition-colors"
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
