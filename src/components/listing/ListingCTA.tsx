import { ContactActions } from "@/components/listing/contact-actions";
import type { Listing } from "@/data/listings";
import Link from "next/link";

interface ListingCTAProps {
  listing: Listing;
  slug: string;
}

export function ListingCTA({ listing, slug }: ListingCTAProps) {
  return (
    <div className="bg-bg-dark py-6 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-4">
          <ContactActions
            listingId={listing.id}
            website={listing.website}
            email={listing.email}
            plan={listing.plan}
            comped={listing.comped}
            className="flex-1"
          />
          {/* Optional: View Gallery link if gallery exists */}
          {listing.gallery && listing.gallery !== "[]" && (
            <Link
              href={`/listing/${slug}#gallery`}
              className="px-4 py-2 rounded-md text-sm font-medium bg-white/5 text-white hover:bg-white/10 transition-colors border border-white/10"
            >
              View Gallery
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

