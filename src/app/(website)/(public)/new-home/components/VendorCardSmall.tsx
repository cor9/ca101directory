import Image from "next/image";
import Link from "next/link";

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
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent-blue/30 to-accent-purple/30">
            <span className="text-2xl font-bold text-text-muted">
              {vendorName.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Vendor Info */}
      <div className="mt-3">
        <h3 className="font-medium text-text-primary truncate">{vendorName}</h3>
        <p className="text-xs text-text-muted">{vendorCategory}</p>
        {vendorLocation && (
          <p className="text-xs text-text-muted">{vendorLocation}</p>
        )}

        {/* Verified Badge */}
        {vendor.is_verified && (
          <span className="inline-flex items-center mt-2 text-xs bg-accent-blue/20 text-accent-blue px-2 py-0.5 rounded-md">
            Verified
          </span>
        )}
      </div>
    </Link>
  );
}
