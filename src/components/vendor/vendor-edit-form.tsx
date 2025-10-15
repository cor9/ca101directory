"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type * as z from "zod";

import { updateListing } from "@/actions/listings";
import { UpdateListingSchema } from "@/lib/validations/listings";
import { Button } from "@/components/ui/button";
import type { Listing } from "@/data/listings";

interface VendorEditFormProps {
  listing: Listing;
  onFinished: () => void;
}

// A vendor might not be allowed to change all fields.
// We create a specific schema by omitting fields vendors cannot change.
const VendorUpdateSchema = UpdateListingSchema.omit({
  status: true, // Vendors shouldn't change their own status
  is_claimed: true, // This is an admin/system field
});

export function VendorEditForm({ listing, onFinished }: VendorEditFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof VendorUpdateSchema>>({
    resolver: zodResolver(VendorUpdateSchema),
    defaultValues: {
      listing_name: listing.listing_name || "",
      website: listing.website || "",
      email: listing.email || "",
      phone: listing.phone || "",
      what_you_offer: listing.what_you_offer || "",
    },
  });

  const onSubmit = (values: z.infer<typeof VendorUpdateSchema>) => {
    startTransition(() => {
      // We need to merge back the original status and is_claimed values
      // so the server action validation passes, as the vendor is not allowed to change them.
      const fullValues = {
        ...values,
        // FIX: Set status to 'Pending' for admin re-approval on any vendor edit.
        status: "Pending" as const,
        is_claimed: !!listing.is_claimed,
      };

      updateListing(listing.id, fullValues).then((res) => {
        if (res.status === "error") {
          toast.error(res.message);
        } else {
          // FIX: Updated toast message for better UX, informing user about review process.
          toast.success("Listing has been submitted for review.");
          onFinished();
        }
      });
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          onClick={onFinished}
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
