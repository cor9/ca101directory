import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export default async function AdminNotificationsPage() {
  const { data: notifications, error } = await supabaseAdmin
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error(error);
    return <div>Failed to load notifications.</div>;
  }

  if (!notifications || notifications.length === 0) {
    return <div>No notifications yet.</div>;
  }

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-semibold">Notifications</h1>
      <div className="space-y-2">
        {notifications.map((n: any) => {
          const created = new Date(n.created_at).toLocaleString("en-US", {
            timeZone: "America/Los_Angeles",
          });
          return (
            <div
              key={n.id}
              className={`border rounded-md p-3 ${
                n.is_read ? "opacity-60" : "border-blue-500"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-gray-500">{created}</div>
                  <div className="font-medium">{n.title}</div>
                  <div className="text-sm text-gray-700 whitespace-pre-line">
                    {n.message}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


