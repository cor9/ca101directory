import { DashboardGuard } from "@/components/auth/role-guard";
import { AdminDashboardLayout } from "@/components/layouts/AdminDashboardLayout";
import { createServerClient } from "@/lib/supabase";

export const metadata = {
  title: "Admin • Users",
};

export default async function AdminUsersPage() {
  const supabase = createServerClient();
  const { data: users, error } = await supabase
    .from("users")
    .select("id, email, name, role, created_at, updated_at")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <DashboardGuard allowedRoles={["admin"]}>
      <AdminDashboardLayout>
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">All Users</h2>
            <p className="text-sm text-muted-foreground">
              Read-only list. Manage roles/accounts in Supabase for now.
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
                      <td className="px-3 py-2">{u.name || "—"}</td>
                      <td className="px-3 py-2">{u.role}</td>
                      <td className="px-3 py-2">
                        {u.created_at ? new Date(u.created_at).toLocaleString() : "—"}
                      </td>
                      <td className="px-3 py-2">
                        {u.updated_at ? new Date(u.updated_at).toLocaleString() : "—"}
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
    </DashboardGuard>
  );
}

