import type { Listing } from "@/data/listings";
import { isIndustryPro as checkIndustryPro } from "@/lib/listings/listingType";
import { type ProfileCopy, profileCopyFor } from "@/lib/profile-kind";
import { ListingPricing, hasListingPricing } from "./ListingPricing";
import { Clock, Globe, MapPin, Shield, Users } from "lucide-react";

interface ListingDetailsProps {
  listing: Listing;
  category: string;
  location: string;
  ageRanges: string[];
  services: string[];
  regions: string[];
  hasVirtualOption: boolean;
  /** Category-aware wording (defaults to a bookable service) */
  copy?: ProfileCopy;
}

export function ListingDetails({
  listing,
  category,
  location,
  ageRanges,
  services,
  regions,
  hasVirtualOption,
  copy = profileCopyFor(null),
}: ListingDetailsProps) {
  const industryPro = checkIndustryPro(listing.listing_type);
  const trustLevel = (listing as any).trust_level;
  const repeatFamilies = (listing as any).repeat_families_count ?? 0;
  const responseTime = (listing as any).response_time_label;

  const isBackgroundChecked =
    trustLevel === "background_checked" || trustLevel === "verified_safe";

  // Trust signals to show
  const showTrustSignals =
    isBackgroundChecked ||
    repeatFamilies > 0 ||
    responseTime;

  // Only state a format the listing actually provides; never default to "In-Person"
  const rawFormat = typeof listing.format === "string" ? listing.format.trim() : "";
  const formatLabel = hasVirtualOption ? "Virtual / Online" : rawFormat || null;

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-zinc-900">
        {copy.detailsTitle}
      </h2>

      {showTrustSignals && (
        <div className="mb-5 flex flex-wrap items-center gap-2 border-b border-zinc-200 pb-4">
          {isBackgroundChecked && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
              <Shield className="h-3 w-3" />
              Background Checked
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
        </div>
      )}

      <dl className="space-y-4 text-sm">
        {location && (
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
            <div>
              <dt className="font-semibold text-zinc-900">Location</dt>
              <dd className="text-zinc-700">{location}</dd>
            </div>
          </div>
        )}
        {formatLabel && (
          <div className="flex items-start gap-3">
            <Globe className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
            <div>
              <dt className="font-semibold text-zinc-900">Format</dt>
              <dd className="text-zinc-700">{formatLabel}</dd>
            </div>
          </div>
        )}
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
            <dt className="mb-2 font-semibold text-zinc-900">{copy.kind === "service" ? "Specialties & Services" : "Specialties"}</dt>
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

      {copy.note && (
        <p className="mt-5 border-t border-zinc-200 pt-4 text-sm leading-relaxed text-zinc-600">
          {copy.note}
        </p>
      )}

      {!industryPro && copy.showPricing && hasListingPricing(listing) && (
        <div className="mt-5 border-t border-zinc-200 pt-4">
          <ListingPricing listing={listing} />
        </div>
      )}
    </div>
  );
}
