import { redirect } from "next/navigation";

export default function AdminApplicationsAlias() {
  // Alias route: /dashboard/admin/applications → /dashboard/admin/badge-applications
  redirect("/dashboard/admin/badge-applications");
}
