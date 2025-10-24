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
export const UpdateListingSchema = z.object({
  listing_name: z.string().min(1, "Listing name is required."),
  status: z.enum(["Live", "Pending", "Draft", "Archived", "Rejected"]),
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
  is_claimed: z.boolean(),
  // Extended fields for comprehensive admin editing
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  facebook_url: z
    .union([z.string().url({ message: "Invalid URL format." }), z.literal("")])
    .optional(),
  instagram_url: z
    .union([z.string().url({ message: "Invalid URL format." }), z.literal("")])
    .optional(),
  plan: z.string().optional(),
  is_active: z.boolean(),
  featured: z.boolean().optional(),
  // Detailed Profile Fields
  who_is_it_for: z.string().optional(),
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
  region: commaSeparatedStringToArray,
}).superRefine((val, ctx) => {
  // If bonded, bond_number required
  if (val.is_bonded && !val.bond_number) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Bond number is required when 'Bonded for Advanced Fees' is enabled.",
      path: ["bond_number"],
    });
  }

  // If 101 Approved, CA permit must be true
  if (val.is_approved_101 && !val.ca_permit_required) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "CA Performer Permit must be enabled for 101 Approved.",
      path: ["ca_permit_required"],
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

    // profile image required
    const profile = typeof val.profile_image === "string" ? val.profile_image : "";
    if (!profile || profile.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Profile image is required for Live listings.",
        path: ["profile_image"],
      });
    }

    // basic location: city and state required
    const city = typeof val.city === "string" ? val.city : "";
    const state = typeof val.state === "string" ? val.state : "";
    if (!city || city.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "City is required for Live listings.",
        path: ["city"],
      });
    }
    if (!state || state.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "State is required for Live listings.",
        path: ["state"],
      });
    }
  }
});

// Schema for creating a new listing
export const CreateListingSchema = z.object({
  listing_name: z.string().min(1, "Listing name is required."),
  status: z.enum(["Live", "Pending", "Draft", "Archived", "Rejected"]),
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
  // Allow optional plan for admin-created listings
  plan: z.string().optional(),
});
