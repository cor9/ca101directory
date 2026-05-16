import type {
  BOOST_LEVELS,
  EVENT_AUDIENCES,
  EVENT_CATEGORIES,
  EVENT_STATUSES,
  PRICE_TYPES,
} from "@/lib/events/constants";

export type EventCategory = (typeof EVENT_CATEGORIES)[number];
export type EventAudience = (typeof EVENT_AUDIENCES)[number];
export type EventPriceType = (typeof PRICE_TYPES)[number];
export type EventBoostLevel = (typeof BOOST_LEVELS)[number];
export type EventStatus = (typeof EVENT_STATUSES)[number];

export type EventListingSummary = {
  id: string;
  slug: string | null;
  listing_name: string | null;
  plan: string | null;
  stripe_plan_id?: string | null;
  owner_id?: string | null;
  comped?: boolean | null;
  city?: string | null;
  state?: string | null;
};

export type DirectoryEvent = {
  id: string;
  listing_id: string | null;
  created_by: string | null;
  title: string;
  slug: string | null;
  event_type: string | null;
  category: string | null;
  description: string | null;
  short_description: string | null;
  audience: string | null;
  age_min: number | null;
  age_max: number | null;
  price_type: EventPriceType | string | null;
  price_amount: number | null;
  price_display: string | null;
  event_url: string | null;
  registration_url: string | null;
  is_online: boolean | null;
  location_name: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
  start_date: string;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  timezone: string | null;
  image_url: string | null;
  status: EventStatus | string | null;
  rejection_reason: string | null;
  is_featured: boolean | null;
  featured_until: string | null;
  boost_level: EventBoostLevel | string | null;
  boost_starts_at: string | null;
  boost_ends_at: string | null;
  submitted_at: string | null;
  approved_at: string | null;
  approved_by: string | null;
  created_at: string | null;
  updated_at: string | null;
  listings?: EventListingSummary | EventListingSummary[] | null;
};

export type DirectoryEventWithListing = DirectoryEvent & {
  listing: EventListingSummary | null;
};

export type PublicEventFilters = {
  q?: string;
  category?: string;
  isOnline?: boolean;
  state?: string;
  city?: string;
  age?: number;
  priceType?: string;
  dateRange?: "this_week" | "this_month" | "next_30_days" | "summer";
};
