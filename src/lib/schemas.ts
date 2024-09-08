import * as z from "zod";
import { UserRole } from "@/types/user-role";

/**
 * submit item
 */
export const SubmitSchema = z.object({
  name: z.string()
      .min(1, { message: "Name is required" })
      .max(32, { message: "Name must be 32 or fewer characters long" }),
  link: z.string()
      .url({ message: "Invalid url" }),
  description: z.string()
      .min(1, { message: "Description is required" })
      .max(256, { message: "Description must be 256 or fewer characters long" }),
  introduction: z.string()
      .min(1, { message: "Introduction is required" })
      .max(4096, { message: "Introduction must be 4096 or fewer characters long" }),
  tags: z.array(z.string())
      .min(1, { message: "Must select at least one tag" }),
  categories: z.array(z.string())
      .min(1, { message: "Must select at least one category" }),
  imageId: z.string()
      .min(1, { message: "Must upload an image" }),
})

/**
 * update item
 */
export const UpdateSchema = SubmitSchema.extend({
  id: z.string().min(1, { message: "ID is required" }),
})

/**
 * account settings
 */
export const SettingsSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
  email: z.optional(z.string().email()),
  password: z.optional(z.string().min(6)),
  newPassword: z.optional(z.string().min(6)),
})
  .refine((data) => {
    if (data.password && !data.newPassword) {
      return false;
    }

    return true;
  }, {
    message: "New password is required!",
    path: ["newPassword"]
  })
  .refine((data) => {
    if (data.newPassword && !data.password) {
      return false;
    }

    return true;
  }, {
    message: "Password is required!",
    path: ["password"]
  })

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
});