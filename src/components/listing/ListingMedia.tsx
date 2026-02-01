import { Gallery } from "@/components/listing/gallery";
import type { Listing } from "@/data/listings";

interface ListingMediaProps {
  listing: Listing;
}

function convertToEmbed(url: string): string {
  if (!url) return "";

  // YouTube: handle standard watch URLs, short URLs, and embed URLs
  const youtubeRegex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch && youtubeMatch[1]) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  // Vimeo: handle standard URLs, channels, and "manage" dashboard URLs
  // Extracts the numeric video ID
  const vimeoRegex =
    /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(?:.*\/)?([0-9]+)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
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
