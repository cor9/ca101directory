"use client";

import { useState } from "react";
import { updateReviewStatus, deleteReview } from "@/actions/admin-reviews";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface Review {
  id: string;
  listing_id: string;
  user_id: string;
  stars: number;
  text: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  listing?: {
    id: string;
    listing_name: string;
    slug: string;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

interface AdminReviewQueueProps {
  reviews: Review[];
}

export function AdminReviewQueue({ reviews: initialReviews }: AdminReviewQueueProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [loading, setLoading] = useState<string | null>(null);

  const filteredReviews = reviews.filter((review) => {
    if (filter === "all") return true;
    return review.status === filter;
  });

  const pendingCount = reviews.filter((r) => r.status === "pending").length;
  const approvedCount = reviews.filter((r) => r.status === "approved").length;
  const rejectedCount = reviews.filter((r) => r.status === "rejected").length;

  const handleApprove = async (reviewId: string) => {
    setLoading(reviewId);
    try {
      const result = await updateReviewStatus(reviewId, "approved");
      if (result.success) {
        setReviews(
          reviews.map((r) =>
            r.id === reviewId ? { ...r, status: "approved" as const } : r
          )
        );
        toast.success("Review approved and published");
      } else {
        toast.error(result.error || "Failed to approve review");
      }
    } catch (error) {
      toast.error("Failed to approve review");
    } finally {
      setLoading(null);
    }
  };

  const handleReject = async (reviewId: string) => {
    setLoading(reviewId);
    try {
      const result = await updateReviewStatus(reviewId, "rejected");
      if (result.success) {
        setReviews(
          reviews.map((r) =>
            r.id === reviewId ? { ...r, status: "rejected" as const } : r
          )
        );
        toast.success("Review rejected");
      } else {
        toast.error(result.error || "Failed to reject review");
      }
    } catch (error) {
      toast.error("Failed to reject review");
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to permanently delete this review?")) {
      return;
    }

    setLoading(reviewId);
    try {
      const result = await deleteReview(reviewId);
      if (result.success) {
        setReviews(reviews.filter((r) => r.id !== reviewId));
        toast.success("Review deleted");
      } else {
        toast.error(result.error || "Failed to delete review");
      }
    } catch (error) {
      toast.error("Failed to delete review");
    } finally {
      setLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderStars = (stars: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= stars ? "text-yellow-500" : "text-gray-300"}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Review Queue</h1>
        <p className="text-gray-600 mt-2">
          Moderate user reviews and ratings for listings
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-white rounded-lg p-4 border">
          <div className="text-2xl font-bold text-gray-900">{reviews.length}</div>
          <div className="text-sm text-gray-600">Total Reviews</div>
        </div>
        <div className="bg-white rounded-lg p-4 border">
          <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white rounded-lg p-4 border">
          <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
          <div className="text-sm text-gray-600">Approved</div>
        </div>
        <div className="bg-white rounded-lg p-4 border">
          <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
          <div className="text-sm text-gray-600">Rejected</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
          size="sm"
        >
          All ({reviews.length})
        </Button>
        <Button
          variant={filter === "pending" ? "default" : "outline"}
          onClick={() => setFilter("pending")}
          size="sm"
        >
          Pending ({pendingCount})
        </Button>
        <Button
          variant={filter === "approved" ? "default" : "outline"}
          onClick={() => setFilter("approved")}
          size="sm"
        >
          Approved ({approvedCount})
        </Button>
        <Button
          variant={filter === "rejected" ? "default" : "outline"}
          onClick={() => setFilter("rejected")}
          size="sm"
        >
          Rejected ({rejectedCount})
        </Button>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-lg p-8 border text-center">
            <p className="text-gray-600">No reviews found</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-lg p-6 border hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {review.listing?.listing_name || "Unknown Listing"}
                    </h3>
                    {getStatusBadge(review.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>By: {review.user?.name || review.user?.email || "Unknown User"}</span>
                    <span>•</span>
                    <span>{new Date(review.created_at).toLocaleDateString()}</span>
                    {review.listing?.slug && (
                      <>
                        <span>•</span>
                        <a
                          href={`/${review.listing.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-orange hover:underline flex items-center gap-1"
                        >
                          View Listing <ExternalLink className="h-3 w-3" />
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-3">{renderStars(review.stars)}</div>

              {/* Review Text */}
              <p className="text-gray-900 mb-4">{review.text}</p>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {review.status !== "approved" && (
                  <Button
                    onClick={() => handleApprove(review.id)}
                    disabled={loading === review.id}
                    size="sm"
                    variant="default"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                )}
                {review.status !== "rejected" && (
                  <Button
                    onClick={() => handleReject(review.id)}
                    disabled={loading === review.id}
                    size="sm"
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                )}
                <Button
                  onClick={() => handleDelete(review.id)}
                  disabled={loading === review.id}
                  size="sm"
                  variant="outline"
                  className="border-red-500 text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

