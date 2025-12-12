import { CheckCircle } from "lucide-react";
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
      <div className="card-surface rounded-xl p-6">
        <div className="aspect-video bg-[#1A1F2E] rounded-lg animate-pulse" />
        <div className="mt-4 space-y-2">
          <div className="h-6 bg-[#1A1F2E] rounded animate-pulse" />
          <div className="h-4 bg-[#1A1F2E] rounded w-2/3 animate-pulse" />
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
    <div className="card-surface rounded-xl overflow-hidden shadow-card hover:shadow-hover transition-shadow duration-300">
      {/* Vendor Image */}
      <div className="relative aspect-video bg-[#1A1F2E]">
        <Image
          src={vendorImage}
          alt={vendorName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
        />
      </div>

      {/* Vendor Info */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-2">{vendorName}</h3>

        {/* Location Badge */}
        {vendorLocation && (
          <span className="inline-block px-3 py-1 bg-[#1A1F2E] rounded-full text-sm text-gray-400 mb-3">
            {vendorLocation}
          </span>
        )}

        {/* Category */}
        <p className="text-gray-400 text-base mb-4">{vendorCategory}</p>

        {/* Actions Row */}
        <div className="flex items-center justify-between">
          {/* Verified Badge */}
          {vendor.is_verified && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0D4F3C] border-2 border-[#10B981] rounded-md text-white text-sm font-semibold">
              <CheckCircle className="w-4 h-4" />
              Verified
            </span>
          )}

          {/* View Button */}
          <Link
            href={`/item/${vendorSlug}`}
            className="px-5 py-2 bg-[#E4572E] hover:bg-[#CC4E2A] text-white font-semibold rounded-lg transition-colors"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
