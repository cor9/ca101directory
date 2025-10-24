import { redirect } from "next/navigation";

export default function AdminReviewApplicationsAlias() {
  // Alias route: /dashboard/admin/review-applications → /dashboard/admin/badge-applications
  redirect("/dashboard/admin/badge-applications");
}


