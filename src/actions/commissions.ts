"use server";

import { requirePermission } from "@/lib/auth/guards";
import { createServerClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export type ServerActionResponse = {
  success: boolean;
  message?: string;
};

/**
 * Rep's own commission ledger rows only.
 */
export async function getMyCommissions() {
  const guard = await requirePermission("commission.read.own");
  if (!guard.authorized) {
    return [];
  }

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("rep_commissions")
    .select("*")
    .eq("rep_id", guard.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getMyCommissions: failed", error);
    return [];
  }
  return data;
}

/**
 * Admin view of every commission ledger row.
 */
export async function getAllCommissions() {
  const guard = await requirePermission("commission.read.all");
  if (!guard.authorized) {
    return [];
  }

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("rep_commissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAllCommissions: failed", error);
    return [];
  }
  return data;
}

/**
 * pending -> approved. Admin-only transition per the commission state machine.
 */
export async function approveCommission(
  commissionId: string,
): Promise<ServerActionResponse> {
  const guard = await requirePermission("commission.approve");
  if (!guard.authorized) {
    return { success: false, message: "Unauthorized: Admin access required" };
  }

  const supabase = createServerClient();
  const { error } = await supabase
    .from("rep_commissions")
    .update({ status: "approved", status_changed_at: new Date().toISOString() })
    .eq("id", commissionId)
    .eq("status", "pending");

  if (error) {
    console.error("approveCommission: failed", error);
    return { success: false, message: "Failed to approve commission" };
  }

  revalidatePath("/dashboard/admin/commissions");
  return { success: true, message: "Commission approved" };
}

/**
 * approved -> paid. Terminal, immutable status. Admin-only transition.
 */
export async function markCommissionPaid(
  commissionId: string,
): Promise<ServerActionResponse> {
  const guard = await requirePermission("commission.mark_paid");
  if (!guard.authorized) {
    return { success: false, message: "Unauthorized: Admin access required" };
  }

  const supabase = createServerClient();
  const { error } = await supabase
    .from("rep_commissions")
    .update({ status: "paid", status_changed_at: new Date().toISOString() })
    .eq("id", commissionId)
    .eq("status", "approved");

  if (error) {
    console.error("markCommissionPaid: failed", error);
    return { success: false, message: "Failed to mark commission paid" };
  }

  revalidatePath("/dashboard/admin/commissions");
  return { success: true, message: "Commission marked paid" };
}
