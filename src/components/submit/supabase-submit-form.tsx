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
import { ListingProgress } from "@/components/submit/listing-progress";
import { cn } from "@/lib/utils";
import { CategoryPicker } from "@/components/vendor/category-picker";
import {
  showLicensing,
  submissionProfile,
} from "@/lib/submission-fields";
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
  specialties?: string[];
  age_range?: string[];
  format?: string;
  notes?: string;
  image_url?: string;
  gallery?: string | null;
  plan?: string;
  region?: string[];
  secondary_locations?: Array<{ city?: string; state?: string; zip?: string }> | null;
  ca_permit_required?: boolean | null;
  is_bonded?: boolean | null;
  bond_number?: string | null;
}

interface SupabaseSubmitFormProps {
  categories: Category[];
  existingListing?: Listing | null;
  isClaimFlow?: boolean;
}

/** Checkbox that stays visible on the light form surface. */
const FormCheckbox = (props: React.ComponentProps<typeof Checkbox>) => (
  <Checkbox
    {...props}
    className={cn(
      "h-5 w-5 border-zinc-500 bg-white data-[state=checked]:border-ink data-[state=checked]:bg-ink data-[state=checked]:text-white",
      props.className,
    )}
  />
);

const getPlanLevel = (plan?: string): "Free" | "Standard" | "Pro" => {
  if (plan === "Pro" || plan === "Founding Pro") {
    return "Pro";
  }
  if (plan === "Standard" || plan === "Founding Standard") {
    return "Standard";
  }
  return "Free";
};

const isPremiumPlan = (plan?: string) => {
  return getPlanLevel(plan) !== "Free";
};

