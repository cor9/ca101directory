import { auth } from "@/auth";
import { ClaimsModeration } from "@/components/admin/claims-moderation";
import { ReviewModeration } from "@/components/admin/review-moderation";
import { VendorSuggestionsModeration } from "@/components/admin/vendor-suggestions-moderation";
import Container from "@/components/container";
import { HeaderSection } from "@/components/shared/header-section";
import { createServerClient } from "@/lib/supabase";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const supabase = createServerClient();

  // Check if user is admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="mb-16">
      <div className="mt-8">
        <div className="w-full flex flex-col items-center justify-center gap-8">
          <HeaderSection
            labelAs="h1"
            label="Admin Dashboard"
            titleAs="h2"
            title="Moderate Content"
            subtitle="Review and approve user-generated content including reviews and vendor suggestions."
          />
        </div>
      </div>

      <Container className="mt-8">
        <div className="space-y-8">
          <ClaimsModeration />
          <ReviewModeration />
          <VendorSuggestionsModeration />
        </div>
      </Container>
    </div>
  );
}
