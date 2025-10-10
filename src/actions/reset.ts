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

  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    return { status: "error", message: "Email not found!" };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(
    existingUser.full_name || existingUser.email,
    passwordResetToken.identifier,
    passwordResetToken.token,
  );

  return { status: "success", message: "Password reset email sent" };
}
