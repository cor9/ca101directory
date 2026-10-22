"use client";

import { trackVendorClaimClick } from "@/components/analytics/ga-events";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const CLAIM_BTN =
  "border-zinc-900 bg-zinc-900 text-white hover:border-brass-dark hover:bg-brass-dark";

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

  // If user is not authenticated, redirect to sign up with return URL
  if (!session) {
    const signUpUrl = `/auth/register?callbackUrl=${encodeURIComponent(`/claim/listing/${listingId}`)}`;

    return (
      <Button asChild className={cn(CLAIM_BTN, className)}>
        <Link
          href={signUpUrl}
          onClick={() =>
            trackVendorClaimClick({ vendor_id: listingId, source: "directory" })
          }
        >
          Sign Up to Claim This Listing
        </Link>
      </Button>
    );
  }

  // If authenticated, redirect to dedicated claim page (Bug #3 fix)
  const claimUrl = `/claim/listing/${listingId}`;

  return (
    <Button asChild className={cn(CLAIM_BTN, className)}>
      <Link
        href={claimUrl}
        onClick={() =>
          trackVendorClaimClick({ vendor_id: listingId, source: "directory" })
        }
      >
        Claim This Listing
      </Link>
    </Button>
  );
}
