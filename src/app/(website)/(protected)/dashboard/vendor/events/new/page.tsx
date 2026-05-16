import { createVendorEvent } from "@/actions/events";
import { EventForm } from "@/components/events/event-form";
import { VendorDashboardLayout } from "@/components/layouts/VendorDashboardLayout";
import { Button } from "@/components/ui/button";
import { getVendorListings } from "@/data/listings";
import { currentUser } from "@/lib/auth";
import { verifyDashboardAccess } from "@/lib/dashboard-safety";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function NewVendorEventPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const user = await currentUser();
  if (!user?.id)
    redirect("/auth/login?callbackUrl=/dashboard/vendor/events/new");
  verifyDashboardAccess(user, "vendor", "/dashboard/vendor/events/new");

  const listings = await getVendorListings(user.id);

  return (
    <VendorDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="bauhaus-heading text-3xl">Submit an Event</h1>
          <p className="bauhaus-body text-foreground">
            Add an upcoming class, workshop, webinar, camp, open call, or parent
            education event to the Child Actor 101 Industry Calendar.
          </p>
        </div>

        {listings.length === 0 ? (
          <div className="rounded-lg border bg-card p-8">
            <h2 className="text-xl font-semibold">Create a listing first</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Events connect to vendor listings, so you need an active listing
              before submitting an event.
            </p>
            <Button asChild className="mt-4">
              <Link href="/submit">Create a Listing</Link>
            </Button>
          </div>
        ) : (
          <div className="rounded-lg border bg-card p-6">
            <EventForm
              action={createVendorEvent}
              listings={listings}
              error={searchParams?.error}
            />
          </div>
        )}
      </div>
    </VendorDashboardLayout>
  );
}
