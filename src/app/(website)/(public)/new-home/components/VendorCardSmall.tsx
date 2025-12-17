import Image from "next/image";
import Link from "next/link";
import { ProfileVerifiedBadge } from "@/components/badges/ProfileVerifiedBadge";
import { CategoryPlaceholder } from "@/components/listing/CategoryPlaceholder";

interface VendorCardSmallProps {
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

export default function VendorCardSmall({ vendor }: VendorCardSmallProps) {
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
      className="min-w-[240px] card-surface rounded-xl p-4 shadow-card hover-glow transition"
    >
      {/* Vendor Image */}
      <div className="relative h-32 w-full bg-bg-dark-2 rounded-lg overflow-hidden">
        {vendorImage ? (
          <Image
            src={vendorImage}
            alt={vendorName}
            fill
            className="object-cover"
            sizes="240px"
          />
        ) : (
          <CategoryPlaceholder category={vendorCategory} size="md" className="h-32" />
        )}
      </div>

      {/* Vendor Info */}
      <div className="mt-3">
        <h3 className="font-medium text-text-primary truncate">{vendorName}</h3>
        <p className="text-xs text-text-muted">{vendorCategory}</p>
        {vendorLocation && (
          <p className="text-xs text-text-muted">{vendorLocation}</p>
        )}

        {/* Profile Verified Badge */}
        {(vendor.profile_verified || vendor.is_verified) && (
          <div className="mt-2">
            <ProfileVerifiedBadge profileVerifiedAt={vendor.profile_verified_at} />
          </div>
        )}
      </div>
    </Link>
  );
}
