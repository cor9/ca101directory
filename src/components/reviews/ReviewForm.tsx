"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { hasUserReviewed, submitReview } from "@/data/reviews";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const ReviewSchema = z.object({
  stars: z.number().min(1, "Please select a rating").max(5),
  text: z
    .string()
    .min(10, "Review must be at least 10 characters")
    .max(500, "Review must be 500 characters or less"),
});

interface ReviewFormProps {
  listingId: string;
  listingName?: string;
  listingOwnerId?: string;
  onReviewSubmitted?: () => void;
  className?: string;
}

export function ReviewForm({
  listingId,
  listingName,
  listingOwnerId,
  onReviewSubmitted,
  className,
}: ReviewFormProps) {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const form = useForm<z.infer<typeof ReviewSchema>>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: {
      stars: 0,
      text: "",
    },
  });

  // Check if user has already reviewed this listing
  useState(() => {
    if (session?.user?.id) {
      hasUserReviewed(session.user.id, listingId)
        .then(setHasReviewed)
        .catch(console.error)
        .finally(() => setIsChecking(false));
    } else {
      setIsChecking(false);
    }
  });

  const onSubmit = async (values: z.infer<typeof ReviewSchema>) => {
    if (!session?.user?.id) {
      toast.error("Please log in to submit a review");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitReview(listingId, session.user.id, values.stars, values.text);
      toast.success(
        "Review submitted! It will be reviewed before being published.",
      );
      form.reset();
      setHasReviewed(true);
      onReviewSubmitted?.();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if user is the owner of this listing
  const isOwner =
    session?.user?.id && listingOwnerId && session.user.id === listingOwnerId;

  if (isOwner) {
    return (
      <div
        className={cn(
          "p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20",
          className,
        )}
      >
        <div className="text-center space-y-3">
          <p className="bauhaus-heading text-lg text-blue-700 dark:text-blue-300">
            You cannot review your own listing.
          </p>
          <p className="bauhaus-body text-base text-blue-600 dark:text-blue-400 font-semibold">
            Only parents and families can review vendor listings.
          </p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className={cn("p-4 border rounded-lg bg-muted/50", className)}>
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-900">
            Create a free parent account to write reviews
            {listingName ? ` for ${listingName}` : ""}.
          </p>
          <div className="flex gap-2 justify-center">
            <Button asChild size="sm">
              <Link href="/auth/register?role=parent">Sign Up</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/auth/login">Log In</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isChecking) {
    return (
      <div className={cn("p-4 border rounded-lg", className)}>
        <p className="text-sm text-gray-900">Loading...</p>
      </div>
    );
  }

  if (hasReviewed) {
    return (
      <div
        className={cn(
          "p-4 border rounded-lg bg-green-50 dark:bg-green-950/20",
          className,
        )}
      >
        <p className="text-sm text-green-700 dark:text-green-300">
          Thank you! You've already submitted a review
          {listingName ? ` for ${listingName}` : ""}. It will be reviewed before
          being published.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("p-6 border rounded-lg", className)}>
      <h3 className="text-lg font-semibold mb-4">Write a Review</h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="stars"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating *</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => field.onChange(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={cn(
                            "h-6 w-6 transition-colors",
                            star <= field.value
                              ? "text-yellow-400 fill-current"
                              : "text-gray-900 hover:text-yellow-200",
                          )}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-900">
                      {field.value > 0 &&
                        `${field.value} star${field.value !== 1 ? "s" : ""}`}
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Review *</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Share your experience with this vendor..."
                    className="min-h-[100px]"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
