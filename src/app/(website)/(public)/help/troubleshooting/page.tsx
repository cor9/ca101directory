import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Mail,
  RefreshCw,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Troubleshooting | Help Center",
  description: "Solutions to common issues on Child Actor 101 Directory",
};

export default function TroubleshootingPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <Link
        href="/help"
        className="inline-flex items-center gap-2 text-[#1E1F23] hover:text-[#1E1F23]/80 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Help Center
      </Link>

      <h1 className="text-4xl font-bold text-paper mb-6">
        Troubleshooting
      </h1>
      <p className="text-xl text-paper mb-12">
        Quick solutions to common issues. Can't find your issue? Contact
        support!
      </p>

      {/* Account & Login Issues */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-paper mb-6 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6" />
          Account & Login Issues
        </h2>
        <div className="space-y-6">
          <div className="bg-surface  rounded-lg p-6">
            <h3 className="font-bold text-[#1E1F23] mb-3 text-lg">
              ❌ I can't log in to my account
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-[#1E1F23] mb-1">
                  Solution 1: Check your email
                </p>
                <p className="text-[#1E1F23]">
                  Make sure you're using the email address you registered with.
                  Try typing it carefully or copy/paste from your registration
                  email.
                </p>
              </div>
              <div>
                <p className="font-semibold text-[#1E1F23] mb-1">
                  Solution 2: Reset your password
                </p>
                <p className="text-[#1E1F23] mb-2">
                  Click "Forgot Password" on the login page to receive a reset
                  link via email.
                </p>
                <Link
                  href="/auth/reset"
                  className="text-[#1E1F23] hover:text-[#1E1F23]/80 underline"
                >
                  Reset password →
                </Link>
              </div>
              <div>
                <p className="font-semibold text-[#1E1F23] mb-1">
                  Solution 3: Clear browser cache
                </p>
                <p className="text-[#1E1F23]">
                  Try clearing your browser cookies and cache, then attempt to
                  log in again.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-surface  rounded-lg p-6">
            <h3 className="font-bold text-[#1E1F23] mb-3 text-lg">
              ⚠️ I didn't receive my confirmation email
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-[#1E1F23] mb-1">
                  Step 1: Check spam folder
                </p>
                <p className="text-[#1E1F23]">
                  Confirmation emails sometimes end up in spam/junk. Check there
                  first and mark it as "Not Spam."
                </p>
              </div>
              <div>
                <p className="font-semibold text-[#1E1F23] mb-1">
                  Step 2: Wait 5-10 minutes
                </p>
                <p className="text-[#1E1F23]">
                  Email delivery can sometimes be delayed. Give it a few
                  minutes.
                </p>
              </div>
              <div>
                <p className="font-semibold text-[#1E1F23] mb-1">
                  Step 3: Resend confirmation
                </p>
                <p className="text-[#1E1F23] mb-2">
                  Go to the login page and click "Resend confirmation email."
                </p>
                <Link
                  href="/auth/login"
                  className="text-[#1E1F23] hover:text-[#1E1F23]/80 underline"
                >
                  Go to login page →
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-surface  rounded-lg p-6">
            <h3 className="font-bold text-[#1E1F23] mb-3 text-lg">
              ⚠️ Error: "Email not confirmed"
            </h3>
            <p className="text-[#1E1F23] text-sm mb-3">
              You need to confirm your email address before claiming listings or
              accessing certain features.
            </p>
            <div className="bg-bauhaus-blue/20 border-0 rounded p-3 mb-3">
              <p className="text-sm text-[#1E1F23]">
                <strong>Quick fix:</strong> Check your email inbox (and spam)
                for the confirmation email and click the link. The link is valid
                for 7 days.
              </p>
            </div>
            <p className="text-sm text-[#1E1F23]">
              If you can't find the email, use the "Resend confirmation" option
              on the login page.
            </p>
          </div>
        </div>
      </div>

      {/* Listing & Submission Issues */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-paper mb-6 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6" />
          Listing & Submission Issues
        </h2>
        <div className="space-y-6">
          <div className="bg-surface  rounded-lg p-6">
            <h3 className="font-bold text-[#1E1F23] mb-3 text-lg">
              ❌ I can't claim my listing
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-[#1E1F23] mb-1">
                  Reason 1: Email not confirmed
                </p>
                <p className="text-[#1E1F23]">
                  You must confirm your email before claiming listings. Check
                  your inbox for the confirmation email.
                </p>
              </div>
              <div>
                <p className="font-semibold text-[#1E1F23] mb-1">
                  Reason 2: Wrong account type
                </p>
                <p className="text-[#1E1F23]">
                  You need a <strong>Vendor</strong> account to claim listings.
                  Parent accounts cannot claim business listings.
                </p>
              </div>
              <div>
                <p className="font-semibold text-[#1E1F23] mb-1">
                  Reason 3: Already claimed
                </p>
                <p className="text-[#1E1F23]">
                  If the listing shows as claimed by someone else, contact
                  support with proof of ownership.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-surface  rounded-lg p-6">
            <h3 className="font-bold text-[#1E1F23] mb-3 text-lg">
              ⚠️ My listing isn't showing up in search
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-[#1E1F23] mb-1">
                  Check 1: Listing status
                </p>
                <p className="text-[#1E1F23]">
                  Go to your dashboard and verify your listing status is "Live"
                  (not "Pending" or "Draft").
                </p>
              </div>
              <div>
                <p className="font-semibold text-[#1E1F23] mb-1">
                  Check 2: Search filters
                </p>
                <p className="text-[#1E1F23]">
                  Make sure you're searching in the correct category and
                  location where your listing is categorized.
                </p>
              </div>
              <div>
                <p className="font-semibold text-[#1E1F23] mb-1">
                  Check 3: Plan level
                </p>
                <p className="text-[#1E1F23]">
                  Free listings appear lower in search results. Pro listings get
                  priority placement, followed by Standard.
                </p>
              </div>
              <div>
                <p className="font-semibold text-[#1E1F23] mb-1">
                  Check 4: Wait for indexing
                </p>
                <p className="text-[#1E1F23]">
                  New listings may take up to 1 hour to appear in all search
                  results. Try refreshing the page.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-surface  rounded-lg p-6">
            <h3 className="font-bold text-[#1E1F23] mb-3 text-lg">
              ⚠️ My edits aren't showing on my listing
            </h3>
            <p className="text-[#1E1F23] text-sm mb-3">
              <strong>This is normal behavior.</strong> All edits require admin
              approval before going live.
            </p>
            <div className="bg-bauhaus-blue/20 border-0 rounded p-3">
              <p className="text-sm text-[#1E1F23]">
                Your edits are saved as "Pending" and will go live after review
                (typically 24-48 hours). You'll receive an email when approved.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Image Upload Issues */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-paper mb-6 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6" />
          Image Upload Issues
        </h2>
        <div className="space-y-6">
          <div className="bg-surface  rounded-lg p-6">
            <h3 className="font-bold text-[#1E1F23] mb-3 text-lg">
              ❌ Image upload fails or shows an error
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-[#1E1F23] mb-1">
                  Solution 1: Check file size
                </p>
                <p className="text-[#1E1F23] mb-2">
                  Images must be under 5MB. Use a compression tool to reduce
                  file size:
                </p>
                <div className="flex gap-3">
                  <a
                    href="https://tinypng.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1E1F23] hover:text-[#1E1F23]/80 underline"
                  >
                    TinyPNG →
                  </a>
                  <a
                    href="https://squoosh.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1E1F23] hover:text-[#1E1F23]/80 underline"
                  >
                    Squoosh →
                  </a>
                </div>
              </div>
              <div>
                <p className="font-semibold text-[#1E1F23] mb-1">
                  Solution 2: Check file format
                </p>
                <p className="text-[#1E1F23]">
                  Only JPEG, PNG, and WebP formats are supported. Convert other
                  formats (GIF, BMP, TIFF) first.
                </p>
              </div>
              <div>
                <p className="font-semibold text-[#1E1F23] mb-1">
                  Solution 3: Try a different browser
                </p>
                <p className="text-[#1E1F23]">
                  If uploads still fail, try Chrome, Firefox, or Safari. Clear
                  your cache first.
                </p>
              </div>
              <div>
                <p className="font-semibold text-[#1E1F23] mb-1">
                  Solution 4: Check internet connection
                </p>
                <p className="text-[#1E1F23]">
                  Large files require a stable connection. Try uploading on a
                  faster/more stable network.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-surface  rounded-lg p-6">
            <h3 className="font-bold text-[#1E1F23] mb-3 text-lg">
              ⚠️ My images look pixelated or blurry
            </h3>
            <div className="space-y-2 text-sm">
              <p className="text-[#1E1F23]">
                <strong>Cause:</strong> Image resolution is too low or was
                compressed too much.
              </p>
              <p className="text-[#1E1F23]">
                <strong>Solution:</strong> Re-upload using our recommended
                sizes:
              </p>
              <ul className="list-disc list-inside ml-4 text-[#1E1F23] space-y-1">
                <li>Profile image: 400x400px minimum</li>
                <li>Gallery images: 1200x800px minimum</li>
              </ul>
              <Link
                href="/help/image-guidelines"
                className="text-[#1E1F23] hover:text-[#1E1F23]/80 underline inline-block mt-2"
              >
                View full image guidelines →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Payment & Subscription Issues */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-paper mb-6 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6" />
          Payment & Subscription Issues
        </h2>
        <div className="space-y-6">
          <div className="bg-surface  rounded-lg p-6">
            <h3 className="font-bold text-[#1E1F23] mb-3 text-lg">
              ❌ Payment failed or card was declined
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-[#1E1F23] mb-1">
                  Step 1: Verify card details
                </p>
                <p className="text-[#1E1F23]">
                  Double-check card number, expiration date, CVV, and billing
                  zip code.
                </p>
              </div>
              <div>
                <p className="font-semibold text-[#1E1F23] mb-1">
                  Step 2: Check with your bank
                </p>
                <p className="text-[#1E1F23]">
                  Your bank may have flagged the transaction as suspicious.
                  Contact them to authorize the charge.
                </p>
              </div>
              <div>
                <p className="font-semibold text-[#1E1F23] mb-1">
                  Step 3: Try a different card
                </p>
                <p className="text-[#1E1F23]">
                  If the issue persists, try using a different payment method.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-surface  rounded-lg p-6">
            <h3 className="font-bold text-[#1E1F23] mb-3 text-lg">
              ⚠️ I was charged but didn't receive access
            </h3>
            <p className="text-[#1E1F23] text-sm mb-3">
              This is rare but can happen due to payment processing delays.
            </p>
            <div className="space-y-2 text-sm">
              <p className="text-[#1E1F23]">
                <strong>Step 1:</strong> Wait 10-15 minutes and refresh your
                dashboard.
              </p>
              <p className="text-[#1E1F23]">
                <strong>Step 2:</strong> Log out completely and log back in.
              </p>
              <p className="text-[#1E1F23]">
                <strong>Step 3:</strong> If still not resolved after 1 hour,
                contact support with your payment receipt.
              </p>
            </div>
          </div>

          <div className="bg-surface  rounded-lg p-6">
            <h3 className="font-bold text-[#1E1F23] mb-3 text-lg">
              ⚠️ How do I cancel my subscription?
            </h3>
            <p className="text-[#1E1F23] text-sm mb-2">
              Go to your dashboard → Settings → Subscription → Cancel Plan
            </p>
            <p className="text-[#1E1F23] text-sm">
              Your listing will remain active until the end of your billing
              period, then convert to a Free plan.
            </p>
          </div>
        </div>
      </div>

      {/* Still Having Issues? */}
      <div className="bg-gradient-to-r from-brand-blue to-brand-navy text-white rounded-lg p-8">
        <div className="text-center">
          <div className="inline-flex p-4 bg-bauhaus-blue/20 rounded-full mb-4">
            <Mail className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Still Having Issues?</h2>
          <p className="text-lg mb-6 opacity-90">
            Our support team is here to help! We typically respond within 24
            hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:hello@childactor101.com"
              className="inline-block bg-bauhaus-orange text-[#FFFDD0] font-semibold px-8 py-3 rounded-lg hover:bg-bauhaus-orange/90 transition-colors"
            >
              Email Support
            </a>
            <Link
              href="/help/faq"
              className="inline-block bg-bauhaus-blue hover:bg-bauhaus-blue/90 text-[#1E1F23] font-semibold px-8 py-3 rounded-lg transition-colors border border-white/30"
            >
              View FAQ
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Fixes Section */}
      <div className="mt-12 bg-bauhaus-mustard/20 border-2 border-green-500 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-[#1E1F23] mb-4 flex items-center gap-2">
          <RefreshCw className="w-6 h-6 text-[#1E1F23]" />
          Quick Fixes to Try First
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#1E1F23] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#1E1F23] text-sm">Refresh the page</p>
              <p className="text-xs text-[#1E1F23]">Press Ctrl+R (or Cmd+R on Mac)</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#1E1F23] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#1E1F23] text-sm">
                Clear browser cache
              </p>
              <p className="text-xs text-[#1E1F23]">
                Settings → Privacy → Clear browsing data
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#1E1F23] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#1E1F23] text-sm">
                Try a different browser
              </p>
              <p className="text-xs text-[#1E1F23]">Chrome, Firefox, or Safari</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#1E1F23] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#1E1F23] text-sm">
                Log out and back in
              </p>
              <p className="text-xs text-[#1E1F23]">
                Sometimes fixes authentication issues
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
