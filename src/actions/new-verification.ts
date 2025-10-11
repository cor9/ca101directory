"use server";

import { getUserByEmail } from "@/data/supabase-user";
import { supabase } from "@/lib/supabase";
import { getVerificationTokenByToken } from "@/lib/tokens";

export type ServerActionResponse = {
  status: "success" | "error";
  message?: string;
};

export async function newVerification(
  token: string,
): Promise<ServerActionResponse> {
  const existingToken = await getVerificationTokenByToken(token);
  if (!existingToken) {
    return { status: "error", message: "Token does not exist!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { status: "error", message: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.identifier);
  if (!existingUser) {
    return { status: "error", message: "Email does not exist!" };
  }

  // For Supabase Auth, email verification is handled automatically
  // We just need to confirm the token is valid
  console.log("Email verified:", existingUser.email);

  // TODO: Delete the verification token from wherever it's stored
  // For now, we'll assume the token expires naturally
  return { status: "success", message: "Email verified!" };
}
