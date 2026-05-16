import type { SupabaseClient } from "@supabase/supabase-js";

export const EVENT_LIMITS = {
  free: 1,
  standard: 3,
  pro: Number.POSITIVE_INFINITY,
} as const;

export function getEventLimitForPlan(plan?: string | null): number {
  const normalized = String(plan || "free").toLowerCase();

  if (normalized.includes("pro")) return EVENT_LIMITS.pro;
  if (normalized.includes("premium")) return EVENT_LIMITS.pro;
  if (normalized.includes("founding standard")) return EVENT_LIMITS.standard;
  if (normalized.includes("standard")) return EVENT_LIMITS.standard;

  return EVENT_LIMITS.free;
}

export function getPlanLabelForEvents(plan?: string | null) {
  const normalized = String(plan || "free").toLowerCase();
  if (normalized.includes("pro") || normalized.includes("premium")) {
    return "Pro";
  }
  if (normalized.includes("standard")) return "Standard";
  return "Free";
}

export function formatEventLimit(limit: number) {
  return Number.isFinite(limit) ? String(limit) : "unlimited";
}

export function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export async function getActiveEventCountForListing(
  supabase: SupabaseClient,
  listingId: string,
) {
  const today = todayIsoDate();
  const { count, error } = await supabase
    .from("events")
    .select("id", { count: "exact", head: true })
    .eq("listing_id", listingId)
    .in("status", ["pending", "approved"])
    .or(`and(end_date.is.null,start_date.gte.${today}),end_date.gte.${today}`);

  if (error) {
    throw error;
  }

  return count || 0;
}

export async function canCreateEventForListing(
  supabase: SupabaseClient,
  listingId: string,
  excludeEventId?: string,
) {
  const { data: listing, error: listingError } = await supabase
    .from("listings")
    .select("id, listing_name, plan, stripe_plan_id, comped")
    .eq("id", listingId)
    .single();

  if (listingError) {
    throw listingError;
  }

  const effectivePlan = listing?.comped
    ? "Pro"
    : listing?.plan || listing?.stripe_plan_id || "Free";
  const limit = getEventLimitForPlan(effectivePlan);
  const today = todayIsoDate();
  let countQuery = supabase
    .from("events")
    .select("id", { count: "exact", head: true })
    .eq("listing_id", listingId)
    .in("status", ["pending", "approved"])
    .or(`and(end_date.is.null,start_date.gte.${today}),end_date.gte.${today}`);

  if (excludeEventId) {
    countQuery = countQuery.neq("id", excludeEventId);
  }

  const { count, error: countError } = await countQuery;

  if (countError) {
    throw countError;
  }

  const activeCount = count || 0;

  return {
    allowed: activeCount < limit,
    activeCount,
    limit,
    listing,
    plan: effectivePlan,
  };
}
