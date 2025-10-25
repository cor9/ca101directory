"use client";

import { approveListing, rejectListing } from "@/actions/admin-listing-actions";
import { adminResendClaimEmail } from "@/actions/admin-resend-claim";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ListingActionsProps {
  listingId: string;
  listingName: string;
  showApproveReject?: boolean;
}

export function ListingActions({
  listingId,
  listingName,
  showApproveReject = true,
}: ListingActionsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    if (!confirm(`Approve "${listingName}"?`)) return;

    setIsLoading(true);
    const result = await approveListing(listingId);
    setIsLoading(false);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleReject = async () => {
    if (
      !confirm(`Reject "${listingName}"? This will hide it from the directory.`)
    )
      return;

    setIsLoading(true);
    const result = await rejectListing(listingId);
    setIsLoading(false);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    const result = await adminResendClaimEmail(listingId);
    setIsLoading(false);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {showApproveReject && (
        <>
          <Button
            size="sm"
            variant="default"
            onClick={handleApprove}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleReject}
            disabled={isLoading}
          >
            <XCircle className="w-4 h-4 mr-1" />
            Reject
          </Button>
        </>
      )}
      <Button
        size="sm"
        variant="secondary"
        onClick={handleResend}
        disabled={isLoading}
      >
        <Mail className="w-4 h-4 mr-1" />
        Resend
      </Button>
    </div>
  );
}
