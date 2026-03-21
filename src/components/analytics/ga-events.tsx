"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { useEffect } from "react";

export function trackVendorProfileView(params: {
  vendor_id: string;
  category: string;
  listing_type: string;
  is_claimed: boolean;
}) {
  sendGAEvent({
    event: "vendor_profile_view",
    ...params,
  });
}

export function trackVendorClaimClick(params: {
  vendor_id: string;
  source: string;
}) {
  sendGAEvent({
    event: "vendor_claim_click",
    ...params,
  });
}

export function trackVendorUpgradeClick(params: {
  plan_type: string;
  vendor_id?: string;
}) {
  sendGAEvent({
    event: "vendor_upgrade_click",
    ...params,
  });
}

export function trackVendorFavorited(params: {
  vendor_id: string;
  category: string;
}) {
  sendGAEvent({
    event: "vendor_favorited",
    ...params,
  });
}

export function trackDirectorySearch(params: {
  query: string;
  category: string;
}) {
  sendGAEvent({
    event: "directory_search",
    ...params,
  });
}

/**
 * Client component to fire the page view event once when the page loads
 */
export function VendorProfileViewTracker(params: Parameters<typeof trackVendorProfileView>[0]) {
  useEffect(() => {
    trackVendorProfileView(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run exactly once on mount
  return null;
}
