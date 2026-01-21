import { z } from "zod";

const commaSeparatedStringToArray = z
  .union([z.string(), z.undefined(), z.null()])
  .optional()
  .transform((val) => {
    if (!val || val === "") return [];
    if (typeof val === "string") {
      return val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [];
  });

// Schema for updating a listing
export const UpdateListingSchema = z
  .object({
    listing_name: z.string().min(1, "Listing name is required."),
    status: z.enum(["Live", "Pending", "Draft", "Archived", "Rejected"]),
    website: z
      .union([
        z.string().url({ message: "Invalid URL format." }),
        z.literal(""),
      ])
      .optional(),
    email: z
      .union([
        z.string().email({ message: "Invalid email format." }),
        z.literal(""),
      ])
      .optional(),
    phone: z.string().optional(),
    what_you_offer: z.string().optional(),
    is_claimed: z.boolean(),
    // Extended fields for comprehensive admin editing
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
    facebook_url: z
      .union([
        z.string().url({ message: "Invalid URL format." }),
        z.literal(""),
      ])
      .optional(),
    instagram_url: z
      .union([
        z.string().url({ message: "Invalid URL format." }),
        z.literal(""),
      ])
      .optional(),
    // Custom link (used for promo video or other CTA)
    custom_link_url: z
      .union([
        z.string().url({ message: "Invalid URL format." }),
        z.literal(""),
      ])
      .optional(),
    custom_link_name: z.string().optional(),
    plan: z.string().optional(),
    is_active: z.boolean(),
    featured: z.boolean().optional(),
    video_url: z
      .union([z.string().url({ message: "Invalid video URL." }), z.literal("")])
      .optional()
      .refine(
        (val) =>
          !val || val === "" || val.includes("youtu") || val.includes("vimeo"),
        { message: "Video URL must be YouTube or Vimeo." },
      ),
    // Detailed Profile Fields
    why_is_it_unique: z.string().optional(),
    format: z.string().optional(),
    extras_notes: z.string().optional(),
    // Images
    profile_image: z.string().optional(),
    // For gallery we accept either a JSON string or empty
    gallery: z.union([z.string(), z.literal("")]).optional(),
    // Badges/Compliance
    is_approved_101: z.boolean().optional(),
    ca_permit_required: z.boolean().optional(),
    is_bonded: z.boolean().optional(),
    bond_number: z.string().optional(),
    // Array fields handled with transform
    categories: commaSeparatedStringToArray,
    age_range: commaSeparatedStringToArray,
    age_tags: commaSeparatedStringToArray,
    services_offered: commaSeparatedStringToArray,
    techniques: commaSeparatedStringToArray,
    specialties: commaSeparatedStringToArray,
    region: commaSeparatedStringToArray,
    logo_url: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    // If bonded, bond_number required
    if (val.is_bonded && !val.bond_number) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Bond number is required when 'Bonded for Advanced Fees' is enabled.",
        path: ["bond_number"],
      });
    }

    // If going Live, enforce required fields
    if (val.status === "Live") {
      // active must be true
      if (!val.is_active) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Listing must be marked Active to go Live.",
          path: ["is_active"],
        });
      }

      // email required (non-empty string)
      const email = typeof val.email === "string" ? val.email : "";
      if (!email || email.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Email is required for Live listings.",
          path: ["email"],
        });
      }

      // profile image required ONLY for Standard/Pro plans (not Free)
      const plan =
        typeof val.plan === "string" ? val.plan.toLowerCase() : "free";
      const isFree = plan === "free";
      const profile =
        typeof val.profile_image === "string" ? val.profile_image : "";
      if (!isFree && (!profile || profile.trim() === "")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Profile image is required for Live listings on Standard/Pro plans.",
          path: ["profile_image"],
        });
      }

      // basic location: city and state required (except for online-only vendors)
      const format =
        typeof val.format === "string" ? val.format.toLowerCase() : "";
      const isOnlineOnly = format === "online";

      if (!isOnlineOnly) {
        const city = typeof val.city === "string" ? val.city : "";
        const state = typeof val.state === "string" ? val.state : "";
        if (!city || city.trim() === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "City is required for Live listings (except online-only).",
            path: ["city"],
          });
        }
        if (!state || state.trim() === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "State is required for Live listings (except online-only).",
            path: ["state"],
          });
        }
      }
    }
  });

// Schema for creating a new listing
export const CreateListingSchema = z.object({
  listing_name: z.string().min(1, "Listing name is required."),
  status: z.enum(["Live", "Pending", "Rejected", "Inactive"]), // Match database enum
  website: z
    .union([z.string().url({ message: "Invalid URL format." }), z.literal("")])
    .optional(),
  email: z
    .union([
      z.string().email({ message: "Invalid email format." }),
      z.literal(""),
    ])
    .optional(),
  phone: z.string().optional(),
  what_you_offer: z.string().optional(),
  // Promo video/custom link (optional)
  custom_link_url: z
    .union([z.string().url({ message: "Invalid URL format." }), z.literal("")])
    .optional(),
  custom_link_name: z.string().optional(),
  video_url: z
    .union([z.string().url({ message: "Invalid video URL." }), z.literal("")])
    .optional()
    .refine(
      (val) =>
        !val || val === "" || val.includes("youtu") || val.includes("vimeo"),
      { message: "Video URL must be YouTube or Vimeo." },
    ),
  // Allow optional plan for admin-created listings
  plan: z.string().optional(),
  logo_url: z.string().optional(),
  // New admin-create fields
  category: z.string().optional(), // single category name (admin free create)
  format: z.enum(["In-person", "Online", "Hybrid"]).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  region: z.string().optional(), // comma-separated or a single region label
  age_tags: z.string().optional(),
  services_offered: z.string().optional(),
  techniques: z.string().optional(),
  specialties: z.string().optional(),
});
