import { ArrowLeft, Check, Star, X, Zap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing & Plans | Help Center",
  description:
    "Compare Child Actor 101 Directory pricing plans and choose the right one for your business",
};

export default function PricingPlansPage() {
  return (
    <div className="container max-w-6xl mx-auto px-4 py-12">
      <Link
        href="/help"
        className="inline-flex items-center gap-2 text-[#1E1F23] hover:text-[#1E1F23]/80 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Help Center
      </Link>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-paper mb-4">
          Pricing & Plans
        </h1>
        <p className="text-xl text-paper max-w-2xl mx-auto">
          Choose the plan that best fits your business needs. All plans include
          core listing features.
        </p>
      </div>

      {/* Plan Comparison Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {/* Free Plan */}
        <div className="bg-surface rounded-lg shadow-lg p-6 flex flex-col">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[#1E1F23] mb-2">Free</h2>
            <div className="mb-4">
              <span className="text-4xl font-bold text-[#1E1F23]">$0</span>
              <span className="text-[#1E1F23]">/forever</span>
            </div>
            <p className="text-sm text-[#1E1F23]">Perfect for getting started</p>
          </div>

          <div className="flex-1 space-y-3 mb-6">
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[#1E1F23]">Basic listing</span>
            </div>
            <div className="flex items-start gap-2">
              <X className="w-5 h-5 text-[#1E1F23] flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[#1E1F23]">Profile image</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[#1E1F23]">Contact information</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[#1E1F23]">
                Business description
              </span>
            </div>
            <div className="flex items-start gap-2">
              <X className="w-5 h-5 text-[#1E1F23] flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[#1E1F23]">Gallery images</span>
            </div>
            <div className="flex items-start gap-2">
              <X className="w-5 h-5 text-[#1E1F23] flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[#1E1F23]">Priority placement</span>
            </div>
            <div className="flex items-start gap-2">
              <X className="w-5 h-5 text-[#1E1F23] flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[#1E1F23]">Social media links</span>
            </div>
          </div>

          <div className="bg-bauhaus-mustard/20 border-0 rounded-lg p-3 mb-4">
            <p className="text-xs text-[#1E1F23]">
              <strong>Note:</strong> Free listings require admin approval before
              going live (24-48 hours)
            </p>
          </div>

          <Link
            href="/submit"
            className="block text-center bg-gray-200 hover:bg-gray-300 text-[#1E1F23] font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Get Started
          </Link>
        </div>

        {/* Standard Plan */}
        <div className="bg-bauhaus-mustard rounded-lg shadow-lg p-6 flex flex-col">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[#1E1F23] mb-2">Standard</h2>
            <div className="mb-4">
              <span className="text-4xl font-bold text-[#1E1F23]">$25</span>
              <span className="text-[#1E1F23]">/month</span>
            </div>
            <p className="text-sm text-[#1E1F23]">Great for small businesses</p>
          </div>

          <div className="flex-1 space-y-3 mb-6">
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[#1E1F23]">
                <strong>Everything in Free</strong>
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[#1E1F23]">
                <strong>1 profile image</strong>
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[#1E1F23]">
                Better search ranking
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[#1E1F23]">Enhanced visibility</span>
            </div>
            <div className="flex items-start gap-2">
              <X className="w-5 h-5 text-[#1E1F23] flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[#1E1F23]">Gallery images</span>
            </div>
            <div className="flex items-start gap-2">
              <X className="w-5 h-5 text-[#1E1F23] flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[#1E1F23]">Social media links</span>
            </div>
          </div>

          <Link
            href="/submit"
            className="block text-center bg-brand-blue hover:bg-brand-blue/90 text-[#1E1F23] font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Choose Standard
          </Link>
        </div>

        {/* Pro Plan - POPULAR */}
        <div className="bg-bauhaus-orange border-4 border-bauhaus-orange rounded-lg p-6 flex flex-col relative shadow-xl">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-brand-blue text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3" />
              MOST POPULAR
            </span>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-brand-blue mb-2">Pro</h2>
            <div className="mb-4">
              <span className="text-4xl font-bold text-[#1E1F23]">$50</span>
              <span className="text-[#1E1F23]">/month</span>
            </div>
            <p className="text-sm text-[#1E1F23]">Best for growing businesses</p>
          </div>

          <div className="flex-1 space-y-3 mb-6">
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[#1E1F23]">
                <strong>Everything in Basic</strong>
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[#1E1F23]">
                <strong>Gallery images (4 photos)</strong>
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[#1E1F23]">
                <strong>Social media links</strong>
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[#1E1F23]">Priority placement</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[#1E1F23]">
                Blog/website integration
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[#1E1F23]">Enhanced profile</span>
            </div>
          </div>

          <div className="bg-bauhaus-blue/20 border-0 rounded-lg p-3 mb-4">
            <p className="text-xs text-[#1E1F23]">
              <strong>Recommended:</strong> 5 total images showcase your
              business better
            </p>
          </div>

          <Link
            href="/submit"
            className="block text-center bg-brand-blue hover:bg-brand-blue/90 text-[#1E1F23] font-semibold px-6 py-3 rounded-lg transition-colors shadow-md"
          >
            Choose Pro
          </Link>
        </div>

      </div>

      {/* Annual Plans */}
      <div className="bg-bauhaus-mustard/20 rounded-lg p-8 mb-12 text-center">
        <h2 className="text-2xl font-bold text-[#1E1F23] mb-3">
          Save with Annual Plans
        </h2>
        <p className="text-lg text-[#1E1F23] mb-4">
          Pay annually and save 2 months!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <div className="bg-surface rounded-lg p-4">
            <p className="text-sm text-[#1E1F23] mb-1">Standard Annual</p>
            <p className="text-2xl font-bold text-[#1E1F23]">
              $250<span className="text-sm text-[#1E1F23]">/year</span>
            </p>
            <p className="text-xs text-[#1E1F23] font-semibold">Save $50</p>
          </div>
          <div className="bg-surface rounded-lg p-4 border-2 border-brand-blue">
            <p className="text-sm text-[#1E1F23] mb-1">Pro Annual</p>
            <p className="text-2xl font-bold text-[#1E1F23]">
              $500<span className="text-sm text-[#1E1F23]">/year</span>
            </p>
            <p className="text-xs text-[#1E1F23] font-semibold">Save $100</p>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-paper mb-6 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="bg-surface border border-gray-200 rounded-lg p-6">
            <h3 className="font-bold text-[#1E1F23] mb-2">
              Can I upgrade or downgrade my plan?
            </h3>
            <p className="text-[#1E1F23] text-sm">
              Yes! You can upgrade or downgrade anytime from your dashboard.
              Changes take effect immediately, and we'll prorate the difference.
            </p>
          </div>

          <div className="bg-surface border border-gray-200 rounded-lg p-6">
            <h3 className="font-bold text-[#1E1F23] mb-2">
              What happens if I cancel?
            </h3>
            <p className="text-[#1E1F23] text-sm">
              Your listing will remain active until the end of your billing
              period. After that, it will revert to a Free plan with limited
              features.
            </p>
          </div>

          <div className="bg-surface border border-gray-200 rounded-lg p-6">
            <h3 className="font-bold text-[#1E1F23] mb-2">
              Do you offer refunds?
            </h3>
            <p className="text-[#1E1F23] text-sm">
              We offer a 30-day money-back guarantee on all paid plans. If
              you're not satisfied, contact us within 30 days for a full refund.
            </p>
          </div>

          <div className="bg-surface border border-gray-200 rounded-lg p-6">
            <h3 className="font-bold text-[#1E1F23] mb-2">
              How does priority placement work?
            </h3>
            <p className="text-[#1E1F23] text-sm">
              Pro listings appear first in search results, followed by Standard,
              then Free. Within each tier, listings are shown by relevance and
              recency.
            </p>
          </div>

          <div className="bg-surface border border-gray-200 rounded-lg p-6">
            <h3 className="font-bold text-[#1E1F23] mb-2">
              What payment methods do you accept?
            </h3>
            <p className="text-[#1E1F23] text-sm">
              We accept all major credit cards (Visa, Mastercard, Amex,
              Discover) processed securely through Stripe.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-brand-blue to-brand-navy text-white rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-3">Ready to Get Started?</h2>
        <p className="text-lg mb-6 opacity-90">
          Join hundreds of professionals already listed on Child Actor 101
          Directory
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/submit"
            className="inline-block bg-bauhaus-orange text-[#FFFDD0] font-semibold px-8 py-3 rounded-lg hover:bg-bauhaus-orange/90 transition-colors"
          >
            Create Listing
          </Link>
          <Link
            href="/pricing"
            className="inline-block bg-bauhaus-blue hover:bg-bauhaus-blue/90 text-[#1E1F23] font-semibold px-8 py-3 rounded-lg transition-colors border border-white/30"
          >
            View Full Pricing
          </Link>
        </div>
      </div>
    </div>
  );
}
