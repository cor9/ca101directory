import type { Listing } from "@/data/listings";
import {
  CheckCircle,
  Clock,
  Globe,
  MapPin,
  Shield,
  Users,
} from "lucide-react";

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
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

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
  const trustLevel = (listing as any).trust_level;
  const repeatFamilies = (listing as any).repeat_families_count ?? 0;
  const responseTime = (listing as any).response_time_label;
  const lastActive = formatLastActive((listing as any).last_active_at);

  const isVerified = trustLevel === "verified" || trustLevel === "background_checked" || trustLevel === "verified_safe";
  const isBackgroundChecked = trustLevel === "background_checked" || trustLevel === "verified_safe";

  // Trust signals to show
  const showTrustSignals = isVerified || isBackgroundChecked || repeatFamilies > 0 || responseTime || lastActive;

  return (
    <section className="bg-bg-panel/60 backdrop-blur-sm border border-white/5 rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4 text-text-primary">Details</h2>

      {/* Trust Signals Bar */}
      {showTrustSignals && (
        <div className="flex flex-wrap gap-3 mb-6 pb-4 border-b border-white/10">
          {isBackgroundChecked && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
              <Shield className="w-3 h-3" />
              Background Checked
            </span>
          )}
          {isVerified && !isBackgroundChecked && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">
              <CheckCircle className="w-3 h-3" />
              Verified
            </span>
          )}
          {repeatFamilies > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-medium">
              <Users className="w-3 h-3" />
              {repeatFamilies} repeat {repeatFamilies === 1 ? "family" : "families"}
            </span>
          )}
          {responseTime && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">
              <Clock className="w-3 h-3" />
              {responseTime}
            </span>
          )}
          {lastActive && (
            <span className="inline-flex items-center gap-1.5 text-xs text-text-muted">
              {lastActive}
            </span>
          )}
        </div>
      )}

      {/* Details Grid */}
      <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-text-muted mt-0.5 flex-shrink-0" />
          <div>
            <dt className="font-medium text-text-primary">Location</dt>
            <dd className="text-text-secondary">{location || "Not specified"}</dd>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Globe className="w-4 h-4 text-text-muted mt-0.5 flex-shrink-0" />
          <div>
            <dt className="font-medium text-text-primary">Format</dt>
            <dd className="text-text-secondary">
              {hasVirtualOption ? "Virtual / Online" : "In-Person"}
            </dd>
          </div>
        </div>

        {regions.length > 0 && (
          <div className="col-span-2 sm:col-span-1">
            <dt className="font-medium text-text-primary mb-1">Service Areas</dt>
            <dd className="text-text-secondary text-xs">{regions.slice(0, 3).join(", ")}{regions.length > 3 ? ` +${regions.length - 3} more` : ""}</dd>
          </div>
        )}
      </dl>

      {/* Ages & Services Pills */}
      <div className="mt-5 pt-4 border-t border-white/10 space-y-4">
        {ageRanges.length > 0 && (
          <div>
            <dt className="font-medium text-text-primary text-sm mb-2">Ages Served</dt>
            <dd className="flex flex-wrap gap-2">
              {ageRanges.map((age) => (
                <span
                  key={age}
                  className="px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-300 text-xs font-medium border border-blue-500/20"
                >
                  {age}
                </span>
              ))}
            </dd>
          </div>
        )}

        {services.length > 0 && (
          <div>
            <dt className="font-medium text-text-primary text-sm mb-2">Services</dt>
            <dd className="flex flex-wrap gap-2">
              {services.slice(0, 6).map((service) => (
                <span
                  key={service}
                  className="px-2.5 py-1 rounded-full bg-white/5 text-text-secondary text-xs border border-white/10"
                >
                  {service}
                </span>
              ))}
              {services.length > 6 && (
                <span className="text-xs text-text-muted self-center">
                  +{services.length - 6} more
                </span>
              )}
            </dd>
          </div>
        )}
      </div>
    </section>
  );
}

