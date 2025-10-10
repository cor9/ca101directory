"use server";

import { getUserByEmail } from "@/data/supabase-user";
import { sendPasswordResetEmail } from "@/lib/mail";
import { ResetSchema } from "@/lib/schemas";
import { generatePasswordResetToken } from "@/lib/tokens";
import type * as z from "zod";

export type ServerActionResponse = {
  status: "success" | "error";
  message?: string;
};

export async function reset(
  values: z.infer<typeof ResetSchema>,
): Promise<ServerActionResponse> {
  const validatedFields = ResetSchema.safeParse(values);
  if (!validatedFields.success) {
    return { status: "error", message: "Invalid email!" };
  }

  const { email } = validatedFields.data;

  try {
    const existingUser = await getUserByEmail(email);
    if (!existingUser) {
      return { status: "error", message: "Email not found!" };
    }

    const passwordResetToken = await generatePasswordResetToken(email);
    
    if (!passwordResetToken) {
      console.error("Failed to generate password reset token");
      return { status: "error", message: "Failed to generate reset token. Please try again." };
    }

    await sendPasswordResetEmail(
      existingUser.full_name || existingUser.email,
      passwordResetToken.identifier,
      passwordResetToken.token,
    );

    return { status: "success", message: "Password reset email sent! Check your inbox (and spam folder)." };
  } catch (error) {
    console.error("Password reset error:", error);
    return { status: "error", message: "Something went wrong. Email rate limit may be exceeded - try again in a few minutes." };
  }
}
