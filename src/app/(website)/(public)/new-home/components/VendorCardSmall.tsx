import { CheckCircle } from "lucide-react";
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

  // Generate initials for placeholder
  const initials = vendorName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Link
      href={`/item/${vendorSlug}`}
      className="flex-shrink-0 w-64 card-surface rounded-xl p-4 hover:shadow-hover transition-all duration-200 group"
    >
      <div className="flex items-start gap-3">
        {/* Profile Photo / Letter Bubble */}
        <div className="relative flex-shrink-0">
          {vendorImage ? (
            <div className="w-12 h-12 rounded-full overflow-hidden bg-[#1A1F2E]">
              <Image
                src={vendorImage}
                alt={vendorName}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#3A76A6] to-[#E4572E] flex items-center justify-center text-white font-bold text-lg">
              {initials}
            </div>
          )}
        </div>

        {/* Vendor Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="text-white font-semibold text-sm truncate group-hover:text-[#3A76A6] transition-colors">
              {vendorName}
            </h4>
            {vendor.is_verified && (
              <CheckCircle className="w-4 h-4 text-[#10B981] flex-shrink-0" />
            )}
          </div>

          {vendor.is_verified && (
            <span className="text-xs text-[#10B981] font-medium">Verified</span>
          )}

          <p className="text-gray-400 text-sm mt-1 truncate">{vendorCategory}</p>

          {vendorLocation && (
            <p className="text-gray-500 text-xs mt-0.5 truncate">
              {vendorLocation}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
