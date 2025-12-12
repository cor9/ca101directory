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

export default function FeaturedListingsClient({
  listings,
}: FeaturedListingsClientProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <Link
          key={listing.id}
          href={
            listing.isFallback ? listing.website : `/listing/${listing.slug}`
          }
          target={listing.isFallback ? "_blank" : undefined}
          className="group card-surface rounded-xl overflow-hidden hover:shadow-cardHover transition-all duration-300 hover:-translate-y-1"
        >
          <div className="relative aspect-[16/9] w-full bg-bg-2">
            <Image
              src={listing.image}
              alt={listing.name}
              fill
              className="object-cover"
            />
            {listing.featured && (
              <div className="absolute top-3 left-3">
                <span className="px-2 py-1 text-xs font-semibold rounded-md bg-accent-teal text-bg-dark">
                  Featured
                </span>
              </div>
            )}
          </div>

          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icons.star className="h-3.5 w-3.5 text-accent-teal" />
              <span className="text-xs text-accent-teal font-medium">
                {listing.category}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-accent-teal transition-colors">
              {listing.name}
            </h3>

            <p className="text-sm text-text-secondary mb-3 line-clamp-2">
              {listing.description}
            </p>

            {listing.tags && listing.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {listing.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 text-xs rounded-md bg-bg-3 text-text-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="text-sm font-semibold text-accent-teal group-hover:underline">
              View Profile →
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
