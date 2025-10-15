"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormRegister, type FieldError } from "react-hook-form";
import type * as z from "zod";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
// Fix: Separated imports to pull `Listing` type from data layer and action/schema from the actions layer.
import { UpdateListingSchema, updateListing } from "@/actions/listings";
import type { Listing } from "@/data/listings";

// Form input type with strings for array fields (before transformation)
type FormInputType = Omit<z.infer<typeof UpdateListingSchema>, 'categories' | 'age_range' | 'region'> & {
  categories: string;
  age_range: string;
  region: string;
};

interface AdminEditFormProps {
  listing: Listing;
  onFinished: (result: Awaited<ReturnType<typeof updateListing>>) => void;
}

interface FormInputProps {
  id: keyof FormInputType;
  label: string;
  register: UseFormRegister<FormInputType>;
  error?: FieldError;
  disabled?: boolean;
  helpText?: string | null;
  type?: string;
}

interface FormSelectProps {
  id: keyof FormInputType;
  label: string;
  register: UseFormRegister<FormInputType>;
  children: React.ReactNode;
  disabled?: boolean;
}

interface FormCheckboxProps {
  id: keyof FormInputType;
  label: string;
  register: UseFormRegister<FormInputType>;
  disabled?: boolean;
}

interface FormTextareaProps {
  id: keyof FormInputType;
  label: string;
  register: UseFormRegister<FormInputType>;
  disabled?: boolean;
  rows?: number;
}

