import * as z from "zod";
import { SUPPORT_ITEM_ICON } from "./constants";

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
export const baseSubmitSchema = {
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(32, { message: "Name must be 32 or fewer characters long" }),
  link: z.string().url({ message: "Invalid url" }),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .max(256, { message: "Description must be 256 or fewer characters long" }),
  introduction: z
    .string()
    .min(1, { message: "Introduction is required" })
    .max(4096, {
      message: "Introduction must be 4096 or fewer characters long",
    }),
  unique: z
    .string()
    .min(5, { message: "Why is it unique? (minimum 5 characters)" }),
  format: z.enum(["In-person", "Online", "Hybrid"], {
    required_error: "Please select a format",
  }),
  notes: z.string().optional(),
  email: z.string().email({ message: "Valid email required" }),
  phone: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  region: z.string().optional(),
  bondNumber: z.string().optional(),
  plan: z.enum(
    ["Free", "Standard", "Pro", "Founding Standard", "Founding Pro"],
    {
      required_error: "Please select a plan",
    },
  ),
  performerPermit: z.boolean().optional(), // Make optional for testing
  bonded: z.boolean().optional(),
  tags: z.array(z.string()).min(1, { message: "Must select at least one tag" }),
  categories: z
    .array(z.string())
    .min(1, { message: "Must select at least one category" }),
  gallery: z.array(z.string()).optional(), // Optional gallery images
  imageId: z.string().optional(), // Make optional for testing
  active: z.boolean().optional(), // Optional active status
};

export const SubmitSchema = SUPPORT_ITEM_ICON
  ? z.object({
      ...baseSubmitSchema,
      iconId: z.string().optional(), // Make optional instead of required
    })
  : z.object(baseSubmitSchema);

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
  city: z
    .string()
    .min(1, { message: "City is required" })
    .max(50, { message: "City must be 50 or fewer characters long" }),
  state: z
    .string()
    .min(2, { message: "State is required" })
    .max(2, { message: "Please use 2-letter state code" }),
  region: z
    .string()
    .min(1, { message: "Region is required" })
    .max(50, { message: "Region must be 50 or fewer characters long" }),
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
export const SettingsSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    },
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "Password is required!",
      path: ["password"],
    },
  );

export const UserNameSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(32, { message: "Name must be 32 or fewer characters long" }),
});

export type UserNameData = z.infer<typeof UserNameSchema>;

export const UserPasswordSchema = z
  .object({
    password: z.string().min(6, {
      message: "Minimum of 6 characters required",
    }),
    newPassword: z.string().min(6, {
      message: "Minimum of 6 characters required",
    }),
    confirmPassword: z.string().min(6, {
      message: "Minimum of 6 characters required",
    }),
  })
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "Password is required",
      path: ["password"],
    },
  )
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required",
      path: ["newPassword"],
    },
  )
  .refine(
    (data) => {
      if (data.newPassword !== data.confirmPassword) {
        return false;
      }

      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );

export type UserPasswordData = z.infer<typeof UserPasswordSchema>;

/**
 * auth related schemas
 */
export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
  role: z.enum(["parent", "vendor"], {
    required_error: "Please select your role",
  }),
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
