export const EVENT_CATEGORIES = [
  "Acting Class",
  "Workshop",
  "Intensive",
  "Camp",
  "Webinar",
  "Open Call",
  "Parent Education",
  "Self-Tape",
  "Headshots",
  "Industry Q&A",
  "College Prep",
  "Other",
] as const;

export const EVENT_AUDIENCES = [
  "Kids",
  "Teens",
  "Parents",
  "Kids & Parents",
  "All Ages",
] as const;

export const PRICE_TYPES = ["free", "paid", "donation", "varies"] as const;

export const BOOST_LEVELS = [
  "none",
  "featured",
  "homepage",
  "newsletter",
  "premium",
] as const;

export const EVENT_STATUSES = [
  "draft",
  "pending",
  "approved",
  "rejected",
  "expired",
  "cancelled",
] as const;

export const REJECTION_REASONS = [
  "Missing or unclear event details",
  "Event does not fit Child Actor 101 audience",
  "Unsupported claims or guarantees",
  "Registration link issue",
  "Needs additional verification",
  "Other",
] as const;

export const EVENT_PRICE_COPY = {
  featured: "$25 Featured Event Placement",
  newsletter: "$49 Newsletter Mention",
  premium: "$75 Premium Event Boost",
  homepage: "$99 Homepage/Event Page Spotlight",
} as const;
