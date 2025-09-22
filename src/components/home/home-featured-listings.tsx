import { Icons } from "@/components/icons/icons";
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

// Sample featured listings - in production, these would come from Airtable
const featuredListings: FeaturedListing[] = [
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

export default function HomeFeaturedListings() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Featured Professionals</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Hand-picked professionals trusted by families across the industry
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {featuredListings.map((listing) => (
          <div
            key={listing.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <div className="relative">
              <Image
                src={listing.image}
                alt={listing.name}
                width={400}
                height={200}
                className={`w-full h-48 object-cover ${
                  listing.name === "Coaching with Corey"
                    ? "bg-gray-800 p-4"
                    : ""
                }`}
              />
              {listing.featured && (
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </span>
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-lg text-gray-900">
                  {listing.name}
                </h3>
                <Icons.externalLink className="h-4 w-4 text-gray-400" />
              </div>

              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {listing.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {listing.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {listing.category}
                </span>
                {listing.name === "Coaching with Corey" ? (
                  <Link
                    href="/item/coaching-with-corey"
                    className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
                  >
                    View Listing →
                  </Link>
                ) : (
                  <Link
                    href={listing.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
                  >
                    Visit Website →
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          href="/search"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          View All Professionals
          <Icons.arrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
