"use server";

import { requirePermission } from "@/lib/auth/guards";
import { createServerClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export type ServerActionResponse = {
  success: boolean;
  message?: string;
};

/**
 * Assigns a listing to a rep. If the listing already has an active
 * assignment, it is released first (status='released') before the new one
 * is created, since only one active assignment per listing is allowed
 * (enforced by a partial unique index in the DDL).
 */
export async function assignListingToRep(
  listingId: string,
  repId: string,
): Promise<ServerActionResponse> {
  const guard = await requirePermission("crm.assign");
  if (!guard.authorized) {
    return { success: false, message: "Unauthorized: Admin access required" };
  }

  const supabase = createServerClient();

  const { error: releaseError } = await supabase
    .from("rep_assignments")
    .update({ status: "released", released_at: new Date().toISOString() })
    .eq("listing_id", listingId)
    .eq("status", "active");

  if (releaseError) {
    console.error(
      "assignListingToRep: failed to release prior assignment",
      releaseError,
    );
    return { success: false, message: "Failed to update existing assignment" };
  }

  const { error: insertError } = await supabase.from("rep_assignments").insert({
    listing_id: listingId,
    rep_id: repId,
    status: "active",
  });

  if (insertError) {
    console.error(
      "assignListingToRep: failed to create assignment",
      insertError,
    );
    return { success: false, message: "Failed to assign listing" };
  }

  revalidatePath("/dashboard/admin/crm");
  return { success: true, message: "Listing assigned" };
}

/**
 * Releases the active assignment for a listing, if one exists.
 */
export async function releaseAssignment(
  listingId: string,
): Promise<ServerActionResponse> {
  const guard = await requirePermission("crm.assign");
  if (!guard.authorized) {
    return { success: false, message: "Unauthorized: Admin access required" };
  }

  const supabase = createServerClient();
  const { error } = await supabase
    .from("rep_assignments")
    .update({ status: "released", released_at: new Date().toISOString() })
    .eq("listing_id", listingId)
    .eq("status", "active");

  if (error) {
    console.error("releaseAssignment: failed", error);
    return { success: false, message: "Failed to release assignment" };
  }

  revalidatePath("/dashboard/admin/crm");
  return { success: true, message: "Assignment released" };
}
