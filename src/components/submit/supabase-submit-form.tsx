"use client";

import { submitToSupabase } from "@/actions/submit-supabase";
import ImageUpload from "@/components/shared/image-upload";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
}

interface Listing {
  id: string;
  listing_name: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  city?: string;
  state?: string;
  zip?: number;
  categories?: string[];
  age_range?: string[];
  format?: string;
  notes?: string;
  image_url?: string;
}

interface SupabaseSubmitFormProps {
  categories: Category[];
  existingListing?: Listing | null;
  isClaimFlow?: boolean;
}

export function SupabaseSubmitForm({
  categories,
  existingListing,
  isClaimFlow = false,
}: SupabaseSubmitFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: existingListing?.listing_name || "",
    link: existingListing?.website || "",
    description: existingListing?.description || "",
    introduction: "",
    unique: "",
    format: existingListing?.format || "",
    notes: existingListing?.notes || "",
    imageId: existingListing?.image_url || "",
    tags: existingListing?.age_range || [],
    categories: existingListing?.categories || [],
    plan: "Free",
    performerPermit: false,
    bonded: false,
    email: existingListing?.email || "",
    phone: existingListing?.phone || "",
    city: existingListing?.city || "",
    state: existingListing?.state || "",
    zip: existingListing?.zip?.toString() || "",
    region: "",
    bondNumber: "",
  });

  const [isImageUploading, setIsImageUploading] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);

  const getMaxGalleryImages = () => {
    if (formData.plan === "Pro") return 4;
    if (formData.plan === "Standard") return 1;
    return 0; // Free plan gets no gallery images
  };

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
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((c) => c !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Add gallery images to form data
      const formDataWithGallery = {
        ...formData,
        gallery: galleryImages.filter((img) => img), // Remove empty strings
      };

      const result = await submitToSupabase(formDataWithGallery);

      if (result.status === "success") {
        toast.success("Listing submitted successfully!");

        if (isClaimFlow) {
          // For claim flow, redirect to plan selection
          router.push(`/plan-selection?listingId=${result.listingId}`);
        } else {
          // For regular submission, go to success page
          router.push("/submit/success");
        }
      } else {
        toast.error(result.message || "Failed to submit listing");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Your Listing</CardTitle>
        <CardDescription>
          Create a professional listing for your child actor business
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>

            <div className="space-y-2">
              <Label htmlFor="name">Business Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Your business name"
                maxLength={32}
                required
              />
              <p className="text-xs text-muted-foreground">
                {formData.name.length}/32 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">What You Offer *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Describe your services"
                maxLength={256}
                required
              />
              <p className="text-xs text-muted-foreground">
                {formData.description.length}/256 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="introduction">Who Is It For</Label>
              <Textarea
                id="introduction"
                value={formData.introduction}
                onChange={(e) =>
                  handleInputChange("introduction", e.target.value)
                }
                placeholder="Describe your target audience"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unique">What Makes You Unique</Label>
              <Textarea
                id="unique"
                value={formData.unique}
                onChange={(e) => handleInputChange("unique", e.target.value)}
                placeholder="What sets you apart from competitors"
              />
            </div>
          </div>

          {/* Service Format */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Service Format</h3>

            <div className="space-y-2">
              <Label>Format *</Label>
              <Select
                value={formData.format}
                onValueChange={(value) => handleInputChange("format", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="In-person">In-Person</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Age Ranges</Label>
              <div className="grid grid-cols-2 gap-2">
                {["5-8", "9-12", "13-17", "18+"].map((age) => (
                  <div key={age} className="flex items-center space-x-2">
                    <Checkbox
                      id={`age-${age}`}
                      checked={formData.tags.includes(age)}
                      onCheckedChange={() => handleTagToggle(age)}
                    />
                    <Label htmlFor={`age-${age}`} className="text-sm">
                      {age}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Categories</h3>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={formData.categories.includes(category.id)}
                    onCheckedChange={() => handleCategoryToggle(category.id)}
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="text-sm"
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
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
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <Select
                  value={formData.state}
                  onValueChange={(value) => handleInputChange("state", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="GA">Georgia</SelectItem>
                    <SelectItem value="IL">Illinois</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
                    <SelectItem value="FL">Florida</SelectItem>
                  </SelectContent>
                </Select>
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

            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Select
                value={formData.region}
                onValueChange={(value) => handleInputChange("region", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Los Angeles">Los Angeles</SelectItem>
                  <SelectItem value="San Francisco Bay Area">
                    San Francisco Bay Area
                  </SelectItem>
                  <SelectItem value="San Diego">San Diego</SelectItem>
                  <SelectItem value="Sacramento">Sacramento</SelectItem>
                  <SelectItem value="Central Valley">Central Valley</SelectItem>
                  <SelectItem value="Orange County">Orange County</SelectItem>
                  <SelectItem value="Ventura County">Ventura County</SelectItem>
                  <SelectItem value="Riverside County">
                    Riverside County
                  </SelectItem>
                  <SelectItem value="San Bernardino County">
                    San Bernardino County
                  </SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Plan Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Plan Selection</h3>
            <RadioGroup
              value={formData.plan}
              onValueChange={(value) => handleInputChange("plan", value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Free" id="plan-free" />
                <Label htmlFor="plan-free">Free</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Standard" id="plan-standard" />
                <Label htmlFor="plan-standard">Standard</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Pro" id="plan-pro" />
                <Label htmlFor="plan-pro">Pro</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="Founding Standard"
                  id="plan-founding-standard"
                />
                <Label htmlFor="plan-founding-standard">
                  Founding Standard
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Founding Pro" id="plan-founding-pro" />
                <Label htmlFor="plan-founding-pro">Founding Pro</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Legal Compliance */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Legal Compliance</h3>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="performerPermit"
                  checked={formData.performerPermit}
                  onCheckedChange={(checked) =>
                    handleInputChange("performerPermit", checked)
                  }
                />
                <Label htmlFor="performerPermit" className="text-sm">
                  California Child Performer Services Permit
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
                <Label htmlFor="bonded" className="text-sm">
                  Bonded for Advanced Fees
                </Label>
              </div>

              {formData.bonded && (
                <div className="space-y-2">
                  <Label htmlFor="bondNumber">Bond Number</Label>
                  <Input
                    id="bondNumber"
                    value={formData.bondNumber}
                    onChange={(e) =>
                      handleInputChange("bondNumber", e.target.value)
                    }
                    placeholder="Bond number"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Any additional information"
            />
          </div>

          {/* Image Upload */}
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
            <p className="text-xs text-muted-foreground">
              Upload a professional photo or logo for your listing
            </p>
          </div>

          {/* Gallery Upload */}
          <div className="space-y-2">
            <Label>Gallery Images</Label>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: getMaxGalleryImages() }).map((_, index) => (
                <div
                  key={index}
                  className="h-32 border-2 border-dashed border-gray-300 rounded-lg"
                >
                  <ImageUpload
                    currentImageUrl={galleryImages[index] || ""}
                    onUploadChange={(status) => {
                      setIsGalleryUploading(status.isUploading);
                      if (status.imageId) {
                        const newGallery = [...galleryImages];
                        newGallery[index] = status.imageId;
                        setGalleryImages(newGallery);
                      }
                    }}
                    type="image"
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {getMaxGalleryImages() === 1
                ? "Standard plan includes 1 gallery image"
                : `Pro plan includes up to ${getMaxGalleryImages()} gallery images`}
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || isImageUploading || isGalleryUploading}
            className="w-full"
          >
            {isSubmitting
              ? "Submitting..."
              : isImageUploading || isGalleryUploading
                ? "Uploading Images..."
                : "Submit Listing"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
