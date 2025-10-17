"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getListingAverageRating, getListingReviews } from "@/data/reviews";
import type { Review } from "@/data/reviews";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

interface ReviewsDisplayProps {
  listingId: string;
  className?: string;
}

export function ReviewsDisplay({ listingId, className }: ReviewsDisplayProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState({ average: 0, count: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const [reviewsData, ratingData] = await Promise.all([
          getListingReviews(listingId),
          getListingAverageRating(listingId),
        ]);
        setReviews(reviewsData);
        setAverageRating(ratingData);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [listingId]);

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className={cn("text-center py-8", className)}>
        <p className="text-surface">
          No reviews yet. Be the first to review!
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Average Rating */}
      {averageRating.count > 0 && (
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "h-5 w-5",
                  star <= Math.round(averageRating.average)
                    ? "text-yellow-400 fill-current"
                    : "text-surface",
                )}
              />
            ))}
          </div>
          <div className="text-sm text-surface">
            <span className="font-medium">{averageRating.average}</span> out of
            5
            <span className="ml-1">
              ({averageRating.count} review
              {averageRating.count !== 1 ? "s" : ""})
            </span>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "h-4 w-4",
                          star <= review.stars
                            ? "text-yellow-400 fill-current"
                            : "text-surface",
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">
                    {review.user?.name || review.user?.email || "Anonymous"}
                  </span>
                </div>
                <span className="text-xs text-surface">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{review.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
