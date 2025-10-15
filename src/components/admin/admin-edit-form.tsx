"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import type * as z from "zod";

// Fix: Separated imports to pull `Listing` type from data layer and action/schema from the actions layer.
import { UpdateListingSchema, updateListing } from "@/actions/listings";
import { Button } from "@/components/ui/button";
import type { Listing } from "@/data/listings";

interface AdminEditFormProps {
  listing: Listing;
  categories?: Array<{ id: string; name: string }>;
  onFinished?: (result: Awaited<ReturnType<typeof updateListing>>) => void;
}

export function AdminEditForm({ listing, categories, onFinished }: AdminEditFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof UpdateListingSchema>>({
    resolver: zodResolver(UpdateListingSchema),
    defaultValues: {
      listing_name: listing.listing_name || "",
      status: (listing.status as "Live" | "Pending" | "Draft" | "Archived" | "Rejected") || "Draft",
      website: listing.website || "",
      email: listing.email || "",
      phone: listing.phone || "",
      what_you_offer: listing.what_you_offer || "",
      is_claimed: listing.is_claimed || false,
    },
  });

  const onSubmit = (values: z.infer<typeof UpdateListingSchema>) => {
    console.log("Form submission started with values:", values);
    startTransition(() => {
      console.log("Starting updateListing with ID:", listing.id);
      updateListing(listing.id, values).then((res) => {
        console.log("UpdateListing response:", res);
        // Pass the entire response to the parent component to handle side-effects
        if (onFinished) {
          onFinished(res);
        }
      }).catch((error) => {
        console.error("UpdateListing error:", error);
        if (onFinished) {
          onFinished({ status: "error", message: "An unexpected error occurred." });
        }
      });
    });
  };

  // Debug form state
  console.log("Form state:", {
    isValid: form.formState.isValid,
    errors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
    isPending
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
      console.error("Form validation errors:", errors);
    })} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Listing Name */}
        <div className="space-y-1">
          <label htmlFor="listing_name">Listing Name</label>
          <input
            id="listing_name"
            {...form.register("listing_name")}
            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            disabled={isPending}
          />
          {form.formState.errors.listing_name && (
            <p className="text-sm text-red-500">
              {form.formState.errors.listing_name.message}
            </p>
          )}
              </div>

        {/* Status */}
        <div className="space-y-1">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            {...form.register("status")}
            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            disabled={isPending}
          >
            <option value="Live">Live</option>
            <option value="Pending">Pending</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
            <option value="Rejected">Rejected</option>
          </select>
              </div>

        {/* Website */}
        <div className="space-y-1">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            {...form.register("website")}
            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            disabled={isPending}
          />
          {form.formState.errors.website && (
            <p className="text-sm text-red-500">
              {form.formState.errors.website.message}
            </p>
          )}
          {form.watch("website") && form.watch("website").length > 0 && !form.watch("website").match(/^https?:\/\/.+\..+/) && (
            <p className="text-sm text-yellow-600">
              Warning: This doesn't look like a valid URL. Please check the format.
            </p>
          )}
            </div>

        {/* Email */}
        <div className="space-y-1">
          <label htmlFor="email">Email</label>
          <input
                id="email"
            {...form.register("email")}
            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            disabled={isPending}
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-500">
              {form.formState.errors.email.message}
            </p>
          )}
          {form.watch("email") && form.watch("email").length > 0 && !form.watch("email").match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) && (
            <p className="text-sm text-yellow-600">
              Warning: This doesn't look like a valid email address. Please check the format.
            </p>
          )}
              </div>

        {/* Phone */}
        <div className="space-y-1">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            {...form.register("phone")}
            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            disabled={isPending}
                />
              </div>

        {/* Is Claimed Checkbox */}
        <div className="flex items-center gap-2 pt-4">
          <input
            type="checkbox"
            id="is_claimed"
            {...form.register("is_claimed")}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            disabled={isPending}
          />
          <label htmlFor="is_claimed">Listing is Claimed</label>
              </div>
            </div>

      {/* What You Offer */}
      <div className="space-y-1">
        <label htmlFor="what_you_offer">What You Offer</label>
        <textarea
          id="what_you_offer"
          {...form.register("what_you_offer")}
          rows={4}
          className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
          disabled={isPending}
                  />
                </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() =>
            onFinished?.({ status: "error", message: "Update cancelled." })
          }
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
      </form>
  );
}
