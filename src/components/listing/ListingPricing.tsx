import type { Listing } from "@/data/listings";
import { DollarSign } from "lucide-react";

interface ListingPricingProps {
  listing: Listing;
}

/**
 * Displays pricing information on listing detail page
 * Shows: Starting at, Typical range, Free consult badge
 * Falls back to "Contact for pricing" if no data
 */
export function ListingPricing({ listing }: ListingPricingProps) {
  const hasStartingAt = listing.price_starting_at != null;
  const hasRange = listing.price_range_min != null && listing.price_range_max != null;
  const hasFreeConsult = listing.free_consult === true;
  const hasPricingInfo = hasStartingAt || hasRange || hasFreeConsult;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-bg-panel/60 backdrop-blur-sm border border-white/5 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-5 h-5 text-emerald-400" />
        <h3 className="text-lg font-semibold text-text-primary">Pricing</h3>
      </div>

      {hasPricingInfo ? (
        <div className="space-y-3">
          {hasStartingAt && (
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-text-muted">Starting at</span>
              <span className="text-xl font-bold text-emerald-400">
                {formatPrice(listing.price_starting_at!)}
              </span>
            </div>
          )}

          {hasRange && (
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-text-muted">Typical range</span>
              <span className="text-lg font-semibold text-text-primary">
                {formatPrice(listing.price_range_min!)}–{formatPrice(listing.price_range_max!)}
              </span>
            </div>
          )}

          {hasFreeConsult && (
            <div className="mt-4 pt-3 border-t border-white/10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium">
                ✓ Free Consultation
              </span>
            </div>
          )}

          <p className="text-xs text-text-muted pt-2">
            Pricing is self-reported and may vary
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-text-secondary">
            Pricing varies — contact for a quote
          </p>
          <p className="text-xs text-text-muted">
            Many providers offer free consultations
          </p>
        </div>
      )}
    </div>
  );
}

