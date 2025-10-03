"use client";

import { submitToSupabase } from "@/actions/submit-supabase";
import { ImageUpload } from "@/components/shared/image-upload";
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
  const [formData, setFormData] = useState({
    name: listing.listing_name || "",
    link: listing.website || "",
    description: listing.what_you_offer || "",
    introduction: listing.who_is_it_for || "",
    unique: listing.why_is_it_unique || "",
    format: listing.format || "",
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
    region: listing.region || "",
    bondNumber: listing.bond_number || "",
    active: listing.is_active ?? true,
  });

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
      const result = await submitToSupabase({
        ...formData,
        gallery: galleryImages,
        // Mark as update to existing listing
        listingId: listing.id,
        isEdit: true,
      });

      if (result.success) {
        toast.success("Listing updated successfully!");
        router.push("/dashboard/vendor");
      } else {
        toast.error(result.error || "Failed to update listing");
      }
    } catch (error) {
      console.error("Error updating listing:", error);
      toast.error("An error occurred while updating your listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">
          Editing: {listing.listing_name}
        </h2>
        <p className="text-sm text-blue-600">
          Current Plan: <strong>{listing.plan}</strong>
        </p>
      </div>

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
        <Label htmlFor="introduction">Who Is It For</Label>
        <Textarea
          id="introduction"
          value={formData.introduction}
          onChange={(e) => handleInputChange("introduction", e.target.value)}
          placeholder="Target audience"
          rows={3}
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
      {listing.plan === "Pro" && (
        <div className="space-y-2">
          <Label>Gallery Images</Label>
          <GalleryUpload
            maxImages={4}
            currentImages={galleryImages}
            onImagesChange={setGalleryImages}
            onUploadingChange={setIsGalleryUploading}
          />
          <p className="text-xs text-muted-foreground">
            Pro plan includes 4 gallery images (5 total with profile)
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

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isSubmitting || isImageUploading || isGalleryUploading}
          className="w-full"
        >
          {isSubmitting ? "Updating..." : "Update Listing"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/vendor")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
