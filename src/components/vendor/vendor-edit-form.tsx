"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
  const [categories, setCategories] = useState<Array<{ id: string; category_name: string }>>([]);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);
  const [profileImageId, setProfileImageId] = useState<string>(listing.profile_image || "");

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

  // Fetch categories on mount
  useEffect(() => {
    getCategoriesClient().then((cats) => {
      setCategories(cats.map(c => ({ id: c.id, category_name: c.category_name })));
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
      who_is_it_for: listing.who_is_it_for || "",
      why_is_it_unique: listing.why_is_it_unique || "",
      extras_notes: listing.extras_notes || "",
      format: normalizeFormat(listing.format),
      city: listing.city || "",
      state: listing.state || "",
      zip: listing.zip?.toString() || "",
      ca_permit_required: listing.ca_permit_required || false,
      is_bonded: listing.is_bonded || false,
      bond_number: listing.bond_number || "",
      categories: listing.categories || [],
      age_range: listing.age_range || [],
      region: listing.region || [],
      profile_image: listing.profile_image || "",
      gallery: typeof listing.gallery === "string" ? listing.gallery : JSON.stringify(listing.gallery || []),
      status: (listing.status === "Live" || listing.status === "Pending" || listing.status === "Draft" || listing.status === "Archived" || listing.status === "Rejected"
        ? listing.status
        : "Pending") as "Pending" | "Live" | "Rejected" | "Draft" | "Archived",
      is_claimed: !!listing.is_claimed,
      is_active: listing.is_active ?? true,
      plan: listing.plan || "Free",
    },
  });

  const plan = listing.plan?.toLowerCase() || "free";
  const isFree = plan === "free";
  const isStandard = plan === "standard" || plan === "founding standard";
  const isPro = plan === "pro" || plan === "founding pro" || listing.comped;

  const handleCategoryToggle = (categoryId: string) => {
    const current = form.getValues("categories") || [];
    const newCategories = current.includes(categoryId)
      ? current.filter((c) => c !== categoryId)
      : [...current, categoryId];

    // Free tier: limit to 1 category
    if (isFree && newCategories.length > 1) {
      toast.error("Free plan allows only 1 category. Upgrade to select multiple.");
      return;
    }

    form.setValue("categories", newCategories);
  };

  const handleTagToggle = (tag: string, field: "age_range" | "region") => {
    const current = form.getValues(field) || [];
    const newTags = current.includes(tag)
      ? current.filter((t) => t !== tag)
      : [...current, tag];
    form.setValue(field, newTags);
  };

  const onSubmit = (values: z.infer<typeof UpdateListingSchema>) => {
    console.log("Form submitted with values:", values);
    console.log("Form errors:", form.formState.errors);
    console.log("Profile image ID:", profileImageId);
    console.log("Gallery images:", galleryImages);
    
    startTransition(() => {
      // Prepare gallery as JSON string
      const galleryString = Array.isArray(galleryImages)
        ? JSON.stringify(galleryImages.filter(Boolean))
        : (typeof galleryImages === "string" ? galleryImages : JSON.stringify([]));

      const fullValues = {
        ...values,
        profile_image: profileImageId || "",
        gallery: galleryString,
        status: "Pending" as const, // Always set to Pending for vendor edits
        is_claimed: !!listing.is_claimed,
        is_active: listing.is_active ?? true,
      };

      console.log("Sending update with fullValues:", fullValues);

      updateListing(listing.id, fullValues)
        .then((res) => {
          console.log("Update response:", res);
          
          if (res.status === "error") {
            toast.error(res.message || "Failed to update listing");
            console.error("Update failed:", res.message);
          } else {
            toast.success("Listing has been submitted for review.");
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

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          <Input
            id="phone"
            {...form.register("phone")}
            disabled={isPending}
          />
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
            <Label htmlFor="who_is_it_for">Who Is It For</Label>
            <Textarea
              id="who_is_it_for"
              {...form.register("who_is_it_for")}
              rows={3}
              disabled={isPending}
              placeholder="Describe your target audience"
            />
          </div>

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
            <Label htmlFor="who_is_it_for" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Who Is It For
            </Label>
            <Textarea
              id="who_is_it_for"
              rows={3}
              disabled
              placeholder="🔒 Upgrade to Standard or Pro to use this field"
            />
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-md p-3 text-sm text-orange-800">
            <strong>Premium Field:</strong> This field is only available with Standard ($25/mo) or Pro ($50/mo) plans.{" "}
            <Link href="/pricing" className="underline font-semibold">View plans</Link>
          </div>

          <div className="space-y-1 opacity-50 pointer-events-none">
            <Label htmlFor="why_is_it_unique" className="flex items-center gap-2">
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
          <Input
            id="city"
            {...form.register("city")}
            disabled={isPending}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            {...form.register("state")}
            disabled={isPending}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="zip">ZIP Code</Label>
          <Input
            id="zip"
            {...form.register("zip")}
            disabled={isPending}
          />
        </div>
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
              <p className="text-sm text-gray-600">Free listings don't include images</p>
              <p className="text-xs text-gray-500 mt-1">Upgrade to Standard ($25/mo) or Pro ($50/mo) to add a profile photo</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-md p-4">
            <p className="text-sm text-blue-900">
              <strong>📸 Stand Out with a Professional Image</strong>
              <br />
              Free listings don't include images. Upgrade to Standard ($25/mo) or Pro ($50/mo) to add a professional profile photo that makes your listing 3x more likely to be clicked!{" "}
              <Link href="/pricing" className="underline font-semibold">View Upgrade Options →</Link>
            </p>
          </div>
        </div>
      )}

      {/* Gallery Images - Pro Only */}
      {isPro ? (
        <div className="space-y-2">
          <Label>Gallery Images</Label>
          <GalleryUpload
            maxImages={4}
            currentImages={galleryImages}
            onImagesChange={setGalleryImages}
            onUploadingChange={setIsGalleryUploading}
          />
          <p className="text-xs text-gray-600">
            {plan === "founding pro" ? "Founding Pro" : "Pro"} plan includes 4 gallery images (5 total with profile)
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
              <p className="text-sm font-semibold text-gray-700">Gallery Locked</p>
              <p className="text-xs text-gray-500">Upgrade to Pro plan to unlock 4 gallery images</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-md p-4">
            <p className="text-sm text-purple-900">
              <strong>🖼️ Showcase Your Work with Gallery Images</strong>
              <br />
              Upgrade to Pro ($50/mo) to showcase up to 4 additional photos of your work, studio, or team!{" "}
              <Link href="/pricing" className="underline font-semibold">Upgrade to Pro →</Link>
            </p>
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="space-y-2">
        <Label>
          Categories {isFree && "(Select 1 - Free Plan)"}
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center space-x-2">
              <Checkbox
                checked={(form.watch("categories") || []).includes(category.id)}
                onCheckedChange={() => handleCategoryToggle(category.id)}
                disabled={isPending || (isFree && !(form.watch("categories") || []).includes(category.id) && (form.watch("categories") || []).length >= 1)}
              />
              <span className="text-sm">{category.category_name}</span>
            </label>
          ))}
        </div>
        {isFree && (
          <p className="text-xs text-gray-600">
            Free Plan: You can select 1 category. Upgrade to Standard or Pro to select multiple categories.
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
                checked={(form.watch("age_range") || []).includes(tag)}
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

      {/* Location/Region Tags */}
      <div className="space-y-2">
        <Label>Location/Region</Label>
        <div className="grid grid-cols-2 gap-2">
          {[
            "los-angeles",
            "northern-california",
            "pnw",
            "new-mexico",
            "arizona",
            "texas",
            "chicago",
            "atlanta-southeast",
            "new-orleans",
            "florida",
            "new-york",
            "northeast-wilmington",
            "global-online",
          ].map((tag) => (
            <label key={tag} className="flex items-center space-x-2">
              <Checkbox
                checked={(form.watch("region") || []).includes(tag)}
                onCheckedChange={() => handleTagToggle(tag, "region")}
                disabled={isPending}
              />
              <span className="text-sm capitalize">
                {tag.replace("-", " ")}
              </span>
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
            onCheckedChange={(checked) => form.setValue("ca_permit_required", !!checked)}
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
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button
          type="button"
          variant="ghost"
          onClick={onFinished}
          disabled={isPending || isImageUploading || isGalleryUploading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending || isImageUploading || isGalleryUploading}
        >
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
