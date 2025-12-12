import { CheckCircle, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

  // Generate initials for placeholder
  const initials = vendorName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="card-surface rounded-xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 group">
      {/* Image Section */}
      <div className="relative aspect-[4/3] bg-[#1A1F2E]">
        {vendorImage ? (
          <Image
            src={vendorImage}
            alt={vendorName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 300px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1A1F2E] to-[#252B3B]">
            <span className="text-4xl font-bold text-gray-600">{initials}</span>
          </div>
        )}

        {/* 101 Approved Badge Overlay */}
        {vendor.is_verified && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#0D4F3C]/90 backdrop-blur-sm border border-[#10B981] rounded-md text-white text-xs font-semibold">
              <CheckCircle className="w-3 h-3" />
              101 Approved
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Vendor Name */}
        <h3 className="text-lg font-bold text-white mb-1 truncate group-hover:text-[#3A76A6] transition-colors">
          {vendorName}
        </h3>

        {/* Category */}
        <p className="text-[#3A76A6] text-base font-medium mb-2 truncate">
          {vendorCategory}
        </p>

        {/* Location */}
        {vendorLocation && (
          <div className="flex items-center gap-1 text-gray-400 text-sm mb-4">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{vendorLocation}</span>
          </div>
        )}

        {/* View Profile CTA */}
        <Link
          href={`/item/${vendorSlug}`}
          className="block w-full text-center py-2.5 bg-[#E4572E] hover:bg-[#CC4E2A] text-white font-semibold rounded-lg transition-colors"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
