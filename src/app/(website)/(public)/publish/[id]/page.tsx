import { Button } from "@/components/ui/button";
import { CheckCircleIcon, EyeIcon, HomeIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

interface PublishPageProps {
  params: { id: string };
  searchParams: { pay?: string };
}

export default function PublishPage({
  params,
  searchParams,
}: PublishPageProps) {
  const listingId = params.id;
  const paymentStatus = searchParams.pay;

  const isSuccess = paymentStatus === "success";

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div
        className={`flex items-center justify-center w-16 h-16 rounded-full ${
          isSuccess ? "bg-green-100" : "bg-brand-blue/10"
        }`}
      >
        <CheckCircleIcon
          className={`w-8 h-8 ${
            isSuccess ? "text-green-600" : "text-brand-blue"
          }`}
        />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          {isSuccess ? "Payment Successful!" : "Publishing Your Listing"}
        </h1>
        <p className="text-lg text-muted-foreground max-w-md">
          {isSuccess
            ? "Thank you for your payment! Your listing is now live and visible to families searching for acting professionals."
            : "Your listing is being processed and will be published shortly."}
        </p>
        {listingId && (
          <p className="text-sm text-muted-foreground">
            Listing ID: {listingId}
          </p>
        )}
      </div>

      {isSuccess && (
        <div className="bg-gradient-to-r from-brand-orange/5 via-brand-yellow/5 to-brand-blue/5 rounded-lg p-6 border border-brand-blue/20 max-w-md">
          <h3 className="font-semibold text-brand-blue mb-2">What's Next?</h3>
          <ul className="text-sm text-muted-foreground space-y-1 text-left">
            <li>• Your listing is now live on the directory</li>
            <li>• Families can find and contact you</li>
            <li>• You'll receive email notifications for inquiries</li>
            <li>• Manage your listing from your dashboard</li>
          </ul>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button asChild>
          <Link href="/directory" className="flex items-center gap-2">
            <SearchIcon className="w-4 h-4" />
            View Directory
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard" className="flex items-center gap-2">
            <EyeIcon className="w-4 h-4" />
            Manage Listings
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/" className="flex items-center gap-2">
            <HomeIcon className="w-4 h-4" />
            Go Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
