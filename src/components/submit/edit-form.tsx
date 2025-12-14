"use client";

import { submitToSupabase } from "@/actions/submit-supabase";
import ImageUpload from "@/components/shared/image-upload";
import { GalleryUpload } from "@/components/submit/gallery-upload";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Listing } from "@/data/listings";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface EditFormProps {
  listing: Listing;
  categories: Array<{ id: string; name: string }>;
}

export function EditForm({ listing, categories }: EditFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Parse format from string to array (for tags)
  const parseFormatTags = (format: string | undefined): string[] => {
    if (!format) return [];
    // Handle comma-separated values or single value
    const normalized = format.toLowerCase().trim();
    if (normalized.includes(",")) {
      return normalized
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);
    }
    // Map single values to tag format
    if (normalized === "in-person" || normalized === "in person") {
      return ["in-person"];
    }
    if (normalized === "online") {
      return ["online"];
    }
    if (normalized === "hybrid") {
      return ["hybrid"];
    }
    return [];
  };

  const [formData, setFormData] = useState<{
    name: string;
    link: string;
    description: string;
    unique: string;
    format: string[]; // Always an array
    notes: string;
    imageId: string;
    tags: string[];
    categories: string[];
    plan: string;
    performerPermit: boolean;
    bonded: boolean;
    email: string;
    phone: string;
    city: string;
    state: string;
    zip: string;
    region: string[];
  }>({
    name: listing.listing_name || "",
    link: listing.website || "",
    description: listing.what_you_offer || "",
    unique: listing.why_is_it_unique || "",
    format: parseFormatTags(listing.format), // Always an array
    notes: listing.extras_notes || "",
    imageId: listing.profile_image || "",
    tags: listing.age_range || [],
    categories: listing.categories || [],
    plan: listing.plan || "Free",
    performerPermit: listing.ca_permit_required || false,
    bonded: listing.is_bonded || false,
    email: listing.email || "",
    phone: listing.phone || "",
    city: listing.city || "",
    state: listing.state || "",
    zip: listing.zip?.toString() || "",
    region: Array.isArray(listing.region)
      ? listing.region
      : listing.region
        ? [listing.region]
        : [],
  });

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

  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);

  const handleInputChange = (
    field: string,
    value: string | boolean | string[],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTagToggle = (tag: string) => {
    const newTags = formData.tags.includes(tag)
      ? formData.tags.filter((t) => t !== tag)
      : [...formData.tags, tag];
    handleInputChange("tags", newTags);
  };

  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = formData.categories.includes(categoryId)
      ? formData.categories.filter((c) => c !== categoryId)
      : [...formData.categories, categoryId];
    handleInputChange("categories", newCategories);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Ensure required fields are present
      const galleryObjects = Array.isArray(galleryImages)
        ? galleryImages
            .map((url, i) =>
              url ? { url, caption: galleryCaptions[i] || "" } : null,
            )
            .filter(Boolean)
        : [];

      const submitData = {
        ...formData,
        tags: formData.tags.length > 0 ? formData.tags : ["hybrid"], // Default tag
        categories:
          formData.categories.length > 0
            ? formData.categories
            : ["acting-coaches"], // Default category
        gallery: galleryObjects,
        // Mark as update to existing listing
        listingId: listing.id,
        isEdit: true,
      };

      const result = await submitToSupabase(submitData as any);

      if (result.status === "success") {
        toast.success("Listing updated successfully!");
        router.push("/dashboard/vendor");
      } else {
        toast.error(result.message || "Failed to update listing");
      }
    } catch (error) {
      console.error("Error updating listing:", error);
      toast.error("An error occurred while updating your listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-paper mb-2">
          Edit Your Listing
        </h2>
        <p className="text-paper">
          Make changes to your listing information below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Information */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Business Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Your business name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="link">Website</Label>
            <Input
              id="link"
              type="url"
              value={formData.link}
              onChange={(e) => handleInputChange("link", e.target.value)}
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>

        {/* Services */}
        <div className="space-y-2">
          <Label htmlFor="description">What You Offer</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Describe your services"
            rows={4}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unique">Why Is It Unique</Label>
          <Textarea
            id="unique"
            value={formData.unique}
            onChange={(e) => handleInputChange("unique", e.target.value)}
            placeholder="What makes your service special"
            rows={3}
          />
        </div>

        {/* Service Format Tags */}
        <div className="space-y-2">
          <Label>Service Format</Label>
          <div className="space-y-2">
            {["online", "in-person", "hybrid"].map((formatTag) => {
              // format is always an array
              const formatArray = formData.format || [];
              const isChecked = formatArray.includes(formatTag);

              return (
                <label
                  key={formatTag}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {
                      const newFormat = isChecked
                        ? formatArray.filter((f) => f !== formatTag)
                        : [...formatArray, formatTag];
                      handleInputChange("format", newFormat);
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm capitalize">
                    {formatTag.replace("-", " ")}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes/Extras</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            placeholder="Any additional information"
            rows={3}
          />
        </div>

        {/* Contact Information */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>
        </div>

        {/* Location Information */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              placeholder="Los Angeles"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
              placeholder="CA"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zip">ZIP Code</Label>
            <Input
              id="zip"
              value={formData.zip}
              onChange={(e) => handleInputChange("zip", e.target.value)}
              placeholder="90210"
            />
          </div>
        </div>

        {/* Legal Compliance */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="performerPermit"
              checked={formData.performerPermit}
              onCheckedChange={(checked) =>
                handleInputChange("performerPermit", checked)
              }
            />
            <Label htmlFor="performerPermit">
              California Child Performer Services Permit Required
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="bonded"
              checked={formData.bonded}
              onCheckedChange={(checked) =>
                handleInputChange("bonded", checked)
              }
            />
            <Label htmlFor="bonded">Bonded For Advanced Fees</Label>
          </div>
        </div>

        {/* Profile Image */}
        <div className="space-y-2">
          <Label>Profile Image</Label>
          <div className="h-48 border-2 border-dashed border-gray-300 rounded-lg">
            <ImageUpload
              currentImageUrl={formData.imageId}
              onUploadChange={(status) => {
                setIsImageUploading(status.isUploading);
                if (status.imageId) {
                  handleInputChange("imageId", status.imageId);
                }
              }}
              type="image"
            />
          </div>
        </div>

        {/* Gallery Images (only for Pro plans) */}
        {(listing.plan?.toLowerCase() === "pro" ||
          listing.plan?.toLowerCase() === "founding pro" ||
          listing.comped) && (
          <div className="space-y-2">
            <Label>Gallery Images</Label>
            <GalleryUpload
              maxImages={4}
              currentImages={galleryImages}
              onImagesChange={setGalleryImages}
              onUploadingChange={setIsGalleryUploading}
            />
            {/* Promo Video (link) */}
            <div className="space-y-1 pt-2">
              <p className="text-xs text-paper">
                Suggested length under 3 minutes. Keep it focused on what
                families should know.
              </p>
            </div>
            {/* Captions per image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {galleryImages.map((url, index) =>
                url ? (
                  <div key={`submit-caption-${index}`} className="space-y-1">
                    <Label htmlFor={`submit-caption-${index}`}>
                      Caption for image {index + 1}
                    </Label>
                    <Textarea
                      id={`submit-caption-${index}`}
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
            <p className="text-xs text-paper">
              {listing.plan?.toLowerCase() === "founding pro"
                ? "Founding Pro"
                : "Pro"}{" "}
              plan includes up to 12 gallery images
            </p>
          </div>
        )}

        {/* Categories */}
        <div className="space-y-2">
          <Label>Categories</Label>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.categories.includes(category.id)}
                  onChange={() => handleCategoryToggle(category.id)}
                  className="rounded"
                />
                <span className="text-sm">{category.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Service Format Tags */}
        <div className="space-y-2">
          <Label>Service Format</Label>
          <div className="space-y-2">
            {["online", "in-person", "hybrid"].map((tag) => (
              <label key={tag} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.tags.includes(tag)}
                  onChange={() => handleTagToggle(tag)}
                  className="rounded"
                />
                <span className="text-sm capitalize">
                  {tag.replace("-", " ")}
                </span>
              </label>
            ))}
          </div>
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
                <input
                  type="checkbox"
                  checked={formData.tags.includes(tag)}
                  onChange={() => handleTagToggle(tag)}
                  className="rounded"
                />
                <span className="text-sm capitalize">
                  {tag.replace("-", " ")}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="bg-gray-50 border-t border-gray-200 -mx-6 px-6 py-6 mt-8">
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting || isImageUploading || isGalleryUploading}
              className="flex-1 bg-primary-orange hover:bg-primary-orange/90 text-white font-semibold py-3 px-6 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                  Updating Listing...
                </>
              ) : (
                <>✓ Update Listing</>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/vendor")}
              className="px-6 py-3 text-paper hover:text-paper border-gray-300 hover:border-gray-400"
            >
              Cancel
            </Button>
          </div>
          <p className="text-sm text-paper mt-3 text-center">
            Your changes will be saved immediately after clicking "Update
            Listing"
          </p>
        </div>
      </form>
    </div>
  );
}
