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
import { FieldTooltip } from "@/components/ui/field-tooltip";
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
import { useFormAutosave } from "@/hooks/use-form-autosave";
import { checkmarkCelebration } from "@/lib/confetti";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
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
    // IMPORTANT: Pre-fill plan from existing listing if claiming
    plan: (existingListing as any)?.plan || "Free",
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

  // Autosave form data to localStorage
  const { loadSavedData, clearSavedData } = useFormAutosave({
    formData,
    storageKey: `listing-draft-${existingListing?.id || "new"}`,
    debounceMs: 2000,
    enabled: false, // Disabled autosave to prevent draft popup
  });

  // Load saved data on mount (only for new submissions)
  useEffect(() => {
    if (!existingListing) {
      const savedData = loadSavedData();
      if (savedData && Object.keys(savedData).length > 0) {
        // Auto-clear saved data without asking
        clearSavedData();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Helper to get error message for a field
  const getFieldError = (fieldName: string): string | null => {
    const errors = validationErrors[fieldName];
    return errors && errors.length > 0 ? errors[0] : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setValidationErrors({}); // Clear previous errors

    try {
      // Add gallery images to form data
      const formDataWithGallery = {
        ...formData,
        gallery: galleryImages.filter((img) => img), // Remove empty strings
      };

      const result = await submitToSupabase(formDataWithGallery);

      if (result.status === "success") {
        // Celebrate with confetti!
        try {
          checkmarkCelebration();
        } catch (confettiError) {
          console.error("Confetti error:", confettiError);
          // Don't let confetti break the success flow
        }
        toast.success("Listing submitted successfully!");

        // Clear saved draft after successful submission
        clearSavedData();

        // Route based on plan selection
        if (formData.plan === "Free") {
          // Free plan - go to success page
          router.push(`/submit/success?id=${result.listingId}`);
        } else {
          // Paid plan (Standard/Pro) - go to payment
          router.push(`/payment/${result.listingId}`);
        }
      } else {
        // Show field-level errors if available
        if (result.errors) {
          setValidationErrors(result.errors);
          // Show error toast with specific issues
          const errorCount = Object.keys(result.errors).length;
          toast.error(`Please fix ${errorCount} error(s) in the form`, {
            description: result.message,
            duration: 6000,
          });

          // Scroll to first error
          const firstErrorField = Object.keys(result.errors)[0];
          const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
          if (errorElement) {
            errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        } else {
          toast.error(result.message || "Failed to submit listing");
        }
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("An unexpected error occurred. Please check your entries and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="surface border-surface/20">
      <CardHeader>
        <CardTitle className="text-surface">
          {isClaimFlow ? "Edit Your Listing" : "Submit Your Listing"}
        </CardTitle>
        <CardDescription className="text-surface">
          {isClaimFlow
            ? "Update your listing information and choose your plan level."
            : "Create a professional listing for your child actor business."}
        </CardDescription>

        {/* Special message when claiming a Free listing */}
        {isClaimFlow &&
          existingListing &&
          ((existingListing as any)?.plan === "Free" ||
            !(existingListing as any)?.plan) && (
            <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-3xl">🎉</span>
                <div>
                  <h4 className="font-bold text-blue-900 mb-1">
                    You're Claiming a Free Listing!
                  </h4>
                  <p className="text-sm text-blue-800 mb-2">
                    This listing is currently on the <strong>Free plan</strong>,
                    which includes basic information only. You can keep it free
                    or upgrade now to unlock premium features:
                  </p>
                  <ul className="text-sm text-blue-800 space-y-1 ml-4 mb-3">
                    <li>
                      • <strong>Standard ($25/mo):</strong> Profile image +
                      enhanced fields
                    </li>
                    <li>
                      • <strong>Pro ($50/mo):</strong> Everything + gallery
                      images + social links
                    </li>
                  </ul>
                  <p className="text-xs text-blue-700 font-semibold">
                    💡 Choose your plan below to unlock features as you fill out
                    the form.
                  </p>
                </div>
              </div>
            </div>
          )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-surface">Basic Information</h3>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-surface">
                Business Name *
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Your business name"
                maxLength={100}
                required
                className={`bg-paper border-secondary-denim text-surface placeholder:text-surface/60 ${getFieldError("name") ? "border-red-500 border-2" : ""}`}
              />
              {getFieldError("name") && (
                <p className="text-red-600 text-sm font-semibold">⚠️ {getFieldError("name")}</p>
              )}
              <p className="text-surface text-xs">
                {formData.name.length}/100 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-surface">
                What You Offer *
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Describe your services"
                maxLength={256}
                required
                className={`bg-paper border-secondary-denim text-surface placeholder:text-surface/60 ${getFieldError("description") ? "border-red-500 border-2" : ""}`}
              />
              {getFieldError("description") && (
                <p className="text-red-600 text-sm font-semibold">⚠️ {getFieldError("description")}</p>
              )}
              <p className="text-surface text-xs">
                {formData.description.length}/256 characters
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="introduction" className="text-surface">
                  Who Is It For {formData.plan !== "Free" && "*"}
                </Label>
                <FieldTooltip
                  message="This field is only available for Standard and Pro plans. Upgrade to unlock."
                  plan={formData.plan as "Free" | "Standard" | "Pro"}
                  showUpgradeIcon={true}
                />
              </div>
              <Textarea
                id="introduction"
                value={formData.introduction}
                onChange={(e) =>
                  handleInputChange("introduction", e.target.value)
                }
                placeholder={
                  formData.plan === "Free"
                    ? "🔒 Upgrade to Standard or Pro to use this field"
                    : "Describe your target audience"
                }
                disabled={formData.plan === "Free"}
                className={`bg-paper border-secondary-denim text-surface placeholder:text-surface/60 ${
                  formData.plan === "Free"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              />
              {formData.plan === "Free" && (
                <div className="text-xs text-orange-600 bg-orange-50 border border-orange-200 rounded p-2 mt-1">
                  <strong>Premium Field:</strong> This field is only available
                  with Standard ($25/mo) or Pro ($50/mo) plans.{" "}
                  <a
                    href="/pricing"
                    className="underline hover:text-orange-700"
                  >
                    View plans
                  </a>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="unique" className="text-surface">
                  What Makes You Unique {formData.plan !== "Free" && "*"}
                </Label>
                <FieldTooltip
                  message="This field is only available for Standard and Pro plans. Upgrade to unlock."
                  plan={formData.plan as "Free" | "Standard" | "Pro"}
                  showUpgradeIcon={true}
                />
              </div>
              <Textarea
                id="unique"
                value={formData.unique}
                onChange={(e) => handleInputChange("unique", e.target.value)}
                placeholder={
                  formData.plan === "Free"
                    ? "🔒 Upgrade to Standard or Pro to use this field"
                    : "What sets you apart from others"
                }
                disabled={formData.plan === "Free"}
                className={`bg-paper border-secondary-denim text-surface placeholder:text-surface/60 ${
                  formData.plan === "Free"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              />
              {formData.plan === "Free" && (
                <div className="text-xs text-orange-600 bg-orange-50 border border-orange-200 rounded p-2 mt-1">
                  <strong>Premium Field:</strong> This field is only available
                  with Standard ($25/mo) or Pro ($50/mo) plans.{" "}
                  <a
                    href="/pricing"
                    className="underline hover:text-orange-700"
                  >
                    View plans
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Service Format */}
          <div className="space-y-4">
            <h3 className="text-surface">Service Format</h3>

            <div className="space-y-2">
              <Label className="text-surface">Format *</Label>
              <Select
                name="format"
                value={formData.format}
                onValueChange={(value) => handleInputChange("format", value)}
                required
              >
                <SelectTrigger className={`bg-paper border-secondary-denim text-surface ${getFieldError("format") ? "border-red-500 border-2" : ""}`}>
                  <SelectValue placeholder="Select service format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="In-person">In-person</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
              {getFieldError("format") && (
                <p className="text-red-600 text-sm font-semibold">⚠️ {getFieldError("format")}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-surface">Age Ranges</Label>
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
                      className="text-sm text-surface"
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
            <h3 className="text-surface">
              Categories * {formData.plan === "Free" && "(Select 1 - Free Plan)"}
              {formData.plan !== "Free" && "(Select all that apply)"}
            </h3>
            {formData.plan === "Free" && (
              <div className="text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded p-2">
                <strong>Free Plan:</strong> You can select 1 category. Upgrade
                to Standard or Pro to select multiple categories.
              </div>
            )}
            <div className={`grid grid-cols-2 gap-2 p-3 border rounded-lg ${getFieldError("categories") ? "border-red-500 border-2 bg-red-50" : ""}`}>
              {categories.map((category) => {
                const isDisabled =
                  formData.plan === "Free" &&
                  formData.categories.length >= 1 &&
                  !formData.categories.includes(category.id);

                return (
                  <div
                    key={category.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={formData.categories.includes(category.id)}
                      onCheckedChange={() => handleCategoryToggle(category.id)}
                      disabled={isDisabled}
                    />
                    <Label
                      htmlFor={`category-${category.id}`}
                      className={`text-sm text-surface ${isDisabled ? "opacity-50" : ""}`}
                    >
                      {category.name}
                    </Label>
                  </div>
                );
              })}
            </div>
            {getFieldError("categories") && (
              <p className="text-red-600 text-sm font-semibold">⚠️ {getFieldError("categories")}</p>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-surface">Contact Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-surface">
                  Email *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your@email.com"
                  required
                  className={`bg-paper border-secondary-denim text-surface placeholder:text-surface/60 ${getFieldError("email") ? "border-red-500 border-2" : ""}`}
                />
                {getFieldError("email") && (
                  <p className="text-red-600 text-sm font-semibold">⚠️ {getFieldError("email")}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-surface">
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
              <Label htmlFor="link" className="text-surface">
                Website *
              </Label>
              <Input
                id="link"
                name="link"
                type="url"
                value={formData.link}
                onChange={(e) => handleInputChange("link", e.target.value)}
                placeholder="yourwebsite.com (we'll add https:// for you)"
                className={`bg-paper border-secondary-denim text-surface placeholder:text-surface/60 ${getFieldError("link") ? "border-red-500 border-2" : ""}`}
              />
              {getFieldError("link") && (
                <p className="text-red-600 text-sm font-semibold">⚠️ {getFieldError("link")}</p>
              )}
              <p className="text-surface text-xs">You can enter just "yoursite.com" - we'll automatically add "https://"</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-surface">
                  City *
                </Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Los Angeles"
                  required
                  className={`bg-paper border-secondary-denim text-surface placeholder:text-surface/60 ${getFieldError("city") ? "border-red-500 border-2" : ""}`}
                />
                {getFieldError("city") && (
                  <p className="text-red-600 text-sm font-semibold">⚠️ {getFieldError("city")}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" className="text-surface">
                  State / Region *
                </Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  placeholder="e.g., CA, NY, or Ontario"
                  required
                  className={`bg-paper border-secondary-denim text-surface placeholder:text-surface/60 ${getFieldError("state") ? "border-red-500 border-2" : ""}`}
                />
                {getFieldError("state") && (
                  <p className="text-red-600 text-sm font-semibold">⚠️ {getFieldError("state")}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="zip" className="text-surface">
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
              <Label className="text-surface">
                Service Areas (Select all that apply) *
              </Label>
              <p className="text-surface">
                Where do you serve clients? Select all regions that apply.
              </p>
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 p-4 border rounded-lg bg-paper/50 ${getFieldError("region") ? "border-red-500 border-2" : ""}`}>
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
                      className="text-sm font-normal cursor-pointer text-surface"
                    >
                      {regionOption}
                    </Label>
                  </div>
                ))}
              </div>
              {getFieldError("region") && (
                <p className="text-red-600 text-sm font-semibold">⚠️ {getFieldError("region")}</p>
              )}
            </div>
          </div>

          {/* Plan Selection */}
          <div className="space-y-4">
            <h3 className="text-surface">Choose Your Plan</h3>
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
                    <li>• Basic directory listing</li>
                    <li>• Contact information</li>
                    <li>• Category</li>
                    <li>• Services Offered</li>
                  </ul>
                  <div className="mt-3 text-xs text-surface">
                    Upgrade for profile image & featured placement
                  </div>
                </CardContent>
              </Card>

              {/* Standard Plan */}
              <Card
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  formData.plan === "Standard"
                    ? "ring-2 ring-[#FF6B35] bg-blue-50"
                    : "border-gray-200"
                }`}
                onClick={() => handleInputChange("plan", "Standard")}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Standard</CardTitle>
                  <div className="text-2xl font-bold text-[#FF6B35]">
                    Starting at $25
                    <span className="text-sm font-normal">/mo</span>
                  </div>
                  <div className="text-xs text-surface mt-1">
                    Multiple billing options available
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="text-sm space-y-1">
                    <li>• Everything in Free</li>
                    <li>• 1 profile image</li>
                    <li>• Robust, Enhanced Listing</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Pro Plan */}
              <Card
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  formData.plan === "Pro"
                    ? "ring-2 ring-[#FF6B35] bg-purple-50"
                    : "border-gray-200"
                }`}
                onClick={() => handleInputChange("plan", "Pro")}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Pro</CardTitle>
                  <div className="text-2xl font-bold text-[#FF6B35]">
                    Starting at $50
                    <span className="text-sm font-normal">/mo</span>
                  </div>
                  <div className="text-xs text-surface mt-1">
                    Multiple billing options available
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="text-sm space-y-1">
                    <li>• Everything in Standard</li>
                    <li>• Up to 4 gallery images</li>
                    <li>• Social Media Links</li>
                    <li>• 101 Approved badge</li>
                    <li>• Top priority placement</li>
                    <li>• Priority support</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {formData.plan === "Free" && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-orange-300 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <p className="text-sm text-orange-900 mb-2">
                      <strong>Free Plan Selected:</strong> Your listing will
                      include basic information only. You won't be able to add:
                    </p>
                    <ul className="text-sm text-orange-800 space-y-1 mb-3 ml-4">
                      <li>• Profile image or gallery photos</li>
                      <li>
                        • Enhanced listing fields (Who it's for, What makes you
                        unique)
                      </li>
                      <li>• Social media links</li>
                      <li>• Multiple categories</li>
                    </ul>
                    <p className="text-sm text-orange-900 font-semibold">
                      ✨ Upgrade now to unlock all features and get 3x more
                      engagement!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {formData.plan === "Standard" && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <p className="text-sm text-green-900 mb-2">
                      <strong>Standard Plan Selected:</strong> Great choice!
                      Your listing will include:
                    </p>
                    <ul className="text-sm text-green-800 space-y-1 mb-2 ml-4">
                      <li>✓ Professional profile image</li>
                      <li>✓ Enhanced listing fields</li>
                      <li>✓ Multiple categories</li>
                      <li>✓ Featured placement</li>
                    </ul>
                    <p className="text-xs text-green-700">
                      Want gallery images and social links? Consider Pro plan
                      ($50/mo)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {formData.plan === "Pro" && (
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-300 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <p className="text-sm text-purple-900 mb-2">
                      <strong>Pro Plan Selected:</strong> Excellent! You get all
                      premium features:
                    </p>
                    <ul className="text-sm text-purple-800 space-y-1 ml-4">
                      <li>✓ Profile image + 4 gallery images</li>
                      <li>✓ All enhanced listing fields</li>
                      <li>✓ Social media links</li>
                      <li>✓ Multiple categories</li>
                      <li>✓ Top priority placement</li>
                      <li>✓ 101 Approved badge eligible</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Legal Compliance */}
          <div className="space-y-4">
            <h3 className="text-surface">Legal Compliance</h3>

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
                  className="text-sm text-surface"
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
                <Label htmlFor="bonded" className="text-sm text-surface">
                  Bonded for Advanced Fees
                </Label>
              </div>

              {formData.bonded && (
                <div className="space-y-2">
                  <Label htmlFor="bondNumber" className="text-surface">
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
            <Label htmlFor="notes" className="text-surface">
              Additional Notes {formData.plan !== "Free" && "(Optional)"}
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder={
                formData.plan === "Free"
                  ? "🔒 Upgrade to Standard or Pro to add additional notes"
                  : "Any additional information"
              }
              disabled={formData.plan === "Free"}
              className={`bg-paper border-secondary-denim text-surface placeholder:text-surface/60 ${
                formData.plan === "Free" ? "opacity-50 cursor-not-allowed" : ""
              }`}
            />
            {formData.plan === "Free" && (
              <div className="text-xs text-orange-600 bg-orange-50 border border-orange-200 rounded p-2 mt-1">
                <strong>Premium Field:</strong> Additional notes are only
                available with Standard ($25/mo) or Pro ($50/mo) plans.{" "}
                <a href="/pricing" className="underline hover:text-orange-700">
                  View plans
                </a>
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-surface">
              Profile Image {formData.plan !== "Free" && "(Recommended)"}
              {formData.plan === "Free" && " - Available with Standard or Pro"}
            </Label>
            {formData.plan === "Free" && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-3">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">📸</span>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">
                      Stand Out with a Professional Image
                    </h4>
                    <p className="text-sm text-blue-800 mb-2">
                      Free listings don't include images. Upgrade to{" "}
                      <strong>Standard ($25/mo)</strong> or{" "}
                      <strong>Pro ($50/mo)</strong> to add a professional
                      profile photo that makes your listing 3x more likely to be
                      clicked!
                    </p>
                    <a
                      href="/pricing"
                      className="inline-block text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors"
                    >
                      View Upgrade Options →
                    </a>
                  </div>
                </div>
              </div>
            )}
            <div
              className={`h-48 border-2 border-dashed border-secondary-denim rounded-lg ${formData.plan === "Free" ? "opacity-40 pointer-events-none" : ""}`}
            >
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
            {formData.plan === "Free" ? (
              <p className="text-surface text-sm">
                🔒 Profile images are available starting with the Standard plan
              </p>
            ) : (
              <p className="text-surface text-sm">
                Upload a professional photo or logo for your listing
              </p>
            )}
          </div>

          {/* Gallery Upload */}
          <div className="space-y-2">
            <Label className="text-surface">
              Gallery Images{" "}
              {formData.plan === "Pro" ? "(Up to 4)" : "- Pro Plan Only"}
            </Label>
            {formData.plan !== "Pro" && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 mb-3">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">🖼️</span>
                  <div>
                    <h4 className="font-semibold text-purple-900 mb-1">
                      Showcase Your Work with Gallery Images
                    </h4>
                    <p className="text-sm text-purple-800 mb-2">
                      {formData.plan === "Free"
                        ? "Free listings don't include gallery images. Upgrade to Pro ($50/mo) to showcase up to 4 additional photos of your work, studio, or team!"
                        : "Standard plan includes your profile image. Upgrade to Pro ($50/mo) to add 4 gallery images and showcase your portfolio!"}
                    </p>
                    <div className="flex gap-2">
                      <a
                        href="/pricing"
                        className="inline-block text-sm bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-medium transition-colors"
                      >
                        Upgrade to Pro →
                      </a>
                      <a
                        href="/help/image-guidelines"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-sm bg-purple-100 hover:bg-purple-200 text-purple-800 px-4 py-2 rounded font-medium transition-colors"
                      >
                        See Examples
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <GalleryUpload
              maxImages={getMaxGalleryImages()}
              currentImages={galleryImages}
              onImagesChange={setGalleryImages}
              onUploadingChange={setIsGalleryUploading}
            />
            <p className="text-surface text-sm">
              {getMaxGalleryImages() === 0
                ? "🔒 Gallery images are exclusive to Pro plan members"
                : "✅ Pro plan includes 4 gallery images (5 total with profile)"}
            </p>
          </div>

          {/* Social Media Section */}
          <div
            className={`space-y-4 p-4 border rounded-lg ${
              formData.plan !== "Pro" ? "opacity-60" : ""
            }`}
            style={{ backgroundColor: "#f8f9fa" }}
          >
            <div>
              <h3 className="text-lg font-semibold text-surface flex items-center gap-2">
                Social Media Links
                {formData.plan !== "Pro" && (
                  <span className="text-sm">🔒 Pro Plan Only</span>
                )}
              </h3>
              <p className="text-surface">
                {formData.plan === "Pro"
                  ? "Add your social media profiles to increase engagement."
                  : "Upgrade to Pro ($50/mo) to display social media links on your listing."}
              </p>
            </div>
            {formData.plan !== "Pro" && (
              <div className="bg-purple-50 border border-purple-200 rounded p-3">
                <p className="text-sm text-purple-800">
                  <strong>Pro Feature:</strong> Social media links are exclusive
                  to Pro plan members. Upgrade to Pro to showcase your Facebook,
                  Instagram, TikTok, YouTube, LinkedIn, and custom links.{" "}
                  <a
                    href="/pricing"
                    className="underline hover:text-purple-900"
                  >
                    View Pro plan
                  </a>
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="facebook_url" className="text-surface">
                  Facebook URL
                </Label>
                <Input
                  id="facebook_url"
                  type="url"
                  value={formData.facebook_url}
                  onChange={(e) =>
                    handleInputChange("facebook_url", e.target.value)
                  }
                  placeholder={
                    formData.plan === "Pro"
                      ? "https://facebook.com/yourpage"
                      : "🔒 Pro plan required"
                  }
                  disabled={formData.plan !== "Pro"}
                  className="bg-paper border-secondary-denim text-surface placeholder:text-surface/60"
                />
              </div>

              <div>
                <Label htmlFor="instagram_url" className="text-surface">
                  Instagram URL
                </Label>
                <Input
                  id="instagram_url"
                  type="url"
                  value={formData.instagram_url}
                  onChange={(e) =>
                    handleInputChange("instagram_url", e.target.value)
                  }
                  placeholder={
                    formData.plan === "Pro"
                      ? "https://instagram.com/youraccount"
                      : "🔒 Pro plan required"
                  }
                  disabled={formData.plan !== "Pro"}
                  className="bg-paper border-secondary-denim text-surface placeholder:text-surface/60"
                />
              </div>

              <div>
                <Label htmlFor="tiktok_url" className="text-surface">
                  TikTok URL
                </Label>
                <Input
                  id="tiktok_url"
                  type="url"
                  value={formData.tiktok_url}
                  onChange={(e) =>
                    handleInputChange("tiktok_url", e.target.value)
                  }
                  placeholder={
                    formData.plan === "Pro"
                      ? "https://tiktok.com/@youraccount"
                      : "🔒 Pro plan required"
                  }
                  disabled={formData.plan !== "Pro"}
                  className="bg-paper border-secondary-denim text-surface placeholder:text-surface/60"
                />
              </div>

              <div>
                <Label htmlFor="youtube_url" className="text-surface">
                  YouTube URL
                </Label>
                <Input
                  id="youtube_url"
                  type="url"
                  value={formData.youtube_url}
                  onChange={(e) =>
                    handleInputChange("youtube_url", e.target.value)
                  }
                  placeholder={
                    formData.plan === "Pro"
                      ? "https://youtube.com/@yourchannel"
                      : "🔒 Pro plan required"
                  }
                  disabled={formData.plan !== "Pro"}
                  className="bg-paper border-secondary-denim text-surface placeholder:text-surface/60"
                />
              </div>

              <div>
                <Label htmlFor="linkedin_url" className="text-surface">
                  LinkedIn URL
                </Label>
                <Input
                  id="linkedin_url"
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) =>
                    handleInputChange("linkedin_url", e.target.value)
                  }
                  placeholder={
                    formData.plan === "Pro"
                      ? "https://linkedin.com/in/yourprofile"
                      : "🔒 Pro plan required"
                  }
                  disabled={formData.plan !== "Pro"}
                  className="bg-paper border-secondary-denim text-surface placeholder:text-surface/60"
                />
              </div>

              <div>
                <Label htmlFor="blog_url" className="text-surface">
                  📝 Blog URL
                </Label>
                <Input
                  id="blog_url"
                  type="url"
                  value={formData.blog_url}
                  onChange={(e) =>
                    handleInputChange("blog_url", e.target.value)
                  }
                  placeholder={
                    formData.plan === "Pro"
                      ? "https://yourblog.com"
                      : "🔒 Pro plan required"
                  }
                  disabled={formData.plan !== "Pro"}
                  className="bg-paper border-secondary-denim text-surface placeholder:text-surface/60"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-surface">Custom Link</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="custom_link_name" className="text-surface">
                    Link Name
                  </Label>
                  <Input
                    id="custom_link_name"
                    value={formData.custom_link_name}
                    onChange={(e) =>
                      handleInputChange("custom_link_name", e.target.value)
                    }
                    placeholder={
                      formData.plan === "Pro"
                        ? "e.g., 'Portfolio', 'Book Now'"
                        : "🔒 Pro plan required"
                    }
                    disabled={formData.plan !== "Pro"}
                    className="bg-paper border-secondary-denim text-surface placeholder:text-surface/60"
                  />
                </div>
                <div>
                  <Label htmlFor="custom_link_url" className="text-surface">
                    Link URL
                  </Label>
                  <Input
                    id="custom_link_url"
                    type="url"
                    value={formData.custom_link_url}
                    onChange={(e) =>
                      handleInputChange("custom_link_url", e.target.value)
                    }
                    placeholder={
                      formData.plan === "Pro"
                        ? "https://your-custom-link.com"
                        : "🔒 Pro plan required"
                    }
                    disabled={formData.plan !== "Pro"}
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
