import { auth } from "@/auth";
import Container from "@/components/container";
import { HeaderSection } from "@/components/shared/header-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createServerClient } from "@/lib/supabase";
import { CheckCircle, Clock, CreditCard, Mail } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Claim Submitted - Child Actor 101 Directory",
  description: "Your claim has been submitted and is pending review",
};

interface ClaimSuccessPageProps {
  searchParams: { listing_id?: string };
}

export default async function ClaimSuccessPage({
  searchParams,
}: ClaimSuccessPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch claim and profile data
  let claimData = null;
  let profileData = null;

  try {
    const supabase = createServerClient();

    // Get the most recent claim for this user
    const { data: claims } = await supabase
      .from("claims")
      .select(`
        id,
        message,
        created_at,
        listings!claims_listing_id_fkey (
          listing_name
        )
      `)
      .eq("vendor_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(1);

    if (claims && claims.length > 0) {
      claimData = claims[0];
    }

    // Get profile data for plan info
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_plan, billing_cycle")
      .eq("id", session.user.id)
      .single();

    if (profile) {
      profileData = profile;
    }
  } catch (error) {
    console.error("Error fetching claim data:", error);
  }

  const listingName = claimData?.listings?.["Listing Name"] || "Your Listing";
  const planName = profileData?.subscription_plan
    ? profileData.subscription_plan.charAt(0).toUpperCase() +
      profileData.subscription_plan.slice(1)
    : "Standard";
  const billingCycle = profileData?.billing_cycle || "Monthly";

  return (
    <div className="mb-16">
      <div className="mt-8">
        <div className="w-full flex flex-col items-center justify-center gap-8">
          <HeaderSection
            labelAs="h1"
            label="Payment Received — Claim Submitted"
            titleAs="h2"
            title="✅ Thank you for upgrading your listing!"
            subtitle="Your payment was processed successfully and your claim has been submitted. Our team will review your request to ensure everything matches up."
          />
        </div>
      </div>

      <Container className="mt-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Main success card */}
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Payment Successful</CardTitle>
              <CardDescription>
                Your subscription has been activated and your claim has been
                submitted for review.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* What happens next */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  What happens next:
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>
                      Your listing will be marked as claimed under your
                      business.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>An admin will review and confirm your claim.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>
                      Once approved, you'll have full access to edit and manage
                      your upgraded listing.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Plan Details */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <CreditCard className="w-5 h-5" />
                  Plan Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-900">Chosen Plan:</span>
                    <Badge variant="secondary">{planName}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-900">Billing:</span>
                    <span>{billingCycle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-900">Listing:</span>
                    <span className="font-medium">{listingName}</span>
                  </div>
                </div>
              </div>

              {/* Contact info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm text-blue-900">
                      Note for Vendors
                    </div>
                    <div className="text-sm text-blue-800">
                      If you have questions or need to provide extra
                      documentation, please reach out to:{" "}
                      <a
                        href="mailto:support@childactor101.com"
                        className="font-medium hover:underline"
                      >
                        support@childactor101.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="flex-1">
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <Link href="/directory">Browse Directory</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}
