import { verifyClaim } from "@/actions/verify-claim";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircleIcon,
  CheckCircleIcon,
  ShieldIcon,
  XCircleIcon,
} from "lucide-react";
import Link from "next/link";

interface VerifyClaimPageProps {
  params: { token: string };
}

export default async function VerifyClaimPage({
  params,
}: VerifyClaimPageProps) {
  const { token } = params;

  // Verify the claim token
  const result = await verifyClaim(token);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <div
          className={`flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-4 ${
            result.status === "success" ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {result.status === "success" ? (
            <CheckCircleIcon className="w-8 h-8 text-green-600" />
          ) : (
            <XCircleIcon className="w-8 h-8 text-red-600" />
          )}
        </div>
        <h1 className="text-3xl font-bold text-paper mb-2">
          {result.status === "success"
            ? "Listing Claimed Successfully!"
            : "Verification Failed"}
        </h1>
        <p className="text-paper">
          {result.status === "success"
            ? "You now have full control of your listing"
            : "There was an issue verifying your claim"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldIcon className="w-5 h-5 text-brand-blue" />
            {result.status === "success"
              ? "Claim Successful"
              : "Verification Error"}
          </CardTitle>
          <CardDescription>
            {result.status === "success"
              ? "Your listing ownership has been verified and confirmed"
              : "We couldn't verify your claim request"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {result.status === "success" ? (
            <div className="space-y-6">
              <Alert>
                <CheckCircleIcon className="h-4 w-4" />
                <AlertDescription>
                  <strong>Congratulations!</strong> You now have full control
                  over your listing.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-paper">
                  What you can do now:
                </h3>
                <ul className="space-y-2 text-paper">
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-600" />
                    Edit your listing details and contact information
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-600" />
                    Upload photos and update your business description
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-600" />
                    Upgrade to Pro or Premium plans for better visibility
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-600" />
                    View analytics and performance metrics
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  className="bg-brand-orange hover:bg-brand-orange-dark"
                >
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/pricing">View Upgrade Options</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <Alert variant="destructive">
                <AlertCircleIcon className="h-4 w-4" />
                <AlertDescription>
                  <strong>Verification Failed:</strong> {result.message}
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-paper">
                  Possible reasons:
                </h3>
                <ul className="space-y-2 text-paper">
                  <li className="flex items-center gap-2">
                    <XCircleIcon className="w-4 h-4 text-red-600" />
                    Verification link has expired (24 hours)
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircleIcon className="w-4 h-4 text-red-600" />
                    Link has already been used
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircleIcon className="w-4 h-4 text-red-600" />
                    Listing has already been claimed
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircleIcon className="w-4 h-4 text-red-600" />
                    Invalid verification token
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild>
                  <Link href="/submit">Submit New Listing</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="mailto:corey@childactor101.com">
                    Contact Support
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
