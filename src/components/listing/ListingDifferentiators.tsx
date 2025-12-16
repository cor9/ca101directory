import { RichTextDisplay } from "@/components/ui/rich-text-display";
import type { Listing } from "@/data/listings";

interface ListingDifferentiatorsProps {
  listing: Listing;
}

export function ListingDifferentiators({
  listing,
}: ListingDifferentiatorsProps) {
  const unique = listing.why_is_it_unique;
  const notes = listing.extras_notes;

  if (!unique && !notes) {
    return null;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-text-primary">
        What Sets This Provider Apart
      </h2>

      {unique && (
        <div className="bg-bg-panel/40 backdrop-blur-sm border border-white/5 rounded-xl p-6">
          <h3 className="text-base font-semibold text-text-primary mb-2">
            What Makes Us Unique
          </h3>
          <RichTextDisplay
            content={unique}
            className="text-sm leading-relaxed text-text-secondary"
          />
        </div>
      )}

      {notes && (
        <div className="bg-bg-panel/40 backdrop-blur-sm border border-white/5 rounded-xl p-6">
          <h3 className="text-base font-semibold text-text-primary mb-2">
            Additional Notes
          </h3>
          <RichTextDisplay
            content={notes}
            className="text-sm leading-relaxed text-text-secondary"
          />
        </div>
      )}
    </section>
  );
}

