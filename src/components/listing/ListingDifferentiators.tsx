import { RichTextDisplay } from "@/components/ui/rich-text-display";
import type { Listing } from "@/data/listings";

const RICH_LIGHT =
  "text-base leading-relaxed [&_*]:!text-zinc-800 [&_a]:!text-brass-dark [&_p]:mb-3";

export function ListingDifferentiators({ listing }: { listing: Listing }) {
  const unique = listing.why_is_it_unique?.trim();
  const notes = listing.extras_notes?.trim();
  if (!unique && !notes) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-zinc-900">
        What Sets This Provider Apart
      </h2>
      {unique && (
        <div>
          <h3 className="mb-2 text-base font-semibold text-zinc-900">
            What Makes Us Unique
          </h3>
          <RichTextDisplay content={unique} className={RICH_LIGHT} />
        </div>
      )}
      {notes && (
        <div>
          <h3 className="mb-2 text-base font-semibold text-zinc-900">
            Additional Notes
          </h3>
          <RichTextDisplay content={notes} className={RICH_LIGHT} />
        </div>
      )}
    </div>
  );
}
