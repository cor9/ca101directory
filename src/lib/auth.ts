import { auth } from "@/auth";
import { type UserRole, type UserWithRole, getRole } from "@/lib/auth/roles";
import { supabase } from "@/lib/supabase";

export async function signInWithEmail(email: string) {
  const { error } = await supabase.auth.signInWithOtp({ email });
  if (error) throw error;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export function onAuthStateChanged(callback: (user: unknown) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
}

export async function currentUser() {
  const session = await auth();
  return session?.user || null;
}

export async function currentRole(): Promise<UserRole> {
  const session = await auth();
  return getRole(session?.user as any);
}

/**
 * Get current user with role information
 */
export async function currentUserWithRole(): Promise<UserWithRole | null> {
  const session = await auth();
  return (session?.user as any) || null;
}
