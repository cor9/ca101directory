import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Getting Started | Help Center",
  description: "Learn how to create your first listing on Child Actor 101 Directory",
};

export default function GettingStartedPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <Link
        href="/help"
        className="inline-flex items-center gap-2 text-brand-blue hover:text-brand-blue/80 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Help Center
      </Link>

      <h1 className="text-4xl font-bold text-gray-900 mb-6">Getting Started</h1>
      <p className="text-xl text-gray-600 mb-8">
        Welcome to Child Actor 101 Directory! Follow this guide to create your
        professional listing and start connecting with families.
      </p>

      {/* Step-by-Step Guide */}
      <div className="space-y-8">
        {/* Step 1 */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-brand-blue transition-colors">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Create Your Account
              </h2>
              <p className="text-gray-700 mb-4">
                Start by creating a vendor account. This gives you access to submit
                listings and manage your profile.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Important:</strong> You'll receive a confirmation email
                  after signing up.
                </p>
                <p className="text-sm text-gray-600">
                  Check your email (including spam folder) and click the confirmation
                  link to activate your account.
                </p>
              </div>
              <Link
                href="/auth/register"
                className="inline-block bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-brand-blue transition-colors">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Choose Your Plan
              </h2>
              <p className="text-gray-700 mb-4">
                Select the subscription plan that works best for your business.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">Free</h3>
                  <p className="text-2xl font-bold text-gray-900 mb-2">$0</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Basic listing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>No images</span>
                    </li>
                  </ul>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">Standard</h3>
                  <p className="text-2xl font-bold text-gray-900 mb-2">
                    $25<span className="text-sm text-gray-600">/month</span>
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Profile image</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Contact details</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Edit anytime</span>
                    </li>
                  </ul>
                </div>
                <div className="border-2 border-brand-orange rounded-lg p-4 bg-orange-50">
                  <div className="inline-block bg-brand-orange text-white text-xs font-bold px-2 py-1 rounded mb-2">
                    POPULAR
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Pro</h3>
                  <p className="text-2xl font-bold text-gray-900 mb-2">
                    $50<span className="text-sm text-gray-600">/month</span>
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Profile + 4 gallery images</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Priority placement</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Social media links</span>
                    </li>
                  </ul>
                </div>
              </div>
              <Link
                href="/help/pricing-plans"
                className="text-brand-blue hover:text-brand-blue/80 underline text-sm"
              >
                View detailed plan comparison →
              </Link>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-brand-blue transition-colors">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Complete Your Listing
              </h2>
              <p className="text-gray-700 mb-4">
                Fill out your business information to create a compelling listing.
              </p>
              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      Business Information
                    </p>
                    <p className="text-sm text-gray-600">
                      Name, tagline, description, and contact details
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Category & Location</p>
                    <p className="text-sm text-gray-600">
                      Choose your category and service areas
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Profile Image</p>
                    <p className="text-sm text-gray-600">
                      Upload your logo (400x400px recommended)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      Gallery Images (Pro+)
                    </p>
                    <p className="text-sm text-gray-600">
                      Add up to 4 additional photos (1200x800px recommended)
                    </p>
                  </div>
                </div>
              </div>
              <Link
                href="/submit"
                className="inline-block bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
              >
                Start Your Listing
              </Link>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-brand-blue transition-colors">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold">
              4
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Wait for Approval
              </h2>
              <p className="text-gray-700 mb-4">
                Our team reviews all new listings to ensure quality and accuracy.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Approval Process:</strong>
                </p>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>
                    <strong>All Plans:</strong> Require admin approval, typically
                    24-48 hours
                  </li>
                  <li>
                    <strong>Free Plan:</strong> Requires admin approval (typically
                    24-48 hours)
                  </li>
                  <li>
                    All edits to existing listings require approval before going
                    live
                  </li>
                </ul>
              </div>
              <p className="text-sm text-gray-600">
                You'll receive an email notification once your listing is approved
                and live.
              </p>
            </div>
          </div>
        </div>

        {/* Step 5 */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-brand-blue transition-colors">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold">
              5
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Manage Your Listing
              </h2>
              <p className="text-gray-700 mb-4">
                Access your dashboard to update information, track performance, and
                manage your subscription.
              </p>
              <div className="space-y-2 mb-4">
                <Link
                  href="/dashboard"
                  className="block text-brand-blue hover:text-brand-blue/80 underline"
                >
                  Go to Dashboard →
                </Link>
                <Link
                  href="/help/editing-listing"
                  className="block text-brand-blue hover:text-brand-blue/80 underline"
                >
                  Learn how to edit your listing →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="mt-12 bg-gradient-to-r from-brand-blue to-brand-navy text-white rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="mb-6 opacity-90">
          Create your professional listing today and start connecting with families
          in the entertainment industry.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/submit"
            className="inline-block bg-white text-brand-blue font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Create New Listing
          </Link>
          <Link
            href="/claim-listing"
            className="inline-block bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-lg transition-colors border border-white/30"
          >
            Claim Existing Listing
          </Link>
        </div>
      </div>

      {/* Related Articles */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Related Articles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/help/image-guidelines"
            className="border border-gray-200 rounded-lg p-4 hover:border-brand-blue transition-colors"
          >
            <h4 className="font-semibold text-gray-900 mb-2">Image Guidelines</h4>
            <p className="text-sm text-gray-600">
              Learn the best practices for profile and gallery images
            </p>
          </Link>
          <Link
            href="/help/pricing-plans"
            className="border border-gray-200 rounded-lg p-4 hover:border-brand-blue transition-colors"
          >
            <h4 className="font-semibold text-gray-900 mb-2">
              Pricing & Plans
            </h4>
            <p className="text-sm text-gray-600">
              Compare plans and choose the right one for your business
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

