"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
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
  const { data: session } = useSession();

  // Don't show button if listing is already claimed
  if (claimed) {
    return null;
  }

  // Don't show button if user already owns this listing
  if (ownerId && ownerId === session?.user?.id) {
    return null;
  }

  // Create slug from listing name for URL
  const slug = listingName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  return (
    <Button asChild variant="outline" className={className}>
      <Link href={`/claim-upgrade/${slug}`}>
        Claim This Listing
      </Link>
    </Button>
  );
}
