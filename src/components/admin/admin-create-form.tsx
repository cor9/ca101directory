"use client";

import ImageUpload from "@/components/shared/image-upload";
import { GalleryUpload } from "@/components/submit/gallery-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  type FieldError,
  type UseFormRegister,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { createListing } from "@/actions/listings";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getCategoriesClient } from "@/data/categories-client";
import { CreateListingSchema } from "@/lib/validations/listings";

type FormInputType = z.infer<typeof CreateListingSchema> & {
  secondary_locations: { city: string; state: string; zip: string }[];
};

interface AdminCreateFormProps {
  onFinished?: (result: Awaited<ReturnType<typeof createListing>>) => void;
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

export function AdminCreateForm({ onFinished }: AdminCreateFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [categories, setCategories] = useState<
    Array<{ id: string; category_name: string }>
  >([]);
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryCaptions, setGalleryCaptions] = useState<string[]>([]);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategoriesClient();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const form = useForm<FormInputType>({
    resolver: zodResolver(CreateListingSchema),
    defaultValues: {
      listing_name: "",
      status: "Pending",
      website: "",
      email: "",
      phone: "",
      what_you_offer: "",
      city: "",
      state: "",
      zip: "",
      plan: "Free",
      format: "In-person",
      why_is_it_unique: "",
      extras_notes: "",
      profile_image: "",
      gallery: "[]",
      is_approved_101: false,
      ca_permit_required: false,
      is_bonded: false,
      bond_number: "",
      categories: [],
      age_range: [],
      region: [],
      services_offered: [],
      specialties: [],
      age_tags: [],
      secondary_locations: [],
    },
  });

  const {
    fields: locationFields,
    append: appendLocation,
    remove: removeLocation,
  } = useFieldArray({
    control: form.control,
    name: "secondary_locations" as never,
  });

