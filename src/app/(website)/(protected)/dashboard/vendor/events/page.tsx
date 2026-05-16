import { EventStatusBadge } from "@/components/events/event-status-badge";
import { VendorDashboardLayout } from "@/components/layouts/VendorDashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getVendorListings } from "@/data/listings";
import { currentUser } from "@/lib/auth";
import { verifyDashboardAccess } from "@/lib/dashboard-safety";
import {
  formatEventLimit,
  getActiveEventCountForListing,
  getEventLimitForPlan,
  getPlanLabelForEvents,
} from "@/lib/events/limits";
import { getVendorEvents } from "@/lib/events/queries";
import { createServerClient } from "@/lib/supabase";
import { CalendarPlus, Edit, ExternalLink, Sparkles } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function VendorEventsPage({
  searchParams,
}: {
  searchParams?: { submitted?: string; updated?: string; error?: string };
}) {
  const user = await currentUser();
  if (!user?.id) redirect("/auth/login?callbackUrl=/dashboard/vendor/events");
  verifyDashboardAccess(user, "vendor", "/dashboard/vendor/events");

  const supabase = createServerClient();
  const [listings, events] = await Promise.all([
    getVendorListings(user.id),
    getVendorEvents(supabase, user.id),
  ]);

  const usage = await Promise.all(
    listings.map(async (listing) => {
      const activeCount = await getActiveEventCountForListing(
        supabase,
        listing.id,
      );
      const plan = listing.comped
        ? "Pro"
        : listing.plan || listing.stripe_plan_id || "Free";
      const limit = getEventLimitForPlan(plan);
      return { listing, activeCount, limit, plan };
    }),
  );
  const canAddAny = usage.some((item) => item.activeCount < item.limit);

  return (
    <VendorDashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="bauhaus-heading text-3xl">Events</h1>
            <p className="bauhaus-body text-foreground">
              Manage classes, workshops, webinars, camps, open calls, and
              special events connected to your listings.
            </p>
          </div>
          <Button asChild disabled={!canAddAny}>
            <Link
              href={canAddAny ? "/dashboard/vendor/events/new" : "/pricing"}
            >
              <CalendarPlus className="mr-2 h-4 w-4" />
              Add an Event
            </Link>
          </Button>
        </div>

        {searchParams?.submitted && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            Your event has been submitted for review.
          </div>
        )}
        {searchParams?.updated && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            Your event has been saved and submitted for review.
          </div>
        )}
        {searchParams?.error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
            {searchParams.error}
          </div>
        )}

        {listings.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <h2 className="text-xl font-semibold">No listings yet</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Create or claim a listing before submitting events.
              </p>
              <Button asChild className="mt-4">
                <Link href="/submit">Create a Listing</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {usage.map(({ listing, activeCount, limit, plan }) => (
              <Card key={listing.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {listing.listing_name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">
                      {getPlanLabelForEvents(plan)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      You are using {activeCount} of {formatEventLimit(limit)}{" "}
                      active event slots.
                    </span>
                  </div>
                  {activeCount >= limit && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
                      You have reached your current event posting limit. Free
                      listings include 1 active event. Standard includes 3
                      active events. Pro includes unlimited event posting and
                      better visibility across the directory.
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button asChild size="sm">
                          <Link href="/pricing?from=event-limit">
                            Upgrade Listing
                          </Link>
                        </Button>
                        <Button asChild size="sm" variant="outline">
                          <Link href="/dashboard/vendor/events">
                            Manage Existing Events
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {events.length === 0 ? (
          <Card>
            <CardContent className="py-10">
              <div className="max-w-2xl space-y-4">
                <h2 className="text-xl font-semibold">
                  Post an upcoming event
                </h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  Post your upcoming classes, workshops, webinars, camps, or
                  special events for families browsing Child Actor 101. Free
                  listings can publish 1 active event. Standard listings can
                  publish up to 3 active events. Pro listings can publish
                  unlimited events.
                </p>
                <Button asChild>
                  <Link href="/dashboard/vendor/events/new">Add an Event</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <Card key={event.id}>
                <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <EventStatusBadge status={event.status} />
                      {event.is_featured && (
                        <Badge className="bg-brand-orange text-white">
                          Featured
                        </Badge>
                      )}
                      {event.boost_level && event.boost_level !== "none" && (
                        <Badge variant="outline">
                          <Sparkles className="mr-1 h-3 w-3" />
                          {event.boost_level}
                        </Badge>
                      )}
                    </div>
                    <h2 className="text-lg font-semibold">{event.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {event.listing?.listing_name} · {event.start_date}
                      {event.start_time
                        ? ` at ${event.start_time.slice(0, 5)}`
                        : ""}
                    </p>
                    {event.rejection_reason && (
                      <p className="text-sm text-rose-700">
                        Rejection reason: {event.rejection_reason}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {event.slug && event.status === "approved" && (
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/events/${event.slug}`}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </Button>
                    )}
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/dashboard/vendor/events/${event.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </VendorDashboardLayout>
  );
}
