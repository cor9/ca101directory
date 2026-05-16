import { EventCard, EventDateHeading } from "@/components/events/event-card";
import { Button } from "@/components/ui/button";
import { EVENT_CATEGORIES, PRICE_TYPES } from "@/lib/events/constants";
import { getPublicEvents } from "@/lib/events/queries";
import { createServerClient } from "@/lib/supabase";
import { Search } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function EventsPage({
  searchParams,
}: {
  searchParams?: {
    q?: string;
    category?: string;
    online?: string;
    price?: string;
    state?: string;
  };
}) {
  const events = await getPublicEvents(createServerClient(), {
    q: searchParams?.q,
    category: searchParams?.category,
    isOnline:
      searchParams?.online === "true"
        ? true
        : searchParams?.online === "false"
          ? false
          : undefined,
    priceType: searchParams?.price,
    state: searchParams?.state,
  });

  const grouped = events.reduce<Record<string, typeof events>>((acc, event) => {
    acc[event.start_date] ||= [];
    acc[event.start_date].push(event);
    return acc;
  }, {});

  return (
    <main className="bg-background">
      <section className="border-b bg-[#0C1A2B] text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold sm:text-4xl">
            Child Actor 101 Industry Calendar
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-200 sm:text-base">
            Browse upcoming classes, workshops, camps, webinars, open calls, and
            parent education events for young actors pursuing TV and film.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <form className="mb-8 grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-[1.5fr_1fr_1fr_1fr_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              name="q"
              defaultValue={searchParams?.q || ""}
              placeholder="Search events"
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm"
            />
          </div>
          <select
            name="category"
            defaultValue={searchParams?.category || ""}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">All categories</option>
            {EVENT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            name="online"
            defaultValue={searchParams?.online || ""}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">Online or in-person</option>
            <option value="true">Online</option>
            <option value="false">In-person</option>
          </select>
          <select
            name="price"
            defaultValue={searchParams?.price || ""}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">Any price</option>
            {PRICE_TYPES.map((priceType) => (
              <option key={priceType} value={priceType}>
                {priceType}
              </option>
            ))}
          </select>
          <Button type="submit">Filter</Button>
        </form>

        {events.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center">
            <h2 className="text-xl font-semibold">No upcoming events yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Check back soon as vendors add new classes, workshops, open calls,
              and parent education events.
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/directory">Browse the Directory</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([date, dateEvents]) => (
              <section key={date} className="space-y-3">
                <EventDateHeading date={date} />
                <div className="grid gap-4">
                  {dateEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