  const onSubmit = (values: FormInputType) => {
    setSubmitError(null);
    startTransition(async () => {
      try {
        const serverValues = {
          ...values,
          profile_image: profileImageUrl,
          gallery: JSON.stringify(
            galleryImages
              .map((url, i) => (url ? { url, caption: galleryCaptions[i] || "" } : null))
              .filter(Boolean)
          ),
        };

        const res = await createListing(serverValues as z.infer<typeof CreateListingSchema>);
        if (res.status === "success") {
          toast.success("Listing created successfully.");
          if (onFinished) {
            onFinished(res);
          } else {
            router.push("/dashboard/admin");
            router.refresh();
          }
        } else {
          setSubmitError(res.message);
          toast.error(res.message);
        }
      } catch (error) {
        console.error("Create error:", error);
        toast.error("An unexpected error occurred.");
      }
    });
  };

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
      <Label htmlFor={id} className="block text-sm font-medium text-text-primary">
        {label}
      </Label>
      <input
        id={id}
        {...register(id)}
        className="w-full bg-bg-dark-3 border border-border-subtle rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent-blue focus:outline-none text-text-primary placeholder:text-text-muted"
        disabled={disabled}
        {...props}
      />
      {helpText && <p className="text-xs text-text-muted mt-1">{helpText}</p>}
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
      <Label htmlFor={id} className="block text-sm font-medium text-text-primary">
        {label}
      </Label>
      <select
        id={id}
        {...register(id)}
        className="w-full bg-bg-dark-3 border border-border-subtle rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent-blue focus:outline-none text-text-primary"
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
        className="h-4 w-4 rounded border-border-subtle bg-bg-dark-3 text-accent-blue focus:ring-accent-blue"
        disabled={disabled}
      />
      <Label htmlFor={id} className="text-text-primary text-sm">
        {label}
      </Label>
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
      <Label htmlFor={id} className="block text-sm font-medium text-text-primary">
        {label}
      </Label>
      <textarea
        id={id}
        {...register(id)}
        rows={rows}
        className="w-full bg-bg-dark-3 border border-border-subtle rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent-blue focus:outline-none text-text-primary placeholder:text-text-muted"
        disabled={disabled}
      />
    </div>
  );

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6 max-h-[70vh] overflow-y-auto pr-4"
    >
      {submitError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {submitError}
        </div>
      )}

      {/* --- Basic Information --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          id="listing_name"
          label="Listing Name *"
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
          <option value="Inactive">Inactive</option>
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
        <FormSelect
          id="plan"
          label="Plan"
          register={form.register}
          disabled={isPending}
        >
          <option value="Free">Free</option>
          <option value="Standard">Standard</option>
          <option value="Pro">Pro</option>
          <option value="Founding Standard">Founding Standard</option>
          <option value="Founding Pro">Founding Pro</option>
        </FormSelect>
      </div>

      <hr className="my-6 border-border-subtle" />

      {/* --- Detailed Info --- */}
      <div className="space-y-4">
        <FormTextarea
          id="what_you_offer"
          label="What You Offer"
          register={form.register}
          disabled={isPending}
        />
        <FormTextarea
          id="why_is_it_unique"
          label="Why Is It Unique?"
          register={form.register}
          disabled={isPending}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            id="format"
            label="Format"
            register={form.register}
            disabled={isPending}
          >
            <option value="In-person">In-person</option>
            <option value="Online">Online</option>
            <option value="Hybrid">Hybrid</option>
          </FormSelect>
          <FormInput
            id="categories"
            label="Categories (comma separated UUIDs)"
            register={form.register}
            disabled={isPending}
          />
        </div>
      </div>

      <hr className="my-6 border-border-subtle" />

      {/* --- Location --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormInput
          id="city"
          label="City"
          register={form.register}
          disabled={isPending}
        />
        <FormInput
          id="state"
          label="State"
          register={form.register}
          disabled={isPending}
        />
        <FormInput
          id="zip"
          label="Zip Code"
          register={form.register}
          disabled={isPending}
        />
      </div>

      <hr className="my-6 border-border-subtle" />

      {/* --- Images --- */}
      <div className="space-y-4">
        <h3 className="text-md font-semibold text-text-primary">Images</h3>
        <div>
          <Label className="block text-sm font-medium text-text-primary mb-2">
            Profile Image
          </Label>
          <div className="h-48 border-2 border-dashed border-border-subtle rounded-lg overflow-hidden">
            <ImageUpload
              currentImageUrl={profileImageUrl}
              onUploadChange={(status) => {
                setIsImageUploading(status.isUploading);
                if (status.imageId) {
                  setProfileImageUrl(status.imageId);
                }
              }}
              type="image"
            />
          </div>
        </div>
        <div>
          <Label className="block text-sm font-medium text-text-primary mb-2">
            Gallery (Pro only)
          </Label>
          <GalleryUpload
            maxImages={12}
            currentImages={galleryImages}
            onImagesChange={(images) => {
              setGalleryImages(images);
            }}
            onUploadingChange={setIsGalleryUploading}
          />
        </div>
      </div>

      <hr className="my-6 border-border-subtle" />

      {/* --- Compliance & Settings --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <FormCheckbox
            id="is_approved_101"
            label="101 Approved"
            register={form.register}
          />
          <FormCheckbox
            id="ca_permit_required"
            label="CA Permit Required"
            register={form.register}
          />
          <FormCheckbox
            id="is_bonded"
            label="Is Bonded"
            register={form.register}
          />
          {form.watch("is_bonded") && (
            <FormInput
              id="bond_number"
              label="Bond Number"
              register={form.register}
            />
          )}
        </div>
        <div className="space-y-2">
          <FormCheckbox
            id="featured"
            label="Featured Listing"
            register={form.register}
          />
        </div>
      </div>

      <div className="pt-6 flex justify-end gap-3 border-t border-border-subtle">
        <Button
          type="submit"
          disabled={isPending || isImageUploading || isGalleryUploading}
          className="bg-accent-blue hover:bg-accent-blue/90 text-white"
        >
          {isPending ? "Creating..." : "Create Listing"}
        </Button>
      </div>
    </form>
  );
}
