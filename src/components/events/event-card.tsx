import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DirectoryEventWithListing } from "@/lib/events/types";
import { CalendarDays, MapPin, MonitorPlay, Tag, Users } from "lucide-react";
import Link from "next/link";

function formatDateRange(event: DirectoryEventWithListing) {
  const start = new Date(`${event.start_date}T00:00:00`);
  const startLabel = start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (!event.end_date || event.end_date === event.start_date) {
    return startLabel;
  }

  const end = new Date(`${event.end_date}T00:00:00`);
  return `${startLabel} - ${end.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
}

function formatTime(event: DirectoryEventWithListing) {
  if (!event.start_time) return null;
  const start = event.start_time.slice(0, 5);
  const end = event.end_time ? event.end_time.slice(0, 5) : null;
  return end ? `${start} - ${end}` : start;
}

function formatAge(event: DirectoryEventWithListing) {
  if (event.age_min == null && event.age_max == null) return "All ages";
  if (event.age_min != null && event.age_max != null) {
    return `Ages ${event.age_min}-${event.age_max}`;
  }
  if (event.age_min != null) return `Ages ${event.age_min}+`;
  return `Up to age ${event.age_max}`;
}

function isPromoted(event: DirectoryEventWithListing) {
  const now = Date.now();
  const featureActive =
    event.is_featured &&
    event.featured_until &&
    Date.parse(event.featured_until) >= now;
  const boostActive =
    event.boost_level &&
    event.boost_level !== "none" &&
    event.boost_starts_at &&
    event.boost_ends_at &&
    Date.parse(event.boost_starts_at) <= now &&
    Date.parse(event.boost_ends_at) >= now;
  return Boolean(featureActive || boostActive);
}

export function EventCard({ event }: { event: DirectoryEventWithListing }) {
  const location = event.is_online
    ? "Online"
    : [event.city, event.state].filter(Boolean).join(", ") ||
      event.location_name ||
      "Location TBA";
  const time = formatTime(event);

  return (
    <article className="rounded-lg border bg-card p-5 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {event.category && (
          <Badge variant="outline" className="border-brand-blue/30">
            {event.category}
          </Badge>
        )}
        {isPromoted(event) && (
          <Badge className="bg-brand-orange text-white">Featured Event</Badge>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <h2 className="text-xl font-semibold leading-tight text-foreground">
            {event.title}
          </h2>
          {event.listing?.listing_name && (
            <p className="mt-1 text-sm text-muted-foreground">
              Hosted by {event.listing.listing_name}
            </p>
          )}
        </div>

        <div className="grid gap-2 text-sm text-foreground sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-brand-blue" />
            <span>
              {formatDateRange(event)}
              {time ? `, ${time}` : ""}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {event.is_online ? (
              <MonitorPlay className="h-4 w-4 text-brand-blue" />
            ) : (
              <MapPin className="h-4 w-4 text-brand-blue" />
            )}
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-brand-blue" />
            <span>{formatAge(event)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-brand-blue" />
            <span>{event.price_display || event.price_type || "paid"}</span>
          </div>
        </div>

        {event.short_description && (
          <p className="text-sm leading-6 text-muted-foreground">
            {event.short_description}
          </p>
        )}

        <Button asChild variant="outline">
          <Link href={`/events/${event.slug || event.id}`}>View Event</Link>
        </Button>
      </div>
    </article>
  );
}

export function EventDateHeading({ date }: { date: string }) {
  const label = new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return <h2 className="text-lg font-bold text-foreground">{label}</h2>;
}
