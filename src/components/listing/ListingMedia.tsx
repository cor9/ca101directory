import { Gallery } from "@/components/listing/gallery";
import { ProfileSection } from "@/components/listing/ProfileSection";
import type { Listing } from "@/data/listings";
import { normalizeListingTier } from "@/lib/listingCapabilities";
import { parseGalleryItems } from "@/lib/gallery";

/** Convert a YouTube/Vimeo page URL to its embed URL; null if unsupported. */
export function toEmbedUrl(url: string): string | null {
  if (!url) return null;
  const yt = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
  );
  if (yt?.[1]) return `https://www.youtube.com/embed/${yt[1]}`;
  const vm = url.match(
    /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(?:.*\/)?([0-9]+)/,
  );
  if (vm?.[1]) return `https://player.vimeo.com/video/${vm[1]}`;
  return null; // never embed arbitrary URLs
}

/**
 * Plan entitlements (see pricing): video embeds = Standard and up,
 * gallery = Pro. Data is never deleted; it just isn't shown above the plan.
 */
export function mediaEntitlements(listing: Listing) {
  const tier = normalizeListingTier(listing.plan, listing.comped);
  const isPro = tier === "pro" || tier === "premium";
  return { gallery: isPro, video: isPro || tier === "standard" };
}

export function ListingPortfolio({ listing }: { listing: Listing }) {
  const ent = mediaEntitlements(listing);
  if (!ent.gallery || parseGalleryItems(listing.gallery).length === 0) {
    return null;
  }
  return (
    <ProfileSection id="gallery">
      <Gallery listing={listing} tone="light" />
    </ProfileSection>
  );
}

export function ListingVideo({
  listing,
  heading,
}: {
  listing: Listing;
  heading: string;
}) {
  const embed = mediaEntitlements(listing).video
    ? toEmbedUrl(listing.video_url || "")
    : null;
  if (!embed) return null;
  return (
    <ProfileSection title={heading}>
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-black shadow-md">
        <iframe
          src={embed}
          title={`${listing.listing_name || "Provider"} video`}
          className="h-full w-full"
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </ProfileSection>
  );
}
