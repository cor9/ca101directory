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
          className="group block overflow-hidden rounded-2xl border border-white/10 bg-[#1a2332] shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
        >
          <div className="relative aspect-[16/9] w-full bg-slate-800">
            <Image
              src={listing.image}
              alt={listing.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              {listing.featured && (
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-amber-500 text-slate-900">
                  Featured
                </span>
              )}
              <Icons.star className="h-3.5 w-3.5 text-text-muted" />
              <span className="text-xs text-text-muted font-medium">
                {listing.category}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-text-primary mb-2">
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

            <div className="text-sm font-semibold text-text-secondary group-hover:text-text-primary transition-colors">
              View Profile →
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
