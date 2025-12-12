"use client";

import VendorCardSmall from "./VendorCardSmall";

interface Vendor {
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
}

interface PopularVendorsProps {
  vendors: Vendor[];
}

export default function PopularVendors({ vendors }: PopularVendorsProps) {
  if (!vendors || vendors.length === 0) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex-shrink-0 w-64 h-32 bg-[#121620] rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
      {vendors.map((vendor) => (
        <VendorCardSmall key={vendor.id} vendor={vendor} />
      ))}
    </div>
  );
}
