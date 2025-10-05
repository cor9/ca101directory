"use client";

import { adminUpdateListing } from "@/actions/admin-edit";
import ImageUpload from "@/components/shared/image-upload";
import { GalleryUpload } from "@/components/submit/gallery-upload";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Listing } from "@/data/listings";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface AdminEditFormProps {
  listing: Listing;
  categories: Array<{ id: string; name: string }>;
}

export function AdminEditForm({ listing, categories }: AdminEditFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function to normalize format values from database
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

  const [formData, setFormData] = useState({
    name: listing.listing_name || "",
    link: listing.website || "",
    description: listing.what_you_offer || "",
    introduction: listing.who_is_it_for || "",
    unique: listing.why_is_it_unique || "",
    format: normalizeFormat(listing.format),
    notes: listing.extras_notes || "",
    imageId: listing.profile_image || "",
    tags: listing.tags || [], // Use proper tags field
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
    comped: listing.comped || false,
    status: listing.status || "Live",
    featured: listing.featured || false,
    approved_101: listing.is_approved_101 || false,
    claimed: listing.is_claimed || false,
    verification_status: listing.verification_status || "pending",
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

    if (isImageUploading || isGalleryUploading) {
      toast.error("Please wait for image uploads to complete");
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        gallery: galleryImages,
        listingId: listing.id,
        isEdit: true,
      };

      const result = await adminUpdateListing(submitData);

      if (result.success) {
        toast.success("Listing updated successfully!");
        router.push("/dashboard/admin/listings");
      } else {
        toast.error(result.error || "Failed to update listing");
      }
    } catch (error) {
      console.error("Error updating listing:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatOptions = ["In-person", "Online", "Hybrid"];
  const planOptions = ["Free", "Standard", "Pro", "Premium"];
  const statusOptions = ["Live", "Pending", "Draft", "Archived"];
  const verificationOptions = ["pending", "verified", "rejected"];

  return (
    <div className="text-gray-900">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Admin Status Card */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Admin Edit Mode
              </Badge>
              <span className="text-lg text-gray-900">Listing Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Row 1 - Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="status" className="text-gray-900 font-medium">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="plan" className="text-gray-900 font-medium">
                  Plan
                </Label>
                <Select
                  value={formData.plan}
                  onValueChange={(value) => handleInputChange("plan", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {planOptions.map((plan) => (
                      <SelectItem key={plan} value={plan}>
                        {plan}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="verification_status"
                  className="text-gray-900 font-medium"
                >
                  Verification Status
                </Label>
                <Select
                  value={formData.verification_status}
                  onValueChange={(value) =>
                    handleInputChange("verification_status", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select verification" />
                  </SelectTrigger>
                  <SelectContent>
                    {verificationOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 2 - Checkboxes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="comped"
                  checked={formData.comped}
                  onCheckedChange={(checked) =>
                    handleInputChange("comped", checked === true)
                  }
                />
                <Label htmlFor="comped" className="text-gray-900 font-medium">
                  Comped
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    handleInputChange("featured", checked === true)
                  }
                />
                <Label htmlFor="featured" className="text-gray-900 font-medium">
                  Featured
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) =>
                    handleInputChange("active", checked === true)
                  }
                />
                <Label htmlFor="active" className="text-gray-900 font-medium">
                  Active
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="approved_101"
                  checked={formData.approved_101}
                  onCheckedChange={(checked) =>
                    handleInputChange("approved_101", checked === true)
                  }
                />
                <Label
                  htmlFor="approved_101"
                  className="text-gray-900 font-medium"
                >
                  101 Approved
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="claimed"
                  checked={formData.claimed}
                  onCheckedChange={(checked) =>
                    handleInputChange("claimed", checked === true)
                  }
                />
                <Label htmlFor="claimed" className="text-gray-900 font-medium">
                  Claimed
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Business/Service Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter business name"
                required
              />
            </div>

            <div>
              <Label htmlFor="link">Website URL</Label>
              <Input
                id="link"
                type="url"
                value={formData.link}
                onChange={(e) => handleInputChange("link", e.target.value)}
                placeholder="https://"
              />
            </div>

            <div>
              <Label htmlFor="description">What You Offer *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Describe your services..."
                rows={6}
                required
                className="min-h-[120px]"
              />
            </div>

            <div>
              <Label htmlFor="introduction">Who Is It For?</Label>
              <Textarea
                id="introduction"
                value={formData.introduction}
                onChange={(e) =>
                  handleInputChange("introduction", e.target.value)
                }
                placeholder="Describe your target audience..."
                rows={4}
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="unique">Why Is It Unique?</Label>
              <Textarea
                id="unique"
                value={formData.unique}
                onChange={(e) => handleInputChange("unique", e.target.value)}
                placeholder="What makes you stand out..."
                rows={4}
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" className="text-gray-900 font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="contact@business.com"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="Los Angeles"
              />
            </div>

            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                placeholder="CA"
              />
            </div>

            <div>
              <Label htmlFor="zip">ZIP Code</Label>
              <Input
                id="zip"
                value={formData.zip}
                onChange={(e) => handleInputChange("zip", e.target.value)}
                placeholder="90210"
              />
            </div>

            <div>
              <Label htmlFor="region" className="text-gray-900 font-medium">
                Region
              </Label>
              <Input
                id="region"
                value={formData.region}
                onChange={(e) => handleInputChange("region", e.target.value)}
                placeholder="Greater LA Area"
              />
            </div>

            <div>
              <Label htmlFor="format" className="text-gray-900 font-medium">
                Format
              </Label>
              <Select
                value={formData.format}
                onValueChange={(value) => handleInputChange("format", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  {formatOptions.map((format) => (
                    <SelectItem key={format} value={format}>
                      {format}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.id}
                    checked={formData.categories.includes(category.id)}
                    onCheckedChange={() => handleCategoryToggle(category.id)}
                  />
                  <Label
                    htmlFor={category.id}
                    className="text-sm text-gray-900"
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Service Format Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900">Service Format</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {["online", "in-person", "hybrid"].map((tag) => (
                <div key={tag} className="flex items-center space-x-2">
                  <Checkbox
                    id={`format-${tag}`}
                    checked={formData.tags.includes(tag)}
                    onCheckedChange={() => handleTagToggle(tag)}
                  />
                  <Label
                    htmlFor={`format-${tag}`}
                    className="text-sm text-gray-900 capitalize"
                  >
                    {tag.replace("-", " ")}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Location/Region Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900">Location/Region</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
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
                <div key={tag} className="flex items-center space-x-2">
                  <Checkbox
                    id={`location-${tag}`}
                    checked={formData.tags.includes(tag)}
                    onCheckedChange={() => handleTagToggle(tag)}
                  />
                  <Label
                    htmlFor={`location-${tag}`}
                    className="text-sm text-gray-900 capitalize"
                  >
                    {tag.replace("-", " ")}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900">Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-900 font-medium">Profile Image</Label>
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

            <div>
              <Label className="text-gray-900 font-medium">
                Gallery Images (Max 4)
              </Label>
              <GalleryUpload
                maxImages={4}
                currentImages={galleryImages}
                onImagesChange={setGalleryImages}
                onUploadingChange={setIsGalleryUploading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="performerPermit"
                checked={formData.performerPermit}
                onCheckedChange={(checked) =>
                  handleInputChange("performerPermit", checked === true)
                }
              />
              <Label htmlFor="performerPermit">
                CA Performer Permit Required
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="bonded"
                checked={formData.bonded}
                onCheckedChange={(checked) =>
                  handleInputChange("bonded", checked === true)
                }
              />
              <Label htmlFor="bonded">Bonded</Label>
            </div>

            {formData.bonded && (
              <div>
                <Label htmlFor="bondNumber">Bond Number</Label>
                <Input
                  id="bondNumber"
                  value={formData.bondNumber}
                  onChange={(e) =>
                    handleInputChange("bondNumber", e.target.value)
                  }
                  placeholder="Enter bond number"
                />
              </div>
            )}

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Any additional information..."
                rows={4}
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={
                  isSubmitting || isImageUploading || isGalleryUploading
                }
                className="flex-1"
              >
                {isSubmitting ? "Updating..." : "Update Listing"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/admin/listings")}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
