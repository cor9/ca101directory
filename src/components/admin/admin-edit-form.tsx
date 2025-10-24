"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import {
  type FieldError,
  type UseFormRegister,
  useForm,
} from "react-hook-form";
import { z } from "zod";
import ImageUpload from "@/components/shared/image-upload";
import { GalleryUpload } from "@/components/submit/gallery-upload";

// Fix: Separated imports to pull `Listing` type from data layer and action/schema from the actions layer.
import { updateListing } from "@/actions/listings";
import { Button } from "@/components/ui/button";
import { getCategoriesClient } from "@/data/categories-client";
import type { Listing } from "@/data/listings";
import type { UpdateListingSchema } from "@/lib/validations/listings";

// Form input type with strings for array fields (before transformation)
type FormInputType = Omit<
  z.infer<typeof UpdateListingSchema>,
  "categories" | "age_range" | "region"
> & {
  categories: string;
  age_range: string;
  region: string;
};

// Form schema that matches FormInputType (strings for array fields)
const FormInputSchema = z.object({
  listing_name: z.string().min(1, "Listing name is required."),
  status: z.enum(["Live", "Pending", "Draft", "Archived", "Rejected"]),
  website: z
    .union([z.string().url({ message: "Invalid URL format." }), z.literal("")])
    .optional(),
  email: z
    .union([
      z.string().email({ message: "Invalid email format." }),
      z.literal(""),
    ])
    .optional(),
  phone: z.string().optional(),
  what_you_offer: z.string().optional(),
  is_claimed: z.boolean(),
  // Extended fields for comprehensive admin editing
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  facebook_url: z
    .union([z.string().url({ message: "Invalid URL format." }), z.literal("")])
    .optional(),
  instagram_url: z
    .union([z.string().url({ message: "Invalid URL format." }), z.literal("")])
    .optional(),
  plan: z.string().optional(),
  is_active: z.boolean(),
  featured: z.boolean(),
  // Detailed Profile Fields
  who_is_it_for: z.string().optional(),
  why_is_it_unique: z.string().optional(),
  format: z.string().optional(),
  extras_notes: z.string().optional(),
  // Images
  profile_image: z.string().optional(),
  gallery: z.string().optional(),
  // Badges/Compliance
  is_approved_101: z.boolean().optional(),
  ca_permit_required: z.boolean().optional(),
  is_bonded: z.boolean().optional(),
  bond_number: z.string().optional(),
  // Array fields as strings (will be converted to arrays before submission)
  categories: z.string().optional(),
  age_range: z.string().optional(),
  region: z.string().optional(),
});

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
  const [categories, setCategories] = useState<
    Array<{ id: string; category_name: string }>
  >([]);
  const [categoryNames, setCategoryNames] = useState<string>("");
  const [profileImageUrl, setProfileImageUrl] = useState<string>(
    listing.profile_image || "",
  );
  const [galleryImages, setGalleryImages] = useState<string[]>(() => {
    if (typeof listing.gallery === "string") {
      try {
        return JSON.parse(listing.gallery) || [];
      } catch {
        return [];
      }
    }
    return Array.isArray(listing.gallery) ? listing.gallery : [];
  });
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);

  // Fetch categories and convert UUIDs to names
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategoriesClient();
        setCategories(fetchedCategories);

        // Convert category UUIDs to names
        if (listing.categories && listing.categories.length > 0) {
          const names = listing.categories
            .map((uuid) => {
              const category = fetchedCategories.find((cat) => cat.id === uuid);
              return category ? category.category_name : uuid; // fallback to UUID if not found
            })
            .join(", ");
          setCategoryNames(names);
          console.log(
            "Converted category UUIDs to names:",
            listing.categories,
            "->",
            names,
          );
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback to showing UUIDs if fetch fails
        setCategoryNames(listing.categories?.join(", ") || "");
      }
    };

    fetchCategories();
  }, [listing.categories]);

  const form = useForm<FormInputType>({
    resolver: zodResolver(FormInputSchema),
    defaultValues: {
      listing_name: listing.listing_name || "",
      status:
        (listing.status as
          | "Live"
          | "Pending"
          | "Draft"
          | "Archived"
          | "Rejected") || "Draft",
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
      // Images
      profile_image: listing.profile_image || "",
      gallery:
        typeof listing.gallery === "string"
          ? listing.gallery
          : JSON.stringify(Array.isArray(listing.gallery) ? listing.gallery : []),
      // Badges/Compliance
      is_approved_101: listing.is_approved_101 ?? false,
      ca_permit_required: listing.ca_permit_required ?? false,
      is_bonded: listing.is_bonded ?? false,
      bond_number: listing.bond_number || "",
      // Array fields converted to comma-separated strings for form input
      categories: listing.categories?.join(", ") || "", // Start with UUIDs, will be updated
      age_range: listing.age_range?.join(", ") || "",
      region: listing.region?.join(", ") || "",
    },
  });

  // Update form when category names are ready
  useEffect(() => {
    if (categoryNames) {
      form.setValue("categories", categoryNames);
    }
  }, [categoryNames, form]);

  // Debug form state
  console.log("Form state:", {
    isValid: form.formState.isValid,
    errors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
    isPending,
  });

  const onSubmit = (values: FormInputType) => {
    console.log("Form submission started with values:", values);
    console.log("Available categories:", categories);

    // Note: We can now handle both UUIDs and category names, so we don't need to wait for categories to load

    try {
      startTransition(() => {
        try {
          // Convert category names back to UUIDs before submitting
          const processedValues = { ...values };

          if (values.categories?.trim()) {
            // Check if it's already a UUID (single category) or category names (comma-separated)
            const isUuid = values.categories?.match(
              /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
            );

            if (isUuid) {
              // It's already a UUID, keep it as is
              console.log(
                "Categories field contains UUID, keeping as is:",
                values.categories,
              );
              processedValues.categories = values.categories;
            } else {
              // It's category names, convert to UUIDs
              const categoryNames = values.categories
                .split(",")
                .map((name) => name.trim())
                .filter(Boolean);
              console.log("Category names to convert:", categoryNames);

              const categoryUuids = categoryNames.map((name) => {
                const category = categories.find(
                  (cat) => cat.category_name === name,
                );
                console.log(
                  `Converting "${name}" to UUID:`,
                  category ? category.id : name,
                );
                return category ? category.id : name; // fallback to original if not found
              });
              processedValues.categories = categoryUuids.join(", ");
              console.log(
                "Final processed categories:",
                processedValues.categories,
              );
            }
          } else {
            // If no categories specified, set to empty string
            processedValues.categories = "";
          }

          console.log("Final processed values:", processedValues);

          // Convert string arrays to comma-separated strings for the server schema transformer
          const serverValues = {
            ...processedValues,
            // The server schema will handle the comma-separated string to array conversion
            categories: processedValues.categories || "",
            age_range: processedValues.age_range || "",
            region: processedValues.region || "",
          };

          // Attach images and compliance fields
          serverValues.profile_image = profileImageUrl || "";
          serverValues.gallery = JSON.stringify(
            galleryImages.filter((g) => g && g.length > 0),
          );

          console.log("Server values:", serverValues);

          updateListing(
            listing.id,
            serverValues as unknown as z.infer<typeof UpdateListingSchema>,
          )
            .then((res) => {
              console.log("UpdateListing response:", res);
              // Pass the entire response to the parent component to handle side-effects
              onFinished(res);
            })
            .catch((error) => {
              console.error("UpdateListing error:", error);
              onFinished({
                status: "error",
                message: "An unexpected error occurred.",
              });
            });
        } catch (innerError) {
          console.error("Error in startTransition:", innerError);
          onFinished({
            status: "error",
            message: "Form processing error occurred.",
          });
        }
      });
    } catch (outerError) {
      console.error("Error in onSubmit:", outerError);
      onFinished({
        status: "error",
        message: "Form submission error occurred.",
      });
    }
  };

  // FIX: Make the `helpText` prop optional by providing a default value.
  const FormInput = ({
    id,
    label,
    register,
    error,
    disabled,
    helpText = null,
    ...props
  }: FormInputProps) => (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        {...register(id)}
        className="w-full bg-surface border border-input rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none text-ink"
        disabled={disabled}
        {...props}
      />
      {helpText && <p className="text-xs text-ink mt-1">{helpText}</p>}
      {error && <p className="text-sm text-red-500 mt-1">{error?.message}</p>}
    </div>
  );

  const FormSelect = ({
    id,
    label,
    register,
    children,
    disabled,
  }: FormSelectProps) => (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
      </label>
      <select
        id={id}
        {...register(id)}
        className="w-full bg-surface border border-input rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none text-ink"
        disabled={disabled}
      >
        {children}
      </select>
    </div>
  );

  const FormCheckbox = ({
    id,
    label,
    register,
    disabled,
  }: FormCheckboxProps) => (
    <div className="flex items-center gap-2 pt-4">
      <input
        type="checkbox"
        id={id}
        {...register(id)}
        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        disabled={disabled}
      />
      <label htmlFor={id} className="text-ink">
        {label}
      </label>
    </div>
  );

  const FormTextarea = ({
    id,
    label,
    register,
    disabled,
    rows = 3,
  }: FormTextareaProps) => (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
      </label>
      <textarea
        id={id}
        {...register(id)}
        rows={rows}
        className="w-full bg-surface border border-input rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none text-ink"
        disabled={disabled}
      />
    </div>
  );

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, (errors) => {
        console.error("Form validation errors:", errors);
      })}
      className="space-y-6 max-h-[70vh] overflow-y-auto pr-4"
    >
      {/* --- Basic Information --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          id="listing_name"
          label="Listing Name"
          register={form.register}
          error={form.formState.errors.listing_name}
          disabled={isPending}
        />
        <FormSelect
          id="status"
          label="Status"
          register={form.register}
          disabled={isPending}
        >
          <option value="Live">Live</option>
          <option value="Pending">Pending</option>
          <option value="Draft">Draft</option>
          <option value="Archived">Archived</option>
          <option value="Rejected">Rejected</option>
        </FormSelect>
        <FormInput
          id="website"
          label="Website"
          register={form.register}
          error={form.formState.errors.website}
          disabled={isPending}
        />
        <FormInput
          id="email"
          label="Email"
          register={form.register}
          error={form.formState.errors.email}
          disabled={isPending}
          type="email"
        />
        <FormInput
          id="phone"
          label="Phone"
          register={form.register}
          error={form.formState.errors.phone}
          disabled={isPending}
        />
        <FormInput
          id="plan"
          label="Plan"
          register={form.register}
          error={form.formState.errors.plan}
          disabled={isPending}
        />
      </div>

      <hr className="my-6 border-border" />

      {/* --- Images --- */}
      <div>
        <h3 className="text-md font-semibold mb-2 text-ink">Images</h3>
        <div className="space-y-4">
          {/* Profile Image */}
          <div>
            <p className="block text-sm font-medium text-ink mb-2">
              Profile Image
            </p>
            <div className="h-48 border-2 border-dashed border-gray-300 rounded-lg">
              <ImageUpload
                currentImageUrl={profileImageUrl}
                onUploadChange={(status) => {
                  setIsImageUploading(status.isUploading);
                  if (status.imageId) {
                    setProfileImageUrl(status.imageId);
                    form.setValue("profile_image", status.imageId);
                  }
                }}
                type="image"
              />
            </div>
          </div>

          {/* Gallery Images */}
          <div>
            <p className="block text-sm font-medium text-ink mb-2">
              Gallery Images
            </p>
            <GalleryUpload
              maxImages={4}
              currentImages={galleryImages}
              onImagesChange={setGalleryImages}
              onUploadingChange={setIsGalleryUploading}
            />
            <p className="text-xs text-ink mt-1">
              Up to 4 gallery images (Pro listings typically use this feature).
            </p>
          </div>
        </div>
      </div>

      {/* --- Location Details --- */}
      <div>
        <h3 className="text-md font-semibold mb-2 text-ink">
          Location Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            id="city"
            label="City"
            register={form.register}
            error={form.formState.errors.city}
            disabled={isPending}
          />
          <FormInput
            id="state"
            label="State"
            register={form.register}
            error={form.formState.errors.state}
            disabled={isPending}
          />
          <FormInput
            id="zip"
            label="Zip Code"
            register={form.register}
            error={form.formState.errors.zip}
            disabled={isPending}
          />
        </div>
      </div>

      <hr className="my-6 border-border" />

      {/* --- Categorization --- */}
      <div>
        <h3 className="text-md font-semibold mb-2 text-ink">Categorization</h3>
        <div className="space-y-4">
          <FormInput
            id="categories"
            label="Categories"
            register={form.register}
            error={form.formState.errors.categories}
            disabled={isPending}
            helpText="Enter values separated by a comma. E.g., Acting Coaches, Headshot Photographers"
          />
          <FormInput
            id="age_range"
            label="Age Range"
            register={form.register}
            error={form.formState.errors.age_range}
            disabled={isPending}
            helpText="Enter values separated by a comma. E.g., 5-8, 9-12, 13-17, 18+"
          />
          <FormInput
            id="region"
            label="Region"
            register={form.register}
            error={form.formState.errors.region}
            disabled={isPending}
            helpText="Enter values separated by a comma. E.g., West Coast, Southeast"
          />
        </div>
      </div>

      <hr className="my-6 border-border" />

      {/* --- Social Media --- */}
      <div>
        <h3 className="text-md font-semibold mb-2 text-ink">Social Media</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            id="facebook_url"
            label="Facebook URL"
            register={form.register}
            error={form.formState.errors.facebook_url}
            disabled={isPending}
          />
          <FormInput
            id="instagram_url"
            label="Instagram URL"
            register={form.register}
            error={form.formState.errors.instagram_url}
            disabled={isPending}
          />
        </div>
      </div>

      <hr className="my-6 border-border" />

      {/* --- Profile Content --- */}
      <div>
        <h3 className="text-md font-semibold mb-2 text-ink">Profile Content</h3>
        <div className="space-y-4">
          <FormTextarea
            id="what_you_offer"
            label="What You Offer (Short Bio)"
            register={form.register}
            disabled={isPending}
            rows={6}
          />
          <FormTextarea
            id="who_is_it_for"
            label="Who Is It For"
            register={form.register}
            disabled={isPending}
            rows={4}
          />
          <FormTextarea
            id="why_is_it_unique"
            label="What Makes This Unique"
            register={form.register}
            disabled={isPending}
            rows={4}
          />
          <FormTextarea
            id="format"
            label="Service Format"
            register={form.register}
            disabled={isPending}
            rows={2}
          />
          <FormTextarea
            id="extras_notes"
            label="Additional Notes"
            register={form.register}
            disabled={isPending}
            rows={2}
          />
          <p className="text-xs text-ink/80">
            Tip: You can paste basic HTML (p, strong, em, a, ul, li). It will be
            stored as text. We sanitize on render to prevent XSS.
          </p>
        </div>
      </div>

      <hr className="my-6 border-border" />

      {/* --- Platform Status --- */}
      <div>
        <h3 className="text-md font-semibold mb-2 text-paper">
          Platform Status
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <FormCheckbox
            id="is_claimed"
            label="Listing is Claimed"
            register={form.register}
            disabled={isPending}
          />
          <FormCheckbox
            id="is_active"
            label="Listing is Active"
            register={form.register}
            disabled={isPending}
          />
          <FormCheckbox
            id="featured"
            label="Is Featured"
            register={form.register}
            disabled={isPending}
          />
          <FormCheckbox
            id="is_approved_101"
            label="101 Approved Badge"
            register={form.register}
            disabled={isPending}
          />
          <FormCheckbox
            id="ca_permit_required"
            label="CA Performer Permit Required"
            register={form.register}
            disabled={isPending}
          />
          <FormCheckbox
            id="is_bonded"
            label="Bonded for Advanced Fees"
            register={form.register}
            disabled={isPending}
          />
        </div>
        {/* Bond Number */}
        <div className="max-w-sm pt-2">
          <FormInput
            id="bond_number"
            label="Bond Number"
            register={form.register}
            disabled={isPending}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-6 sticky bottom-0 bg-card py-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() =>
            onFinished({ status: "error", message: "Update cancelled." })
          }
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending || isImageUploading || isGalleryUploading}
          onClick={() => console.log("Save Changes button clicked!")}
        >
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
