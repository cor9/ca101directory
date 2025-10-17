"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StarRating } from "@/components/ui/star-rating";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  parent_id: string;
  profiles?: {
    full_name?: string;
  } | null;
}

interface ReviewsDisplayProps {
  vendorId: string;
  className?: string;
}

export function ReviewsDisplay({ vendorId, className }: ReviewsDisplayProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from("reviews")
          .select(`
            id,
            rating,
            comment,
            created_at,
            parent_id,
            profiles!reviews_parent_id_fkey (
              full_name
            )
          `)
          .eq("vendor_id", vendorId)
          .eq("approved", true)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching reviews:", error);
          return;
        }

        setReviews(
          (data || []).map((review) => ({
            ...review,
            profiles: Array.isArray(review.profiles)
              ? review.profiles[0]
              : review.profiles,
          })),
        );

        // Calculate average rating
        if (data && data.length > 0) {
          const total = data.reduce((sum, review) => sum + review.rating, 0);
          setAverageRating(total / data.length);
          setTotalReviews(data.length);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [vendorId]);

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (totalReviews === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-surface">No reviews yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Reviews</CardTitle>
          <div className="flex items-center gap-2">
            <StarRating value={Math.round(averageRating)} readonly size="sm" />
            <span className="text-sm text-surface">
              {averageRating.toFixed(1)} ({totalReviews} review
              {totalReviews !== 1 ? "s" : ""})
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border-b pb-4 last:border-b-0 last:pb-0"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <StarRating value={review.rating} readonly size="sm" />
                <span className="text-sm font-medium">
                  {review.profiles?.full_name || "Anonymous"}
                </span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {new Date(review.created_at).toLocaleDateString()}
              </Badge>
            </div>
            <p className="text-sm text-surface">{review.comment}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
