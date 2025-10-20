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

  // Helper function to normalize format values from database
  const normalizeFormat = (format: string | undefined): string => {
    if (!format) return "";
    const lowerFormat = format.toLowerCase();
    // Map to exact schema values
    if (lowerFormat === "in-person" || lowerFormat === "in person") {
      return "In-person";
    }
    if (lowerFormat === "online") {
      return "Online";
    }
    if (lowerFormat === "hybrid") {
      return "Hybrid";
    }
    // Default: capitalize first letter only
    return format.charAt(0).toUpperCase() + format.slice(1).toLowerCase();
  };

  const [formData, setFormData] = useState({
    name: listing.listing_name || "",
    link: listing.website || "",
    description: listing.what_you_offer || "",
    introduction: listing.who_is_it_for || "",
    unique: listing.why_is_it_unique || "",
    format: normalizeFormat(listing.format),
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
      // Ensure required fields are present
      const submitData = {
        ...formData,
        tags: formData.tags.length > 0 ? formData.tags : ["hybrid"], // Default tag
        categories:
          formData.categories.length > 0
            ? formData.categories
            : ["acting-coaches"], // Default category
        gallery: galleryImages,
        // Mark as update to existing listing
        listingId: listing.id,
        isEdit: true,
      };

      const result = await submitToSupabase(submitData);

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
        <h2 className="text-2xl font-bold text-paper mb-2">Edit Your Listing</h2>
        <p className="text-paper">Make changes to your listing information below.</p>
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

      <div className="space-y-2">
        <Label htmlFor="format">Format</Label>
        <select
          id="format"
          value={formData.format}
          onChange={(e) => handleInputChange("format", e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="">Select format</option>
          <option value="In-person">In-person Only</option>
          <option value="Online">Online Only</option>
          <option value="Hybrid">Hybrid (Online & In-person)</option>
        </select>
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
            onCheckedChange={(checked) => handleInputChange("bonded", checked)}
          />
          <Label htmlFor="bonded">Bonded For Advanced Fees</Label>
        </div>
        {formData.bonded && (
          <div className="space-y-2">
            <Label htmlFor="bondNumber">Bond Number</Label>
            <Input
              id="bondNumber"
              value={formData.bondNumber}
              onChange={(e) => handleInputChange("bondNumber", e.target.value)}
              placeholder="Enter bond number"
            />
          </div>
        )}
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
          <p className="text-xs text-paper">
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
              <>
                ✓ Update Listing
              </>
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
          Your changes will be saved immediately after clicking "Update Listing"
        </p>
      </div>
      </form>
    </div>
  );
}
