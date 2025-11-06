"use client";

import { claimListing } from "@/actions/claim-listing";
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
import { Textarea } from "@/components/ui/textarea";
import { type ClaimListingFormData, ClaimListingSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ClaimFormProps {
  listingId: string;
  listingName: string;
  onSuccess?: () => void;
  className?: string;
}

export function ClaimForm({
  listingId,
  listingName,
  onSuccess,
  className,
}: ClaimFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<ClaimListingFormData>({
    resolver: zodResolver(ClaimListingSchema),
    defaultValues: {
      listingId,
      message: "",
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      try {
        const result = await claimListing(data.listingId, data.message);

        if (result.success) {
          toast.success(result.title || "Success!", {
            description: result.message,
          });
          form.reset();

          // Call optional onSuccess callback
          onSuccess?.();

          // Redirect to vendor dashboard after successful claim
          setTimeout(() => {
            router.push("/dashboard/vendor/listing");
          }, 1000);
        } else {
          toast.error(result.title || "Claim Failed", {
            description: result.message,
          });
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
        <CardTitle className="text-xl font-bold">Claim This Listing</CardTitle>
        <CardDescription>
          Submit a claim for "{listingName}" to become the owner
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Message */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Why should you own this listing? *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please explain why you should be the owner of this listing. Include any relevant business information, credentials, or proof of ownership..."
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
                  Submitting Claim...
                </>
              ) : (
                "Submit Claim"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
