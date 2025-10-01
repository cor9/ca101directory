import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create client with fallback for build time
export const supabase = (() => {
  if (!supabaseUrl || !supabaseAnonKey) {
    // During build or when env vars are missing, create a dummy client
    return createClient("https://placeholder.supabase.co", "placeholder_key");
  }
  return createClient(supabaseUrl, supabaseAnonKey);
})();

// Server-side client for API routes
export const createServerClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    // During build or when env vars are missing, create a dummy client
    return createClient(
      "https://placeholder.supabase.co",
      "placeholder_service_key",
    );
  }

  return createClient(url, serviceKey);
};
