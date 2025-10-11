import { supabase } from "@/lib/supabase";

// Generate a secure random token (works in both Node and Edge Runtime)
function generateSecureToken(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    // Use Web Crypto API (works in Edge Runtime)
    return crypto.randomUUID() + crypto.randomUUID().replace(/-/g, "");
  } else {
    // Fallback to Node crypto
    const nodeCrypto = require("crypto");
    return nodeCrypto.randomBytes(32).toString("hex");
  }
}

export const generateVerificationToken = async (email: string) => {
  // Generate a secure random token
  const token = generateSecureToken();

  // Expires in 1 hour
  const expires = new Date(new Date().getTime() + 3600 * 1000).toISOString();

  // Delete any existing tokens for this email
  await supabase.from("verification_tokens").delete().eq("email", email);

  // Create new token
  const { data, error } = await supabase
    .from("verification_tokens")
    .insert({
      email,
      token,
      expires,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating verification token:", error);
    return null;
  }

  return { identifier: email, token, expires };
};

export const generatePasswordResetToken = async (email: string) => {
  try {
    // Generate a secure random token
    const token = generateSecureToken();

    // Expires in 1 hour
    const expires = new Date(new Date().getTime() + 3600 * 1000).toISOString();

    // Delete any existing tokens for this email
    await supabase.from("password_reset_tokens").delete().eq("email", email);

    // Create new token
    const { data, error } = await supabase
      .from("password_reset_tokens")
      .insert({
        email,
        token,
        expires,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating password reset token:", error);
      return null;
    }

    return { identifier: email, token, expires };
  } catch (error) {
    console.error("generatePasswordResetToken error:", error);
    return null;
  }
};

// Get password reset token by token (Supabase version)
export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const { data, error } = await supabase
      .from("password_reset_tokens")
      .select("*")
      .eq("token", token)
      .single();

    if (error) {
      console.error("Error fetching password reset token:", error);
      return null;
    }

    return {
      identifier: data.email,
      token: data.token,
      expires: data.expires,
    };
  } catch (error) {
    console.error("getPasswordResetTokenByToken error:", error);
    return null;
  }
};

// Get password reset token by email (Supabase version)
export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const { data, error } = await supabase
      .from("password_reset_tokens")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      console.error("Error fetching password reset token by email:", error);
      return null;
    }

    return {
      identifier: data.email,
      token: data.token,
      expires: data.expires,
    };
  } catch (error) {
    console.error("getPasswordResetTokenByEmail error:", error);
    return null;
  }
};

// Get verification token by token (Supabase version)
export const getVerificationTokenByToken = async (token: string) => {
  try {
    const { data, error } = await supabase
      .from("verification_tokens")
      .select("*")
      .eq("token", token)
      .single();

    if (error) {
      console.error("Error fetching verification token:", error);
      return null;
    }

    return {
      identifier: data.email,
      token: data.token,
      expires: data.expires,
    };
  } catch (error) {
    console.error("getVerificationTokenByToken error:", error);
    return null;
  }
};
