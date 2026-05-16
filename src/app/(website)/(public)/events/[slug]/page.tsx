import { Button } from "@/components/ui/button";
import { getPublicEventBySlug } from "@/lib/events/queries";
import type { DirectoryEventWithListing } from "@/lib/events/types";
import { createServerClient } from "@/lib/supabase";
import {
  CalendarDays,
  ExternalLink,
  MapPin,
  MonitorPlay,
  Tag,
  Users,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

function formatDateRange(event: DirectoryEventWithListing) {
  const start = new Date(`${event.start_date}T00:00:00`).toLocaleDateString(
    "en-US",
    { month: "long", day: "numeric", year: "numeric" },
  );

  if (!event.end_date || event.end_date === event.start_date) return start;

  const end = new Date(`${event.end_date}T00:00:00`).toLocaleDateString(
    "en-US",
    { month: "long", day: "numeric", year: "numeric" },
  );
  return `${start} - ${end}`;
}

function formatAge(event: DirectoryEventWithListing) {
  if (event.age_min == null && event.age_max == null) return "All ages";
  if (event.age_min != null && event.age_max != null) {
    return `Ages ${event.age_min}-${event.age_max}`;
  }
  if (event.age_min != null) return `Ages ${event.age_min}+`;
  return `Up to age ${event.age_max}`;
}

export default async function EventDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const event = await getPublicEventBySlug(createServerClient(), params.slug);
  if (!event) notFound();

  const location = event.is_online
    ? "Online"
    : [
        event.location_name,
        event.address,
        [event.city, event.state].filter(Boolean).join(", "),
        event.zip,
      ]
        .filter(Boolean)
        .join(" · ") || "Location TBA";
  const registrationUrl = event.registration_url || event.event_url;

  return (
    <main className="bg-background">
      <section className="border-b bg-[#0C1A2B] text-white">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          {event.category && (
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand-orange">
              {event.category}
            </p>
          )}
          <h1 className="text-3xl font-bold sm:text-4xl">{event.title}</h1>
          {event.listing?.listing_name && (
            <p className="mt-3 text-slate-200">
              Hosted by{" "}
              {event.listing.slug ? (
                <Link
                  href={`/listing/${event.listing.slug}`}
                  className="underline underline-offset-4"
                >
                  {event.listing.listing_name}
                </Link>
              ) : (
                event.listing.listing_name
              )}
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[2fr_1fr] lg:px-8">
        <article className="space-y-6">
          {event.image_url && (
            <img
              src={event.image_url}
              alt=""
              className="aspect-[16/9] w-full rounded-lg object-cover"
            />
          )}

          {event.short_description && (
            <p className="text-lg leading-8 text-foreground">
              {event.short_description}
            </p>
          )}

          <div className="whitespace-pre-wrap text-sm leading-7 text-foreground">
            {event.description}
          </div>

          <div className="rounded-lg border bg-muted/40 p-4 text-sm leading-6 text-muted-foreground">
            Events are submitted by vendors and industry professionals. Child
            Actor 101 does not guarantee outcomes or endorse every claim made by
            event hosts. Parents should review each opportunity carefully and
            choose what fits their child, budget, and goals.
          </div>
        </article>

        <aside className="space-y-4">
          <div className="rounded-lg border bg-card p-5 shadow-sm">
            <div className="space-y-4 text-sm">
              <div className="flex gap-3">
                <CalendarDays className="h-5 w-5 text-brand-blue" />
                <div>
                  <div className="font-medium">{formatDateRange(event)}</div>
                  <div className="text-muted-foreground">
                    {[
                      event.start_time?.slice(0, 5),
                      event.end_time?.slice(0, 5),
                    ]
                      .filter(Boolean)
                      .join(" - ") || "Time TBA"}
                    {event.timezone ? ` ${event.timezone}` : ""}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                {event.is_online ? (
                  <MonitorPlay className="h-5 w-5 text-brand-blue" />
                ) : (
                  <MapPin className="h-5 w-5 text-brand-blue" />
                )}
                <div>{location}</div>
              </div>
              <div className="flex gap-3">
                <Users className="h-5 w-5 text-brand-blue" />
                <div>{formatAge(event)}</div>
              </div>
              <div className="flex gap-3">
                <Tag className="h-5 w-5 text-brand-blue" />
                <div>{event.price_display || event.price_type || "paid"}</div>
              </div>
            </div>

            {registrationUrl && (
              <Button asChild className="mt-6 w-full">
                <Link href={registrationUrl} target="_blank" rel="noreferrer">
                  Register / Learn More
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}

            {event.listing?.slug && (
              <Button asChild variant="outline" className="mt-3 w-full">
                <Link href={`/listing/${event.listing.slug}`}>
                  View Vendor Listing
                </Link>
              </Button>
            )}
          </div>

          <Button asChild variant="ghost">
            <Link href="/events">Back to Industry Calendar</Link>
          </Button>
        </aside>
      </section>
    </main>
  );
}
