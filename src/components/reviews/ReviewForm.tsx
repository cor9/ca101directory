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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const ReviewSchema = z.object({
  stars: z.number().min(1, "Please select a rating").max(5),
  text: z.string().min(10, "Review must be at least 10 characters"),
});

interface ReviewFormProps {
  listingId: string;
  listingName: string;
  onReviewSubmitted?: () => void;
  className?: string;
}

export function ReviewForm({
  listingId,
  listingName,
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

  if (!session?.user) {
    return (
      <div className={cn("p-4 border rounded-lg bg-muted/50", className)}>
        <p className="text-sm text-muted-foreground">
          Please log in to write a review for {listingName}.
        </p>
      </div>
    );
  }

  if (isChecking) {
    return (
      <div className={cn("p-4 border rounded-lg", className)}>
        <p className="text-sm text-muted-foreground">Loading...</p>
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
          Thank you! You've already submitted a review for {listingName}. It
          will be reviewed before being published.
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
                              : "text-gray-300 hover:text-yellow-200",
                          )}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">
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
