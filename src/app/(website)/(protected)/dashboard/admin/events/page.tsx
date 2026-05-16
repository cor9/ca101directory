import {
  approveEvent,
  cancelEvent,
  rejectEvent,
  removeEventFeature,
} from "@/actions/events";
import { EventStatusBadge } from "@/components/events/event-status-badge";
import { AdminDashboardLayout } from "@/components/layouts/AdminDashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { currentUser } from "@/lib/auth";
import { verifyDashboardAccess } from "@/lib/dashboard-safety";
import { REJECTION_REASONS } from "@/lib/events/constants";
import { getAdminEvents } from "@/lib/events/queries";
import { createServerClient } from "@/lib/supabase";
import { Check, Edit, ExternalLink, Star, X } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const tabs = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Expired", value: "expired" },
];

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams?: { status?: string };
}) {
  const user = await currentUser();
  if (!user?.id) redirect("/auth/login?callbackUrl=/dashboard/admin/events");
  verifyDashboardAccess(user, "admin", "/dashboard/admin/events");

  const status = searchParams?.status || "pending";
  const events = await getAdminEvents(createServerClient(), status);

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Events Moderation</h1>
            <p className="text-sm text-muted-foreground">
              Review vendor-submitted calendar events and manage promotional
              placement.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/events">
              <ExternalLink className="mr-2 h-4 w-4" />
              Public Calendar
            </Link>
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <Button
              key={tab.value}
              asChild
              variant={status === tab.value ? "default" : "outline"}
              size="sm"
            >
              <Link href={`/dashboard/admin/events?status=${tab.value}`}>
                {tab.label}
              </Link>
            </Button>
          ))}
        </div>

        {events.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <h2 className="text-xl font-semibold">No {status} events</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Events will appear here when vendors submit them.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <Card key={event.id}>
                <CardContent className="space-y-4 p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <EventStatusBadge status={event.status} />
                        {event.category && (
                          <Badge variant="outline">{event.category}</Badge>
                        )}
                        {event.is_featured && (
                          <Badge className="bg-brand-orange text-white">
                            Featured
                          </Badge>
                        )}
                        {event.boost_level && event.boost_level !== "none" && (
                          <Badge variant="outline">{event.boost_level}</Badge>
                        )}
                      </div>
                      <h2 className="text-lg font-semibold">{event.title}</h2>
                      <p className="text-sm text-muted-foreground">
                        {event.listing?.listing_name || "Unknown listing"} ·{" "}
                        {event.start_date}
                        {event.start_time
                          ? ` at ${event.start_time.slice(0, 5)}`
                          : ""}
                      </p>
                      {event.short_description && (
                        <p className="max-w-2xl text-sm leading-6 text-foreground">
                          {event.short_description}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/dashboard/admin/events/${event.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Review
                        </Link>
                      </Button>
                      {event.status !== "approved" && (
                        <form action={approveEvent.bind(null, event.id)}>
                          <Button size="sm" type="submit">
                            <Check className="mr-2 h-4 w-4" />
                            Approve
                          </Button>
                        </form>
                      )}
                      {event.status === "approved" && event.is_featured && (
                        <form action={removeEventFeature.bind(null, event.id)}>
                          <Button size="sm" variant="outline" type="submit">
                            <Star className="mr-2 h-4 w-4" />
                            Remove Feature
                          </Button>
                        </form>
                      )}
                      {event.status !== "cancelled" && (
                        <form action={cancelEvent.bind(null, event.id)}>
                          <Button size="sm" variant="outline" type="submit">
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                          </Button>
                        </form>
                      )}
                    </div>
                  </div>

                  {event.status === "pending" && (
                    <form action={rejectEvent} className="flex flex-wrap gap-2">
                      <input type="hidden" name="event_id" value={event.id} />
                      <select
                        name="rejection_reason"
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                        defaultValue={REJECTION_REASONS[0]}
                      >
                        {REJECTION_REASONS.map((reason) => (
                          <option key={reason} value={reason}>
                            {reason}
                          </option>
                        ))}
                      </select>
                      <Button type="submit" variant="outline" size="sm">
                        Reject
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}
