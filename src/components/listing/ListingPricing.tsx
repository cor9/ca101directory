import type { Listing } from "@/data/listings";

/** True when the listing has any real pricing to show. */
export const hasListingPricing = (listing: Listing): boolean =>
  listing.price_starting_at != null ||
  (listing.price_range_min != null && listing.price_range_max != null) ||
  listing.free_consult === true;

/**
 * Pricing from real data only; renders nothing when no pricing exists.
 */
export function ListingPricing({ listing }: { listing: Listing }) {
  const hasStartingAt = listing.price_starting_at != null;
  const hasRange =
    listing.price_range_min != null && listing.price_range_max != null;
  const hasFreeConsult = listing.free_consult === true;
  if (!hasStartingAt && !hasRange && !hasFreeConsult) return null;

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <dl className="space-y-2 text-sm">
      {hasStartingAt && (
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-zinc-600">Starting at</dt>
          <dd className="text-lg font-bold text-zinc-900">
            {fmt(listing.price_starting_at as number)}
          </dd>
        </div>
      )}
      {hasRange && (
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-zinc-600">Typical range</dt>
          <dd className="font-semibold text-zinc-900">
            {fmt(listing.price_range_min as number)}–
            {fmt(listing.price_range_max as number)}
          </dd>
        </div>
      )}
      {hasFreeConsult && (
        <div className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
          Free consultation
        </div>
      )}
    </dl>
  );
}
