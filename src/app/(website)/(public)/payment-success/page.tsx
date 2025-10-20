import { Button } from "@/components/ui/button";
import {
  CheckCircleIcon,
  ClockIcon,
  HomeIcon,
  MailIcon,
  SearchIcon,
} from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
        <CheckCircleIcon className="w-8 h-8 text-green-600" />
      </div>

      <div className="space-y-4">
        <h1 className="bauhaus-heading text-3xl text-paper">
          ✅ Payment Received — Your Listing Is In Review
        </h1>

        <div className="bauhaus-body text-lg text-paper max-w-2xl space-y-4">
          <p>
            Thank you for your payment! Your listing has been submitted and is
            now in the review queue.
          </p>
          <p>
            Our team typically approves listings within 72 hours. Once approved,
            you'll receive an email confirmation and your listing will be
            visible in the 101 Directory.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-brand-orange/5 via-brand-yellow/5 to-brand-blue/5 rounded-lg p-6 border border-brand-blue/20 max-w-2xl">
        <h3 className="bauhaus-heading text-bauhaus-blue mb-4 flex items-center justify-center gap-2">
          <ClockIcon className="w-5 h-5" />
          Next Steps
        </h3>
        <ul className="text-sm text-paper space-y-2 text-left">
          <li className="flex items-start gap-2">
            <MailIcon className="w-4 h-4 mt-0.5 text-brand-blue" />
            <span>Watch your inbox for approval and live link.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircleIcon className="w-4 h-4 mt-0.5 text-brand-blue" />
            <span>
              While you wait, prepare your logo, gallery photos, and any copy
              edits you might want to add.
            </span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button asChild>
          <Link href="/directory" className="flex items-center gap-2">
            <SearchIcon className="w-4 h-4" />
            Browse Directory
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/vendor" className="flex items-center gap-2">
            <CheckCircleIcon className="w-4 h-4" />
            View Dashboard
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
