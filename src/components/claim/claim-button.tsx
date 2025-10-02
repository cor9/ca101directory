"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ClaimButtonProps {
  listingId: string;
  listingName: string;
  claimed: boolean;
  ownerId?: string;
  className?: string;
}

export function ClaimButton({
  listingId,
  listingName,
  claimed,
  ownerId,
  className,
}: ClaimButtonProps) {
  // Don't show button if listing is already claimed
  if (claimed) {
    return null;
  };

  // Create slug from listing name for URL
  const slug = listingName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  // Show button for all unclaimed listings
  // The claim-upgrade page will handle authentication
  return (
    <Button asChild variant="outline" className={className}>
      <Link href={`/claim-upgrade/${slug}`}>
        Claim This Listing
      </Link>
    </Button>
  );
}
