import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { BadgeApplicationsTable } from "@/components/admin/badge-applications-table";

export const metadata = {
  title: "Badge Applications | Admin Dashboard",
  description: "Review and manage 101 Approved Badge applications",
};

export default async function BadgeApplicationsPage() {
  const supabase = createServerComponentClient({ cookies });

  // Check if user is admin
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  // Fetch all badge applications with vendor details
  const { data: applications, error } = await supabase
    .from("badge_applications_admin")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching badge applications:", error);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-paper mb-2">
          101 Approved Badge Applications
        </h1>
        <p className="text-lg text-paper">
          Review and manage vendor applications for the 101 Approved badge
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-sm font-medium text-paper mb-1">
            Total Applications
          </div>
          <div className="text-3xl font-bold text-paper">
            {applications?.length || 0}
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="text-sm font-medium text-yellow-800 mb-1">
            Pending Review
          </div>
          <div className="text-3xl font-bold text-yellow-900">
            {applications?.filter((app) => app.status === "submitted").length ||
              0}
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="text-sm font-medium text-green-800 mb-1">
            Approved
          </div>
          <div className="text-3xl font-bold text-green-900">
            {applications?.filter((app) => app.status === "approved").length ||
              0}
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="text-sm font-medium text-paper mb-1">Drafts</div>
          <div className="text-3xl font-bold text-paper">
            {applications?.filter((app) => app.status === "draft").length || 0}
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <BadgeApplicationsTable applications={applications || []} />
    </div>
  );
}

