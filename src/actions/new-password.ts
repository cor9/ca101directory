"use server";

import { getUserByEmail } from "@/data/supabase-user";
import { NewPasswordSchema } from "@/lib/schemas";
import { supabase } from "@/lib/supabase";
import { getPasswordResetTokenByToken } from "@/lib/tokens";
import type * as z from "zod";

export type ServerActionResponse = {
  status: "success" | "error";
  message?: string;
};

export async function newPassword(
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null,
): Promise<ServerActionResponse> {
  // console.log('newPassword, token:', token);
  if (!token) {
    return { status: "error", message: "Missing token!" };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { status: "error", message: "Invalid fields!" };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) {
    return { status: "error", message: "Invalid token!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { status: "error", message: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.identifier);
  if (!existingUser) {
    return { status: "error", message: "Email does not exist!" };
  }

  // Update password using Supabase Auth
  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    console.error("Password update error:", error);
    return { status: "error", message: "Failed to update password!" };
  }

  // Delete the used password reset token
  try {
    await supabase.from("password_reset_tokens").delete().eq("token", token);
  } catch (error) {
    console.error("Error deleting used reset token:", error);
    // Don't fail if we can't delete the token - it will expire anyway
  }

  return { status: "success", message: "Password updated!" };
}