export function AdminEditForm({ listing, onFinished }: AdminEditFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormInputType>({
    resolver: zodResolver(UpdateListingSchema),
    defaultValues: {
      listing_name: listing.listing_name || "",
      status: (listing.status as "Live" | "Pending" | "Draft" | "Archived" | "Rejected") || "Draft",
      website: listing.website || "",
      email: listing.email || "",
      phone: listing.phone || "",
      what_you_offer: listing.what_you_offer || "",
      is_claimed: listing.is_claimed || false,
      // Extended fields
      city: listing.city || "",
      state: listing.state || "",
      zip: String(listing.zip || ""),
      facebook_url: listing.facebook_url || "",
      instagram_url: listing.instagram_url || "",
      plan: listing.plan || "Free",
      is_active: listing.is_active ?? false,
      featured: listing.featured ?? false,
      // Detailed profile fields
      who_is_it_for: listing.who_is_it_for || "",
      why_is_it_unique: listing.why_is_it_unique || "",
      format: listing.format || "",
      extras_notes: listing.extras_notes || "",
      // Array fields converted to comma-separated strings for form input
      categories: listing.categories?.join(", ") || "",
      age_range: listing.age_range?.join(", ") || "",
      region: listing.region?.join(", ") || "",
    },
  });

  const onSubmit = (values: FormInputType) => {
    startTransition(() => {
      updateListing(listing.id, values as unknown as z.infer<typeof UpdateListingSchema>).then((res) => {
        // Pass the entire response to the parent component to handle side-effects
        onFinished(res);
      });
    });
  };

  // FIX: Make the `helpText` prop optional by providing a default value.
  const FormInput = ({ id, label, register, error, disabled, helpText = null, ...props }: FormInputProps) => (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        {...register(id)}
        className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
        disabled={disabled}
        {...props}
      />
      {helpText && <p className="text-xs text-muted-foreground mt-1">{helpText}</p>}
      {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
    </div>
  );

  const FormSelect = ({ id, label, register, children, disabled }: FormSelectProps) => (
     <div className="space-y-1">
        <label htmlFor={id}>{label}</label>
        <select
          id={id}
          {...register(id)}
          className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
          disabled={disabled}
        >
          {children}
        </select>
      </div>
  );
  
  const FormCheckbox = ({ id, label, register, disabled }: FormCheckboxProps) => (
     <div className="flex items-center gap-2 pt-4">
        <input
           type="checkbox"
           id={id}
           {...register(id)}
           className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
           disabled={disabled}
        />
        <label htmlFor={id}>{label}</label>
      </div>
  );

  const FormTextarea = ({ id, label, register, disabled, rows = 3 }: FormTextareaProps) => (
    <div className="space-y-1">
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        {...register(id)}
        rows={rows}
        className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
        disabled={disabled}
      />
    </div>
  );

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
      
      {/* --- Basic Information --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput id="listing_name" label="Listing Name" register={form.register} error={form.formState.errors.listing_name} disabled={isPending} />
        <FormSelect id="status" label="Status" register={form.register} disabled={isPending}>
            <option value="Live">Live</option>
            <option value="Pending">Pending</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
            <option value="Rejected">Rejected</option>
        </FormSelect>
        <FormInput id="website" label="Website" register={form.register} error={form.formState.errors.website} disabled={isPending} />
        <FormInput id="email" label="Email" register={form.register} error={form.formState.errors.email} disabled={isPending} type="email" />
        <FormInput id="phone" label="Phone" register={form.register} error={form.formState.errors.phone} disabled={isPending} />
        <FormInput id="plan" label="Plan" register={form.register} error={form.formState.errors.plan} disabled={isPending} />
      </div>

      <hr className="my-6 border-border" />

      {/* --- Location Details --- */}
      <div>
        <h3 className="text-md font-semibold mb-2 text-foreground">Location Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput id="city" label="City" register={form.register} error={form.formState.errors.city} disabled={isPending} />
          <FormInput id="state" label="State" register={form.register} error={form.formState.errors.state} disabled={isPending} />
          <FormInput id="zip" label="Zip Code" register={form.register} error={form.formState.errors.zip} disabled={isPending} />
        </div>
      </div>
      
      <hr className="my-6 border-border" />

      {/* --- Categorization --- */}
      <div>
        <h3 className="text-md font-semibold mb-2 text-foreground">Categorization</h3>
        <div className="space-y-4">
          <FormInput id="categories" label="Categories" register={form.register} error={form.formState.errors.categories} disabled={isPending} helpText="Enter values separated by a comma. E.g., Acting Coaches, Headshot Photographers" />
          <FormInput id="age_range" label="Age Range" register={form.register} error={form.formState.errors.age_range} disabled={isPending} helpText="Enter values separated by a comma. E.g., 5-8, 9-12, 13-17, 18+" />
          <FormInput id="region" label="Region" register={form.register} error={form.formState.errors.region} disabled={isPending} helpText="Enter values separated by a comma. E.g., West Coast, Southeast" />
        </div>
      </div>

      <hr className="my-6 border-border" />

      {/* --- Social Media --- */}
      <div>
        <h3 className="text-md font-semibold mb-2 text-foreground">Social Media</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <FormInput id="facebook_url" label="Facebook URL" register={form.register} error={form.formState.errors.facebook_url} disabled={isPending} />
           <FormInput id="instagram_url" label="Instagram URL" register={form.register} error={form.formState.errors.instagram_url} disabled={isPending} />
        </div>
      </div>

      <hr className="my-6 border-border" />
      
      {/* --- Profile Content --- */}
      <div>
        <h3 className="text-md font-semibold mb-2 text-foreground">Profile Content</h3>
        <div className="space-y-4">
            <FormTextarea id="what_you_offer" label="What You Offer (Short Bio)" register={form.register} disabled={isPending} />
            <FormTextarea id="who_is_it_for" label="Who Is It For" register={form.register} disabled={isPending} />
            <FormTextarea id="why_is_it_unique" label="What Makes This Unique" register={form.register} disabled={isPending} />
            <FormTextarea id="format" label="Service Format" register={form.register} disabled={isPending} rows={2} />
            <FormTextarea id="extras_notes" label="Additional Notes" register={form.register} disabled={isPending} rows={2} />
        </div>
      </div>

      <hr className="my-6 border-border" />
      
      {/* --- Platform Status --- */}
      <div>
        <h3 className="text-md font-semibold mb-2 text-foreground">Platform Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <FormCheckbox id="is_claimed" label="Listing is Claimed" register={form.register} disabled={isPending} />
            <FormCheckbox id="is_active" label="Listing is Active" register={form.register} disabled={isPending} />
            <FormCheckbox id="featured" label="Is Featured" register={form.register} disabled={isPending} />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-6 sticky bottom-0 bg-card py-4">
        <Button type="button" variant="ghost" onClick={() => onFinished({ status: "error", message: "Update cancelled."})} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}