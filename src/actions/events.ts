"use server";

import { currentUser } from "@/lib/auth";
import { canCreateEventForListing } from "@/lib/events/limits";
import { getEventById } from "@/lib/events/queries";
import {
  type EventFormValues,
  eventFormDataToObject,
  eventFormSchema,
  eventValidationErrors,
} from "@/lib/events/validation";
import { createServerClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function makeUniqueEventSlug(
  supabase: ReturnType<typeof createServerClient>,
  title: string,
  startDate: string,
  existingEventId?: string,
) {
  const base = `${slugify(title)}-${startDate}`;
  let candidate = base;

  for (let attempt = 0; attempt < 5; attempt++) {
    let query = supabase.from("events").select("id").eq("slug", candidate);
    if (existingEventId) query = query.neq("id", existingEventId);
    const { data, error } = await query.maybeSingle();

    if (!error && !data) return candidate;

    candidate = `${base}-${crypto.randomUUID().slice(0, 8)}`;
  }

  return `${base}-${crypto.randomUUID().slice(0, 8)}`;
}

function cleanEventPayload(values: EventFormValues) {
  const { standards_acknowledged: _standards, ...payload } = values;
  return {
    ...payload,
    category: payload.category || null,
    event_type: payload.event_type || null,
    short_description: payload.short_description || null,
    audience: payload.audience || null,
    end_date: payload.end_date || null,
    start_time: payload.start_time || null,
    end_time: payload.end_time || null,
    price_amount: payload.price_amount ?? null,
    price_display: payload.price_display || null,
    event_url: payload.event_url || null,
    registration_url: payload.registration_url || null,
    location_name: payload.location_name || null,
    address: payload.address || null,
    city: payload.city || null,
    state: payload.state || null,
    zip: payload.zip || null,
    image_url: payload.image_url || null,
  };
}

async function fetchListingForOwnership(
  supabase: ReturnType<typeof createServerClient>,
  listingId: string,
) {
  const { data, error } = await supabase
    .from("listings")
    .select("id, owner_id, listing_name, plan, stripe_plan_id, comped")
    .eq("id", listingId)
    .single();

  if (error) throw error;
  return data;
}

function failRedirect(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

export async function createVendorEvent(formData: FormData) {
  const user = await currentUser();
  if (!user?.id) redirect("/auth/login?callbackUrl=/dashboard/vendor/events");

  const parsed = eventFormSchema.safeParse(eventFormDataToObject(formData));
  if (!parsed.success) {
    failRedirect(
      "/dashboard/vendor/events/new",
      eventValidationErrors(parsed.error),
    );
  }

  const supabase = createServerClient();
  const listing = await fetchListingForOwnership(
    supabase,
    parsed.data.listing_id,
  );

  if (listing.owner_id !== user.id && user.role !== "admin") {
    failRedirect(
      "/dashboard/vendor/events/new",
      "You can only submit events for your own listings.",
    );
  }

  const limit = await canCreateEventForListing(
    supabase,
    parsed.data.listing_id,
  );
  if (user.role !== "admin" && !limit.allowed) {
    failRedirect(
      "/dashboard/vendor/events",
      "You have reached your current event posting limit.",
    );
  }

  const slug = await makeUniqueEventSlug(
    supabase,
    parsed.data.title,
    parsed.data.start_date,
  );

  const { error } = await supabase.from("events").insert({
    ...cleanEventPayload(parsed.data),
    created_by: user.id,
    slug,
    status: user.role === "admin" ? "approved" : "pending",
    approved_at: user.role === "admin" ? new Date().toISOString() : null,
    approved_by: user.role === "admin" ? user.id : null,
  });

  if (error) {
    console.error("createVendorEvent error:", error);
    failRedirect(
      "/dashboard/vendor/events/new",
      "Could not submit this event.",
    );
  }

  revalidatePath("/events");
  revalidatePath("/dashboard/vendor/events");
  redirect("/dashboard/vendor/events?submitted=1");
}

export async function updateVendorEvent(eventId: string, formData: FormData) {
  const user = await currentUser();
  if (!user?.id) redirect("/auth/login?callbackUrl=/dashboard/vendor/events");

  const parsed = eventFormSchema.safeParse(eventFormDataToObject(formData));
  const errorPath = `/dashboard/vendor/events/${eventId}/edit`;
  if (!parsed.success) {
    failRedirect(errorPath, eventValidationErrors(parsed.error));
  }

  const supabase = createServerClient();
  const event = await getEventById(supabase, eventId);
  if (!event) failRedirect("/dashboard/vendor/events", "Event not found.");

  const listing = await fetchListingForOwnership(
    supabase,
    parsed.data.listing_id,
  );
  if (listing.owner_id !== user.id && user.role !== "admin") {
    failRedirect(
      "/dashboard/vendor/events",
      "You can only edit your own events.",
    );
  }

  if (
    user.role !== "admin" &&
    !["draft", "pending", "rejected", "approved"].includes(String(event.status))
  ) {
    failRedirect(
      "/dashboard/vendor/events",
      "This event can no longer be edited.",
    );
  }

  const limit = await canCreateEventForListing(
    supabase,
    parsed.data.listing_id,
    eventId,
  );
  const willBecomeActive = [
    "draft",
    "rejected",
    "cancelled",
    "expired",
  ].includes(String(event.status));
  if (user.role !== "admin" && willBecomeActive && !limit.allowed) {
    failRedirect(
      "/dashboard/vendor/events",
      "You have reached your current event posting limit.",
    );
  }

  const slug = await makeUniqueEventSlug(
    supabase,
    parsed.data.title,
    parsed.data.start_date,
    eventId,
  );

  const { error } = await supabase
    .from("events")
    .update({
      ...cleanEventPayload(parsed.data),
      slug,
      status: user.role === "admin" ? event.status : "pending",
      rejection_reason: null,
      approved_at: user.role === "admin" ? event.approved_at : null,
      approved_by: user.role === "admin" ? event.approved_by : null,
      submitted_at: new Date().toISOString(),
    })
    .eq("id", eventId);

  if (error) {
    console.error("updateVendorEvent error:", error);
    failRedirect(errorPath, "Could not save this event.");
  }

  revalidatePath("/events");
  revalidatePath("/dashboard/vendor/events");
  redirect("/dashboard/vendor/events?updated=1");
}

async function requireAdmin() {
  const user = await currentUser();
  if (!user?.id) redirect("/auth/login?callbackUrl=/dashboard/admin/events");
  if (user.role !== "admin") redirect("/dashboard");
  return user;
}

export async function approveEvent(eventId: string) {
  const user = await requireAdmin();
  const supabase = createServerClient();
  const { error } = await supabase
    .from("events")
    .update({
      status: "approved",
      rejection_reason: null,
      approved_at: new Date().toISOString(),
      approved_by: user.id,
    })
    .eq("id", eventId);

  if (error) console.error("approveEvent error:", error);
  revalidatePath("/events");
  revalidatePath("/dashboard/admin/events");
}

export async function rejectEvent(formData: FormData) {
  await requireAdmin();
  const eventId = String(formData.get("event_id") || "");
  const reason = String(formData.get("rejection_reason") || "Other");
  const supabase = createServerClient();
  const { error } = await supabase
    .from("events")
    .update({
      status: "rejected",
      rejection_reason: reason,
      approved_at: null,
      approved_by: null,
    })
    .eq("id", eventId);

  if (error) console.error("rejectEvent error:", error);
  revalidatePath("/events");
  revalidatePath("/dashboard/admin/events");
}

export async function cancelEvent(eventId: string) {
  await requireAdmin();
  const supabase = createServerClient();
  const { error } = await supabase
    .from("events")
    .update({ status: "cancelled" })
    .eq("id", eventId);

  if (error) console.error("cancelEvent error:", error);
  revalidatePath("/events");
  revalidatePath("/dashboard/admin/events");
}

export async function deleteEvent(eventId: string) {
  await requireAdmin();
  const supabase = createServerClient();
  const { error } = await supabase.from("events").delete().eq("id", eventId);

  if (error) console.error("deleteEvent error:", error);
  revalidatePath("/events");
  revalidatePath("/dashboard/admin/events");
  redirect("/dashboard/admin/events");
}

export async function featureEvent(formData: FormData) {
  await requireAdmin();
  const eventId = String(formData.get("event_id") || "");
  const featuredUntil = String(formData.get("featured_until") || "");
  const supabase = createServerClient();
  const { error } = await supabase
    .from("events")
    .update({
      is_featured: true,
      featured_until: featuredUntil
        ? new Date(featuredUntil).toISOString()
        : null,
    })
    .eq("id", eventId);

  if (error) console.error("featureEvent error:", error);
  revalidatePath("/events");
  revalidatePath("/dashboard/admin/events");
}

export async function removeEventFeature(eventId: string) {
  await requireAdmin();
  const supabase = createServerClient();
  const { error } = await supabase
    .from("events")
    .update({ is_featured: false, featured_until: null })
    .eq("id", eventId);

  if (error) console.error("removeEventFeature error:", error);
  revalidatePath("/events");
  revalidatePath("/dashboard/admin/events");
}

export async function applyEventBoost(formData: FormData) {
  await requireAdmin();
  const eventId = String(formData.get("event_id") || "");
  const boostLevel = String(formData.get("boost_level") || "none");
  const boostStartsAt = String(formData.get("boost_starts_at") || "");
  const boostEndsAt = String(formData.get("boost_ends_at") || "");
  const supabase = createServerClient();
  const { error } = await supabase
    .from("events")
    .update({
      boost_level: boostLevel,
      boost_starts_at: boostStartsAt
        ? new Date(boostStartsAt).toISOString()
        : null,
      boost_ends_at: boostEndsAt ? new Date(boostEndsAt).toISOString() : null,
    })
    .eq("id", eventId);

  if (error) console.error("applyEventBoost error:", error);
  revalidatePath("/events");
  revalidatePath("/dashboard/admin/events");
}

export async function adminUpdateEvent(eventId: string, formData: FormData) {
  await requireAdmin();
  const parsed = eventFormSchema.safeParse(eventFormDataToObject(formData));
  const errorPath = `/dashboard/admin/events/${eventId}`;
  if (!parsed.success) {
    failRedirect(errorPath, eventValidationErrors(parsed.error));
  }

  const supabase = createServerClient();
  const event = await getEventById(supabase, eventId);
  if (!event) failRedirect("/dashboard/admin/events", "Event not found.");

  const slug = await makeUniqueEventSlug(
    supabase,
    parsed.data.title,
    parsed.data.start_date,
    eventId,
  );

  const { error } = await supabase
    .from("events")
    .update({
      ...cleanEventPayload(parsed.data),
      slug,
    })
    .eq("id", eventId);

  if (error) {
    console.error("adminUpdateEvent error:", error);
    failRedirect(errorPath, "Could not save this event.");
  }

  revalidatePath("/events");
  revalidatePath("/dashboard/admin/events");
  redirect(`/dashboard/admin/events/${eventId}?updated=1`);
}
