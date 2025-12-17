import { ContactActions } from "@/components/listing/contact-actions";
import type { Listing } from "@/data/listings";
import { ImageIcon } from "lucide-react";
import Link from "next/link";

interface ListingCTAProps {
  listing: Listing;
  slug: string;
}

// Check if gallery has actual content (not empty string, "[]", or falsy)
function hasGallery(gallery: string | null | undefined): boolean {
  if (!gallery) return false;
  const trimmed = gallery.trim();
  return trimmed !== "" && trimmed !== "[]" && trimmed !== '[""]';
}

export function ListingCTA({ listing, slug }: ListingCTAProps) {
  const showGallery = hasGallery(listing.gallery);

  return (
    <div className="bg-bg-dark py-6 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <ContactActions
            listingId={listing.id}
            website={listing.website}
            email={listing.email}
            listingType={listing.listing_type}
            plan={listing.plan}
            comped={listing.comped}
          />
          {/* Gallery link - styled consistently with contact actions */}
          {showGallery && (
            <Link
              href={`/listing/${slug}#gallery`}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              <ImageIcon className="w-4 h-4" />
              Gallery
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

