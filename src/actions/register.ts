"use server";

import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/mail";
import { RegisterSchema } from "@/lib/schemas";
import { generateVerificationToken } from "@/lib/tokens";
import { sanityClient } from "@/sanity/lib/client";
import { UserRole } from "@/types/user-role";
import { uuid } from "@sanity/uuid";
import bcrypt from "bcryptjs";
import type * as z from "zod";

export type ServerActionResponse = {
  status: "success" | "error";
  message?: string;
};

export async function register(
  values: z.infer<typeof RegisterSchema>,
): Promise<ServerActionResponse> {
  // Temporarily disable email/password registration
  // Users should use Google/Facebook login instead
  return { 
    status: "error", 
    message: "Email registration is temporarily disabled. Please use Google or Facebook login instead." 
  };
}
