import Image from "next/image";
import Link from "next/link";
import { ProfileVerifiedBadge } from "@/components/badges/ProfileVerifiedBadge";

interface VendorCardMediumProps {
  vendor: {
    id: string;
    slug?: string;
    title?: string;
    name?: string;
    category?: string;
    category_name?: string;
    city?: string;
    state?: string;
    location?: string;
    is_verified?: boolean;
    profile_verified?: boolean;
    profile_verified_at?: string | null;
    image_url?: string;
    logo_url?: string;
  };
}

export default function VendorCardMedium({ vendor }: VendorCardMediumProps) {
  const vendorName = vendor.title || vendor.name || "Vendor";
  const vendorCategory = vendor.category || vendor.category_name || "Professional";
  const vendorLocation =
    vendor.city && vendor.state
      ? `${vendor.city}, ${vendor.state}`
      : vendor.location || "";
  const vendorImage = vendor.image_url || vendor.logo_url;
  const vendorSlug = vendor.slug || vendor.id;

  return (
    <Link
      href={`/item/${vendorSlug}`}
      className="card-surface rounded-2xl p-6 shadow-card hover:brightness-110 transition group"
    >
      <div className="flex gap-4 items-center">
        {/* Profile Image */}
        <div className="relative h-16 w-16 rounded-full overflow-hidden bg-bg-dark-2 flex-shrink-0">
          {vendorImage ? (
            <Image
              src={vendorImage}
              alt={vendorName}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent-teal/30 to-accent-purple/30">
              <span className="text-xl font-bold text-text-muted">
                {vendorName.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Vendor Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-text-primary truncate">
            {vendorName}
          </h3>
          <p className="text-sm text-text-muted truncate">
            {vendorCategory} • {vendorLocation}
          </p>

          {/* Profile Verified Badge */}
          {(vendor.profile_verified || vendor.is_verified) && (
            <div className="mt-2">
              <ProfileVerifiedBadge profileVerifiedAt={vendor.profile_verified_at} />
            </div>
          )}
        </div>
      </div>

      {/* View CTA */}
      <div className="mt-6">
        <span className="btn-secondary inline-block">View Listing →</span>
      </div>
    </Link>
  );
}
