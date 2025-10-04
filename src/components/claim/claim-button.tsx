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

  // If user is not authenticated, redirect to sign up with return URL
  if (!session) {
    const signUpUrl = `/auth/register?callbackUrl=${encodeURIComponent(`/submit?claim=true&listingId=${listingId}`)}`;

    return (
      <Button asChild variant="outline" className={className}>
        <Link href={signUpUrl}>Sign Up to Claim This Listing</Link>
      </Button>
    );
  }

  // If authenticated, redirect to submission form with claim parameters
  const claimUrl = `/submit?claim=true&listingId=${listingId}`;

  return (
    <Button asChild variant="outline" className={className}>
      <Link href={claimUrl}>Claim This Listing</Link>
    </Button>
  );
}