const isProTierPlan = (plan?: string) => {
  return getPlanLevel(plan) === "Pro";
};

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

  // Parse format from string to array (for tags)
  const parseFormatTags = (format?: string): string[] => {
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

  const [formData, setFormData] = useState({
    name: existingListing?.listing_name || "",
    link: existingListing?.website || "",
    description: existingListing?.description || "",
    introduction: "",
    unique: "",
    format: parseFormatTags(existingListing?.format), // Now an array
    notes: existingListing?.notes || "",
    imageId: existingListing?.image_url || "",
    tags: existingListing?.age_range || [],
    categories: existingListing?.categories || [],
    specialties: existingListing?.specialties || [],
    // IMPORTANT: Pre-fill plan from existing listing if claiming
    plan: existingListing?.plan || "Free",
    // Licensing answers an owner already gave are kept (never reset by a re-save)
    performerPermit: existingListing?.ca_permit_required === true,
    bonded: existingListing?.is_bonded === true,
    email: existingListing?.email || "",
    phone: existingListing?.phone || "",
    city: existingListing?.city || "",
    state: existingListing?.state || "",
    zip: existingListing?.zip?.toString() || "",
    region: existingListing?.region || [], // Array for multi-select
    bondNumber: existingListing?.bond_number || "",
    active: true,
    serviceAreas: (existingListing?.secondary_locations || []).map((a) => ({
      city: a.city || "",
      state: a.state || "",
      zip: a.zip || "",
    })),
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
  }, [clearSavedData, existingListing, loadSavedData]);

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

  const profile = submissionProfile(formData.categories);
  const licensingVisible = showLicensing({
    profile,
    state: formData.state,
    hasExistingAnswer:
      existingListing?.ca_permit_required === true ||
      existingListing?.is_bonded === true,
  });
  const currentPlanLevel = getPlanLevel(formData.plan);
  // Extra cities: set teachers / sitters on any plan (they work where they are
  // hired); other categories keep the existing Pro-only rule (2 locations).
  const maxServiceAreas = profile.emphasizeCoverage
    ? 15
    : currentPlanLevel === "Pro"
      ? 2
      : 0;
  const canEditEnhancedFields = currentPlanLevel !== "Free";
  const canEditNotes = currentPlanLevel !== "Free";
  const canEditProfileImage = currentPlanLevel !== "Free";
  const canEditGallery = currentPlanLevel === "Pro";
  const canEditSocial = currentPlanLevel === "Pro";

  const renderUpgradeNotice = ({
    tone,
    title,
    description,
    helpHref = "/help/pricing-plans",
    ctaHref = "/pricing",
    ctaLabel = "Compare plans",
  }: {
    tone: "standard" | "pro";
    title: string;
    description: string;
    helpHref?: string;
    ctaHref?: string;
    ctaLabel?: string;
  }) => {
    const palette =
      tone === "pro"
        ? {
            wrapper: "bg-purple-50 border border-purple-200",
            heading: "text-purple-900",
            copy: "text-purple-800",
            button: "bg-purple-600 hover:bg-purple-700",
            link: "text-purple-800",
          }
        : {
            wrapper: "bg-orange-50 border border-orange-200",
            heading: "text-orange-900",
            copy: "text-orange-800",
            button: "bg-orange-600 hover:bg-orange-700",
            link: "text-orange-800",
          };

    return (
      <div className={`${palette.wrapper} rounded-lg p-4`}>
        <h4 className={`font-semibold ${palette.heading}`}>{title}</h4>
        <p className={`mt-2 text-sm ${palette.copy}`}>{description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href={ctaHref}
            className={`inline-flex items-center rounded px-3 py-1.5 text-sm font-medium text-white transition-colors ${palette.button}`}
          >
            {ctaLabel}
          </a>
          <Link
            href={helpHref}
            className={`text-sm font-medium underline underline-offset-2 ${palette.link}`}
          >
            Learn how upgrades help
          </Link>
        </div>
      </div>
    );
  };

  const getMaxGalleryImages = () => {
    if (canEditGallery) return 12; // Pro tiers get up to 12 gallery images
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

  const handleFormatToggle = (formatTag: string) => {
    setFormData((prev) => ({
      ...prev,
      format: Array.isArray(prev.format)
        ? prev.format.includes(formatTag)
          ? prev.format.filter((f) => f !== formatTag)
          : [...prev.format, formatTag]
        : [formatTag],
    }));
  };

  const updateServiceArea = (
    index: number,
    patch: Partial<{ city: string; state: string; zip: string }>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      serviceAreas: prev.serviceAreas.map((a, i) =>
        i === index ? { ...a, ...patch } : a,
      ),
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
        listingId: existingListing?.id,
        isEdit: !!existingListing,
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
          // Paid plan selected in the form, but the server always
          // creates new listings as Free now (submit-supabase.ts's
          // trustedPlan — see Phase 1C Task 7) and this branch is
          // unreachable from any live link (the plan picker that would
          // set formData.plan away from "Free" only renders for
          // isClaimFlow, which nothing links to anymore — Phase 1B Task
          // 5). Route through the real checkout flow regardless.
          router.push(`/plan-selection?listingId=${result.listingId}`);
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
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 [&>div]:rounded-2xl [&>div]:border [&>div]:border-canvas-line [&>div]:bg-white [&>div]:p-6 [&>div]:shadow-[0_1px_2px_rgba(18,22,29,0.04),0_14px_30px_-18px_rgba(18,22,29,0.18)] sm:[&>div]:p-8"
      >
        <ListingProgress requiresPayment={formData.plan !== "Free"} />
        {/* STEP 9: Remove upgrade callouts - plan selection hidden for new submissions */}
        {isClaimFlow && (
          <div className="space-y-4">
            {/* STEP 4: Field grouping */}
            <h2 className="heading-display text-2xl text-ink mb-4">
              Plan Selection
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Free Plan */}
              <Card
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  formData.plan === "Free"
                    ? "ring-2 ring-brass-dark bg-orange-50"
                    : "border-gray-200"
                }`}
                onClick={() => handleInputChange("plan", "Free")}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Free</CardTitle>
                  <div className="text-2xl font-bold text-brass-dark">$0</div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="text-sm space-y-1">
                    <li>• Basic directory listing</li>
                    <li>• Contact information</li>
                    <li>• Category</li>
                    <li>• Services Offered</li>
                  </ul>
                  <div className="mt-3 text-xs text-ink-soft">
                    Upgrade for profile image & featured placement
                  </div>
                </CardContent>
              </Card>

              {/* Standard Plan */}
              <Card
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  formData.plan === "Standard"
                    ? "ring-2 ring-brass-dark bg-blue-50"
                    : "border-gray-200"
                }`}
                onClick={() => handleInputChange("plan", "Standard")}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Standard</CardTitle>
                  <div className="text-2xl font-bold text-brass-dark">
                    Starting at $25
                    <span className="text-sm font-normal">/mo</span>
                  </div>
                  <div className="text-xs text-ink-soft mt-1">
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
                    ? "ring-2 ring-brass-dark bg-blue-50"
                    : "border-gray-200"
                }`}
                onClick={() => handleInputChange("plan", "Founding Standard")}
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  🎉 LIMITED TIME
                </div>
                <CardHeader className="pb-3 pt-4">
                  <CardTitle className="text-lg">Founding Standard</CardTitle>
                  <div className="text-2xl font-bold text-brass-dark">
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
                    ? "ring-2 ring-brass-dark bg-purple-50"
                    : "border-gray-200"
                }`}
                onClick={() => handleInputChange("plan", "Pro")}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Pro</CardTitle>
                  <div className="text-2xl font-bold text-brass-dark">
                    Starting at $50
                    <span className="text-sm font-normal">/mo</span>
                  </div>
                  <div className="text-xs text-ink-soft mt-1">
                    Multiple billing options available
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="text-sm space-y-1">
                    <li>• Everything in Standard</li>
                    <li>• Up to 12 gallery images</li>
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
                    ? "ring-2 ring-brass-dark bg-purple-50"
                    : "border-gray-200"
                }`}
                onClick={() => handleInputChange("plan", "Founding Pro")}
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  🌟 MOST POPULAR
                </div>
                <CardHeader className="pb-3 pt-4">
                  <CardTitle className="text-lg">Founding Pro</CardTitle>
                  <div className="text-2xl font-bold text-brass-dark">
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
                    <li>• Up to 12 gallery images</li>
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
                      <li>✓ Profile image + up to 12 gallery images</li>
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
                      <li>✓ Profile image + up to 12 gallery images</li>
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
        )}

        {/* Category + specialties first: the rest of the form adapts to it */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="heading-display text-2xl text-ink mb-4">
              Category *
            </h2>
            <FieldTooltip message="Choose the category that best describes your listing, then pick the specialties that apply. They power search filters and appear on your profile." />
          </div>
          <p className="-mt-2 text-sm text-ink-soft">
            {formData.plan === "Free"
              ? "Choose the one category that best describes your listing."
              : "Choose every category that applies to your listing."}
          </p>
          <CategoryPicker
            categories={formData.categories}
            specialties={formData.specialties}
            singleCategory={formData.plan === "Free"}
            invalid={Boolean(getFieldError("categories"))}
            resolveName={(v) => categories.find((c) => c.id === v)?.name ?? v}
            onChange={(next) =>
              setFormData((prev) => ({
                ...prev,
                categories: next.categories,
                specialties: next.specialties,
              }))
            }
          />
          {getFieldError("categories") && (
            <p className="text-red-600 text-sm font-semibold">
              ⚠️ {getFieldError("categories")}
            </p>
          )}
        </div>

        {/* STEP 4: Field grouping - Basic Information */}
        <div className="space-y-4">
          <h2 className="heading-display text-2xl text-ink mb-4">
            Basic information
          </h2>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="name" className="text-ink">
                {profile.nameLabel} *
              </Label>
              <FieldTooltip message="Use the exact name parents will search for. Avoid abbreviations unless they appear on your signage and marketing." />
            </div>
            {/* STEP 5: Input styling */}
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder={profile.namePlaceholder}
              maxLength={100}
              required
              className={`bg-white border border-[#8B8F99] shadow-sm rounded-md px-3 py-2 text-ink placeholder:text-zinc-500 focus:outline-none focus:border-brass-dark focus:ring-2 focus:ring-brass/40 ${getFieldError("name") ? "border-red-500 border-2" : ""}`}
            />
            {getFieldError("name") && (
              <p className="text-red-600 text-sm font-semibold">
                ⚠️ {getFieldError("name")}
              </p>
            )}
            <p className="text-ink-soft text-xs">
              {formData.name.length}/100 characters
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="description" className="text-ink">
                {profile.descriptionLabel} *
              </Label>
              <FieldTooltip message={profile.descriptionHelp} />
            </div>
            {/* STEP 5: Input styling */}
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder={profile.descriptionPlaceholder}
              maxLength={256}
              required
              className={`bg-white border border-[#8B8F99] shadow-sm rounded-md px-3 py-2 text-ink placeholder:text-zinc-500 focus:outline-none focus:border-brass-dark focus:ring-2 focus:ring-brass/40 ${getFieldError("description") ? "border-red-500 border-2" : ""}`}
            />
            {getFieldError("description") && (
              <p className="text-red-600 text-sm font-semibold">
                ⚠️ {getFieldError("description")}
              </p>
            )}
            <p className="text-ink-soft text-xs">
              {formData.description.length}/256 characters
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="introduction" className="text-ink">
                Who Is It For {canEditEnhancedFields && "*"}
              </Label>
              <FieldTooltip
                message="Describe the ages or experience levels you serve. Example: 'Families with kids 8-14 who need on-set tutoring in Atlanta or via Zoom.'"
                plan={currentPlanLevel}
                showUpgradeIcon={true}
              />
            </div>
            {canEditEnhancedFields ? (
              <Textarea
                id="introduction"
                value={formData.introduction}
                onChange={(e) =>
                  handleInputChange("introduction", e.target.value)
                }
                placeholder="Share who you support and any specialties (ex: 'LA-based child actors needing weekly coaching')."
                className="bg-white border border-[#8B8F99] shadow-sm rounded-md px-3 py-2 text-ink placeholder:text-zinc-500 focus:outline-none focus:border-brass-dark focus:ring-2 focus:ring-brass/40"
              />
            ) : (
              /* STEP 9: Remove upgrade callouts - just disable field */
              <Textarea
                id="introduction"
                value={formData.introduction}
                onChange={(e) =>
                  handleInputChange("introduction", e.target.value)
                }
                placeholder="Optional field"
                disabled
                className="bg-white border border-[#8B8F99] shadow-sm rounded-md px-3 py-2 text-ink placeholder:text-zinc-500 opacity-50 cursor-not-allowed"
              />
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="unique" className="text-ink">
                What Makes You Unique {canEditEnhancedFields && "*"}
              </Label>
              <FieldTooltip
                message="Highlight your differentiators—certifications, success stories, or signature process."
                plan={currentPlanLevel}
                showUpgradeIcon={true}
              />
            </div>
            {canEditEnhancedFields ? (
              <Textarea
                id="unique"
                value={formData.unique}
                onChange={(e) => handleInputChange("unique", e.target.value)}
                placeholder="Example: 'Only bilingual SAG-AFTRA accredited coaching studio with on-set former child stars as mentors.'"
                className="bg-white border border-[#8B8F99] shadow-sm rounded-md px-3 py-2 text-ink placeholder:text-zinc-500 focus:outline-none focus:border-brass-dark focus:ring-2 focus:ring-brass/40"
              />
            ) : (
              /* STEP 9: Remove upgrade callouts - just disable field */
              <Textarea
                id="unique"
                value={formData.unique}
                onChange={(e) => handleInputChange("unique", e.target.value)}
                placeholder="Optional field"
                disabled
                className="bg-white border border-[#8B8F99] shadow-sm rounded-md px-3 py-2 text-ink placeholder:text-zinc-500 opacity-50 cursor-not-allowed"
              />
            )}
          </div>
        </div>

        {/* Service format (service categories only) and age ranges */}
        {(profile.requireFormat || profile.showAges) && (
        <div className="space-y-4">
          {/* STEP 4: Field grouping - Services (already has h2 above) */}

          {profile.requireFormat && (
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label className="text-ink">Service Format *</Label>
              <FieldTooltip message="Select all that apply. These tags help families find your service." />
            </div>
            <div className="space-y-2">
              {["online", "in-person", "hybrid"].map((formatTag) => {
                const formatArray = Array.isArray(formData.format)
                  ? formData.format
                  : [];
                const isChecked = formatArray.includes(formatTag);

                return (
                  <label
                    key={formatTag}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <FormCheckbox
                      checked={isChecked}
                      onCheckedChange={() => handleFormatToggle(formatTag)}
                      required={profile.requireFormat && formatArray.length === 0}
                    />
                    <span className="text-sm text-ink capitalize">
                      {formatTag.replace("-", " ")}
                    </span>
                  </label>
                );
              })}
            </div>
            {getFieldError("format") && (
              <p className="text-red-600 text-sm font-semibold">
                ⚠️ {getFieldError("format")}
              </p>
            )}
          </div>
          )}

          {profile.showAges && (
          <div className="space-y-2">
            <Label className="text-ink">
              {profile.mode === "representation" ? "Ages You Represent" : "Age Ranges"}
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {/* STEP 6: Checkboxes - visible, legible */}
              {["5-8", "9-12", "13-17", "18+"].map((age) => (
                <div
                  key={age}
                  className="flex items-start gap-2 text-ink-soft"
                >
                  <FormCheckbox
                    id={`age-${age}`}
                    checked={formData.tags.includes(age)}
                    onCheckedChange={() => handleTagToggle(age)}
                    className="mt-1 accent-ink"
                  />
                  <Label
                    htmlFor={`age-${age}`}
                    className="text-sm cursor-pointer"
                  >
                    {age}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          )}
        </div>
        )}


        {/* Contact Information */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* STEP 4: Field grouping - Contact */}
            <h2 className="heading-display text-2xl text-ink mb-4">
              Contact
            </h2>
            <Link
              href="/help/getting-started"
              className="text-sm font-medium text-brass-dark underline underline-offset-2"
            >
              Contact info checklist
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="email" className="text-ink">
                  Email *
                </Label>
                <FieldTooltip message="Add the inbox you or your team checks daily. We'll send new lead alerts here." />
              </div>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="hello@brightlightstalent.com"
                required
                className={`bg-white border border-[#8B8F99] shadow-sm rounded-md px-3 py-2 text-ink placeholder:text-zinc-500 focus:outline-none focus:border-brass-dark focus:ring-2 focus:ring-brass/40 ${getFieldError("email") ? "border-red-500 border-2" : ""}`}
              />
              {getFieldError("email") && (
                <p className="text-red-600 text-sm font-semibold">
                  ⚠️ {getFieldError("email")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-ink">
                Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="(555) 123-4567"
                className="bg-white border border-[#8B8F99] shadow-sm rounded-md px-3 py-2 text-ink placeholder:text-zinc-500 focus:outline-none focus:border-brass-dark focus:ring-2 focus:ring-brass/40"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="link" className="text-ink">
                Website
              </Label>
              <FieldTooltip message="Link to the page families should land on—your main site, booking page, or dedicated listing." />
            </div>
            <Input
              id="link"
              name="link"
              type="url"
              value={formData.link}
              onChange={(e) => handleInputChange("link", e.target.value)}
              placeholder="brightlightstalent.com (we'll add https://)"
              className={`bg-white border border-[#8B8F99] shadow-sm rounded-md px-3 py-2 text-ink-soft placeholder:text-zinc-500/60 ${getFieldError("link") ? "border-red-500 border-2" : ""}`}
            />
            {getFieldError("link") && (
              <p className="text-red-600 text-sm font-semibold">
                ⚠️ {getFieldError("link")}
              </p>
            )}
            <p className="text-ink-soft text-xs">
              You can enter just "yoursite.com" - we'll automatically add
              "https://"
            </p>
          </div>

          {/* STEP 4: Field grouping - Location */}
          <h2 className="heading-display text-2xl text-ink mb-4">
            Location
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="city" className="text-ink">
                  City *
                </Label>
                <FieldTooltip message="Families search by metro. Add the city where you operate or coordinate services." />
              </div>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="Los Angeles"
                required
                className={`bg-white border border-[#8B8F99] shadow-sm rounded-md px-3 py-2 text-ink placeholder:text-zinc-500 focus:outline-none focus:border-brass-dark focus:ring-2 focus:ring-brass/40 ${getFieldError("city") ? "border-red-500 border-2" : ""}`}
              />
              {getFieldError("city") && (
                <p className="text-red-600 text-sm font-semibold">
                  ⚠️ {getFieldError("city")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="state" className="text-ink">
                  State / Region *
                </Label>
                <FieldTooltip message="Share the state, province, or region you cover so we can display the correct badge." />
              </div>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                placeholder="e.g., CA, NY, or Ontario"
                required
                className={`bg-white border border-[#8B8F99] shadow-sm rounded-md px-3 py-2 text-ink placeholder:text-zinc-500 focus:outline-none focus:border-brass-dark focus:ring-2 focus:ring-brass/40 ${getFieldError("state") ? "border-red-500 border-2" : ""}`}
              />
              {getFieldError("state") && (
                <p className="text-red-600 text-sm font-semibold">
                  ⚠️ {getFieldError("state")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip" className="text-ink">
                ZIP Code
              </Label>
              <Input
                id="zip"
                value={formData.zip}
                onChange={(e) => handleInputChange("zip", e.target.value)}
                placeholder="90210"
                className="bg-white border border-[#8B8F99] shadow-sm rounded-md px-3 py-2 text-ink placeholder:text-zinc-500 focus:outline-none focus:border-brass-dark focus:ring-2 focus:ring-brass/40"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-ink">
              Regional Service Areas {profile.requireRegion ? "*" : "(optional)"}
            </Label>
            <p className="text-ink-soft text-sm">
              Broad regions you cover. Add specific cities below so families
              nearby can find you.
            </p>
            <div
              className={`grid grid-cols-1 md:grid-cols-2 gap-3 p-4 border border-canvas-line rounded-lg bg-white ${getFieldError("region") ? "border-red-500 border-2" : ""}`}
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
                  className="flex items-start gap-2 text-ink-soft"
                >
                  <FormCheckbox
                    id={`region-${regionOption}`}
                    checked={(formData.region || []).includes(regionOption)}
                    onCheckedChange={(checked) => {
                      const currentRegions = formData.region || [];
                      const newRegions = checked
                        ? [...currentRegions, regionOption]
                        : currentRegions.filter((r) => r !== regionOption);
                      handleInputChange("region", newRegions);
                    }}
                    className="mt-1 accent-ink"
                  />
                  <Label
                    htmlFor={`region-${regionOption}`}
                    className="text-sm cursor-pointer"
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

          {/* Specific cities served: saved to the existing secondary_locations
              column, which city / state search already matches. */}
          {maxServiceAreas > 0 && (
          <div className="space-y-3">
            <Label className="text-ink">
              {profile.emphasizeCoverage
                ? "Cities and Areas You Cover"
                : "Additional Cities You Serve (optional)"}
            </Label>
            <p className="text-ink-soft text-sm">
              {profile.emphasizeCoverage
                ? "Families and productions search by city. List every city or area where you work, besides the one above (up to 15)."
                : "Besides the city above, list up to 2 other cities where you work."}
            </p>
            {formData.serviceAreas.map((area, index) => (
              <div
                key={`area-${index}`}
                className="grid grid-cols-[1fr_6rem_auto] gap-2 sm:grid-cols-[1fr_8rem_7rem_auto]"
              >
                <Input
                  aria-label={`Additional city ${index + 1}`}
                  value={area.city}
                  placeholder="City"
                  onChange={(e) =>
                    updateServiceArea(index, { city: e.target.value })
                  }
                  className="bg-white border border-[#8B8F99] shadow-sm rounded-md px-3 py-2 text-ink placeholder:text-zinc-500"
                />
                <Input
                  aria-label={`Additional state ${index + 1}`}
                  value={area.state}
                  placeholder="State"
                  onChange={(e) =>
                    updateServiceArea(index, { state: e.target.value })
                  }
                  className="bg-white border border-[#8B8F99] shadow-sm rounded-md px-3 py-2 text-ink placeholder:text-zinc-500"
                />
                <Input
                  aria-label={`Additional ZIP ${index + 1}`}
                  value={area.zip}
                  placeholder="ZIP"
                  onChange={(e) =>
                    updateServiceArea(index, { zip: e.target.value })
                  }
                  className="hidden bg-white border border-[#8B8F99] shadow-sm rounded-md px-3 py-2 text-ink placeholder:text-zinc-500 sm:block"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      serviceAreas: prev.serviceAreas.filter(
                        (_, i) => i !== index,
                      ),
                    }))
                  }
                  className="rounded-md border border-canvas-line px-3 text-sm text-ink-soft hover:text-ink"
                >
                  Remove
                </button>
              </div>
            ))}
            {formData.serviceAreas.length < maxServiceAreas && (
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    serviceAreas: [
                      ...prev.serviceAreas,
                      { city: "", state: prev.state, zip: "" },
                    ],
                  }))
                }
                className="rounded-md border border-canvas-line px-3 py-2 text-sm font-medium text-ink hover:bg-white/5"
              >
                + Add a city
              </button>
            )}
          </div>
          )}
        </div>

        {/* STEP 4: Field grouping - Legal Compliance */}
        {licensingVisible && (
        <div className="space-y-4">
          <h2 className="heading-display text-2xl text-ink">
            California Licensing (optional)
          </h2>
          <p className="text-sm text-ink-soft">
            Answer only if this applies to your work. Most professionals do not
            need to complete this section.
          </p>

          <div className="space-y-4">
            {/* STEP 6: Checkboxes - visible, legible */}
            <div className="flex items-start gap-2 text-ink-soft">
              <FormCheckbox
                id="performerPermit"
                checked={formData.performerPermit}
                onCheckedChange={(checked) =>
                  handleInputChange("performerPermit", checked)
                }
                className="mt-1 accent-ink"
              />
              <Label
                htmlFor="performerPermit"
                className="text-sm cursor-pointer"
              >
                California Child Performer Services Permit
              </Label>
            </div>

            <div className="flex items-start gap-2 text-ink-soft">
              <FormCheckbox
                id="bonded"
                checked={formData.bonded}
                onCheckedChange={(checked) =>
                  handleInputChange("bonded", checked)
                }
                className="mt-1 accent-ink"
              />
              <Label htmlFor="bonded" className="text-sm cursor-pointer">
                Bonded for Advanced Fees
              </Label>
            </div>

            {formData.bonded && (
              <div className="space-y-2">
                <Label htmlFor="bondNumber" className="text-ink">
                  Bond Number
                </Label>
                <Input
                  id="bondNumber"
                  value={formData.bondNumber}
                  onChange={(e) =>
                    handleInputChange("bondNumber", e.target.value)
                  }
                  placeholder="Bond number"
                  className="bg-white border border-[#8B8F99] shadow-sm rounded-md px-3 py-2 text-ink placeholder:text-zinc-500 focus:outline-none focus:border-brass-dark focus:ring-2 focus:ring-brass/40"
                />
              </div>
            )}
          </div>
        </div>
        )}

        {/* Additional Notes */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="notes" className="text-ink">
              Additional Notes {canEditNotes && "(Optional)"}
            </Label>
            <FieldTooltip
              message="Share booking policies, onboarding steps, or quick FAQ answers so families know what to expect."
              plan={currentPlanLevel}
              showUpgradeIcon
            />
          </div>
          {canEditNotes ? (
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Example: 'We respond within 24 hours. Sessions held in Burbank studio with on-set coaching available.'"
              className="bg-white border border-[#8B8F99] shadow-sm rounded-md px-3 py-2 text-ink placeholder:text-zinc-500 focus:outline-none focus:border-brass-dark focus:ring-2 focus:ring-brass/40"
            />
          ) : (
            /* STEP 9: Remove upgrade callouts - just disable field */
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Optional field"
              disabled
              className="bg-white border border-[#8B8F99] shadow-sm rounded-md px-3 py-2 text-ink placeholder:text-zinc-500 opacity-50 cursor-not-allowed"
            />
          )}
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Label className="text-ink">
              Profile Image {canEditProfileImage && "(Recommended)"}
            </Label>
            <FieldTooltip
              message="Listings with clear, friendly imagery get more clicks. Use a 1200x1200px square image when possible."
              plan={currentPlanLevel}
              showUpgradeIcon
            />
          </div>
          {canEditProfileImage ? (
            <>
              <div className="h-48 rounded-lg border-2 border-dashed border-canvas-line bg-white">
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
              <p className="text-ink-soft text-sm">
                Upload a professional photo or logo for your listing.{" "}
                <Link
                  href="/help/image-guidelines"
                  className="font-medium text-accent-blue hover:text-accent-blue/80 underline underline-offset-2"
                >
                  Review image guidelines
                </Link>
              </p>
            </>
          ) : (
            /* STEP 9: Remove upgrade callouts - just show disabled state */
            <div className="h-48 rounded-lg border-2 border-dashed border-canvas-line bg-white flex items-center justify-center">
              <p className="text-ink-soft text-sm">
                Profile image available with paid plans
              </p>
            </div>
          )}
        </div>

        {/* Gallery Upload */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Label className="text-ink">
              Gallery Images {canEditGallery && "(Up to 12)"}
            </Label>
            <FieldTooltip
              message="Use high-quality photos of your studio, classes, or happy clients to build trust."
              plan={currentPlanLevel}
              showUpgradeIcon
            />
          </div>
          {canEditGallery ? (
            <>
              <GalleryUpload
                maxImages={getMaxGalleryImages()}
                currentImages={galleryImages}
                onImagesChange={setGalleryImages}
                onUploadingChange={setIsGalleryUploading}
              />
              <p className="text-ink-soft text-sm">
                Upload up to {getMaxGalleryImages()} detail shots of your work.{" "}
                <Link
                  href="/help/image-guidelines"
                  className="font-medium text-accent-blue hover:text-accent-blue/80 underline underline-offset-2"
                >
                  See photo examples
                </Link>
              </p>
            </>
          ) : (
            /* STEP 9: Remove upgrade callouts - just show disabled state */
            <div className="h-48 rounded-lg border-2 border-dashed border-canvas-line bg-white flex items-center justify-center">
              <p className="text-ink-soft text-sm">
                Gallery images available with Pro plan
              </p>
            </div>
          )}
        </div>

        {/* Social Media Section */}
        {canEditSocial ? (
          <div
            className="space-y-4 rounded-lg border p-4"
            style={{ backgroundColor: "#f8f9fa" }}
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-semibold text-ink-soft">
                Social Media Links
              </h3>
              <FieldTooltip
                message="Drop the profiles you're most active on so parents can preview your vibe."
                plan={currentPlanLevel}
              />
            </div>
            <p className="text-ink-soft text-sm">
              Add your social media profiles to increase engagement and give
              families a behind-the-scenes look.
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="facebook_url" className="text-ink">
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
                  className="bg-white border border-[#8B8F99] shadow-sm rounded-md px-3 py-2 text-ink placeholder:text-zinc-500 focus:outline-none focus:border-brass-dark focus:ring-2 focus:ring-brass/40"
                />
              </div>

              <div>
                <Label htmlFor="instagram_url" className="text-ink">
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
                  className="bg-white border border-[#8B8F99] shadow-sm rounded-md px-3 py-2 text-ink placeholder:text-zinc-500 focus:outline-none focus:border-brass-dark focus:ring-2 focus:ring-brass/40"
                />
              </div>

              <div>
                <Label htmlFor="tiktok_url" className="text-ink">
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
                  className="bg-white border border-[#8B8F99] shadow-sm rounded-md px-3 py-2 text-ink placeholder:text-zinc-500 focus:outline-none focus:border-brass-dark focus:ring-2 focus:ring-brass/40"
                />
              </div>

              <div>
                <Label htmlFor="youtube_url" className="text-ink">
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
                  className="bg-white border border-[#8B8F99] shadow-sm rounded-md px-3 py-2 text-ink placeholder:text-zinc-500 focus:outline-none focus:border-brass-dark focus:ring-2 focus:ring-brass/40"
                />
              </div>

              <div>
                <Label htmlFor="linkedin_url" className="text-ink">
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
                  className="bg-white border border-[#8B8F99] shadow-sm rounded-md px-3 py-2 text-ink placeholder:text-zinc-500 focus:outline-none focus:border-brass-dark focus:ring-2 focus:ring-brass/40"
                />
              </div>

              <div>
                <Label htmlFor="blog_url" className="text-ink">
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
                  className="bg-white border border-[#8B8F99] shadow-sm rounded-md px-3 py-2 text-ink placeholder:text-zinc-500 focus:outline-none focus:border-brass-dark focus:ring-2 focus:ring-brass/40"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-ink">Custom Link</h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label
                    htmlFor="custom_link_name"
                    className="text-ink"
                  >
                    Link Name
                  </Label>
                  <Input
                    id="custom_link_name"
                    value={formData.custom_link_name}
                    onChange={(e) =>
                      handleInputChange("custom_link_name", e.target.value)
                    }
                    placeholder="e.g., 'Book Now'"
                    className="bg-white border border-[#8B8F99] shadow-sm rounded-md px-3 py-2 text-ink placeholder:text-zinc-500 focus:outline-none focus:border-brass-dark focus:ring-2 focus:ring-brass/40"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="custom_link_url"
                    className="text-ink"
                  >
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
                    className="bg-white border border-[#8B8F99] shadow-sm rounded-md px-3 py-2 text-ink placeholder:text-zinc-500 focus:outline-none focus:border-brass-dark focus:ring-2 focus:ring-brass/40"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* STEP 9: Remove upgrade callouts - just show disabled state */
          <div className="space-y-4 rounded-lg border border-canvas-line p-4 opacity-60 bg-white">
            <h3 className="text-lg font-semibold text-ink">
              Social Media Links
            </h3>
            <p className="text-ink-soft text-sm">Available with paid plans</p>
          </div>
        )}

        {/* STEP 7: Trust microcopy - remove fear */}
        <p className="text-center text-sm text-ink-soft">
          Free listings are reviewed before going live. Upgrades are optional
          and can be added later.
        </p>

        {/* STEP 8: Submit CTA - frictionless */}
        <Button
          type="submit"
          disabled={isSubmitting || isImageUploading || isGalleryUploading}
          className="h-12 w-full rounded-full bg-ink text-base font-semibold text-white hover:bg-ink-2 focus-visible:ring-2 focus-visible:ring-brass-dark focus-visible:ring-offset-2"
        >
          {isSubmitting
            ? "Submitting..."
            : isImageUploading || isGalleryUploading
              ? "Uploading Images..."
              : existingListing
                ? "Save Changes"
                : "Create free listing"}
        </Button>
      </form>
    </>
  );
}
