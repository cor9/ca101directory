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
import Link from "next/link";
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

type PlanTier = "Free" | "Standard" | "Pro";

const tierLabels: Record<PlanTier, string> = {
  Free: "Free",
  Standard: "Standard ($25/mo)",
  Pro: "Pro ($50/mo)",
};

const getPlanTier = (plan: string | undefined | null): PlanTier => {
  if (!plan) return "Free";
  const normalized = plan.toLowerCase();
  if (normalized.includes("pro")) return "Pro";
  if (normalized.includes("standard")) return "Standard";
  return "Free";
};

interface ClaimFlowUpgradeCalloutProps {
  requiredTier: Exclude<PlanTier, "Free">;
  headline: string;
  body: string;
  helpHref?: string;
  helpLabel?: string;
}

function ClaimFlowUpgradeCallout({
  requiredTier,
  headline,
  body,
  helpHref,
  helpLabel,
}: ClaimFlowUpgradeCalloutProps) {
  return (
    <div className="rounded-lg border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-3">
          <span className="text-2xl" aria-hidden>
            🚀
          </span>
          <div>
            <h4 className="font-semibold text-orange-900">{headline}</h4>
            <p className="text-sm text-orange-800">{body}</p>
            {helpHref && (
              <Link
                href={helpHref}
                className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-orange-700 underline hover:text-orange-900"
              >
                {helpLabel ?? "Read best practices"}
                <span aria-hidden>→</span>
              </Link>
            )}
          </div>
        </div>
        <div className="flex flex-col items-stretch gap-2 md:min-w-[220px]">
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-md bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#e85d2d]"
          >
            Upgrade to {tierLabels[requiredTier]}
          </Link>
          <p className="text-right text-xs font-medium text-orange-700 md:text-left">
            Unlock this field with the {tierLabels[requiredTier]} plan.
          </p>
        </div>
      </div>
    </div>
  );
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
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});
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

  const planTier = getPlanTier(formData.plan);
  const canUseStandardFields = planTier !== "Free";
  const canUseProFields = planTier === "Pro";

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

  // Helper functions to check plan tiers
  const isProTierPlan = (plan: string) => {
    return plan === "Pro" || plan === "Founding Pro";
  };

  const getMaxGalleryImages = () => {
    if (isProTierPlan(formData.plan)) return 4; // Pro tiers get 4 gallery images (plus 1 profile = 5 total)
    return 0; // Only Pro tiers get gallery images
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
          const errorElement = document.querySelector(
            `[name="${firstErrorField}"]`,
          );
          if (errorElement) {
            errorElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        } else {
          toast.error(result.message || "Failed to submit listing");
        }
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(
        "An unexpected error occurred. Please check your entries and try again.",
      );
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
          {/* Plan Selection - Moved to top for better UX */}
          <div className="space-y-4">
            <h3 className="text-surface">Choose Your Plan</h3>
            <p className="text-sm text-surface/80">
              Select your plan first to see which fields you can use. You can
              upgrade anytime.
            </p>
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

              {/* Founding Standard */}
              <Card
                className={`cursor-pointer transition-all hover:shadow-lg relative ${
                  formData.plan === "Founding Standard"
                    ? "ring-2 ring-[#FF6B35] bg-blue-50"
                    : "border-gray-200"
                }`}
                onClick={() => handleInputChange("plan", "Founding Standard")}
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  🎉 LIMITED TIME
                </div>
                <CardHeader className="pb-3 pt-4">
                  <CardTitle className="text-lg">Founding Standard</CardTitle>
                  <div className="text-2xl font-bold text-[#FF6B35]">
                    $101
                    <span className="text-sm font-normal"> for 6 months</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    ~$16.83/month - vs $25/month regular
                  </div>
                  <div className="text-xs text-green-700 font-semibold mt-1">
                    🔒 Locked rate as long as you stay subscribed!
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="text-sm space-y-1">
                    <li>• Everything in Free</li>
                    <li>• 1 profile image</li>
                    <li>• Robust, Enhanced Listing</li>
                    <li className="text-orange-600 font-semibold">
                      • Founding Member Badge
                    </li>
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

              {/* Founding Pro */}
              <Card
                className={`cursor-pointer transition-all hover:shadow-lg relative ${
                  formData.plan === "Founding Pro"
                    ? "ring-2 ring-[#FF6B35] bg-purple-50"
                    : "border-gray-200"
                }`}
                onClick={() => handleInputChange("plan", "Founding Pro")}
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  🌟 MOST POPULAR
                </div>
                <CardHeader className="pb-3 pt-4">
                  <CardTitle className="text-lg">Founding Pro</CardTitle>
                  <div className="text-2xl font-bold text-[#FF6B35]">
                    $199
                    <span className="text-sm font-normal"> for 6 months</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    ~$33.17/month - vs $50/month regular
                  </div>
                  <div className="text-xs text-green-700 font-semibold mt-1">
                    🔒 Locked rate as long as you stay subscribed!
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="text-sm space-y-1">
                    <li>• Everything in Standard</li>
                    <li>• Up to 4 gallery images</li>
                    <li>• Social Media Links</li>
                    <li>• 101 Approved badge eligible</li>
                    <li>• Top priority placement</li>
                    <li>• Priority support</li>
                    <li className="text-purple-600 font-semibold">
                      • Founding Member Badge
                    </li>
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

            {formData.plan === "Founding Standard" && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-orange-400 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">🎉</span>
                  <div>
                    <p className="text-sm text-orange-900 mb-2">
                      <strong>Founding Standard Selected:</strong> Amazing
                      choice! You're locking in an exclusive 6-month rate:
                    </p>
                    <ul className="text-sm text-orange-800 space-y-1 mb-3 ml-4">
                      <li>✓ Professional profile image</li>
                      <li>✓ Enhanced listing fields</li>
                      <li>✓ Multiple categories</li>
                      <li>✓ Featured placement</li>
                      <li className="font-bold text-orange-600">
                        ✓ Founding Member Badge (exclusive!)
                      </li>
                      <li className="font-bold text-green-700">
                        ✓ Only $101 for 6 months (~$16.83/mo vs $25/mo regular)
                      </li>
                    </ul>
                    <p className="text-xs text-orange-900 font-semibold bg-orange-100 p-2 rounded">
                      🔒 This special 6-month rate stays locked as long as you
                      keep your subscription active!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {formData.plan === "Founding Pro" && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-400 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">🌟</span>
                  <div>
                    <p className="text-sm text-purple-900 mb-2">
                      <strong>Founding Pro Selected:</strong> MOST POPULAR!
                      You're getting the ultimate 6-month deal:
                    </p>
                    <ul className="text-sm text-purple-800 space-y-1 mb-3 ml-4">
                      <li>✓ Profile image + 4 gallery images</li>
                      <li>✓ All enhanced listing fields</li>
                      <li>✓ Social media links</li>
                      <li>✓ Multiple categories</li>
                      <li>✓ Top priority placement</li>
                      <li>✓ 101 Approved badge eligible</li>
                      <li>✓ Priority support</li>
                      <li className="font-bold text-purple-600">
                        ✓ Founding Member Badge (exclusive!)
                      </li>
                      <li className="font-bold text-green-700">
                        ✓ Only $199 for 6 months (~$33.17/mo vs $50/mo regular)
                      </li>
                    </ul>
                    <p className="text-xs text-purple-900 font-semibold bg-purple-100 p-2 rounded">
                      🔒 This exclusive 6-month rate stays locked forever as
                      long as you keep your subscription active!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-surface">Basic Information</h3>
              <Link
                href="/help/editing-listing"
                className="text-xs font-medium text-[#FF6B35] underline hover:text-[#d95728]"
              >
                Writing tips
              </Link>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="name" className="text-surface">
                  Business Name *
                </Label>
                <FieldTooltip
                  message="Use the name parents will search for. Example: “Bright Star Talent Coaching.”"
                  plan={planTier}
                />
              </div>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Bright Star Talent Coaching"
                maxLength={100}
                required
                className={`bg-paper border-secondary-denim text-surface placeholder:text-surface/60 ${getFieldError("name") ? "border-red-500 border-2" : ""}`}
              />
              {getFieldError("name") && (
                <p className="text-red-600 text-sm font-semibold">
                  ⚠️ {getFieldError("name")}
                </p>
              )}
              <p className="text-surface text-xs">
                {formData.name.length}/100 characters • Matches your
                public-facing name.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="description" className="text-surface">
                  What You Offer *
                </Label>
                <FieldTooltip
                  message="Summarize your service in one clear sentence. Example: “On-set tutoring and audition prep for union kids.”"
                  plan={planTier}
                />
              </div>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Ex: On-set tutoring and audition prep for young performers in Los Angeles."
                maxLength={256}
                required
                className={`bg-paper border-secondary-denim text-surface placeholder:text-surface/60 ${getFieldError("description") ? "border-red-500 border-2" : ""}`}
              />
              {getFieldError("description") && (
                <p className="text-red-600 text-sm font-semibold">
                  ⚠️ {getFieldError("description")}
                </p>
              )}
              <p className="text-surface text-xs">
                {formData.description.length}/256 characters • Aim for one
                sentence.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="introduction" className="text-surface">
                  Who Is It For {canUseStandardFields && "*"}
                </Label>
                <FieldTooltip
                  message="Describe the families or performers you serve. Example: “Parents seeking private coaching for ages 8-15.”"
                  plan={planTier}
                  showUpgradeIcon={!canUseStandardFields}
                />
              </div>
              {isClaimFlow && !canUseStandardFields ? (
                <ClaimFlowUpgradeCallout
                  requiredTier="Standard"
                  headline="Help families know if this listing fits them"
                  body="Upgrade to add a short paragraph explaining the age ranges, experience level, or type of performers you specialize in."
                  helpHref="/help/editing-listing"
                  helpLabel="See targeting tips"
                />
              ) : (
                <>
                  <Textarea
                    id="introduction"
                    value={formData.introduction}
                    onChange={(e) =>
                      handleInputChange("introduction", e.target.value)
                    }
                    placeholder={
                      canUseStandardFields
                        ? "Ex: We guide new-to-set families with weekly coaching for ages 6-12."
                        : "🔒 Upgrade to Standard or Pro to describe your audience"
                    }
                    disabled={!canUseStandardFields}
                    className={`bg-paper border-secondary-denim text-surface placeholder:text-surface/60 ${
                      !canUseStandardFields
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  />
                  {!isClaimFlow && !canUseStandardFields && (
                    <div className="mt-1 rounded border border-orange-200 bg-orange-50 p-2 text-xs text-orange-700">
                      <strong>Premium Field:</strong> Available with Standard or
                      Pro plans.{" "}
                      <Link
                        href="/pricing"
                        className="underline hover:text-orange-900"
                      >
                        View plans
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="unique" className="text-surface">
                  What Makes You Unique {canUseStandardFields && "*"}
                </Label>
                <FieldTooltip
                  message="Share a proof point or differentiator. Example: “Former Disney casting director with 15 years of experience.”"
                  plan={planTier}
                  showUpgradeIcon={!canUseStandardFields}
                />
              </div>
              {isClaimFlow && !canUseStandardFields ? (
                <ClaimFlowUpgradeCallout
                  requiredTier="Standard"
                  headline="Spotlight what makes your business special"
                  body="Upgrade to Standard or Pro to add testimonials, certifications, or experience that builds trust."
                  helpHref="/help/claim-listing"
                  helpLabel="How to strengthen your claim"
                />
              ) : (
                <>
                  <Textarea
                    id="unique"
                    value={formData.unique}
                    onChange={(e) =>
                      handleInputChange("unique", e.target.value)
                    }
                    placeholder={
                      canUseStandardFields
                        ? "Ex: SAG-AFTRA signatory studio with 200+ bookings."
                        : "🔒 Upgrade to Standard or Pro to highlight your wins"
                    }
                    disabled={!canUseStandardFields}
                    className={`bg-paper border-secondary-denim text-surface placeholder:text-surface/60 ${
                      !canUseStandardFields
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  />
                  {!isClaimFlow && !canUseStandardFields && (
                    <div className="mt-1 rounded border border-orange-200 bg-orange-50 p-2 text-xs text-orange-700">
                      <strong>Premium Field:</strong> Available with Standard or
                      Pro plans.{" "}
                      <Link
                        href="/pricing"
                        className="underline hover:text-orange-900"
                      >
                        View plans
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Service Format */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-surface">Service Format</h3>
              <Link
                href="/help/getting-started"
                className="text-xs font-medium text-[#FF6B35] underline hover:text-[#d95728]"
              >
                Format guide
              </Link>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-surface">Format *</Label>
                <FieldTooltip
                  message="Tell parents how you deliver the service. Example: choose “Hybrid” if you coach both online and in person."
                  plan={planTier}
                />
              </div>
              <Select
                name="format"
                value={formData.format}
                onValueChange={(value) => handleInputChange("format", value)}
                required
              >
                <SelectTrigger
                  className={`bg-paper border-secondary-denim text-surface ${getFieldError("format") ? "border-red-500 border-2" : ""}`}
                >
                  <SelectValue placeholder="Select service format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="In-person">In-person</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
              {getFieldError("format") && (
                <p className="text-red-600 text-sm font-semibold">
                  ⚠️ {getFieldError("format")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-surface">Age Ranges</Label>
                <FieldTooltip
                  message="Select the performer ages you serve. Example: check 5-8 and 9-12 if you focus on elementary talent."
                  plan={planTier}
                />
              </div>
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
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h3 className="text-surface">
                  Categories *
                  {planTier === "Free"
                    ? " (Select 1 - Free Plan)"
                    : " (Select all that apply)"}
                </h3>
                <FieldTooltip
                  message="Pick the best-fit categories so families can find you faster. Example: “Acting Coach” + “On-Set Tutoring.”"
                  plan={planTier}
                />
              </div>
              <Link
                href="/help/getting-started"
                className="text-xs font-medium text-[#FF6B35] underline hover:text-[#d95728]"
              >
                Category tips
              </Link>
            </div>
            {planTier === "Free" && (
              <div className="rounded border border-blue-200 bg-blue-50 p-2 text-xs text-blue-700">
                <strong>Free Plan:</strong> You can select 1 category. Upgrade
                to Standard or Pro to highlight multiple services.
              </div>
            )}
            <div
              className={`grid grid-cols-2 gap-2 p-3 border rounded-lg ${getFieldError("categories") ? "border-red-500 border-2 bg-red-50" : ""}`}
            >
              {categories.map((category) => {
                const isDisabled =
                  planTier === "Free" &&
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
              <p className="text-red-600 text-sm font-semibold">
                ⚠️ {getFieldError("categories")}
              </p>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-surface">Contact Information</h3>
              <Link
                href="/help/troubleshooting"
                className="text-xs font-medium text-[#FF6B35] underline hover:text-[#d95728]"
              >
                Contact tips
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="email" className="text-surface">
                    Email *
                  </Label>
                  <FieldTooltip
                    message="Use the inbox you monitor daily so leads never slip by. Example: hello@brightstarcoaching.com."
                    plan={planTier}
                  />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="hello@brightstarcoaching.com"
                  required
                  className={`bg-paper border-secondary-denim text-surface placeholder:text-surface/60 ${getFieldError("email") ? "border-red-500 border-2" : ""}`}
                />
                {getFieldError("email") && (
                  <p className="text-red-600 text-sm font-semibold">
                    ⚠️ {getFieldError("email")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="phone" className="text-surface">
                    Phone
                  </Label>
                  <FieldTooltip
                    message="Optional but recommended—parents feel reassured seeing a direct number. Format however you prefer."
                    plan={planTier}
                  />
                </div>
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
              <div className="flex items-center gap-2">
                <Label htmlFor="link" className="text-surface">
                  Website *
                </Label>
                <FieldTooltip
                  message="Link to the page that best represents your services. Example: https://brightstarcoaching.com/parents."
                  plan={planTier}
                />
              </div>
              <Input
                id="link"
                name="link"
                type="url"
                value={formData.link}
                onChange={(e) => handleInputChange("link", e.target.value)}
                placeholder="brightstarcoaching.com (we'll add https:// for you)"
                className={`bg-paper border-secondary-denim text-surface placeholder:text-surface/60 ${getFieldError("link") ? "border-red-500 border-2" : ""}`}
              />
              {getFieldError("link") && (
                <p className="text-red-600 text-sm font-semibold">
                  ⚠️ {getFieldError("link")}
                </p>
              )}
              <p className="text-xs text-surface">
                You can enter just "yoursite.com" — we'll automatically add
                "https://".
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="city" className="text-surface">
                    City *
                  </Label>
                  <FieldTooltip
                    message="List the primary city where you operate. Example: Los Angeles or Atlanta."
                    plan={planTier}
                  />
                </div>
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
                  <p className="text-red-600 text-sm font-semibold">
                    ⚠️ {getFieldError("city")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="state" className="text-surface">
                    State / Region *
                  </Label>
                  <FieldTooltip
                    message="Add your state, province, or territory abbreviation. Example: CA, NY, or Ontario."
                    plan={planTier}
                  />
                </div>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  placeholder="CA"
                  required
                  className={`bg-paper border-secondary-denim text-surface placeholder:text-surface/60 ${getFieldError("state") ? "border-red-500 border-2" : ""}`}
                />
                {getFieldError("state") && (
                  <p className="text-red-600 text-sm font-semibold">
                    ⚠️ {getFieldError("state")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="zip" className="text-surface">
                    ZIP / Postal Code
                  </Label>
                  <FieldTooltip
                    message="Helps parents filter by distance. Example: 90028 or V5K 0A1."
                    plan={planTier}
                  />
                </div>
                <Input
                  id="zip"
                  value={formData.zip}
                  onChange={(e) => handleInputChange("zip", e.target.value)}
                  placeholder="90028"
                  className="bg-paper border-secondary-denim text-surface placeholder:text-surface/60"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Label className="text-surface">
                    Service Areas (Select all that apply) *
                  </Label>
                  <FieldTooltip
                    message="Check every region you actively serve. Include “Global” if you work with families virtually."
                    plan={planTier}
                  />
                </div>
                <Link
                  href="/help/editing-listing"
                  className="text-xs font-medium text-[#FF6B35] underline hover:text-[#d95728]"
                >
                  Region tips
                </Link>
              </div>
              <p className="text-surface text-sm">
                Where do you serve clients? Select all regions that apply.
              </p>
              <div
                className={`grid grid-cols-1 gap-3 rounded-lg border p-4 bg-paper/50 md:grid-cols-2 ${getFieldError("region") ? "border-red-500 border-2" : ""}`}
              >
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
                      className="cursor-pointer text-sm font-normal text-surface"
                    >
                      {regionOption}
                    </Label>
                  </div>
                ))}
              </div>
              {getFieldError("region") && (
                <p className="text-red-600 text-sm font-semibold">
                  ⚠️ {getFieldError("region")}
                </p>
              )}
            </div>
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
            <div className="flex items-center gap-2">
              <Label htmlFor="notes" className="text-surface">
                Additional Notes {canUseStandardFields && "(Optional)"}
              </Label>
              <FieldTooltip
                message="Share booking policies, office hours, or onboarding steps. Keep it to one or two sentences."
                plan={planTier}
                showUpgradeIcon={!canUseStandardFields}
              />
            </div>
            {isClaimFlow && !canUseStandardFields ? (
              <ClaimFlowUpgradeCallout
                requiredTier="Standard"
                headline="Add extra details that build confidence"
                body="Upgrade to include FAQs, onboarding notes, or next steps so parents know exactly what happens after they reach out."
                helpHref="/help/editing-listing"
                helpLabel="See what to include"
              />
            ) : (
              <>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder={
                    canUseStandardFields
                      ? "Ex: We reply within 24 hours and hold a free 15-minute consult."
                      : "🔒 Upgrade to Standard or Pro to add additional notes"
                  }
                  disabled={!canUseStandardFields}
                  className={`bg-paper border-secondary-denim text-surface placeholder:text-surface/60 ${
                    !canUseStandardFields ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                />
                {!isClaimFlow && !canUseStandardFields && (
                  <div className="mt-1 rounded border border-orange-200 bg-orange-50 p-2 text-xs text-orange-700">
                    <strong>Premium Field:</strong> Available with Standard or
                    Pro plans.{" "}
                    <Link
                      href="/pricing"
                      className="underline hover:text-orange-900"
                    >
                      View plans
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-surface">
                Profile Image{" "}
                {canUseStandardFields
                  ? "(Recommended)"
                  : "- Available with Standard or Pro"}
              </Label>
              <FieldTooltip
                message="Upload a bright, horizontal image (at least 1200px wide) so your listing pops in search results."
                plan={planTier}
                showUpgradeIcon={!canUseStandardFields}
              />
            </div>
            {isClaimFlow && !canUseStandardFields ? (
              <ClaimFlowUpgradeCallout
                requiredTier="Standard"
                headline="Add a hero image to capture attention"
                body="Standard listings include a large profile photo that appears across the directory and in search results."
                helpHref="/help/image-guidelines"
                helpLabel="Image guidelines"
              />
            ) : (
              <>
                {!canUseStandardFields && (
                  <div className="mb-3 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">📸</span>
                      <div>
                        <h4 className="mb-1 font-semibold text-blue-900">
                          Stand out with a professional image
                        </h4>
                        <p className="text-sm text-blue-800">
                          Upgrade to <strong>Standard ($25/mo)</strong> or{" "}
                          <strong>Pro ($50/mo)</strong> to add a compelling
                          profile photo that drives more clicks.
                        </p>
                        <Link
                          href="/pricing"
                          className="mt-3 inline-block rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                        >
                          View upgrade options →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
                <div
                  className={`h-48 rounded-lg border-2 border-dashed border-secondary-denim ${
                    !canUseStandardFields
                      ? "pointer-events-none opacity-40"
                      : ""
                  }`}
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
                <p className="text-sm text-surface">
                  {canUseStandardFields
                    ? "Upload a professional photo or logo for your listing."
                    : "🔒 Profile images unlock with the Standard plan."}
                </p>
              </>
            )}
          </div>

          {/* Gallery Upload */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-surface">
                Gallery Images{" "}
                {canUseProFields ? "(Up to 4)" : "- Pro Plan Only"}
              </Label>
              <FieldTooltip
                message="Show behind-the-scenes moments, facilities, or happy clients to build trust."
                plan={planTier}
                showUpgradeIcon={!canUseProFields}
              />
            </div>
            {isClaimFlow && !canUseProFields ? (
              <ClaimFlowUpgradeCallout
                requiredTier="Pro"
                headline="Showcase your work with a full gallery"
                body="Pro listings add up to four gallery photos alongside your profile image so families can see the experience you provide."
                helpHref="/help/image-guidelines"
                helpLabel="Gallery inspiration"
              />
            ) : (
              <>
                {!canUseProFields && (
                  <div className="mb-3 rounded-lg border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">🖼️</span>
                      <div>
                        <h4 className="mb-1 font-semibold text-purple-900">
                          Showcase your work with gallery images
                        </h4>
                        <p className="text-sm text-purple-800">
                          {planTier === "Free"
                            ? "Upgrade to Pro ($50/mo) or Founding Pro ($199 for 6 months) to feature up to four extra photos of your work, studio, or team."
                            : "Upgrade to Pro ($50/mo) or Founding Pro ($199 for 6 months) to add four gallery images and spotlight your portfolio."}
                        </p>
                        <div className="mt-3 flex gap-2">
                          <Link
                            href="/pricing"
                            className="inline-block rounded bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700"
                          >
                            Upgrade to Pro →
                          </Link>
                          <Link
                            href="/help/image-guidelines"
                            className="inline-block rounded bg-purple-100 px-4 py-2 text-sm font-medium text-purple-800 transition-colors hover:bg-purple-200"
                          >
                            See examples
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div
                  className={`rounded-lg border border-dashed border-secondary-denim p-4 ${
                    !canUseProFields ? "pointer-events-none opacity-40" : ""
                  }`}
                >
                  <GalleryUpload
                    maxImages={getMaxGalleryImages()}
                    currentImages={galleryImages}
                    onImagesChange={setGalleryImages}
                    onUploadingChange={setIsGalleryUploading}
                  />
                </div>
                <p className="text-sm text-surface">
                  {getMaxGalleryImages() === 0
                    ? "🔒 Gallery images are exclusive to Pro tier members."
                    : "✅ Pro tier includes 4 gallery images (5 total with profile)."}
                </p>
              </>
            )}
          </div>

          {/* Social Media Section */}
          {isClaimFlow && !canUseProFields ? (
            <ClaimFlowUpgradeCallout
              requiredTier="Pro"
              headline="Unlock social links to keep families engaged"
              body="Upgrade to Pro to display Facebook, Instagram, TikTok, YouTube, LinkedIn, and custom call-to-action links on your profile."
              helpHref="/help/editing-listing"
              helpLabel="Social content ideas"
            />
          ) : (
            <div
              className={`space-y-4 rounded-lg border p-4 ${
                !canUseProFields ? "opacity-60" : ""
              }`}
              style={{ backgroundColor: "#f8f9fa" }}
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold text-surface">
                    Social Media Links
                  </h3>
                  <FieldTooltip
                    message="Add the channels you update regularly so families can follow and trust you."
                    plan={planTier}
                    showUpgradeIcon={!canUseProFields}
                  />
                  {!canUseProFields && (
                    <span className="text-sm text-purple-700">
                      🔒 Pro Plan Only
                    </span>
                  )}
                </div>
                <p className="text-surface text-sm">
                  {canUseProFields
                    ? "Add your social media profiles to increase engagement."
                    : "Upgrade to Pro ($50/mo) or Founding Pro ($199 for 6 months) to display social media links on your listing."}
                </p>
              </div>
              {!canUseProFields && (
                <div className="rounded border border-purple-200 bg-purple-50 p-3">
                  <p className="text-sm text-purple-800">
                    <strong>Pro Feature:</strong> Social media links are
                    exclusive to Pro tier members. Upgrade to Pro ($50/mo) or
                    Founding Pro ($199 for 6 months) to showcase your channels.{" "}
                    <Link
                      href="/pricing"
                      className="underline hover:text-purple-900"
                    >
                      View Pro plans
                    </Link>
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                      canUseProFields
                        ? "https://facebook.com/brightstartalent"
                        : "🔒 Pro plan required"
                    }
                    disabled={!canUseProFields}
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
                      canUseProFields
                        ? "https://instagram.com/brightstartalent"
                        : "🔒 Pro plan required"
                    }
                    disabled={!canUseProFields}
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
                      canUseProFields
                        ? "https://tiktok.com/@brightstartalent"
                        : "🔒 Pro plan required"
                    }
                    disabled={!canUseProFields}
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
                      canUseProFields
                        ? "https://youtube.com/@brightstartalent"
                        : "🔒 Pro plan required"
                    }
                    disabled={!canUseProFields}
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
                      canUseProFields
                        ? "https://linkedin.com/company/brightstartalent"
                        : "🔒 Pro plan required"
                    }
                    disabled={!canUseProFields}
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
                      canUseProFields
                        ? "https://brightstartalent.com/blog"
                        : "🔒 Pro plan required"
                    }
                    disabled={!canUseProFields}
                    className="bg-paper border-secondary-denim text-surface placeholder:text-surface/60"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-surface">Custom Link</h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                        canUseProFields
                          ? "e.g., 'Portfolio' or 'Book Now'"
                          : "🔒 Pro plan required"
                      }
                      disabled={!canUseProFields}
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
                        canUseProFields
                          ? "https://calendly.com/brightstartalent"
                          : "🔒 Pro plan required"
                      }
                      disabled={!canUseProFields}
                      className="bg-paper border-secondary-denim text-surface placeholder:text-surface/60"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
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
