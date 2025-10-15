import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BadgeApplicationForm } from "@/components/badge/badge-application-form";
import { currentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "101 Approved Badge Application | Dashboard",
  description: "Apply for the 101 Approved badge - our highest mark of trust for child acting professionals",
};

export default async function BadgeApplicationPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/auth/login");
  }

  // TODO: Check if user has vendor role and Pro/Premium listing
  // if (!user.role || user.role !== 'vendor') {
  //   redirect("/dashboard");
  // }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          101 Approved Badge Application
        </h1>
        <p className="text-gray-900">
          Apply for our highest mark of trust for verified child acting professionals
        </p>
      </div>

      <BadgeApplicationForm userId={user.id} />
    </div>
  );
}
