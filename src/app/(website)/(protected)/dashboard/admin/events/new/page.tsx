import { createAdminEvent } from "@/actions/events";
import { EventForm } from "@/components/events/event-form";
import { AdminDashboardLayout } from "@/components/layouts/AdminDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminListings } from "@/data/listings";
import { currentUser } from "@/lib/auth";
import { verifyDashboardAccess } from "@/lib/dashboard-safety";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function NewAdminEventPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const user = await currentUser();
  if (!user?.id) redirect("/auth/login?callbackUrl=/dashboard/admin/events");
  verifyDashboardAccess(user, "admin", "/dashboard/admin/events");

  const listings = await getAdminListings();

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div>
          <Link
            href="/dashboard/admin/events"
            className="text-sm text-muted-foreground hover:underline"
          >
            Back to events
          </Link>
          <h1 className="mt-2 text-2xl font-bold">Create Event</h1>
          <p className="text-sm text-muted-foreground">
            Admin-created events are approved immediately and can appear
            publicly if their dates are current.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent>
            <EventForm
              action={createAdminEvent}
              listings={listings}
              submitLabel="Create Approved Event"
              error={searchParams?.error}
            />
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}
