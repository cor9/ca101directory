import type { UserRole } from "@/actions/admin-users";
import { UserRoleSelector } from "@/components/admin/user-role-selector";
import { AdminDashboardLayout } from "@/components/layouts/AdminDashboardLayout";
import { siteConfig } from "@/config/site";
import { currentUser } from "@/lib/auth";
import { verifyDashboardAccess } from "@/lib/dashboard-safety";
import { constructMetadata } from "@/lib/metadata";
import { createServerClient } from "@/lib/supabase";
import { redirect } from "next/navigation";

export const metadata = constructMetadata({
  title: "Admin • Users",
  description: "Manage user accounts and roles",
  canonicalUrl: `${siteConfig.url}/dashboard/admin/users`,
  noIndex: true,
});

// Force dynamic rendering - don't cache this page
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminUsersPage() {
  // Verify admin access
  const user = await currentUser();
  if (!user?.id) {
    redirect("/auth/login");
  }
  verifyDashboardAccess(user, "admin", "/dashboard/admin/users");

  const supabase = createServerClient();
  const { data: users, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, created_at, updated_at")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <AdminDashboardLayout>
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">All Users</h2>
          <p className="text-sm text-muted-foreground">
            Manage user roles and view account information. Total users:{" "}
            {users?.length || 0}
          </p>
        </div>

        {error ? (
          <div className="text-sm text-red-600">Failed to load users.</div>
        ) : (
          <div className="overflow-x-auto rounded-md border">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-600">
                <tr>
                  <th className="px-3 py-2 font-medium">Email</th>
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Role</th>
                  <th className="px-3 py-2 font-medium">Created</th>
                  <th className="px-3 py-2 font-medium">Updated</th>
                  <th className="px-3 py-2 font-medium">ID</th>
                </tr>
              </thead>
              <tbody>
                {(users || []).map((u) => (
                  <tr key={u.id} className="border-t">
                    <td className="px-3 py-2">{u.email}</td>
                    <td className="px-3 py-2">{u.full_name || "—"}</td>
                    <td className="px-3 py-2">
                      <UserRoleSelector
                        userId={u.id}
                        currentRole={u.role as UserRole}
                        userEmail={u.email}
                        isCurrentUser={u.id === user.id}
                      />
                    </td>
                    <td className="px-3 py-2">
                      {u.created_at
                        ? new Date(u.created_at).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-3 py-2">
                      {u.updated_at
                        ? new Date(u.updated_at).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-500">{u.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-3 py-2 text-xs text-gray-500">
              Showing {(users || []).length} users (max 200)
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}
