"use client";

import { claimListing } from "@/actions/listings";
import { Button } from "@/components/ui/button";
import { Building, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

type UnclaimedListing = {
  id: string;
  listing_name: string | null;
  city: string | null;
  state: string | null;
};

interface ClaimListingClientProps {
  listings: UnclaimedListing[];
}

export function ClaimListingClient({ listings }: ClaimListingClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const filteredListings = useMemo(() => {
    if (!searchTerm.trim()) {
      return listings;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return listings.filter((listing) =>
      listing.listing_name?.toLowerCase().includes(lowercasedTerm),
    );
  }, [listings, searchTerm]);

  const handleClaim = (listingId: string) => {
    setClaimingId(listingId);
    startTransition(() => {
      claimListing(listingId).then((res) => {
        if (res.status === "success") {
          toast.success(res.message);
          // Redirect to the main vendor dashboard after successful claim
          router.push("/dashboard/vendor");
        } else {
          toast.error(res.message);
        }
        setClaimingId(null);
      });
    });
  };

  return (
    <div className="bg-card rounded-lg p-6 border">
      <div className="relative mb-6">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-paper"
          size={20}
        />
        <input
          type="text"
          placeholder="Search for your business name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-background border border-input rounded-md pl-10 pr-4 py-2 text-base focus:ring-2 focus:ring-primary focus:outline-none"
          aria-label="Search for your business"
        />
      </div>

      <div className="space-y-4">
        {filteredListings.length > 0 ? (
          filteredListings.map((listing) => (
            <div
              key={listing.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border rounded-md bg-muted/50"
            >
              <div className="flex items-center gap-4">
                <Building className="h-8 w-8 text-paper flex-shrink-0" />
                <div>
                  <p className="font-semibold text-paper">
                    {listing.listing_name}
                  </p>
                  <p className="text-sm text-paper">
                    {listing.city}, {listing.state}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => handleClaim(listing.id)}
                disabled={isPending}
                className="w-full sm:w-auto flex-shrink-0"
                aria-label={`Claim ${listing.listing_name}`}
              >
                {isPending && claimingId === listing.id
                  ? "Submitting..."
                  : "Claim this Listing"}
              </Button>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-paper">
            <p className="font-semibold text-lg">
              No matching businesses found.
            </p>
            <p className="mt-1">
              Try a different search term or create a new listing if yours is
              not in our system yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
