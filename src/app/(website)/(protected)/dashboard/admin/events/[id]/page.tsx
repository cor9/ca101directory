import {
  adminUpdateEvent,
  applyEventBoost,
  approveEvent,
  cancelEvent,
  deleteEvent,
  featureEvent,
  rejectEvent,
  removeEventFeature,
} from "@/actions/events";
import { EventForm } from "@/components/events/event-form";
import { EventStatusBadge } from "@/components/events/event-status-badge";
import { AdminDashboardLayout } from "@/components/layouts/AdminDashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminListings } from "@/data/listings";
import { currentUser } from "@/lib/auth";
import { verifyDashboardAccess } from "@/lib/dashboard-safety";
import { BOOST_LEVELS, REJECTION_REASONS } from "@/lib/events/constants";
import { getEventById } from "@/lib/events/queries";
import { createServerClient } from "@/lib/supabase";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminEventDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { error?: string; updated?: string };
}) {
  const user = await currentUser();
  if (!user?.id) redirect("/auth/login?callbackUrl=/dashboard/admin/events");
  verifyDashboardAccess(user, "admin", "/dashboard/admin/events");

  const supabase = createServerClient();
  const [event, listings] = await Promise.all([
    getEventById(supabase, params.id),
    getAdminListings(),
  ]);

  if (!event) notFound();

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/dashboard/admin/events"
              className="text-sm text-muted-foreground hover:underline"
            >
              Back to events
            </Link>
            <h1 className="mt-2 text-2xl font-bold">{event.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <EventStatusBadge status={event.status} />
              {event.category && (
                <Badge variant="outline">{event.category}</Badge>
              )}
              {event.listing?.plan && (
                <Badge variant="outline">{event.listing.plan}</Badge>
              )}
            </div>
          </div>
          {event.slug && event.status === "approved" && (
            <Button asChild variant="outline">
              <Link href={`/events/${event.slug}`}>View Public Event</Link>
            </Button>
          )}
        </div>

        {searchParams?.updated && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            Event details saved.
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Edit Event Details</CardTitle>
            </CardHeader>
            <CardContent>
              <EventForm
                action={adminUpdateEvent.bind(null, params.id)}
                listings={listings}
                event={event}
                submitLabel="Save Event Details"
                error={searchParams?.error}
              />
            </CardContent>
          </Card>

          <aside className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Review Context</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <div className="text-muted-foreground">Listing</div>
                  <div className="font-medium">
                    {event.listing?.listing_name || "Unknown listing"}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Listing plan</div>
                  <div>{event.listing?.plan || "Free"}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Submitted by</div>
                  <div>{event.created_by || "Unknown"}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Registration</div>
                  {event.registration_url ? (
                    <Link
                      href={event.registration_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline"
                    >
                      Open registration link
                    </Link>
                  ) : (
                    "None"
                  )}
                </div>
                {event.rejection_reason && (
                  <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-rose-900">
                    {event.rejection_reason}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Moderation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <form action={approveEvent.bind(null, event.id)}>
                  <Button type="submit" className="w-full">
                    Approve Event
                  </Button>
                </form>

                <form action={rejectEvent} className="space-y-2">
                  <input type="hidden" name="event_id" value={event.id} />
                  <select
                    name="rejection_reason"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    defaultValue={
                      event.rejection_reason || REJECTION_REASONS[0]
                    }
                  >
                    {REJECTION_REASONS.map((reason) => (
                      <option key={reason} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                  <Button type="submit" variant="outline" className="w-full">
                    Reject Event
                  </Button>
                </form>

                <form action={cancelEvent.bind(null, event.id)}>
                  <Button type="submit" variant="outline" className="w-full">
                    Cancel Event
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feature / Boost</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form action={featureEvent} className="space-y-2">
                  <input type="hidden" name="event_id" value={event.id} />
                  <label
                    className="text-sm font-medium"
                    htmlFor="featured_until"
                  >
                    Featured until
                  </label>
                  <input
                    id="featured_until"
                    name="featured_until"
                    type="datetime-local"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  />
                  <Button type="submit" className="w-full" variant="outline">
                    Feature Event
                  </Button>
                </form>

                {event.is_featured && (
                  <form action={removeEventFeature.bind(null, event.id)}>
                    <Button type="submit" variant="outline" className="w-full">
                      Remove Feature
                    </Button>
                  </form>
                )}

                <form action={applyEventBoost} className="space-y-2">
                  <input type="hidden" name="event_id" value={event.id} />
                  <label className="text-sm font-medium" htmlFor="boost_level">
                    Boost level
                  </label>
                  <select
                    id="boost_level"
                    name="boost_level"
                    defaultValue={event.boost_level || "none"}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {BOOST_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                  <label
                    className="text-sm font-medium"
                    htmlFor="boost_starts_at"
                  >
                    Boost starts
                  </label>
                  <input
                    id="boost_starts_at"
                    name="boost_starts_at"
                    type="datetime-local"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  />
                  <label
                    className="text-sm font-medium"
                    htmlFor="boost_ends_at"
                  >
                    Boost ends
                  </label>
                  <input
                    id="boost_ends_at"
                    name="boost_ends_at"
                    type="datetime-local"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  />
                  <Button type="submit" variant="outline" className="w-full">
                    Apply Boost
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <form action={deleteEvent.bind(null, event.id)}>
                  <Button
                    type="submit"
                    variant="destructive"
                    className="w-full"
                  >
                    Delete Event
                  </Button>
                </form>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
