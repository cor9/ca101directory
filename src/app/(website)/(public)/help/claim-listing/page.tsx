import { AlertCircle, ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Claim Your Listing | Help Center",
  description:
    "Step-by-step guide to claiming your existing listing on Child Actor 101 Directory",
};

export default function ClaimListingPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <Link
        href="/help"
        className="inline-flex items-center gap-2 text-[#1E1F23] hover:text-[#1E1F23]/80 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Help Center
      </Link>

      <h1 className="bauhaus-heading text-4xl font-bold text-paper mb-6">
        How to Claim Your Listing
      </h1>
      <p className="text-xl text-paper mb-8">
        Already listed in our directory? Claim your listing to gain full control
        and unlock premium features.
      </p>

      {/* Why Claim Your Listing */}
      <div className="bg-bauhaus-blue border-l-4 border-brand-blue rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-[#1E1F23] mb-4">
          Why Claim Your Listing?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-[#1E1F23]">Full Control</p>
              <p className="text-sm text-[#1E1F23]">
                Edit your information, images, and contact details anytime
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-[#1E1F23]">Instant Ownership</p>
              <p className="text-sm text-[#1E1F23]">
                Claims are auto-approved - take control immediately
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-[#1E1F23]">Premium Features</p>
              <p className="text-sm text-[#1E1F23]">
                Upgrade to Pro for enhanced visibility and gallery images
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-[#1E1F23]">Verified Badge</p>
              <p className="text-sm text-[#1E1F23]">
                Show customers you're the official business owner
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Process */}
      <div className="space-y-8 mb-12">
        <h2 className="text-2xl font-bold text-paper">
          Claiming Process (5 Easy Steps)
        </h2>

        {/* Step 1 */}
        <div className="bg-card-surface rounded-lg p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[#1E1F23] mb-3">
                Find Your Listing
              </h3>
              <p className="text-[#1E1F23] mb-4">
                Search for your business in our directory using the search bar
                or browse by category.
              </p>
              <Link
                href="/search"
                className="inline-block bg-brand-blue hover:bg-brand-blue/90 text-[#1E1F23] font-semibold px-6 py-2 rounded-lg transition-colors text-sm"
              >
                Search Directory
              </Link>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-bauhaus-blue rounded-lg p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[#1E1F23] mb-3">
                Create or Switch to Vendor Account
              </h3>
              <p className="text-[#1E1F23] mb-4">
                If you don't have an account yet, create one with your business
                email and select <strong>"Vendor"</strong> as your role. If you
                already have a Parent account, you can easily switch to Vendor
                in your Settings.
              </p>
              <div className="bg-bauhaus-mustard/20 border-0 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#1E1F23] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-[#1E1F23] mb-1">
                      Passwordless Magic Link Login
                    </p>
                    <p className="text-sm text-[#1E1F23] mb-2">
                      No passwords needed! Enter your email and we'll send you a
                      secure login link. Click it to sign in instantly.
                    </p>
                    <p className="text-sm text-[#1E1F23]">
                      Check your spam folder if you don't see the email within a
                      few minutes.
                    </p>
                  </div>
                </div>
              </div>
              <Link
                href="/auth/register"
                className="inline-block bg-brand-blue hover:bg-brand-blue/90 text-[#1E1F23] font-semibold px-6 py-2 rounded-lg transition-colors text-sm"
              >
                Create Vendor Account
              </Link>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-bauhaus-orange rounded-lg p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[#1E1F23] mb-3">
                Click "Claim This Listing"
              </h3>
              <p className="text-[#1E1F23] mb-4">
                On your listing page, you'll see a "Claim This Listing" button.
                Click it to start the claim process.
              </p>
              <div className="bg-bauhaus-blue/20 border-0 rounded-lg p-4">
                <p className="text-sm text-[#1E1F23] italic">
                  💡 Tip: The claim button appears on unclaimed listings when
                  you're logged in with a vendor account.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-card-surface rounded-lg p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[#1E1F23] mb-3">
                Verify Ownership (Optional)
              </h3>
              <p className="text-[#1E1F23] mb-4">
                You may be asked to provide a brief message or verification that
                you own this business. This helps us ensure listings are claimed
                by their rightful owners.
              </p>
              <div className="bg-bauhaus-mustard/20 border-0 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#1E1F23] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-[#1E1F23] mb-1">
                      Instant Approval!
                    </p>
                    <p className="text-sm text-[#1E1F23]">
                      Claims are automatically approved. You get instant
                      ownership and can start editing immediately.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 5 */}
        <div className="bg-bauhaus-mustard rounded-lg p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[#1E1F23] mb-3">
                Manage Your Listing
              </h3>
              <p className="text-[#1E1F23] mb-4">
                After claiming, you'll be redirected to your dashboard where you
                can edit your listing, upgrade your plan, and manage your
                profile.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-[#1E1F23]">
                  <strong>Note:</strong> Edits to your listing will need admin
                  approval before going live. This ensures quality across the
                  directory.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Troubleshooting Section */}
      <div className="bg-bauhaus-orange  rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-[#1E1F23] mb-4">
          Having Trouble Claiming?
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-[#1E1F23] mb-2">
              I didn't receive my magic link email
            </h3>
            <p className="text-sm text-[#1E1F23] mb-2">
              Check your spam/junk folder first. Magic links are valid for 24
              hours. If it expired or you can't find it, simply request a new
              one from the login page - there's no limit on how many you can
              request.
            </p>
            <Link
              href="/auth/login"
              className="text-sm text-[#1E1F23] hover:text-[#1E1F23]/80 underline"
            >
              Send me a new login link →
            </Link>
          </div>

          <div>
            <h3 className="font-semibold text-[#1E1F23] mb-2">
              I have a Parent account, can I still claim?
            </h3>
            <p className="text-sm text-[#1E1F23] mb-2">
              Yes! Go to your Settings page and use the "Change Account Type"
              feature to switch from Parent to Vendor. You can switch back
              anytime - it's instant and self-service.
            </p>
            <Link
              href="/settings"
              className="text-sm text-[#1E1F23] hover:text-[#1E1F23]/80 underline"
            >
              Go to Settings to switch roles →
            </Link>
          </div>

          <div>
            <h3 className="font-semibold text-[#1E1F23] mb-2">
              Error: "Listing already claimed"
            </h3>
            <p className="text-sm text-[#1E1F23]">
              This listing has already been claimed by another user. If you
              believe this is your business, contact our support team for
              assistance.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-[#1E1F23] mb-2">
              My listing isn't in the directory
            </h3>
            <p className="text-sm text-[#1E1F23] mb-2">
              If your business isn't listed yet, you can submit a new listing
              instead of claiming one.
            </p>
            <Link
              href="/submit"
              className="text-sm text-[#1E1F23] hover:text-[#1E1F23]/80 underline"
            >
              Submit new listing →
            </Link>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-gradient-to-r from-brand-blue to-brand-navy text-white rounded-lg p-8 text-center">
        <div className="inline-flex p-4 bg-bauhaus-blue/20 rounded-full mb-4">
          <Mail className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Still Need Help?</h2>
        <p className="text-lg mb-6 opacity-90">
          Our support team is here to help you claim your listing.
        </p>
        <a
          href="mailto:hello@childactor101.com"
          className="inline-block bg-bauhaus-orange text-[#FFFDD0] font-semibold px-8 py-3 rounded-lg hover:bg-bauhaus-orange/90 transition-colors"
        >
          Contact Support
        </a>
      </div>

      {/* Related Articles */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-paper mb-4">Related Articles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/help/getting-started"
            className="border border-gray-200 rounded-lg p-4 hover:border-brand-blue transition-colors"
          >
            <h4 className="font-semibold text-[#1E1F23] mb-2">
              Getting Started
            </h4>
            <p className="text-sm text-[#1E1F23]">
              New to the directory? Learn how to create your first listing
            </p>
          </Link>
          <Link
            href="/help/editing-listing"
            className="border border-gray-200 rounded-lg p-4 hover:border-brand-blue transition-colors"
          >
            <h4 className="font-semibold text-[#1E1F23] mb-2">
              Editing Your Listing
            </h4>
            <p className="text-sm text-[#1E1F23]">
              Learn how to update and optimize your claimed listing
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
