import * as z from "zod";
import { UserRole } from "@/types/user-role";

// https://nextjs.org/learn/dashboard-app/mutating-data
export const SubmitItemSchema = z.object({
  name: z.string()
      .min(1, { message: "Must be 1 or more characters long" })
      .max(32, { message: "Must be 32 or fewer characters long" }),
  link: z.string()
      .url({ message: "Invalid url" }),
  description: z.string()
      .min(3, { message: "Must be 3 or more characters long" })
      .max(256, { message: "Must be 256 or fewer characters long" }),
  mdContent: z.string()
      .min(1, { message: "Must be 32 or more characters long" }),
      // .max(1024, { message: "Must be 1024 or fewer characters long" }),
  tags: z.array(z.string())
      .min(1, { message: "Must select at least one tag" }),
  categories: z.array(z.string())
      .min(1, { message: "Must select at least one category" }),
  // logoImageId: z.string()
  //     .min(1, { message: "Must upload an image" }),
  coverImageId: z.string()
      .min(1, { message: "Must upload an image" }),
})

export const SettingsSchema = z.object({
  name: z.optional(z.string()),
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