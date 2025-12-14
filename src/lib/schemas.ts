import * as z from "zod";

/**
 * newsletter schema
 */
export const NewsletterFormSchema = z.object({
  email: z.string().email({
    message: "Enter a valid email",
  }),
});

export type NewsletterFormData = z.infer<typeof NewsletterFormSchema>;

/**
 * submit item
 */
// Helper to auto-fix URLs (add https:// if missing)
const urlWithProtocol = z
  .string()
  .transform((val) => {
    if (!val || val === "") return "";
    // If it already has a protocol, return as is
    if (val.match(/^https?:\/\//i)) return val;
    // Add https:// prefix
    return `https://${val}`;
  })
  .pipe(
    z.union([
      z.string().url({ message: "Please enter a valid website URL" }),
      z.literal(""),
    ]),
  );

// Helper for optional social media URLs - auto-fix or accept empty
const optionalUrlWithProtocol = z
  .string()
  .optional()
  .or(z.literal(""))
  .transform((val) => {
    if (!val || val === "") return "";
    // If it already has a protocol, return as is
    if (val.match(/^https?:\/\//i)) return val;
    // Add https:// prefix
    return `https://${val}`;
  });

export const baseSubmitSchema = {
  name: z
    .string()
    .min(1, { message: "Business name is required" })
    .max(100, { message: "Name must be 100 or fewer characters long" }),
  link: urlWithProtocol,
  description: z
    .string()
    .max(256, { message: "Description must be 256 or fewer characters long" })
    .optional(), // Optional for free listings
  introduction: z
    .string()
    .max(4096, {
      message: "Introduction must be 4096 or fewer characters long",
    })
    .optional(), // Optional for free listings
  unique: z.string().optional(), // Optional for free listings, validated in form based on plan
  format: z.union([
    z.enum(["In-person", "Online", "Hybrid"]), // Legacy single value
    z.array(z.enum(["online", "in-person", "hybrid"])).min(1, {
      message: "Please select at least one service format",
    }), // New tags format
  ]),
  notes: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
  city: z.string().min(1, { message: "City is required" }), // Required for all listings
  state: z.string().min(1, { message: "State is required" }), // Required for all listings
  zip: z.string().optional(),
  region: z.union([
    z
      .array(z.string())
      .min(1, { message: "Please select at least one region" }),
    z
      .string()
      .transform((val) => [val]), // Convert single string to array
  ]),
  bondNumber: z.string().optional(),
  plan: z.enum(
    ["Free", "Standard", "Pro", "Founding Standard", "Founding Pro"],
    {
      required_error: "Please select a plan",
    },
  ),
  performerPermit: z.boolean().optional(), // Make optional for testing
  bonded: z.boolean().optional(),
  tags: z.array(z.string()).optional(), // Optional for free listings
  categories: z
    .array(z.string())
    .min(1, { message: "Please select at least one category" }),
  // Gallery supports legacy string[] and new object format with captions
  gallery: z
    .array(
      z.union([
        z.string(),
        z.object({
          url: z.string(),
          caption: z.string().optional(),
        }),
      ]),
    )
    .optional(),
  imageId: z.string().optional(), // Make optional for testing
  iconId: z.string().optional(), // Optional logo/icon even if icons are disabled
  active: z.boolean().optional(), // Optional active status
  // Social media fields (Pro users only) - now much more forgiving
  facebook_url: optionalUrlWithProtocol,
  instagram_url: optionalUrlWithProtocol,
  tiktok_url: optionalUrlWithProtocol,
  youtube_url: optionalUrlWithProtocol,
  linkedin_url: optionalUrlWithProtocol,
  blog_url: optionalUrlWithProtocol,
  custom_link_url: optionalUrlWithProtocol,
  custom_link_name: z.string().optional(),
};

export const SubmitSchema = z.object(baseSubmitSchema);

export type SubmitFormData = z.infer<typeof SubmitSchema>;

/**
 * Vendor suggestion form schema
 */
export const VendorSuggestionSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Vendor name is required" })
    .max(100, { message: "Name must be 100 or fewer characters long" }),
  website: z
    .string()
    .url({ message: "Please enter a valid website URL" })
    .optional()
    .or(z.literal("")),
  category: z.string().min(1, { message: "Category is required" }),
  // City/state optional to allow online-only or unknown submissions
  city: z
    .string()
    .max(50, { message: "City must be 50 or fewer characters long" })
    .optional()
    .or(z.literal("")),
  state: z
    .string()
    .max(2, { message: "Use 2-letter state code" })
    .optional()
    .or(z.literal("")),
  // Removed 'region'; replacing with vendor contact channels
  vendorEmail: z
    .string()
    .email({ message: "Enter a valid email" })
    .optional()
    .or(z.literal("")),
  vendorPhone: z.string().optional().or(z.literal("")),
  notes: z
    .string()
    .max(500, { message: "Notes must be 500 or fewer characters long" })
    .optional(),
  suggestedBy: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .optional()
    .or(z.literal("")),
});

export type VendorSuggestionFormData = z.infer<typeof VendorSuggestionSchema>;

/**
 * Review form schema
 */
export const ReviewSchema = z.object({
  vendorId: z.string().min(1, { message: "Vendor ID is required" }),
  rating: z
    .number()
    .min(1, { message: "Rating must be at least 1" })
    .max(5, { message: "Rating must be at most 5" }),
  comment: z
    .string()
    .min(10, { message: "Comment must be at least 10 characters" })
    .max(1000, { message: "Comment must be 1000 or fewer characters" }),
});

export type ReviewFormData = z.infer<typeof ReviewSchema>;

/**
 * Claim listing form schema
 */
export const ClaimListingSchema = z.object({
  listingId: z.string().min(1, { message: "Listing ID is required" }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(1000, { message: "Message must be 1000 or fewer characters" }),
});

export type ClaimListingFormData = z.infer<typeof ClaimListingSchema>;

/**
 * edit item
 */
export const EditSchema = SubmitSchema.extend({
  id: z.string().min(1, { message: "ID is required" }),
  pricePlan: z.string().min(1, { message: "Price plan is required" }),
  planStatus: z.string().min(1, { message: "Plan status is required" }),
});

/**
 * account settings
 */
export const SettingsSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

export const UserNameSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(32, { message: "Name must be 32 or fewer characters long" }),
});

export type UserNameData = z.infer<typeof UserNameSchema>;

/**
 * auth related schemas
 */
export const MagicLinkRequestSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  remember: z.boolean().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  token: z.string().min(1, {
    message: "Magic link token is required",
  }),
  refreshToken: z.string().min(1, {
    message: "Refresh token is required",
  }),
  remember: z.string().optional(),
  expiresIn: z.string().optional(),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
  role: z.enum(["parent", "vendor"], {
    required_error: "Please select your role",
  }),
  remember: z.boolean().optional(),
});

/**
 * og image schema
 */
export const ogImageSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  type: z.string().optional(),
  mode: z.enum(["light", "dark"]).default("light"),
});
