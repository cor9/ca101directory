"use client";

import { Icons } from "@/components/icons/icons";
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

interface FeaturedListingsClientProps {
  listings: FeaturedListing[];
}

export default function FeaturedListingsClient({ listings }: FeaturedListingsClientProps) {
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
              <div className="flex items-center gap-2 mb-3">
                <Icons.star className="h-4 w-4 text-primary-orange" />
                <Link
                  href={`/category/${listing.categorySlug}`}
                  className="bauhaus-body text-secondary-denim hover:text-primary-orange transition-colors"
                >
                  {listing.category}
                </Link>
              </div>

              <h3 className="bauhaus-heading text-xl mb-3 text-paper">
                {listing.name}
              </h3>

              <p className="bauhaus-body text-paper mb-4 line-clamp-3">
                {listing.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {listing.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="chip chip-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

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
