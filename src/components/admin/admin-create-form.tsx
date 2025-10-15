"use client";

import { createListing } from "@/actions/listings";
import { CreateListingSchema } from "@/lib/validations/listings";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type * as z from "zod";

export function AdminCreateForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof CreateListingSchema>>({
    resolver: zodResolver(CreateListingSchema),
    defaultValues: {
      listing_name: "",
      status: "Draft",
      website: "",
    email: "",
    phone: "",
      what_you_offer: "",
    },
  });

  const onSubmit = (values: z.infer<typeof CreateListingSchema>) => {
    startTransition(() => {
      createListing(values).then((res) => {
        if (res?.status === "error") {
          toast.error(res.message);
        } else {
          toast.success("Listing created successfully!");
          // Redirect back to admin dashboard
          router.push("/dashboard/admin");
        }
      }).catch((error) => {
        console.error("CreateListing error:", error);
        toast.error("An unexpected error occurred.");
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
              {form.formState.errors.listing_name?.message}
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
            <option value="Draft">Draft</option>
            <option value="Pending">Pending</option>
            <option value="Live">Live</option>
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
              {form.formState.errors.website?.message}
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
              {form.formState.errors.email?.message}
            </p>
          )}
          {form.watch("email") && form.watch("email").length > 0 && !form.watch("email").match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) && (
            <p className="text-sm text-yellow-600">
              Warning: This doesn't look like a valid email address. Please check the format.
            </p>
          )}
              </div>

        {/* Phone */}
        <div className="space-y-1 md:col-span-2">
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
        <label htmlFor="what_you_offer">What You Offer (Short Bio)</label>
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
          onClick={() => router.back()}
          disabled={isPending}
              >
                Cancel
              </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create Listing"}
              </Button>
            </div>
      </form>
  );
}