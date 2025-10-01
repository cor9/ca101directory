"use client";

import { Button } from "@/components/ui/button";
import { updateReviewStatus } from "@/data/reviews";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ReviewActionsProps {
  reviewId: string;
}

export function ReviewActions({ reviewId }: ReviewActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      await updateReviewStatus(reviewId, "approved");
      toast.success("Review approved successfully!");
      router.refresh();
    } catch (error) {
      console.error("Error approving review:", error);
      toast.error("Failed to approve review");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      await updateReviewStatus(reviewId, "rejected");
      toast.success("Review rejected");
      router.refresh();
    } catch (error) {
      console.error("Error rejecting review:", error);
      toast.error("Failed to reject review");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        onClick={handleApprove}
        disabled={isLoading}
        className="bg-green-600 hover:bg-green-700"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle className="h-4 w-4" />
        )}
        Approve
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={handleReject}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <XCircle className="h-4 w-4" />
        )}
        Reject
      </Button>
    </div>
  );
}
