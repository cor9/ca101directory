import { AdminDashboardLayout } from "@/components/layouts/AdminDashboardLayout";
import { siteConfig } from "@/config/site";
import { getListingById, type Listing } from "@/data/listings";
import { currentUser } from "@/lib/auth";
import { verifyDashboardAccess } from "@/lib/dashboard-safety";
import { constructMetadata } from "@/lib/metadata";
import { notFound, redirect } from "next/navigation";
import { MockupListingPage } from "./mockup-listing-page";

export const metadata = constructMetadata({
  title: "Pro Listing Mockup - Admin",
  description: "Preview how a listing would look with Pro tier features",
  canonicalUrl: `${siteConfig.url}/dashboard/admin/mockup`,
  noIndex: true,
});

// Force dynamic rendering
export const dynamic = "force-dynamic";

interface MockupPageProps {
  params: { id: string };
}

/**
 * Admin-only Pro Listing Mockup Generator
 * 
 * Fetches a listing by ID and transforms it in-memory to preview Pro features.
 * NO database writes - purely client-side mockup rendering.
 */
export default async function MockupPage({ params }: MockupPageProps) {
  const user = await currentUser();
  
  if (!user?.id) {
    redirect("/auth/login");
  }

  // Only admins can access mockup generator
  verifyDashboardAccess(user, "admin", "/dashboard/admin/mockup");

  // Fetch the real listing data
  const listing = await getListingById(params.id);

  if (!listing) {
    console.error("MockupPage: Listing not found for ID:", params.id);
    return notFound();
  }

  return (
    <AdminDashboardLayout>
      <MockupListingPage dbListing={listing} />
    </AdminDashboardLayout>
  );
}
