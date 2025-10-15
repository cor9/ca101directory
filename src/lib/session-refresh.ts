/**
 * Session refresh utilities
 * 
 * Helps with session refresh after login flow changes
 */

import { unstable_update } from "@/auth";

/**
 * Force refresh the current session
 * Useful after login flow changes to ensure role is properly updated
 */
export async function refreshSession() {
  try {
    console.log("Refreshing session...");
    await unstable_update();
    console.log("Session refreshed successfully");
  } catch (error) {
    console.error("Failed to refresh session:", error);
  }
}

/**
 * Check if current session needs refresh
 * Based on whether role is properly set
 */
export function needsSessionRefresh(session: any): boolean {
  if (!session?.user) return false;
  
  // If user exists but no role is set, needs refresh
  if (!session.user.role) return true;
  
  // If role is "guest" for authenticated user, needs refresh
  if (session.user.role === "guest" && session.user.id) return true;
  
  return false;
}
