import { BadgeStack } from "@/components/badges/StatusBadge";
import type { Listing } from "@/data/listings";

interface ListingBadgesProps {
  listing: Listing;
  averageRating?: { average: number; count: number };
}

export function ListingBadges({ listing, averageRating }: ListingBadgesProps) {
  const trustLevel = (listing as any).trust_level;
  const isVerified =
    trustLevel === "verified" ||
    trustLevel === "background_checked" ||
    trustLevel === "verified_safe";
  const isVerifiedSafe =
    trustLevel === "verified_safe" || trustLevel === "background_checked";
  const is101Approved =
    (listing as any).is_approved === true ||
    listing.badge_approved === true ||
    listing.is_approved_101 === true;

  // Determine Pro status
  const planPriority = (listing.plan || "").toLowerCase();
  const isPro =
    planPriority.includes("pro") ||
    planPriority.includes("premium") ||
    listing.comped === true;

  const isFeatured = listing.featured === true;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <BadgeStack
        verified={isVerified}
        featured={isFeatured}
        pro={isPro}
        maxBadges={3}
      />

      {isVerifiedSafe && (
        <span className="px-3 py-1 rounded-full bg-emerald-600 text-xs font-semibold text-white border border-emerald-500">
          Verified Safe
        </span>
      )}

      {is101Approved && (
        <span className="px-3 py-1 rounded-full bg-[#CC5A47] text-xs font-semibold text-white border border-[#CC5A47]">
          101 Approved
        </span>
      )}

      {averageRating && averageRating.count > 0 && (
        <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 text-xs font-semibold text-text-primary border border-white/10">
          ★ {averageRating.average.toFixed(1)} ({averageRating.count})
        </span>
      )}
    </div>
  );
}

