import { updateVendorEvent } from "@/actions/events";
import { EventForm } from "@/components/events/event-form";
import { VendorDashboardLayout } from "@/components/layouts/VendorDashboardLayout";
import { getVendorListings } from "@/data/listings";
import { currentUser } from "@/lib/auth";
import { verifyDashboardAccess } from "@/lib/dashboard-safety";
import { getEventById } from "@/lib/events/queries";
import { createServerClient } from "@/lib/supabase";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditVendorEventPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { error?: string };
}) {
  const user = await currentUser();
  if (!user?.id) redirect("/auth/login?callbackUrl=/dashboard/vendor/events");
  verifyDashboardAccess(user, "vendor", "/dashboard/vendor/events");

  const supabase = createServerClient();
  const [event, listings] = await Promise.all([
    getEventById(supabase, params.id),
    getVendorListings(user.id),
  ]);

  if (!event) notFound();
  const ownsEvent = listings.some((listing) => listing.id === event.listing_id);
  if (!ownsEvent) redirect("/dashboard/vendor/events");

  return (
    <VendorDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="bauhaus-heading text-3xl">Edit Event</h1>
          <p className="bauhaus-body text-foreground">
            Approved event changes are resubmitted for review.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <EventForm
            action={updateVendorEvent.bind(null, params.id)}
            listings={listings}
            event={event}
            submitLabel="Save Event"
            error={searchParams?.error}
          />
        </div>
      </div>
    </VendorDashboardLayout>
  );
}
