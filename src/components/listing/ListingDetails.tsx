import type { Listing } from "@/data/listings";
import { isIndustryPro as checkIndustryPro } from "@/lib/listings/listingType";
import { ListingPricing } from "./ListingPricing";
import { CheckCircle, Clock, Globe, MapPin, Shield, Users } from "lucide-react";

interface ListingDetailsProps {
  listing: Listing;
  category: string;
  location: string;
  ageRanges: string[];
  services: string[];
  regions: string[];
  hasVirtualOption: boolean;
}

// Format "last active" as relative time
function formatLastActive(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) return "Active today";
  if (diffDays === 1) return "Active yesterday";
  if (diffDays < 7) return `Active ${diffDays} days ago`;
  if (diffDays < 30) return `Active ${Math.floor(diffDays / 7)} weeks ago`;
  return null; // Don't show if more than a month
}

export function ListingDetails({
  listing,
  category,
  location,
  ageRanges,
  services,
  regions,
  hasVirtualOption,
}: ListingDetailsProps) {
  const industryPro = checkIndustryPro(listing.listing_type);
  const trustLevel = (listing as any).trust_level;
  const repeatFamilies = (listing as any).repeat_families_count ?? 0;
  const responseTime = (listing as any).response_time_label;
  const lastActive = formatLastActive((listing as any).last_active_at);

  const isVerified =
    trustLevel === "verified" ||
    trustLevel === "background_checked" ||
    trustLevel === "verified_safe";
  const isBackgroundChecked =
    trustLevel === "background_checked" || trustLevel === "verified_safe";

  // Trust signals to show
  const showTrustSignals =
    isVerified ||
    isBackgroundChecked ||
    repeatFamilies > 0 ||
    responseTime ||
    lastActive;

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-zinc-900">Session Details</h2>

      {showTrustSignals && (
        <div className="mb-5 flex flex-wrap items-center gap-2 border-b border-zinc-200 pb-4">
          {isBackgroundChecked && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
              <Shield className="h-3 w-3" />
              Background Checked
            </span>
          )}
          {isVerified && !isBackgroundChecked && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-800">
              <CheckCircle className="h-3 w-3" />
              Verified
            </span>
          )}
          {repeatFamilies > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-800">
              <Users className="h-3 w-3" />
              {repeatFamilies} repeat {repeatFamilies === 1 ? "family" : "families"}
            </span>
          )}
          {responseTime && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
              <Clock className="h-3 w-3" />
              {responseTime}
            </span>
          )}
          {lastActive && (
            <span className="text-xs text-zinc-500">{lastActive}</span>
          )}
        </div>
      )}

      <dl className="space-y-4 text-sm">
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
          <div>
            <dt className="font-semibold text-zinc-900">Location</dt>
            <dd className="text-zinc-700">{location || "Not specified"}</dd>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Globe className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
          <div>
            <dt className="font-semibold text-zinc-900">Format</dt>
            <dd className="text-zinc-700">
              {hasVirtualOption ? "Virtual / Online" : "In-Person"}
            </dd>
          </div>
        </div>
        {regions.length > 0 && (
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
            <div>
              <dt className="font-semibold text-zinc-900">Service Areas</dt>
              <dd className="text-zinc-700">{regions.join(", ")}</dd>
            </div>
          </div>
        )}
        {ageRanges.length > 0 && (
          <div>
            <dt className="mb-2 font-semibold text-zinc-900">Ages Served</dt>
            <dd className="flex flex-wrap gap-1.5">
              {ageRanges.map((age) => (
                <span
                  key={age}
                  className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-900"
                >
                  {age}
                </span>
              ))}
            </dd>
          </div>
        )}
        {services.length > 0 && (
          <div>
            <dt className="mb-2 font-semibold text-zinc-900">Specialties &amp; Services</dt>
            <dd className="flex flex-wrap gap-1.5">
              {services.slice(0, 10).map((service) => (
                <span
                  key={service}
                  className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-800"
                >
                  {service}
                </span>
              ))}
              {services.length > 10 && (
                <span className="self-center text-xs text-zinc-500">
                  +{services.length - 10} more
                </span>
              )}
            </dd>
          </div>
        )}
      </dl>

      {!industryPro && (
        <div className="mt-5 border-t border-zinc-200 pt-4">
          <ListingPricing listing={listing} />
        </div>
      )}
    </div>
  );
}
