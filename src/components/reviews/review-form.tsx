"use client";

import { submitReview } from "@/actions/submit-review";
import { Icons } from "@/components/icons/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { StarRating } from "@/components/ui/star-rating";
import { Textarea } from "@/components/ui/textarea";
import { type ReviewFormData, ReviewSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ReviewFormProps {
  vendorId: string;
  vendorName: string;
  className?: string;
}

export function ReviewForm({
  vendorId,
  vendorName,
  className,
}: ReviewFormProps) {
  const { data: session, status } = useSession();
  const [isPending, startTransition] = useTransition();

  // Don't show form if user is not logged in
  if (status === "loading") {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center text-paper">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (!session?.user) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Write a Review</CardTitle>
          <CardDescription>
            Share your experience with {vendorName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-paper">
              You must be logged in as a parent to write a review.
            </p>
            <div className="flex gap-2 justify-center">
              <Button asChild variant="outline">
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">Sign Up as Parent</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Only parents can submit reviews
  if (session.user.role !== "parent") {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Write a Review</CardTitle>
          <CardDescription>
            Share your experience with {vendorName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-paper">
              Only parents can submit reviews for vendors.
            </p>
            <p className="text-sm text-paper">
              If you're a parent, please make sure you're logged in with the
              correct account.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: {
      vendorId,
      rating: 0,
      comment: "",
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      try {
        const result = await submitReview(data);

        if (result.success) {
          toast.success(result.message);
          form.reset();
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error("Form submission error:", error);
        toast.error("An unexpected error occurred. Please try again.");
      }
    });
  });

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Write a Review</CardTitle>
        <CardDescription>
          Share your experience with {vendorName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Rating */}
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating *</FormLabel>
                  <FormControl>
                    <StarRating
                      value={field.value}
                      onChange={field.onChange}
                      size="lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Comment */}
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Review *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your experience with this vendor..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Review...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
