import { Gallery } from "@/components/listing/gallery";
import type { Listing } from "@/data/listings";

interface ListingMediaProps {
  listing: Listing;
}

function convertToEmbed(url: string): string {
  if (!url) return "";
  if (url.includes("watch?v=")) {
    return url.replace("watch?v=", "embed/");
  }
  if (url.includes("youtu.be")) {
    return url.replace("youtu.be/", "www.youtube.com/embed/");
  }
  if (url.includes("youtube.com")) {
    return url.replace("youtube.com/", "youtube.com/embed/");
  }
  if (url.includes("vimeo.com")) {
    return url.replace("vimeo.com", "player.vimeo.com/video");
  }
  return url;
}

export function ListingMedia({ listing }: ListingMediaProps) {
  const hasVideo = Boolean(listing.video_url);
  const hasGallery = Boolean(listing.gallery && listing.gallery !== "[]");

  if (!hasVideo && !hasGallery) {
    return null;
  }

  return (
    <section className="space-y-6">
      {/* Video Embed - Always first if exists */}
      {hasVideo && (
        <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
          <iframe
            src={convertToEmbed(listing.video_url || "")}
            title="Provider video"
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* Gallery Grid - After video */}
      {hasGallery && (
        <div id="gallery">
          <Gallery listing={listing} />
        </div>
      )}
    </section>
  );
}

