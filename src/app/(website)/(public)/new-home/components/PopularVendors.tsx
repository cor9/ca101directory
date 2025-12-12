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
      <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex-shrink-0 min-w-[240px] h-48 bg-bg-dark-2 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-2">
      {vendors.map((vendor) => (
        <VendorCardSmall key={vendor.id} vendor={vendor} />
      ))}
    </div>
  );
}
