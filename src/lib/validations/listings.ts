import { z } from "zod";

const commaSeparatedStringToArray = z
  .union([z.string(), z.undefined(), z.null()])
  .optional()
  .transform((val) => {
    if (!val || val === "") return [];
    if (typeof val === "string") {
      return val.split(",").map((s) => s.trim()).filter(Boolean);
    }
    return [];
  });

// Schema for updating a listing
export const UpdateListingSchema = z.object({
  listing_name: z.string().min(1, "Listing name is required."),
  status: z.enum(["Live", "Pending", "Draft", "Archived", "Rejected"]),
  website: z.union([z.string().url({ message: "Invalid URL format." }), z.literal("")]).optional(),
  email: z.union([z.string().email({ message: "Invalid email format." }), z.literal("")]).optional(),
  phone: z.string().optional(),
  what_you_offer: z.string().optional(),
  is_claimed: z.boolean(),
  // Extended fields for comprehensive admin editing
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  facebook_url: z.union([z.string().url({ message: "Invalid URL format." }), z.literal("")]).optional(),
  instagram_url: z.union([z.string().url({ message: "Invalid URL format." }), z.literal("")]).optional(),
  plan: z.string().optional(),
  is_active: z.boolean().optional(),
  featured: z.boolean().optional(),
  // Detailed Profile Fields
  who_is_it_for: z.string().optional(),
  why_is_it_unique: z.string().optional(),
  format: z.string().optional(),
  extras_notes: z.string().optional(),
  // Array fields handled with transform
  categories: commaSeparatedStringToArray,
  age_range: commaSeparatedStringToArray,
  region: commaSeparatedStringToArray,
});

// Schema for creating a new listing
export const CreateListingSchema = z.object({
  listing_name: z.string().min(1, "Listing name is required."),
  status: z.enum(["Live", "Pending", "Draft", "Archived", "Rejected"]),
  website: z.union([z.string().url({ message: "Invalid URL format." }), z.literal("")]).optional(),
  email: z.union([z.string().email({ message: "Invalid email format." }), z.literal("")]).optional(),
  phone: z.string().optional(),
  what_you_offer: z.string().optional(),
});
