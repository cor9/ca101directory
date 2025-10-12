"use client";

import { submitToSupabase } from "@/actions/submit-supabase";
import ImageUpload from "@/components/shared/image-upload";
import { GalleryUpload } from "@/components/submit/gallery-upload";
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
  gallery?: string | null;
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
    name: existingListing?.listing_name || "",
    link: existingListing?.website || "",
    description: existingListing?.description || "",
    introduction: "",
    unique: "",
    format: normalizeFormat(existingListing?.format),
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
    region: (existingListing as any)?.region || [], // Array for multi-select
    bondNumber: "",
    active: true,
    // Social media fields
    facebook_url: "",
    instagram_url: "",
    tiktok_url: "",
    youtube_url: "",
    linkedin_url: "",
    blog_url: "",
    custom_link_url: "",
    custom_link_name: "",
  });

  const [isImageUploading, setIsImageUploading] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>(() => {
    // Handle both string and array types for gallery
    if (Array.isArray(existingListing?.gallery)) {
      return existingListing.gallery;
    }
    if (typeof existingListing?.gallery === "string") {
      try {
        return JSON.parse(existingListing.gallery);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);

  const getMaxGalleryImages = () => {
    if (formData.plan === "Pro") return 4; // Pro gets 4 gallery images (plus 1 profile = 5 total)
    return 0; // Only Pro gets gallery images
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
    <Card className="surface border-surface/20">
      <CardHeader>
        <CardTitle style={{ color: "#1F2327" }}>Submit Your Listing</CardTitle>
        <CardDescription style={{ color: "#333" }}>
          Create a professional listing for your child actor business
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: "#1F2327" }}>
              Basic Information
            </h3>

            <div className="space-y-2">
              <Label htmlFor="name" style={{ color: "#1F2327" }}>
                Business Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Your business name"
                maxLength={32}
                required
                className="bg-paper border-secondary-denim text-surface placeholder:text-surface/60"
              />
              <p className="text-xs" style={{ color: "#666" }}>
                {formData.name.length}/32 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" style={{ color: "#1F2327" }}>
                What You Offer *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Describe your services"
                maxLength={256}
                required
                className="bg-paper border-secondary-denim text-surface placeholder:text-surface/60"
              />
              <p className="text-xs" style={{ color: "#666" }}>
                {formData.description.length}/256 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="introduction" style={{ color: "#1F2327" }}>
                Who Is It For
              </Label>
              <Textarea
                id="introduction"
                value={formData.introduction}
                onChange={(e) =>
                  handleInputChange("introduction", e.target.value)
                }
                placeholder="Describe your target audience"
                className="bg-paper border-secondary-denim text-surface placeholder:text-surface/60"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unique" style={{ color: "#1F2327" }}>
                What Makes You Unique
              </Label>
              <Textarea
                id="unique"
                value={formData.unique}
                onChange={(e) => handleInputChange("unique", e.target.value)}
                placeholder="What sets you apart from competitors"
                className="bg-paper border-secondary-denim text-surface placeholder:text-surface/60"
              />
            </div>
          </div>

          {/* Service Format */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: "#1F2327" }}>
              Service Format
            </h3>

            <div className="space-y-2">
              <Label style={{ color: "#1F2327" }}>Format *</Label>
              <Select
                value={formData.format}
                onValueChange={(value) => handleInputChange("format", value)}
                required
              >
                <SelectTrigger className="bg-paper border-secondary-denim text-surface">
                  <SelectValue placeholder="Select service format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="In-person">In-person</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label style={{ color: "#1F2327" }}>Age Ranges</Label>
              <div className="grid grid-cols-2 gap-2">
                {["5-8", "9-12", "13-17", "18+"].map((age) => (
                  <div key={age} className="flex items-center space-x-2">
                    <Checkbox
                      id={`age-${age}`}
                      checked={formData.tags.includes(age)}
                      onCheckedChange={() => handleTagToggle(age)}
                    />
                    <Label
                      htmlFor={`age-${age}`}
                      className="text-sm"
                      style={{ color: "#333" }}
                    >
                      {age}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: "#1F2327" }}>
              Categories
            </h3>
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
                    style={{ color: "#333" }}
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: "#1F2327" }}>
              Contact Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" style={{ color: "#1F2327" }}>
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="bg-paper border-secondary-denim text-surface placeholder:text-surface/60"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" style={{ color: "#1F2327" }}>
                  Phone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="(555) 123-4567"
                  className="bg-paper border-secondary-denim text-surface placeholder:text-surface/60"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="link" style={{ color: "#1F2327" }}>
                Website
              </Label>
              <Input
                id="link"
                type="url"
                value={formData.link}
                onChange={(e) => handleInputChange("link", e.target.value)}
                placeholder="https://yourwebsite.com"
                className="bg-paper border-secondary-denim text-surface placeholder:text-surface/60"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" style={{ color: "#1F2327" }}>
                  City
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Los Angeles"
                  className="bg-paper border-secondary-denim text-surface placeholder:text-surface/60"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" style={{ color: "#1F2327" }}>
                  State
                </Label>
                <Select
                  value={formData.state}
                  onValueChange={(value) => handleInputChange("state", value)}
                >
                  <SelectTrigger className="bg-paper border-secondary-denim text-surface">
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
                <Label htmlFor="zip" style={{ color: "#1F2327" }}>
                  ZIP Code
                </Label>
                <Input
                  id="zip"
                  value={formData.zip}
                  onChange={(e) => handleInputChange("zip", e.target.value)}
                  placeholder="90210"
                  className="bg-paper border-secondary-denim text-surface placeholder:text-surface/60"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label style={{ color: "#1F2327" }}>
                Service Areas (Select all that apply)
              </Label>
              <p className="text-xs" style={{ color: "#666" }}>
                Where do you serve clients? Select all regions that apply.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 border rounded-lg bg-paper/50">
                {[
                  "West Coast",
                  "Southwest",
                  "Southeast",
                  "Midwest",
                  "Northeast",
                  "Mid-Atlantic",
                  "Pacific Northwest",
                  "Rocky Mountain",
                  "Canada",
                  "Global (Online Only)",
                ].map((regionOption) => (
                  <div
                    key={regionOption}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`region-${regionOption}`}
                      checked={(formData.region || []).includes(regionOption)}
                      onCheckedChange={(checked) => {
                        const currentRegions = formData.region || [];
                        const newRegions = checked
                          ? [...currentRegions, regionOption]
                          : currentRegions.filter((r) => r !== regionOption);
                        handleInputChange("region", newRegions);
                      }}
                    />
                    <Label
                      htmlFor={`region-${regionOption}`}
                      className="text-sm font-normal cursor-pointer"
                      style={{ color: "#1F2327" }}
                    >
                      {regionOption}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Plan Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: "#1F2327" }}>
              Choose Your Plan
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Free Plan */}
              <Card
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  formData.plan === "Free"
                    ? "ring-2 ring-[#FF6B35] bg-orange-50"
                    : "border-gray-200"
                }`}
                onClick={() => handleInputChange("plan", "Free")}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Free</CardTitle>
                  <div className="text-2xl font-bold text-[#FF6B35]">$0</div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="text-sm space-y-1">
                    <li>• Basic listing</li>
                    <li>• Profile image</li>
                    <li>• Standard placement</li>
                  </ul>
                  <div className="mt-3 text-xs text-gray-500">
                    Upgrade anytime for more features
                  </div>
                </CardContent>
              </Card>

              {/* Pro Plan */}
              <Card
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  formData.plan === "Pro"
                    ? "ring-2 ring-[#FF6B35] bg-blue-50"
                    : "border-gray-200"
                }`}
                onClick={() => handleInputChange("plan", "Pro")}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Pro</CardTitle>
                  <div className="text-2xl font-bold text-[#FF6B35]">
                    $50<span className="text-sm font-normal">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="text-sm space-y-1">
                    <li>• Everything in Free</li>
                    <li>• 4 gallery images</li>
                    <li>• Featured placement</li>
                    <li>• Priority support</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Premium Plan */}
              <Card
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  formData.plan === "Premium"
                    ? "ring-2 ring-[#FF6B35] bg-purple-50"
                    : "border-gray-200"
                }`}
                onClick={() => handleInputChange("plan", "Premium")}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Premium</CardTitle>
                  <div className="text-2xl font-bold text-[#FF6B35]">
                    $90<span className="text-sm font-normal">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="text-sm space-y-1">
                    <li>• Everything in Pro</li>
                    <li>• 101 Approved badge</li>
                    <li>• Top priority placement</li>
                    <li>• Premium support</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {formData.plan === "Free" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Free Plan:</strong> Perfect for getting started! You
                  can upgrade anytime to unlock gallery images and featured
                  placement.
                </p>
              </div>
            )}

            {formData.plan !== "Free" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800">
                  <strong>Paid Plan Selected:</strong> Great choice! Your
                  listing will be featured and you'll get premium placement.
                </p>
              </div>
            )}
          </div>

          {/* Legal Compliance */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: "#1F2327" }}>
              Legal Compliance
            </h3>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="performerPermit"
                  checked={formData.performerPermit}
                  onCheckedChange={(checked) =>
                    handleInputChange("performerPermit", checked)
                  }
                />
                <Label
                  htmlFor="performerPermit"
                  className="text-sm"
                  style={{ color: "#333" }}
                >
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
                <Label
                  htmlFor="bonded"
                  className="text-sm"
                  style={{ color: "#333" }}
                >
                  Bonded for Advanced Fees
                </Label>
              </div>

              {formData.bonded && (
                <div className="space-y-2">
                  <Label htmlFor="bondNumber" style={{ color: "#1F2327" }}>
                    Bond Number
                  </Label>
                  <Input
                    id="bondNumber"
                    value={formData.bondNumber}
                    onChange={(e) =>
                      handleInputChange("bondNumber", e.target.value)
                    }
                    placeholder="Bond number"
                    className="bg-paper border-secondary-denim text-surface placeholder:text-surface/60"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" style={{ color: "#1F2327" }}>
              Additional Notes
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Any additional information"
              className="bg-paper border-secondary-denim text-surface placeholder:text-surface/60"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label style={{ color: "#1F2327" }}>Profile Image</Label>
            <div className="h-48 border-2 border-dashed border-secondary-denim rounded-lg">
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
            <p className="text-xs" style={{ color: "#666" }}>
              Upload a professional photo or logo for your listing
            </p>
          </div>

          {/* Gallery Upload */}
          <div className="space-y-2">
            <Label style={{ color: "#1F2327" }}>Gallery Images</Label>
            <GalleryUpload
              maxImages={getMaxGalleryImages()}
              currentImages={galleryImages}
              onImagesChange={setGalleryImages}
              onUploadingChange={setIsGalleryUploading}
            />
            <p className="text-xs" style={{ color: "#666" }}>
              {getMaxGalleryImages() === 0
                ? "Gallery images are only available with Pro plan"
                : "Pro plan includes 4 gallery images (5 total with profile)"}
            </p>
          </div>

          {/* Social Media Section */}
          <div
            className="space-y-4 p-4 border rounded-lg"
            style={{ backgroundColor: "#f8f9fa" }}
          >
            <div>
              <h3
                className="text-lg font-semibold"
                style={{ color: "#1F2327" }}
              >
                Social Media Links (Pro/Premium only)
              </h3>
              <p className="text-sm" style={{ color: "#666" }}>
                These links will only be displayed for Pro and Premium listings.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="facebook_url" style={{ color: "#1F2327" }}>
                  Facebook URL
                </Label>
                <Input
                  id="facebook_url"
                  type="url"
                  value={formData.facebook_url}
                  onChange={(e) =>
                    handleInputChange("facebook_url", e.target.value)
                  }
                  placeholder="https://facebook.com/yourpage"
                  className="bg-paper border-secondary-denim text-surface placeholder:text-surface/60"
                />
              </div>

              <div>
                <Label htmlFor="instagram_url" style={{ color: "#1F2327" }}>
                  Instagram URL
                </Label>
                <Input
                  id="instagram_url"
                  type="url"
                  value={formData.instagram_url}
                  onChange={(e) =>
                    handleInputChange("instagram_url", e.target.value)
                  }
                  placeholder="https://instagram.com/youraccount"
                  className="bg-paper border-secondary-denim text-surface placeholder:text-surface/60"
                />
              </div>

              <div>
                <Label htmlFor="tiktok_url" style={{ color: "#1F2327" }}>
                  TikTok URL
                </Label>
                <Input
                  id="tiktok_url"
                  type="url"
                  value={formData.tiktok_url}
                  onChange={(e) =>
                    handleInputChange("tiktok_url", e.target.value)
                  }
                  placeholder="https://tiktok.com/@youraccount"
                  className="bg-paper border-secondary-denim text-surface placeholder:text-surface/60"
                />
              </div>

              <div>
                <Label htmlFor="youtube_url" style={{ color: "#1F2327" }}>
                  YouTube URL
                </Label>
                <Input
                  id="youtube_url"
                  type="url"
                  value={formData.youtube_url}
                  onChange={(e) =>
                    handleInputChange("youtube_url", e.target.value)
                  }
                  placeholder="https://youtube.com/@yourchannel"
                  className="bg-paper border-secondary-denim text-surface placeholder:text-surface/60"
                />
              </div>

              <div>
                <Label htmlFor="linkedin_url" style={{ color: "#1F2327" }}>
                  LinkedIn URL
                </Label>
                <Input
                  id="linkedin_url"
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) =>
                    handleInputChange("linkedin_url", e.target.value)
                  }
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="bg-paper border-secondary-denim text-surface placeholder:text-surface/60"
                />
              </div>

              <div>
                <Label htmlFor="blog_url" style={{ color: "#1F2327" }}>
                  📝 Blog URL
                </Label>
                <Input
                  id="blog_url"
                  type="url"
                  value={formData.blog_url}
                  onChange={(e) =>
                    handleInputChange("blog_url", e.target.value)
                  }
                  placeholder="https://yourblog.com"
                  className="bg-paper border-secondary-denim text-surface placeholder:text-surface/60"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3" style={{ color: "#1F2327" }}>
                Custom Link
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="custom_link_name"
                    style={{ color: "#1F2327" }}
                  >
                    Link Name
                  </Label>
                  <Input
                    id="custom_link_name"
                    value={formData.custom_link_name}
                    onChange={(e) =>
                      handleInputChange("custom_link_name", e.target.value)
                    }
                    placeholder="e.g., 'Portfolio', 'Book Now'"
                    className="bg-paper border-secondary-denim text-surface placeholder:text-surface/60"
                  />
                </div>
                <div>
                  <Label htmlFor="custom_link_url" style={{ color: "#1F2327" }}>
                    Link URL
                  </Label>
                  <Input
                    id="custom_link_url"
                    type="url"
                    value={formData.custom_link_url}
                    onChange={(e) =>
                      handleInputChange("custom_link_url", e.target.value)
                    }
                    placeholder="https://your-custom-link.com"
                    className="bg-paper border-secondary-denim text-surface placeholder:text-surface/60"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || isImageUploading || isGalleryUploading}
            className="w-full btn-primary"
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
