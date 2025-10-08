"use client";

import "./admin-edit-form.css";
import { adminCreateListing } from "@/actions/admin-create";
import ImageUpload from "@/components/shared/image-upload";
import { GalleryUpload } from "@/components/submit/gallery-upload";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
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

interface AdminCreateFormProps {
  categories: Array<{ id: string; name: string }>;
}

export function AdminCreateForm({ categories }: AdminCreateFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);

  // Initialize form with empty/default values
  const [formData, setFormData] = useState({
    name: "",
    link: "",
    description: "",
    introduction: "",
    unique: "",
    format: "",
    notes: "",
    imageId: "",
    tags: [] as string[],
    categories: [] as string[],
    plan: "Free",
    performerPermit: false,
    bonded: false,
    email: "",
    phone: "",
    city: "",
    state: "",
    zip: "",
    region: "",
    bondNumber: "",
    active: true,
    comped: false,
    status: "Live",
    featured: false,
    approved_101: false,
    claimed: false,
    verification_status: "verified",
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

  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const handleInputChange = (
    field: string,
    value: string | boolean | string[],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await adminCreateListing({
        ...formData,
        gallery: galleryImages,
      });

      if (result.success) {
        toast.success("Listing created successfully!");
        router.push("/dashboard/admin/listings");
      } else {
        toast.error(result.error || "Failed to create listing");
      }
    } catch (error) {
      console.error("Error creating listing:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      categories: checked
        ? [...prev.categories, categoryId]
        : prev.categories.filter((id) => id !== categoryId),
    }));
  };

  const handleTagChange = (tag: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      tags: checked ? [...prev.tags, tag] : prev.tags.filter((t) => t !== tag),
    }));
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="font-medium">
                  Listing Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter listing name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="link" className="font-medium">
                  Website
                </Label>
                <Input
                  id="link"
                  type="url"
                  value={formData.link}
                  onChange={(e) => handleInputChange("link", e.target.value)}
                  placeholder="https://your-website.com"
                />
              </div>
            </div>

              <div>
                <Label
                  htmlFor="description"
                  className="font-medium"
                >
                  What You Offer? *
                </Label>
              <RichTextEditor
                value={formData.description}
                onChange={(value) => handleInputChange("description", value)}
                placeholder="Describe what services you offer..."
              />
            </div>

              <div>
                <Label
                  htmlFor="introduction"
                  className="font-medium"
                >
                  Who Is It For?
                </Label>
              <RichTextEditor
                value={formData.introduction}
                onChange={(value) => handleInputChange("introduction", value)}
                placeholder="Describe your target audience..."
              />
            </div>

              <div>
                <Label htmlFor="unique" className="font-medium">
                  Why Is It Unique?
                </Label>
              <RichTextEditor
                value={formData.unique}
                onChange={(value) => handleInputChange("unique", value)}
                placeholder="What makes your service special?"
              />
            </div>

            <div>
              <Label htmlFor="format" className=" font-medium">
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
                  <SelectItem value="Online">Online Only</SelectItem>
                  <SelectItem value="In-person">In-Person Only</SelectItem>
                  <SelectItem value="Hybrid">
                    Hybrid (Online & In-Person)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes" className=" font-medium">
                Extras/Notes
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Any additional information..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Categories and Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Categories & Tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className=" font-medium">Categories *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={formData.categories.includes(category.id)}
                      onCheckedChange={(checked) =>
                        handleCategoryChange(category.id, !!checked)
                      }
                    />
                    <Label
                      htmlFor={`category-${category.id}`}
                      className="text-sm font-normal"
                    >
                      {category.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className=" font-medium">
                Age Range Tags
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {["5-8", "9-12", "13-17", "18+"].map((tag) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag}`}
                      checked={formData.tags.includes(tag)}
                      onCheckedChange={(checked) =>
                        handleTagChange(tag, !!checked)
                      }
                    />
                    <Label
                      htmlFor={`tag-${tag}`}
                      className="text-sm font-normal"
                    >
                      {tag}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email" className=" font-medium">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="contact@example.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone" className=" font-medium">
                  Phone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city" className=" font-medium">
                  City
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Los Angeles"
                />
              </div>

              <div>
                <Label htmlFor="state" className=" font-medium">
                  State
                </Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  placeholder="CA"
                />
              </div>

              <div>
                <Label htmlFor="zip" className=" font-medium">
                  ZIP Code
                </Label>
                <Input
                  id="zip"
                  value={formData.zip}
                  onChange={(e) => handleInputChange("zip", e.target.value)}
                  placeholder="90210"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="region" className=" font-medium">
                Region
              </Label>
              <Select
                value={formData.region}
                onValueChange={(value) => handleInputChange("region", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Los Angeles">Los Angeles</SelectItem>
                  <SelectItem value="New York">New York</SelectItem>
                  <SelectItem value="Virtual/Remote">Virtual/Remote</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className=" font-medium">Profile Image</Label>
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
              <Label className=" font-medium">
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

        {/* Business Details */}
        <Card>
          <CardHeader>
            <CardTitle>Business Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="plan" className=" font-medium">
                  Plan
                </Label>
                <Select
                  value={formData.plan}
                  onValueChange={(value) => handleInputChange("plan", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Free">Free</SelectItem>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Pro">Pro</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status" className=" font-medium">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Live">Live</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="verification_status"
                  className=" font-medium"
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
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="bondNumber"
                  className=" font-medium"
                >
                  Bond Number
                </Label>
                <Input
                  id="bondNumber"
                  value={formData.bondNumber}
                  onChange={(e) =>
                    handleInputChange("bondNumber", e.target.value)
                  }
                  placeholder="Enter bond number if applicable"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="performerPermit"
                  checked={formData.performerPermit}
                  onCheckedChange={(checked) =>
                    handleInputChange("performerPermit", !!checked)
                  }
                />
                <Label htmlFor="performerPermit" className="text-sm">
                  CA Child Performer Permit
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="bonded"
                  checked={formData.bonded}
                  onCheckedChange={(checked) =>
                    handleInputChange("bonded", !!checked)
                  }
                />
                <Label htmlFor="bonded" className="text-sm">
                  Bonded for Advanced Fees
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) =>
                    handleInputChange("active", !!checked)
                  }
                />
                <Label htmlFor="active" className="text-sm">
                  Active
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="comped"
                  checked={formData.comped}
                  onCheckedChange={(checked) =>
                    handleInputChange("comped", !!checked)
                  }
                />
                <Label htmlFor="comped" className="text-sm">
                  Comped
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    handleInputChange("featured", !!checked)
                  }
                />
                <Label htmlFor="featured" className="text-sm">
                  Featured
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="approved_101"
                  checked={formData.approved_101}
                  onCheckedChange={(checked) =>
                    handleInputChange("approved_101", !!checked)
                  }
                />
                <Label htmlFor="approved_101" className="text-sm">
                  101 Approved
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="claimed"
                  checked={formData.claimed}
                  onCheckedChange={(checked) =>
                    handleInputChange("claimed", !!checked)
                  }
                />
                <Label htmlFor="claimed" className="text-sm">
                  Claimed
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media & Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="facebook_url"
                  className=" font-medium"
                >
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
                />
              </div>

              <div>
                <Label
                  htmlFor="instagram_url"
                  className=" font-medium"
                >
                  Instagram URL
                </Label>
                <Input
                  id="instagram_url"
                  type="url"
                  value={formData.instagram_url}
                  onChange={(e) =>
                    handleInputChange("instagram_url", e.target.value)
                  }
                  placeholder="https://instagram.com/yourpage"
                />
              </div>

              <div>
                <Label
                  htmlFor="tiktok_url"
                  className=" font-medium"
                >
                  TikTok URL
                </Label>
                <Input
                  id="tiktok_url"
                  type="url"
                  value={formData.tiktok_url}
                  onChange={(e) =>
                    handleInputChange("tiktok_url", e.target.value)
                  }
                  placeholder="https://tiktok.com/@yourpage"
                />
              </div>

              <div>
                <Label
                  htmlFor="youtube_url"
                  className=" font-medium"
                >
                  YouTube URL
                </Label>
                <Input
                  id="youtube_url"
                  type="url"
                  value={formData.youtube_url}
                  onChange={(e) =>
                    handleInputChange("youtube_url", e.target.value)
                  }
                  placeholder="https://youtube.com/yourpage"
                />
              </div>

              <div>
                <Label
                  htmlFor="linkedin_url"
                  className=" font-medium"
                >
                  LinkedIn URL
                </Label>
                <Input
                  id="linkedin_url"
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) =>
                    handleInputChange("linkedin_url", e.target.value)
                  }
                  placeholder="https://linkedin.com/in/yourpage"
                />
              </div>

              <div>
                <Label htmlFor="blog_url" className=" font-medium">
                  Blog URL
                </Label>
                <Input
                  id="blog_url"
                  type="url"
                  value={formData.blog_url}
                  onChange={(e) =>
                    handleInputChange("blog_url", e.target.value)
                  }
                  placeholder="https://yourblog.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="custom_link_name"
                  className=" font-medium"
                >
                  Custom Link Name
                </Label>
                <Input
                  id="custom_link_name"
                  value={formData.custom_link_name}
                  onChange={(e) =>
                    handleInputChange("custom_link_name", e.target.value)
                  }
                  placeholder="Link Display Name"
                />
              </div>

              <div>
                <Label
                  htmlFor="custom_link_url"
                  className=" font-medium"
                >
                  Custom Link URL
                </Label>
                <Input
                  id="custom_link_url"
                  type="url"
                  value={formData.custom_link_url}
                  onChange={(e) =>
                    handleInputChange("custom_link_url", e.target.value)
                  }
                  placeholder="https://your-custom-link.com"
                />
              </div>
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
                {isSubmitting ? "Creating..." : "Create Listing"}
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
