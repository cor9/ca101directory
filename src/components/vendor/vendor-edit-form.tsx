"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { updateListing } from "@/actions/listings";
import ImageUpload from "@/components/shared/image-upload";
import { GalleryUpload } from "@/components/submit/gallery-upload";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getCategoriesClient } from "@/data/categories-client";
import type { Listing } from "@/data/listings";
import { regionsList } from "@/data/regions";
import { UpdateListingSchema } from "@/lib/validations/listings";
import { Lock } from "lucide-react";
import Link from "next/link";

interface VendorEditFormProps {
  listing: Listing;
  onFinished?: () => void;
  redirectUrl?: string;
}

export function VendorEditForm({
  listing,
  onFinished,
  redirectUrl,
}: VendorEditFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [categories, setCategories] = useState<
    Array<{ id: string; category_name: string }>
  >([]);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isLogoUploading, setIsLogoUploading] = useState(false);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);
  const [profileImageId, setProfileImageId] = useState<string>(
    listing.profile_image || "",
  );
  const [logoUrl, setLogoUrl] = useState<string>(
    (listing as any).logo_url || "",
  );
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [initialCategories, setInitialCategories] = useState<string>("");

  const [galleryImages, setGalleryImages] = useState<string[]>(() => {
    if (typeof listing.gallery === "string") {
      try {
        const parsed = JSON.parse(listing.gallery) || [];
        if (Array.isArray(parsed)) {
          return parsed.map((e: any) =>
            typeof e === "string" ? e : e?.url || e?.src || "",
          );
        }
        return [];
      } catch {
        return [];
      }
    }
    return Array.isArray(listing.gallery)
      ? (listing.gallery as any[]).map((e) =>
          typeof e === "string" ? e : e?.url || e?.src || "",
        )
      : [];
  });
  const [galleryCaptions, setGalleryCaptions] = useState<string[]>(() => {
    if (typeof listing.gallery === "string") {
      try {
        const parsed = JSON.parse(listing.gallery) || [];
        if (Array.isArray(parsed)) {
          return parsed.map((e: any) =>
            typeof e === "object" && typeof e?.caption === "string"
              ? e.caption
              : "",
          );
        }
        return [];
      } catch {
        return [];
      }
    }
    return Array.isArray(listing.gallery)
      ? (listing.gallery as any[]).map((e) =>
          typeof e === "object" && typeof (e as any).caption === "string"
            ? (e as any).caption
            : "",
        )
      : [];
  });

  // Fetch categories on mount and convert UUIDs to names BEFORE form initializes
  useEffect(() => {
    getCategoriesClient().then((cats) => {
      setCategories(
        cats.map((c) => ({ id: c.id, category_name: c.category_name })),
      );

      // Convert UUID categories to names
      const listingCats = Array.isArray(listing.categories)
        ? listing.categories.join(", ")
        : typeof listing.categories === "string"
          ? listing.categories
          : "";

      if (listingCats) {
        const categoryArray = listingCats.split(", ").filter(Boolean);
        // Check if we have UUIDs (36 chars with dashes)
        const hasUUIDs = categoryArray.some(
          (cat) => cat.length === 36 && cat.includes("-"),
        );

        if (hasUUIDs) {
          // Convert UUIDs to names
          const categoryNames = categoryArray
            .map((catId) => {
              const found = cats.find((c) => c.id === catId);
              return found ? found.category_name : catId;
            })
            .filter(Boolean);

          const convertedStr = categoryNames.join(", ");
          setInitialCategories(convertedStr);
          console.log("✅ Converted UUID categories to names:", categoryNames);
        } else {
          setInitialCategories(listingCats);
        }
      }

      setCategoriesLoaded(true);
    });
  }, []);

  // Helper to normalize format values
  const normalizeFormat = (format: string | undefined): string => {
    if (!format) return "";
    const lowerFormat = format.toLowerCase();
    if (lowerFormat === "in-person" || lowerFormat === "in person") {
      return "In-person";
    }
    if (lowerFormat === "online") {
      return "Online";
    }
    if (lowerFormat === "hybrid") {
      return "Hybrid";
    }
    return format.charAt(0).toUpperCase() + format.slice(1).toLowerCase();
  };

  const form = useForm<z.infer<typeof UpdateListingSchema>>({
    resolver: zodResolver(UpdateListingSchema),
    defaultValues: {
      listing_name: listing.listing_name || "",
      website: listing.website || "",
      email: listing.email || "",
      phone: listing.phone || "",
      what_you_offer: listing.what_you_offer || "",
      why_is_it_unique: listing.why_is_it_unique || "",
      extras_notes: listing.extras_notes || "",
      video_url: (listing as any).video_url || "",
      format: normalizeFormat(listing.format),
      city: listing.city || "",
      state: listing.state || "",
      zip: listing.zip?.toString() || "",
      ca_permit_required: listing.ca_permit_required || false,
      is_bonded: listing.is_bonded || false,
      bond_number: listing.bond_number || "",
      categories: "" as any, // Will be set by useEffect after conversion
      age_range: (Array.isArray(listing.age_range)
        ? listing.age_range.join(", ")
        : typeof listing.age_range === "string"
          ? listing.age_range
          : "") as any,
      age_tags: (Array.isArray((listing as any).age_tags)
        ? (listing as any).age_tags.join(", ")
        : ((listing as any).age_tags as any) || "") as any,
      services_offered: (Array.isArray((listing as any).services_offered)
        ? (listing as any).services_offered.join(", ")
        : ((listing as any).services_offered as any) || "") as any,
      techniques: (Array.isArray((listing as any).techniques)
        ? (listing as any).techniques.join(", ")
        : ((listing as any).techniques as any) || "") as any,
      specialties: (Array.isArray((listing as any).specialties)
        ? (listing as any).specialties.join(", ")
        : ((listing as any).specialties as any) || "") as any,
      region: (Array.isArray(listing.region)
        ? listing.region.join(", ")
        : typeof listing.region === "string"
          ? listing.region
          : "") as any,
      logo_url: (listing as any).logo_url || "",
      profile_image: listing.profile_image || "",
      gallery:
        typeof listing.gallery === "string"
          ? listing.gallery
          : JSON.stringify(listing.gallery || []),
      status: (listing.status === "Live" ||
      listing.status === "Pending" ||
      listing.status === "Draft" ||
      listing.status === "Archived" ||
      listing.status === "Rejected"
        ? listing.status
        : "Pending") as "Pending" | "Live" | "Rejected" | "Draft" | "Archived",
      is_claimed: !!listing.is_claimed,
      is_active: listing.is_active ?? true,
      plan: listing.plan || "Free",
    },
  });

  // Update categories after conversion completes
  useEffect(() => {
    if (categoriesLoaded && initialCategories) {
      form.setValue("categories", initialCategories as any);
      console.log("📝 Set form categories to:", initialCategories);
    }
  }, [categoriesLoaded, initialCategories, form]);

  const plan = listing.plan?.toLowerCase() || "free";
  const isFree = plan === "free";
  const isStandard = plan === "standard" || plan === "founding standard";
  const isPro = plan === "pro" || plan === "founding pro" || listing.comped;

  const serviceOptions = [
    "Private Coaching",
    "Group Classes",
    "On-Set Coaching",
    "Zoom/Remote",
  ];
  const techniqueOptions = [
    "Meisner",
    "Method",
    "Improv",
    "On-Camera",
    "Commercial",
    "Theatrical",
  ];
  const specialtyOptions = [
    "Pre-Readers",
    "Memorization",
    "Audition Prep",
    "Self-Tapes",
  ];

  const handleCategoryToggle = (categoryName: string) => {
    const currentStr = (form.getValues("categories") as any) || "";
    const currentArray = currentStr
      ? String(currentStr).split(", ").filter(Boolean)
      : [];
    const newCategories = currentArray.includes(categoryName)
      ? currentArray.filter((c) => c !== categoryName)
      : [...currentArray, categoryName];

    // Free tier: limit to 1 category
    if (isFree && newCategories.length > 1) {
      toast.error(
        "Free plan allows only 1 category. Upgrade to select multiple.",
      );
      return;
    }

    form.setValue("categories", newCategories.join(", ") as any);
  };

  const handleTagToggle = (
    tag: string,
    field:
      | "age_range"
      | "region"
      | "age_tags"
      | "services_offered"
      | "techniques"
      | "specialties",
  ) => {
    const currentStr = (form.getValues(field) as any) || "";
    const currentArray = currentStr
      ? String(currentStr).split(", ").filter(Boolean)
      : [];
    const newTags = currentArray.includes(tag)
      ? currentArray.filter((t) => t !== tag)
      : [...currentArray, tag];
    form.setValue(field, newTags.join(", ") as any);
  };

  const onSubmit = (values: z.infer<typeof UpdateListingSchema>) => {
    console.log("=== FORM SUBMIT DEBUG ===");
    console.log("Form submitted with values:", values);
    console.log("Categories raw value:", values.categories);
    console.log(
      "Categories type:",
      typeof values.categories,
      Array.isArray(values.categories),
    );
    console.log("Form errors:", form.formState.errors);
    console.log("Profile image ID:", profileImageId);
    console.log("Gallery images:", galleryImages);

    startTransition(() => {
      // Prepare gallery as JSON string (objects with url and caption)
      const galleryObjects = Array.isArray(galleryImages)
        ? galleryImages
            .map((url, i) =>
              url ? { url, caption: galleryCaptions[i] || "" } : null,
            )
            .filter(Boolean)
        : [];
      const galleryString = JSON.stringify(galleryObjects);

      // Values are already strings (from form state), but ensure they're strings
      const categoriesStr =
        typeof values.categories === "string"
          ? values.categories
          : Array.isArray(values.categories)
            ? values.categories.join(", ")
            : "";
      const ageRangeStr =
        typeof values.age_range === "string"
          ? values.age_range
          : Array.isArray(values.age_range)
            ? values.age_range.join(", ")
            : "";
      const ageTagsStr =
        typeof (values as any).age_tags === "string"
          ? (values as any).age_tags
          : Array.isArray((values as any).age_tags)
            ? (values as any).age_tags.join(", ")
            : "";
      const servicesStr =
        typeof (values as any).services_offered === "string"
          ? (values as any).services_offered
          : Array.isArray((values as any).services_offered)
            ? (values as any).services_offered.join(", ")
            : "";
      const techniquesStr =
        typeof (values as any).techniques === "string"
          ? (values as any).techniques
          : Array.isArray((values as any).techniques)
            ? (values as any).techniques.join(", ")
            : "";
      const specialtiesStr =
        typeof (values as any).specialties === "string"
          ? (values as any).specialties
          : Array.isArray((values as any).specialties)
            ? (values as any).specialties.join(", ")
            : "";
      const regionStr =
        typeof values.region === "string"
          ? values.region
          : Array.isArray(values.region)
            ? values.region.join(", ")
            : "";

      console.log("=== STRING CONVERSIONS ===");
      console.log("categoriesStr:", categoriesStr);
      console.log("ageRangeStr:", ageRangeStr);
      console.log("regionStr:", regionStr);

      const fullValues = {
        ...values,
        custom_link_name:
          ((values as any)?.custom_link_url || "").trim().length > 0
            ? "Promo Video"
            : (values as any)?.custom_link_name,
        // Ensure these are strings (schema expects strings)
        categories: categoriesStr,
        age_range: ageRangeStr,
        age_tags: ageTagsStr,
        services_offered: servicesStr,
        techniques: techniquesStr,
        specialties: specialtiesStr,
        region: regionStr,
        profile_image: profileImageId || "",
        gallery: galleryString,
        status: "Pending" as const, // Always set to Pending for vendor edits
        is_claimed: !!listing.is_claimed,
        is_active: listing.is_active ?? true,
      } as any;

      console.log("=== FULL VALUES TO SEND ===");
      console.log("Sending update with fullValues:", fullValues);
      console.log("Categories in fullValues:", fullValues.categories);

      updateListing(listing.id, fullValues)
        .then((res) => {
          console.log("Update response:", res);

          if (res.status === "error") {
            toast.error(res.message || "Failed to update listing");
            console.error("Update failed:", res.message);
          } else {
            toast.success("Listing has been submitted for review.");

            // 18D: Time-based Psychology - Trigger upgrade prompt after save
            const isFree =
              !listing.plan || listing.plan === "Free" || listing.plan === null;
            if (isFree) {
              // Small delay to let success toast show first
              setTimeout(() => {
                toast.info(
                  "💡 Pro tip: Providers with Pro features receive 3–5× more parent contact.",
                  {
                    duration: 6000,
                    action: {
                      label: "Learn more",
                      onClick: () => router.push("/pricing?from=after-save"),
                    },
                  },
                );
              }, 2000);
            }

            if (onFinished) {
              onFinished();
            } else if (redirectUrl) {
              router.push(redirectUrl);
            }
          }
        })
        .catch((error) => {
          console.error("Error in onSubmit:", error);
          toast.error("An unexpected error occurred. Please try again.");
        });
    });
  };

  const onError = (errors: any) => {
    console.error("Form validation errors:", errors);
    const firstError = Object.keys(errors)[0];
    if (firstError) {
      toast.error(`Please fix the ${firstError} field`);
    } else {
      toast.error("Please check all fields and try again");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6">
      {/* Top Actions */}
      <div className="flex justify-end">
        <Button
          type="submit"
          variant="default"
          disabled={
            isPending ||
            isImageUploading ||
            isLogoUploading ||
            isGalleryUploading
          }
        >
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="listing_name">Listing Name</Label>
          <Input
            id="listing_name"
            {...form.register("listing_name")}
            disabled={isPending}
          />
          {form.formState.errors.listing_name && (
            <p className="text-sm text-red-500">
              {form.formState.errors.listing_name.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            {...form.register("website")}
            disabled={isPending}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...form.register("email")}
            disabled={isPending}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" {...form.register("phone")} disabled={isPending} />
        </div>
      </div>

      {/* What You Offer */}
      <div className="space-y-1">
        <Label htmlFor="what_you_offer">What You Offer</Label>
        <Textarea
          id="what_you_offer"
          {...form.register("what_you_offer")}
          rows={4}
          disabled={isPending}
        />
      </div>

      {/* Premium Fields - Standard/Pro Only */}
      {!isFree ? (
        <>
          <div className="space-y-1">
            <Label htmlFor="why_is_it_unique">Why Is It Unique</Label>
            <Textarea
              id="why_is_it_unique"
              {...form.register("why_is_it_unique")}
              rows={3}
              disabled={isPending}
              placeholder="What makes your service special"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="extras_notes">Additional Notes/Extras</Label>
            <Textarea
              id="extras_notes"
              {...form.register("extras_notes")}
              rows={3}
              disabled={isPending}
              placeholder="Any additional information"
            />
          </div>
        </>
      ) : (
        <>
          <div className="space-y-1 opacity-50 pointer-events-none">
            <Label
              htmlFor="why_is_it_unique"
              className="flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Why Is It Unique
            </Label>
            <Textarea
              id="why_is_it_unique"
              rows={3}
              disabled
              placeholder="🔒 Upgrade to Standard or Pro to use this field"
            />
          </div>

          <div className="space-y-1 opacity-50 pointer-events-none">
            <Label htmlFor="extras_notes" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Additional Notes/Extras
            </Label>
            <Textarea
              id="extras_notes"
              rows={3}
              disabled
              placeholder="🔒 Upgrade to Standard or Pro to use this field"
            />
          </div>
        </>
      )}

      {/* Format */}
      <div className="space-y-1">
        <Label htmlFor="format">Service Format</Label>
        <select
          id="format"
          {...form.register("format")}
          className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
          disabled={isPending}
        >
          <option value="">Select format</option>
          <option value="In-person">In-person Only</option>
          <option value="Online">Online Only</option>
          <option value="Hybrid">Hybrid (Online & In-person)</option>
        </select>
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label htmlFor="city">City</Label>
          <Input id="city" {...form.register("city")} disabled={isPending} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="state">State</Label>
          <Input id="state" {...form.register("state")} disabled={isPending} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="zip">ZIP Code</Label>
          <Input id="zip" {...form.register("zip")} disabled={isPending} />
        </div>
      </div>

      {/* Logo - available for all plans */}
      <div className="space-y-2">
        <Label>Logo (one image)</Label>
        <div className="h-32 border-2 border-dashed border-gray-300 rounded-lg">
          <ImageUpload
            currentImageUrl={logoUrl}
            onUploadChange={(status) => {
              setIsLogoUploading(status.isUploading);
              if (status.imageId) {
                setLogoUrl(status.imageId);
                form.setValue("logo_url" as any, status.imageId);
              }
            }}
            type="image"
          />
        </div>
        <p className="text-xs text-gray-600">
          Free tier listings can upload a logo. Standard/Pro can use both logo
          and gallery.
        </p>
      </div>

      {/* Profile Image */}
      {!isFree ? (
        <div className="space-y-2">
          <Label>Profile Image</Label>
          <div className="h-48 border-2 border-dashed border-gray-300 rounded-lg">
            <ImageUpload
              currentImageUrl={profileImageId}
              onUploadChange={(status) => {
                setIsImageUploading(status.isUploading);
                if (status.imageId) {
                  setProfileImageId(status.imageId);
                  form.setValue("profile_image", status.imageId);
                }
              }}
              type="image"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Profile Image
          </Label>
          <div className="h-48 border-2 border-dashed border-gray-300 rounded-lg opacity-50 pointer-events-none flex items-center justify-center">
            <div className="text-center">
              <Lock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Free plan includes one logo image
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Upgrade to Standard ($25/mo) or Pro ($50/mo) to add a profile
                photo
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-md p-4">
            <p className="text-sm text-blue-900">
              <strong>📸 Stand Out with a Professional Image</strong>
              <br />
              Free plan includes one logo. Upgrade to Standard ($25/mo) or Pro
              ($50/mo) to add a professional profile photo that makes your
              listing 3x more likely to be clicked!{" "}
              <Link href="/pricing" className="underline font-semibold">
                View Upgrade Options →
              </Link>
            </p>
          </div>
        </div>
      )}

      {/* Gallery Images - Standard/Pro */}
      {isPro || isStandard ? (
        <div className="space-y-2">
          <Label>Gallery Images</Label>
          <GalleryUpload
            maxImages={isPro ? 12 : 6}
            currentImages={galleryImages}
            onImagesChange={setGalleryImages}
            onUploadingChange={setIsGalleryUploading}
          />
          {/* Promo Video (link) */}
          <div className="space-y-1 pt-2">
            <Label htmlFor="video_url">Video URL (YouTube/Vimeo)</Label>
            <Input
              id="video_url"
              placeholder="https://youtu.be/... or https://vimeo.com/..."
              defaultValue={(listing as any).video_url || ""}
              onChange={(e) =>
                form.setValue("video_url" as any, e.target.value)
              }
              disabled={isPending}
            />
            <p className="text-xs text-gray-600">
              Must be a YouTube or Vimeo link.
            </p>
          </div>
          {/* Captions per image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {galleryImages.map((url, index) =>
              url ? (
                <div key={`caption-${index}`} className="space-y-1">
                  <Label htmlFor={`caption-${index}`}>
                    Caption for image {index + 1}
                  </Label>
                  <Textarea
                    id={`caption-${index}`}
                    placeholder="Write a caption (hashtags and links allowed)"
                    rows={3}
                    value={galleryCaptions[index] || ""}
                    onChange={(e) => {
                      const next = [...galleryCaptions];
                      next[index] = e.target.value;
                      setGalleryCaptions(next);
                    }}
                  />
                </div>
              ) : null,
            )}
          </div>
          <p className="text-xs text-gray-600">
            {isPro
              ? "Pro plan can upload up to 12 gallery images."
              : "Standard plan can upload up to 6 gallery images."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Gallery Images
          </Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 opacity-50 pointer-events-none">
            <div className="text-center">
              <Lock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-700">
                Gallery Locked
              </p>
              <p className="text-xs text-gray-500">
                Upgrade to Pro plan to unlock up to 12 gallery images
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-md p-4">
            <p className="text-sm text-purple-900">
              <strong>🖼️ Showcase Your Work with Gallery Images</strong>
              <br />
              Upgrade to Pro ($50/mo) to showcase up to 12 photos of your work,
              studio, or team!{" "}
              <Link href="/pricing" className="underline font-semibold">
                Upgrade to Pro →
              </Link>
            </p>
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="space-y-2">
        <Label>Categories {isFree && "(Select 1 - Free Plan)"}</Label>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center space-x-2">
              <Checkbox
                checked={String((form.watch("categories") as any) || "")
                  .split(", ")
                  .includes(category.category_name)}
                onCheckedChange={() =>
                  handleCategoryToggle(category.category_name)
                }
                disabled={
                  isPending ||
                  (isFree &&
                    !String((form.watch("categories") as any) || "")
                      .split(", ")
                      .includes(category.category_name) &&
                    String((form.watch("categories") as any) || "")
                      .split(", ")
                      .filter(Boolean).length >= 1)
                }
              />
              <span className="text-sm">{category.category_name}</span>
            </label>
          ))}
        </div>
        {isFree && (
          <p className="text-xs text-gray-600">
            Free Plan: You can select 1 category. Upgrade to Standard or Pro to
            select multiple categories.
          </p>
        )}
      </div>

      {/* Service Format Tags (stored in age_range field) */}
      <div className="space-y-2">
        <Label>Service Format Tags</Label>
        <div className="space-y-2">
          {["online", "in-person", "hybrid"].map((tag) => (
            <label key={tag} className="flex items-center space-x-2">
              <Checkbox
                checked={String((form.watch("age_range") as any) || "")
                  .split(", ")
                  .includes(tag)}
                onCheckedChange={() => handleTagToggle(tag, "age_range")}
                disabled={isPending}
              />
              <span className="text-sm capitalize">
                {tag.replace("-", " ")}
              </span>
            </label>
          ))}
        </div>
        <p className="text-xs text-gray-600">
          Select all that apply. These tags help families find your service.
        </p>
      </div>

      {/* Age Tags */}
      <div className="space-y-2">
        <Label>Age Tags</Label>
        <div className="flex flex-wrap gap-2">
          {["Ages 5–8", "Ages 9–12", "Ages 13–17", "Ages 18+"].map((tag) => (
            <label key={tag} className="flex items-center space-x-2">
              <Checkbox
                checked={String((form.watch("age_tags") as any) || "")
                  .split(", ")
                  .includes(tag)}
                onCheckedChange={() => handleTagToggle(tag, "age_tags")}
                disabled={isPending}
              />
              <span className="text-sm">{tag}</span>
            </label>
          ))}
        </div>
        <p className="text-xs text-gray-600">
          Pick one or more age bands you serve.
        </p>
      </div>

      {/* Structured Taxonomy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label>Services Offered</Label>
          <div className="space-y-2">
            {serviceOptions.map((opt) => (
              <label key={opt} className="flex items-center space-x-2">
                <Checkbox
                  checked={String((form.watch("services_offered") as any) || "")
                    .split(", ")
                    .includes(opt)}
                  onCheckedChange={() =>
                    handleTagToggle(opt, "services_offered")
                  }
                  disabled={isPending}
                />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Techniques</Label>
          <div className="space-y-2">
            {techniqueOptions.map((opt) => (
              <label key={opt} className="flex items-center space-x-2">
                <Checkbox
                  checked={String((form.watch("techniques") as any) || "")
                    .split(", ")
                    .includes(opt)}
                  onCheckedChange={() => handleTagToggle(opt, "techniques")}
                  disabled={isPending}
                />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Specialties</Label>
          <div className="space-y-2">
            {specialtyOptions.map((opt) => (
              <label key={opt} className="flex items-center space-x-2">
                <Checkbox
                  checked={String((form.watch("specialties") as any) || "")
                    .split(", ")
                    .includes(opt)}
                  onCheckedChange={() => handleTagToggle(opt, "specialties")}
                  disabled={isPending}
                />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Location/Region Tags */}
      <div className="space-y-2">
        <Label>Location/Region</Label>
        <div className="grid grid-cols-2 gap-2">
          {regionsList.map((regionName) => (
            <label key={regionName} className="flex items-center space-x-2">
              <Checkbox
                checked={String((form.watch("region") as any) || "")
                  .split(", ")
                  .includes(regionName)}
                onCheckedChange={() => handleTagToggle(regionName, "region")}
                disabled={isPending}
              />
              <span className="text-sm capitalize">{regionName}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Legal Compliance */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="ca_permit_required"
            checked={form.watch("ca_permit_required")}
            onCheckedChange={(checked) =>
              form.setValue("ca_permit_required", !!checked)
            }
            disabled={isPending}
          />
          <Label htmlFor="ca_permit_required">
            California Child Performer Services Permit Required
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_bonded"
            checked={form.watch("is_bonded")}
            onCheckedChange={(checked) => form.setValue("is_bonded", !!checked)}
            disabled={isPending}
          />
          <Label htmlFor="is_bonded">Bonded For Advanced Fees</Label>
        </div>
        {form.watch("is_bonded") && (
          <div className="space-y-1">
            <Label htmlFor="bond_number">Bond Number</Label>
            <Input
              id="bond_number"
              {...form.register("bond_number")}
              disabled={isPending}
            />
          </div>
        )}
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end gap-2 pt-4 border-t sticky bottom-0 bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/70">
        <Button
          type="button"
          variant="ghost"
          onClick={onFinished}
          disabled={
            isPending ||
            isImageUploading ||
            isLogoUploading ||
            isGalleryUploading
          }
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={
            isPending ||
            isImageUploading ||
            isLogoUploading ||
            isGalleryUploading
          }
        >
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
