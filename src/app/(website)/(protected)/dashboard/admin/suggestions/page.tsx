import { DashboardGuard } from "@/components/auth/role-guard";
import { AdminDashboardLayout } from "@/components/layouts/AdminDashboardLayout";

export const metadata = {
  title: "Admin • Vendor Suggestions",
};

export default async function AdminSuggestionsPage() {
  return (
    <DashboardGuard allowedRoles={["admin"]}>
      <AdminDashboardLayout>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Vendor Suggestions</h2>
          <p className="text-sm text-muted-foreground">
            Moderation UI is coming soon. Track suggestions in Supabase table
            <code className="ml-1">vendor_suggestions</code>.
          </p>
        </div>
      </AdminDashboardLayout>
    </DashboardGuard>
  );
}

