import { auth } from "@/auth";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createSupabaseClient(supabaseUrl, supabaseServiceKey);
}

/**
 * Create a Supabase client with user session context for RLS
 */
export async function createClientWithSession() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
  }

  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("No authenticated session");
  }

  const client = createSupabaseClient(supabaseUrl, supabaseAnonKey);

  // Set the session for RLS
  await client.auth.setSession({
    access_token: (session as any).accessToken || "",
    refresh_token: (session as any).refreshToken || "",
  });

  return client;
}
