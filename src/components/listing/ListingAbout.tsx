import { RichTextDisplay } from "@/components/ui/rich-text-display";
import type { Listing } from "@/data/listings";

interface ListingAboutProps {
  listing: Listing;
}

export function ListingAbout({ listing }: ListingAboutProps) {
  const description =
    listing.what_you_offer || listing.description || null;

  if (!description) {
    return null;
  }

  return (
    <section className="bg-bg-panel/60 backdrop-blur-sm border border-white/5 rounded-xl p-6">
      <h2 className="text-xl font-bold mb-3 text-text-primary">About</h2>
      <RichTextDisplay
        content={description}
        className="text-sm leading-relaxed text-text-secondary"
      />
    </section>
  );
}

