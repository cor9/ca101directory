import { todayIsoDate } from "@/lib/events/limits";
import type {
  DirectoryEvent,
  DirectoryEventWithListing,
  EventListingSummary,
  PublicEventFilters,
} from "@/lib/events/types";
import type { SupabaseClient } from "@supabase/supabase-js";

const EVENT_WITH_LISTING_SELECT = `
  *,
  listings:listing_id (
    id,
    slug,
    listing_name,
    plan,
    stripe_plan_id,
    owner_id,
    comped,
    city,
    state
  )
`;

type RawDirectoryEvent = DirectoryEvent & {
  listings?: EventListingSummary | EventListingSummary[] | null;
};

type BoostSortableEvent = {
  start_date: string;
  is_featured?: boolean | null;
  featured_until?: string | null;
  boost_level?: string | null;
  boost_starts_at?: string | null;
  boost_ends_at?: string | null;
};

function normalizeEvent(event: RawDirectoryEvent): DirectoryEventWithListing {
  const listings = Array.isArray(event.listings)
    ? event.listings[0] || null
    : event.listings || null;
  const { listings: _listings, ...rest } = event;
  return { ...rest, listing: listings };
}

function addActiveBoostSort<T extends BoostSortableEvent>(events: T[]) {
  const now = Date.now();
  return [...events].sort((a, b) => {
    const aFeatured =
      (a.is_featured &&
        a.featured_until &&
        Date.parse(a.featured_until) >= now) ||
      (a.boost_level &&
        a.boost_level !== "none" &&
        a.boost_starts_at &&
        a.boost_ends_at &&
        Date.parse(a.boost_starts_at) <= now &&
        Date.parse(a.boost_ends_at) >= now);
    const bFeatured =
      (b.is_featured &&
        b.featured_until &&
        Date.parse(b.featured_until) >= now) ||
      (b.boost_level &&
        b.boost_level !== "none" &&
        b.boost_starts_at &&
        b.boost_ends_at &&
        Date.parse(b.boost_starts_at) <= now &&
        Date.parse(b.boost_ends_at) >= now);

    if (aFeatured !== bFeatured) return aFeatured ? -1 : 1;
    return String(a.start_date).localeCompare(String(b.start_date));
  });
}

export function isEventPubliclyCurrent(event: {
  start_date: string;
  end_date?: string | null;
  status?: string | null;
}) {
  if (event.status !== "approved") return false;
  const today = todayIsoDate();
  return event.end_date ? event.end_date >= today : event.start_date >= today;
}

export async function getPublicEvents(
  supabase: SupabaseClient,
  filters: PublicEventFilters = {},
) {
  const today = todayIsoDate();
  let query = supabase
    .from("events")
    .select(EVENT_WITH_LISTING_SELECT)
    .eq("status", "approved")
    .order("start_date", { ascending: true })
    .or(`and(end_date.is.null,start_date.gte.${today}),end_date.gte.${today}`);

  if (filters.category) {
    query = query.eq("category", filters.category);
  }
  if (typeof filters.isOnline === "boolean") {
    query = query.eq("is_online", filters.isOnline);
  }
  if (filters.state) {
    query = query.ilike("state", filters.state);
  }
  if (filters.city) {
    query = query.ilike("city", `%${filters.city}%`);
  }
  if (filters.priceType) {
    query = query.eq("price_type", filters.priceType);
  }
  if (typeof filters.age === "number") {
    query = query
      .or(`age_min.is.null,age_min.lte.${filters.age}`)
      .or(`age_max.is.null,age_max.gte.${filters.age}`);
  }

  const { data, error } = await query;
  if (error) {
    console.error("getPublicEvents error:", error);
    return [];
  }

  const q = filters.q?.trim().toLowerCase();
  const rawEvents = (data || []) as RawDirectoryEvent[];
  const filtered = q
    ? rawEvents.filter((event) => {
        const listing = Array.isArray(event.listings)
          ? event.listings[0]
          : event.listings;
        return [
          event.title,
          event.short_description,
          event.description,
          event.category,
          event.city,
          event.state,
          listing?.listing_name,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q);
      })
    : rawEvents;

  return addActiveBoostSort(filtered.map(normalizeEvent));
}

export async function getPublicEventBySlug(
  supabase: SupabaseClient,
  slug: string,
) {
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_WITH_LISTING_SELECT)
    .eq("slug", slug)
    .eq("status", "approved")
    .single();

  if (error || !data) {
    if (error?.code !== "PGRST116") {
      console.error("getPublicEventBySlug error:", error);
    }
    return null;
  }

  const event = normalizeEvent(data as RawDirectoryEvent);
  return isEventPubliclyCurrent(event) ? event : null;
}

export async function getPublicEventsForListing(
  supabase: SupabaseClient,
  listingId: string,
  limit = 3,
) {
  const today = todayIsoDate();
  const query = supabase
    .from("events")
    .select("*")
    .eq("listing_id", listingId)
    .eq("status", "approved")
    .order("start_date", { ascending: true })
    .limit(limit)
    .or(`and(end_date.is.null,start_date.gte.${today}),end_date.gte.${today}`);

  const { data, error } = await query;
  if (error) {
    console.error("getPublicEventsForListing error:", error);
    return [];
  }

  return addActiveBoostSort((data || []) as DirectoryEvent[]);
}

export async function getVendorEvents(
  supabase: SupabaseClient,
  userId: string,
) {
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_WITH_LISTING_SELECT)
    .order("start_date", { ascending: true });

  if (error) {
    console.error("getVendorEvents error:", error);
    return [];
  }

  return ((data || []) as RawDirectoryEvent[])
    .map(normalizeEvent)
    .filter((event) => event.listing?.owner_id === userId);
}

export async function getAdminEvents(
  supabase: SupabaseClient,
  status?: string,
) {
  let query = supabase
    .from("events")
    .select(EVENT_WITH_LISTING_SELECT)
    .order("submitted_at", { ascending: false });

  if (status && status !== "expired") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) {
    console.error("getAdminEvents error:", error);
    return [];
  }

  const events = ((data || []) as RawDirectoryEvent[]).map(normalizeEvent);
  if (status === "expired") {
    return events.filter((event) => !isEventPubliclyCurrent(event));
  }

  return events;
}

export async function getEventById(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_WITH_LISTING_SELECT)
    .eq("id", id)
    .single();

  if (error || !data) {
    if (error?.code !== "PGRST116") {
      console.error("getEventById error:", error);
    }
    return null;
  }

  return normalizeEvent(data as RawDirectoryEvent);
}
