import { Icons } from "@/components/icons/icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Claim Link Issue - Child Actor 101",
  description: "Your claim link has expired or is invalid. Request a fresh link.",
};

export default function ClaimExpiredPage() {
  return (
    <div className="container mx-auto max-w-lg px-4 py-16">
      <div className="rounded-2xl border border-secondary-denim bg-paper p-8 text-center shadow-lg">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-orange/10 text-primary-orange">
          <Icons.alert className="h-6 w-6" />
        </div>
        
        <h1 className="mt-6 text-2xl font-semibold text-gray-900">
          Claim Link Expired or Invalid
        </h1>
        
        <p className="mt-3 text-gray-700">
          Your claim link may have <strong>expired</strong> (links are valid for 14 days) or the 
          link may have been <strong>copied incorrectly</strong>.
        </p>

        <div className="mt-6 rounded-lg bg-blue-50 p-4 text-left">
          <p className="text-sm font-semibold text-blue-900 mb-2">
            What to do next:
          </p>
          <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
            <li>
              <strong>Request a new claim link</strong> using the button below
            </li>
            <li>
              <strong>Check your spam folder</strong> for the original email
            </li>
            <li>
              Make sure to <strong>click the link directly</strong> from your email 
              (don't copy/paste the URL, as it may break)
            </li>
          </ul>
        </div>
        
        <div className="mt-6 space-y-3">
          <a 
            href="mailto:corey@childactor101.com?subject=New%20Claim%20Link%20Request&body=Hi%2C%0A%0AI%20need%20a%20new%20claim%20link%20for%20my%20listing.%0A%0ABusiness%20Name%3A%20%5BYour%20Business%20Name%5D%0AEmail%3A%20%5BYour%20Email%5D%0A%0AThank%20you!"
          >
            <Button className="w-full bg-primary-orange hover:bg-primary-orange/90">
              Request New Claim Link
            </Button>
          </a>
          
          <Link href="/auth/login">
            <Button variant="outline" className="w-full">
              Back to Login
            </Button>
          </Link>
          
          <p className="text-sm text-gray-600">
            💡 <strong>Tip:</strong> Claim links are sent to the email address 
            associated with your business listing.
          </p>
        </div>
      </div>
    </div>
  );
}

