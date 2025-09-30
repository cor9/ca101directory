"use client";

import { Icons } from "@/components/icons/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StarRating } from "@/components/ui/star-rating";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PendingReview {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  vendor_id: string;
  parent_id: string;
  profiles?: {
    full_name?: string;
  };
  listings?: {
    businessName?: string;
  };
}

export function ReviewModeration() {
  const [reviews, setReviews] = useState<PendingReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPendingReviews() {
      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from("reviews")
          .select(`
            id,
            rating,
            comment,
            created_at,
            vendor_id,
            parent_id,
            profiles!reviews_parent_id_fkey (
              full_name
            ),
            listings!reviews_vendor_id_fkey (
              businessName
            )
          `)
          .eq("approved", false)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching pending reviews:", error);
          return;
        }

        setReviews(data || []);
      } catch (error) {
        console.error("Error fetching pending reviews:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPendingReviews();
  }, []);

  const handleApprove = async (reviewId: string) => {
    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("reviews")
        .update({ approved: true })
        .eq("id", reviewId);

      if (error) {
        console.error("Error approving review:", error);
        toast.error("Failed to approve review");
        return;
      }

      setReviews(reviews.filter((review) => review.id !== reviewId));
      toast.success("Review approved successfully");
    } catch (error) {
      console.error("Error approving review:", error);
      toast.error("Failed to approve review");
    }
  };

  const handleReject = async (reviewId: string) => {
    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId);

      if (error) {
        console.error("Error rejecting review:", error);
        toast.error("Failed to reject review");
        return;
      }

      setReviews(reviews.filter((review) => review.id !== reviewId));
      toast.success("Review rejected successfully");
    } catch (error) {
      console.error("Error rejecting review:", error);
      toast.error("Failed to reject review");
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Reviews</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No pending reviews to moderate.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Reviews ({reviews.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StarRating value={review.rating} readonly size="sm" />
                <span className="font-medium">
                  {review.profiles?.full_name || "Anonymous"}
                </span>
                <span className="text-muted-foreground">for</span>
                <span className="font-medium">
                  {review.listings?.businessName || "Unknown Vendor"}
                </span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {new Date(review.created_at).toLocaleDateString()}
              </Badge>
            </div>

            <p className="text-sm">{review.comment}</p>

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleApprove(review.id)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Icons.check className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleReject(review.id)}
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
