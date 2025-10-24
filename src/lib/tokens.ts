import { supabase } from "@/lib/supabase";
import crypto from "crypto";

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

// Lightweight signed claim token (no DB write). Format: base64url(payload).base64url(sig)
// payload: { lid, exp } signed with NEXTAUTH_SECRET
export function createClaimToken(listingId: string, ttlSeconds = 60 * 60 * 24 * 14) {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("NEXTAUTH_SECRET is required to sign claim tokens");
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = JSON.stringify({ lid: listingId, exp });
  const payloadB64 = Buffer.from(payload).toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url");
  return `${payloadB64}.${sig}`;
}

export function verifyClaimToken(token: string): { lid: string; exp: number } | null {
  try {
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) throw new Error("NEXTAUTH_SECRET missing");
    const [payloadB64, sig] = token.split(".");
    if (!payloadB64 || !sig) return null;
    const expected = crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url");
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
    if (!payload?.lid || !payload?.exp) return null;
    const now = Math.floor(Date.now() / 1000);
    if (now > payload.exp) return null;
    return { lid: payload.lid, exp: payload.exp };
  } catch (e) {
    console.error("verifyClaimToken error", e);
    return null;
  }
}

// Opt-out tokens (same scheme as claim tokens)
export function createOptOutToken(listingId: string, ttlSeconds = 60 * 60 * 24 * 30) {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("NEXTAUTH_SECRET is required to sign opt-out tokens");
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = JSON.stringify({ lid: listingId, exp, t: "optout" });
  const payloadB64 = Buffer.from(payload).toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url");
  return `${payloadB64}.${sig}`;
}

export function verifyOptOutToken(token: string): { lid: string; exp: number } | null {
  try {
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) throw new Error("NEXTAUTH_SECRET missing");
    const [payloadB64, sig] = token.split(".");
    if (!payloadB64 || !sig) return null;
    const expected = crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url");
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
    if (payload?.t !== "optout") return null;
    if (!payload?.lid || !payload?.exp) return null;
    const now = Math.floor(Date.now() / 1000);
    if (now > payload.exp) return null;
    return { lid: payload.lid, exp: payload.exp };
  } catch (e) {
    console.error("verifyOptOutToken error", e);
    return null;
  }
}


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
