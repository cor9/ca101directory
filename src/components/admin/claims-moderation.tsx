"use client";

import { Icons } from "@/components/icons/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PendingClaim {
  id: string;
  message: string;
  created_at: string;
  listing_id: string;
  vendor_id: string;
  profiles?: {
    full_name?: string;
    email?: string;
  };
  listings?: {
    businessName?: string;
  };
}

export function ClaimsModeration() {
  const [claims, setClaims] = useState<PendingClaim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPendingClaims() {
      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from("claims")
          .select(`
            id,
            message,
            created_at,
            listing_id,
            vendor_id,
            profiles!claims_vendor_id_fkey (
              full_name,
              email
            ),
            listings!claims_listing_id_fkey (
              businessName
            )
          `)
          .eq("approved", false)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching pending claims:", error);
          return;
        }

        setClaims(data || []);
      } catch (error) {
        console.error("Error fetching pending claims:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPendingClaims();
  }, []);

  const handleApprove = async (
    claimId: string,
    listingId: string,
    vendorId: string,
  ) => {
    try {
      const supabase = createClient();

      // Start a transaction-like operation
      // First, update the listing
      const { error: listingError } = await supabase
        .from("listings")
        .update({
          owner_id: vendorId,
          claimed: true,
        })
        .eq("id", listingId);

      if (listingError) {
        console.error("Error updating listing:", listingError);
        toast.error("Failed to approve claim");
        return;
      }

      // Then, mark the claim as approved
      const { error: claimError } = await supabase
        .from("claims")
        .update({ approved: true })
        .eq("id", claimId);

      if (claimError) {
        console.error("Error approving claim:", claimError);
        toast.error("Failed to approve claim");
        return;
      }

      setClaims(claims.filter((claim) => claim.id !== claimId));
      toast.success("Claim approved successfully");
    } catch (error) {
      console.error("Error approving claim:", error);
      toast.error("Failed to approve claim");
    }
  };

  const handleReject = async (claimId: string) => {
    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("claims")
        .delete()
        .eq("id", claimId);

      if (error) {
        console.error("Error rejecting claim:", error);
        toast.error("Failed to reject claim");
        return;
      }

      setClaims(claims.filter((claim) => claim.id !== claimId));
      toast.success("Claim rejected successfully");
    } catch (error) {
      console.error("Error rejecting claim:", error);
      toast.error("Failed to reject claim");
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Claims</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (claims.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Claims</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No pending claims to review.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Claims ({claims.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {claims.map((claim) => (
          <div key={claim.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">
                  {claim.listings?.businessName || "Unknown Listing"}
                </h3>
                <Badge variant="outline">Claim Request</Badge>
              </div>
              <Badge variant="secondary" className="text-xs">
                {new Date(claim.created_at).toLocaleDateString()}
              </Badge>
            </div>

            <div className="text-sm">
              <div className="font-medium mb-1">Claimed by:</div>
              <div className="text-muted-foreground">
                {claim.profiles?.full_name || "Unknown User"}
                {claim.profiles?.email && (
                  <span className="ml-2">({claim.profiles.email})</span>
                )}
              </div>
            </div>

            <div className="text-sm">
              <div className="font-medium mb-1">Message:</div>
              <p className="text-muted-foreground">{claim.message}</p>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() =>
                  handleApprove(claim.id, claim.listing_id, claim.vendor_id)
                }
                className="bg-green-600 hover:bg-green-700"
              >
                <Icons.check className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleReject(claim.id)}
              >
                <Icons.x className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
