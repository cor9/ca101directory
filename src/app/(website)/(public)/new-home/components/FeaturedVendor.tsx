import Image from "next/image";
import Link from "next/link";

interface FeaturedVendorProps {
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
  } | null;
}

export default function FeaturedVendor({ vendor }: FeaturedVendorProps) {
  if (!vendor) {
    return (
      <div className="card-surface rounded-2xl p-6 max-w-sm w-full">
        <div className="w-full h-52 bg-bg-dark-2 rounded-xl animate-pulse" />
        <div className="mt-4 space-y-2">
          <div className="h-6 bg-bg-dark-2 rounded animate-pulse" />
          <div className="h-4 bg-bg-dark-2 rounded w-2/3 animate-pulse" />
        </div>
      </div>
    );
  }

  const vendorName = vendor.title || vendor.name || "Featured Vendor";
  const vendorCategory = vendor.category || vendor.category_name || "Professional";
  const vendorLocation =
    vendor.city && vendor.state
      ? `${vendor.city}, ${vendor.state}`
      : vendor.location || "";
  const vendorImage = vendor.image_url || vendor.logo_url || "/placeholder.svg";
  const vendorSlug = vendor.slug || vendor.id;

  return (
    <div className="card-surface rounded-2xl p-6 shadow-card max-w-sm w-full hover-lift">
      {/* Vendor Image */}
      <div className="relative w-full h-52 bg-bg-dark-2 rounded-xl overflow-hidden">
        <Image
          src={vendorImage}
          alt={vendorName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
        />
      </div>

      {/* Vendor Info */}
      <h3 className="mt-4 text-xl font-semibold text-text-primary">{vendorName}</h3>
      <p className="text-text-muted text-sm">{vendorCategory}</p>
      {vendorLocation && (
        <p className="text-text-muted text-sm">{vendorLocation}</p>
      )}

      {/* Verified Badge */}
      {vendor.is_verified && (
        <span className="inline-flex items-center mt-3 text-xs bg-accent-blue/20 text-accent-blue px-2 py-1 rounded-md font-medium">
          Verified
        </span>
      )}

      {/* View Profile CTA */}
      <Link
        href={`/item/${vendorSlug}`}
        className="btn-secondary w-full text-center block mt-4"
      >
        View Profile →
      </Link>
    </div>
  );
}
