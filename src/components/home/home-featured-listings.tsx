import { Icons } from "@/components/icons/icons";
import { getPublicListings } from "@/data/listings";
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
    image: "https://coaching.childactor101.com/coachlogo.png",
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
      .filter((listing) => listing.Plan === "Premium" || listing.Plan === "Pro") // Show premium/pro listings as featured
      .slice(0, 3) // Limit to 3
      .map((listing) => ({
        id: listing.id,
        name: listing["Listing Name"] || "Untitled Listing",
        description:
          listing["What You Offer?"] || "Professional acting services",
        image:
          listing["Profile Image"] ||
          "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&fit=crop",
        website: listing.Website || "#",
        category: listing.Categories?.split(",")[0] || "Acting Professional",
        tags: listing["Age Range"]?.split(",") || [],
        featured: listing.Plan === "Premium",
      }));
  } catch (error) {
    console.error("Error fetching featured listings:", error);
  }

  // Use fallback if no Supabase listings
  if (listings.length === 0) {
    listings = fallbackListings;
  }
  return (
    <section className="py-16 bg-gradient-to-b from-muted/50 to-background">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Featured Professionals</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Hand-picked professionals trusted by families across the industry
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="bg-card rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <div className="relative">
              <Image
                src={listing.image}
                alt={listing.name}
                width={400}
                height={200}
                className={`w-full h-48 object-cover ${
                  listing.name === "Coaching with Corey" ? "bg-muted p-4" : ""
                }`}
              />
              {listing.featured && (
                <div className="absolute top-4 left-4">
                  <span className="bg-brand-blue text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </span>
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-lg text-card-foreground">
                  {listing.name}
                </h3>
                <Icons.externalLink className="h-4 w-4 text-muted-foreground" />
              </div>

              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {listing.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {listing.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {listing.category}
                </span>
                <Link
                  href={`/listing/${listing.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9-]/g, "")}`}
                  className="text-brand-blue hover:text-brand-blue-dark text-sm font-semibold"
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
          href="/search"
          className="inline-flex items-center px-6 py-3 bg-brand-blue text-white rounded-lg hover:bg-brand-blue-dark transition-colors font-semibold"
        >
          View All Professionals
          <Icons.arrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
