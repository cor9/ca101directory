import { ArrowLeft, Mail } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Help Center",
  description:
    "Find answers to common questions about Child Actor 101 Directory",
};

export default function FAQPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <Link
        href="/help"
        className="inline-flex items-center gap-2 text-secondary-denim hover:text-bauhaus-blue mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Help Center
      </Link>

      <h1 className="text-4xl font-bold text-paper mb-6">
        Frequently Asked Questions
      </h1>
      <p className="bauhaus-body text-xl text-paper mb-12">
        Quick answers to common questions about the Child Actor 101 Directory.
      </p>

      {/* General Questions */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-bauhaus-blue mb-6">
          General Questions
        </h2>
        <div className="space-y-4">
          <div className="bg-surface border border-secondary-denim/20 rounded-lg p-6 shadow-lg">
            <h3 className="font-bold text-[#1E1F23] mb-2 text-lg">
              What is Child Actor 101 Directory?
            </h3>
            <p className="bauhaus-body text-surface">
              Child Actor 101 Directory is a curated platform connecting
              families in the entertainment industry with trusted professionals
              like acting coaches, headshot photographers, agents, managers, and
              more.
            </p>
          </div>

          <div className="bg-bauhaus-blue border border-secondary-denim/20 rounded-lg p-6 shadow-lg">
            <h3 className="font-bold text-[#1E1F23] mb-2 text-lg">
              Who can list on the directory?
            </h3>
            <p className="bauhaus-body text-surface">
              We accept businesses and professionals who serve families in the
              entertainment industry, including: acting coaches, headshot
              photographers, casting directors, agents, managers, self-tape
              studios, acting classes, and related services.
            </p>
          </div>

          <div className="bg-bauhaus-orange border border-secondary-denim/20 rounded-lg p-6 shadow-lg">
            <h3 className="font-bold text-[#1E1F23] mb-2 text-lg">
              Is the directory only for child actors?
            </h3>
            <p className="bauhaus-body text-surface">
              While our focus is on services for young performers, we also
              include professionals who work with actors of all ages.
            </p>
          </div>
        </div>
      </div>

      {/* Account & Registration */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-bauhaus-blue mb-6">
          Account & Registration
        </h2>
        <div className="space-y-4">
          <div className="bg-bauhaus-mustard border border-secondary-denim/20 rounded-lg p-6 shadow-lg">
            <h3 className="font-bold text-[#1E1F23] mb-2 text-lg">
              How do I create an account?
            </h3>
            <p className="bauhaus-body text-surface mb-2">
              Click "Register" in the navigation menu and choose "Vendor" as
              your role. You'll receive a confirmation email - click the link to
              activate your account.
            </p>
            <Link
              href="/auth/register"
              className="text-secondary-denim hover:text-bauhaus-blue underline text-sm"
            >
              Create account →
            </Link>
          </div>

          <div className="bg-surface border border-secondary-denim/20 rounded-lg p-6 shadow-lg">
            <h3 className="font-bold text-[#1E1F23] mb-2 text-lg">
              I didn't receive my confirmation email. What should I do?
            </h3>
            <p className="bauhaus-body text-surface">
              Check your spam/junk folder first. If it's not there, you can
              request a new confirmation email from the login page. The
              confirmation link is valid for 7 days.
            </p>
          </div>

          <div className="bg-bauhaus-blue border border-secondary-denim/20 rounded-lg p-6 shadow-lg">
            <h3 className="font-bold text-[#1E1F23] mb-2 text-lg">
              What's the difference between Vendor and Parent accounts?
            </h3>
            <p className="bauhaus-body text-surface">
              <strong>Vendor accounts</strong> are for businesses listing their
              services. <strong>Parent accounts</strong> are for families
              browsing and saving their favorite professionals. You need a
              vendor account to create or claim listings.
            </p>
          </div>

          <div className="bg-bauhaus-orange border border-secondary-denim/20 rounded-lg p-6 shadow-lg">
            <h3 className="font-bold text-[#1E1F23] mb-2 text-lg">
              Can I change my password?
            </h3>
            <p className="bauhaus-body text-surface mb-2">
              Yes! Go to your account settings from the dashboard to update your
              password or other account information.
            </p>
            <Link
              href="/settings"
              className="text-secondary-denim hover:text-bauhaus-blue underline text-sm"
            >
              Go to settings →
            </Link>
          </div>
        </div>
      </div>

      {/* Listings & Submission */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-bauhaus-blue mb-6">
          Listings & Submission
        </h2>
        <div className="space-y-4">
          <div className="bg-bauhaus-mustard border border-secondary-denim/20 rounded-lg p-6 shadow-lg">
            <h3 className="font-bold text-[#1E1F23] mb-2 text-lg">
              How do I submit a new listing?
            </h3>
            <p className="bauhaus-body text-surface mb-2">
              Create a vendor account, then go to "Submit Listing" from the
              navigation menu. Fill out your business information, select your
              plan, and submit for review.
            </p>
            <Link
              href="/help/getting-started"
              className="text-secondary-denim hover:text-bauhaus-blue underline text-sm"
            >
              View getting started guide →
            </Link>
          </div>

          <div className="bg-surface border border-secondary-denim/20 rounded-lg p-6 shadow-lg">
            <h3 className="font-bold text-[#1E1F23] mb-2 text-lg">
              How long does it take for my listing to go live?
            </h3>
            <p className="bauhaus-body text-surface">
              All listings require admin approval before going live, typically
              within 24-48 hours. This ensures quality and accuracy across the
              directory.
            </p>
          </div>

          <div className="bg-bauhaus-blue border border-secondary-denim/20 rounded-lg p-6 shadow-lg">
            <h3 className="font-bold text-[#1E1F23] mb-2 text-lg">
              My business is already listed. How do I claim it?
            </h3>
            <p className="bauhaus-body text-surface mb-2">
              Search for your business in the directory, then click "Claim This
              Listing" on your listing page. Claims are instantly approved!
            </p>
            <Link
              href="/help/claim-listing"
              className="text-secondary-denim hover:text-bauhaus-blue underline text-sm"
            >
              View claim guide →
            </Link>
          </div>

          <div className="bg-bauhaus-orange border border-secondary-denim/20 rounded-lg p-6 shadow-lg">
            <h3 className="font-bold text-[#1E1F23] mb-2 text-lg">
              Can I edit my listing after it's published?
            </h3>
            <p className="bauhaus-body text-surface">
              Yes! Go to your dashboard and click "Edit" on your listing. All
              edits require admin approval before going live to maintain
              quality.
            </p>
          </div>

          <div className="bg-bauhaus-mustard border border-secondary-denim/20 rounded-lg p-6 shadow-lg">
            <h3 className="font-bold text-[#1E1F23] mb-2 text-lg">
              Can I have multiple listings?
            </h3>
            <p className="bauhaus-body text-surface">
              Yes, if you have multiple business locations or distinct brands,
              you can create separate listings for each. Each listing requires
              its own subscription.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing & Plans */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-bauhaus-blue mb-6">
          Pricing & Plans
        </h2>
        <div className="space-y-4">
          <div className="bg-surface border border-secondary-denim/20 rounded-lg p-6 shadow-lg">
            <h3 className="font-bold text-[#1E1F23] mb-2 text-lg">
              What plans are available?
            </h3>
            <p className="bauhaus-body text-surface mb-2">
              We offer Free ($0), Standard ($25/mo), and Pro ($50/mo) plans.
              Each plan includes different features and visibility levels.
            </p>
            <Link
              href="/help/pricing-plans"
              className="text-secondary-denim hover:text-bauhaus-blue underline text-sm"
            >
              Compare all plans →
            </Link>
          </div>

          <div className="bg-bauhaus-blue border border-secondary-denim/20 rounded-lg p-6 shadow-lg">
            <h3 className="font-bold text-[#1E1F23] mb-2 text-lg">
              Can I upgrade or downgrade my plan?
            </h3>
            <p className="bauhaus-body text-surface">
              Yes! You can change your plan anytime from your dashboard.
              Upgrades take effect immediately. Downgrades take effect at the
              end of your current billing period.
            </p>
          </div>

          <div className="bg-bauhaus-orange border border-secondary-denim/20 rounded-lg p-6 shadow-lg">
            <h3 className="font-bold text-[#1E1F23] mb-2 text-lg">
              Do you offer refunds?
            </h3>
            <p className="bauhaus-body text-surface">
              Yes, we offer a 30-day money-back guarantee on all paid plans. If
              you're not satisfied, contact us within 30 days for a full refund.
            </p>
          </div>

          <div className="bg-bauhaus-mustard border border-secondary-denim/20 rounded-lg p-6 shadow-lg">
            <h3 className="font-bold text-[#1E1F23] mb-2 text-lg">
              What payment methods do you accept?
            </h3>
            <p className="bauhaus-body text-surface">
              We accept all major credit cards (Visa, Mastercard, Amex,
              Discover) processed securely through Stripe.
            </p>
          </div>

          <div className="bg-surface border border-secondary-denim/20 rounded-lg p-6 shadow-lg">
            <h3 className="font-bold text-[#1E1F23] mb-2 text-lg">
              Can I cancel my subscription?
            </h3>
            <p className="bauhaus-body text-surface">
              Yes, you can cancel anytime from your dashboard. Your listing will
              remain active until the end of your billing period, then
              automatically convert to a Free plan.
            </p>
          </div>
        </div>
      </div>

      {/* Images & Media */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-bauhaus-blue mb-6">
          Images & Media
        </h2>
        <div className="space-y-4">
          <div className="bg-bauhaus-blue border border-secondary-denim/20 rounded-lg p-6 shadow-lg">
            <h3 className="font-bold text-[#1E1F23] mb-2 text-lg">
              What image sizes do you recommend?
            </h3>
            <p className="bauhaus-body text-surface mb-2">
              <strong>Profile image:</strong> 400x400px (square)
              <br />
              <strong>Gallery images:</strong> 1200x800px (landscape)
              <br />
              <strong>Maximum file size:</strong> 5MB per image
            </p>
            <Link
              href="/help/image-guidelines"
              className="text-secondary-denim hover:text-bauhaus-blue underline text-sm"
            >
              View detailed guidelines →
            </Link>
          </div>

          <div className="bg-bauhaus-orange border border-secondary-denim/20 rounded-lg p-6 shadow-lg">
            <h3 className="font-bold text-[#1E1F23] mb-2 text-lg">
              What image formats are supported?
            </h3>
            <p className="bauhaus-body text-surface">
              We support JPEG, PNG, and WebP formats. We recommend JPEG for
              photos and PNG for logos with transparent backgrounds.
            </p>
          </div>

          <div className="bg-bauhaus-mustard border border-secondary-denim/20 rounded-lg p-6 shadow-lg">
            <h3 className="font-bold text-[#1E1F23] mb-2 text-lg">
              How many images can I upload?
            </h3>
            <p className="bauhaus-body text-surface">
              <strong>Free:</strong> No images
              <br />
              <strong>Standard:</strong> 1 profile image
              <br />
              <strong>Pro:</strong> 1 profile image + 4 gallery images (5 total)
            </p>
          </div>
        </div>
      </div>

      {/* Technical Support */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-bauhaus-blue mb-6">
          Technical Support
        </h2>
        <div className="space-y-4">
          <div className="bg-surface border border-secondary-denim/20 rounded-lg p-6 shadow-lg">
            <h3 className="font-bold text-[#1E1F23] mb-2 text-lg">
              I'm having trouble uploading images. What should I do?
            </h3>
            <p className="bauhaus-body text-surface">
              First, make sure your image is under 5MB and in JPEG, PNG, or WebP
              format. Try compressing the image using a tool like TinyPNG. If
              problems persist, contact support.
            </p>
          </div>

          <div className="bg-bauhaus-blue border border-secondary-denim/20 rounded-lg p-6 shadow-lg">
            <h3 className="font-bold text-[#1E1F23] mb-2 text-lg">
              My listing isn't appearing in search results. Why?
            </h3>
            <p className="bauhaus-body text-surface">
              Check that your listing status is "Live" (not "Pending"). Also,
              verify you're searching in the correct category and location. Free
              listings appear lower in search results than paid plans.
            </p>
          </div>

          <div className="bg-bauhaus-orange border border-secondary-denim/20 rounded-lg p-6 shadow-lg">
            <h3 className="font-bold text-[#1E1F23] mb-2 text-lg">
              How do I delete my listing?
            </h3>
            <p className="bauhaus-body text-surface">
              To remove your listing, cancel your subscription from your
              dashboard. Your listing will remain visible until the end of your
              billing period. For immediate removal, contact support.
            </p>
          </div>

          <div className="bg-bauhaus-mustard border border-secondary-denim/20 rounded-lg p-6 shadow-lg">
            <h3 className="font-bold text-[#1E1F23] mb-2 text-lg">
              I found incorrect information on my listing. How do I fix it?
            </h3>
            <p className="bauhaus-body text-surface">
              If someone else claimed your listing incorrectly, contact support
              immediately with proof of ownership. We'll transfer the listing to
              the rightful owner.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-gradient-to-r from-secondary-denim to-primary-orange text-white rounded-lg p-8 text-center">
        <div className="inline-flex p-4 bg-bauhaus-blue/20 rounded-full mb-4">
          <Mail className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Can't Find Your Answer?</h2>
        <p className="bauhaus-body text-lg mb-6 opacity-90">
          Our support team is here to help you with any questions.
        </p>
        <a
          href="mailto:hello@childactor101.com"
          className="bauhaus-btn-secondary inline-block font-semibold px-8 py-3 rounded-lg hover:bg-highlight transition-colors"
        >
          Contact Support
        </a>
      </div>

      {/* Browse Help Articles */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-paper mb-4">
          Browse Help Articles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/help/getting-started"
            className="bg-surface border border-secondary-denim/20 rounded-lg p-4 hover:border-bauhaus-blue transition-colors"
          >
            <h4 className="font-semibold text-[#1E1F23] mb-2">
              Getting Started
            </h4>
            <p className="bauhaus-body text-sm text-surface">
              Step-by-step guide for new vendors
            </p>
          </Link>
          <Link
            href="/help/claim-listing"
            className="bg-surface border border-secondary-denim/20 rounded-lg p-4 hover:border-bauhaus-blue transition-colors"
          >
            <h4 className="font-semibold text-[#1E1F23] mb-2">Claim Listing</h4>
            <p className="bauhaus-body text-sm text-surface">
              Take control of your existing listing
            </p>
          </Link>
          <Link
            href="/help/pricing-plans"
            className="bg-surface border border-secondary-denim/20 rounded-lg p-4 hover:border-bauhaus-blue transition-colors"
          >
            <h4 className="font-semibold text-[#1E1F23] mb-2">
              Pricing & Plans
            </h4>
            <p className="bauhaus-body text-sm text-surface">Compare all available plans</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
