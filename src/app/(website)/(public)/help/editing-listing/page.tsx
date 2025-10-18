import {
  AlertCircle,
  ArrowLeft,
  Edit,
  Globe,
  Image as ImageIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Editing Your Listing | Help Center",
  description:
    "Learn how to update and optimize your Child Actor 101 Directory listing",
};

export default function EditingListingPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <Link
        href="/help"
        className="inline-flex items-center gap-2 text-brand-blue hover:text-brand-blue/80 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Help Center
      </Link>

      <h1 className="bauhaus-heading text-4xl font-bold text-paper mb-6">
        Editing Your Listing
      </h1>
      <p className="text-xl text-gray-900 mb-8">
        Keep your listing up-to-date with the latest information about your
        business. Here's everything you need to know about editing.
      </p>

      {/* How to Access Editor */}
      <div className="bg-blue-50 border-l-4 border-brand-blue rounded-lg p-6 mb-8">
        <h2 className="bauhaus-heading text-2xl font-bold text-paper mb-4">
          How to Edit Your Listing
        </h2>
        <ol className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-brand-blue text-white rounded-full flex items-center justify-center text-sm font-bold">
              1
            </span>
            <div>
              <p className="font-semibold text-gray-900">
                Log in to your account
              </p>
              <p className="text-sm text-gray-900">
                Use your vendor credentials to access the dashboard
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-brand-blue text-white rounded-full flex items-center justify-center text-sm font-bold">
              2
            </span>
            <div>
              <p className="font-semibold text-gray-900">
                Go to your dashboard
              </p>
              <p className="text-sm text-gray-900">
                Click "Dashboard" in the main navigation
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-brand-blue text-white rounded-full flex items-center justify-center text-sm font-bold">
              3
            </span>
            <div>
              <p className="font-semibold text-gray-900">
                Find your listing and click "Edit"
              </p>
              <p className="text-sm text-gray-900">
                Your listing will appear with an edit button
              </p>
            </div>
          </li>
        </ol>
        <div className="mt-4">
          <Link
            href="/dashboard"
            className="inline-block bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>

      {/* What You Can Edit */}
      <div className="mb-12">
        <h2 className="bauhaus-heading text-3xl font-bold text-paper mb-6">
          What You Can Edit
        </h2>

        <div className="space-y-6">
          {/* Business Information */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-3 bg-blue-100 text-brand-blue rounded-lg">
                <Edit className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="bauhaus-heading text-xl font-bold text-paper mb-3">
                  Business Information
                </h3>
                <ul className="space-y-2 text-gray-900">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-blue mt-1">•</span>
                    <span>
                      <strong>Business name</strong> - Your official company
                      name
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-blue mt-1">•</span>
                    <span>
                      <strong>Tagline</strong> - Short, catchy description (60
                      characters max)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-blue mt-1">•</span>
                    <span>
                      <strong>Description</strong> - Detailed information about
                      your services
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-blue mt-1">•</span>
                    <span>
                      <strong>Contact details</strong> - Phone, email, website
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-blue mt-1">•</span>
                    <span>
                      <strong>Location</strong> - Region, state, city
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-blue mt-1">•</span>
                    <span>
                      <strong>Category</strong> - Primary business category
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-3 bg-purple-100 text-purple-600 rounded-lg">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="bauhaus-heading text-xl font-bold text-paper mb-3">
                  Images & Gallery
                </h3>
                <ul className="space-y-2 text-gray-900 mb-4">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-blue mt-1">•</span>
                    <span>
                      <strong>Profile image</strong> - Your main logo or
                      business photo (400x400px recommended)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-blue mt-1">•</span>
                    <span>
                      <strong>Gallery images</strong> - Up to 4 additional
                      photos (Pro plan only, 1200x800px recommended)
                    </span>
                  </li>
                </ul>
                <Link
                  href="/help/image-guidelines"
                  className="text-brand-blue hover:text-brand-blue/80 underline text-sm"
                >
                  View image guidelines →
                </Link>
              </div>
            </div>
          </div>

          {/* Social Media & Links */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-3 bg-green-100 text-green-600 rounded-lg">
                <Globe className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="bauhaus-heading text-xl font-bold text-paper mb-3">
                  Social Media & Links (Pro Plan)
                </h3>
                <ul className="space-y-2 text-gray-900">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-blue mt-1">•</span>
                    <span>
                      <strong>Facebook</strong> - Your Facebook page URL
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-blue mt-1">•</span>
                    <span>
                      <strong>Instagram</strong> - Your Instagram profile
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-blue mt-1">•</span>
                    <span>
                      <strong>TikTok</strong> - Your TikTok profile
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-blue mt-1">•</span>
                    <span>
                      <strong>YouTube</strong> - Your YouTube channel
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-blue mt-1">•</span>
                    <span>
                      <strong>LinkedIn</strong> - Your LinkedIn company page
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-blue mt-1">•</span>
                    <span>
                      <strong>Blog</strong> - Your blog or news page
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-blue mt-1">•</span>
                    <span>
                      <strong>Custom link</strong> - Any additional link
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Approval Process */}
      <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-6 mb-8">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
          <div>
            <h2 className="bauhaus-heading text-2xl font-bold text-paper mb-3">
              Important: Approval Required
            </h2>
            <p className="text-gray-900 mb-4">
              <strong>All edits require admin approval</strong> before going
              live, regardless of your plan. This ensures quality and accuracy
              across the directory.
            </p>
            <div className="space-y-2 text-sm text-gray-900">
              <p>
                <strong>What this means:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Your edits will be saved but marked as "Pending"</li>
                <li>
                  The public will continue to see your current (live) listing
                </li>
                <li>Typical approval time: 24-48 hours</li>
                <li>You'll receive an email once your edits are approved</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="mb-12">
        <h2 className="bauhaus-heading text-3xl font-bold text-paper mb-6">
          Best Practices for Editing
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-gray-900 mb-2">Keep It Updated</h3>
            <p className="text-sm text-gray-900">
              Review your listing monthly to ensure contact information,
              services, and pricing are current.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-gray-900 mb-2">
              Use High-Quality Images
            </h3>
            <p className="text-sm text-gray-900">
              Professional photos make your listing stand out. Follow our image
              guidelines for best results.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-gray-900 mb-2">
              Write Clear Descriptions
            </h3>
            <p className="text-sm text-gray-900">
              Be specific about your services, experience, and what makes your
              business unique.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-gray-900 mb-2">Add Social Proof</h3>
            <p className="text-sm text-gray-900">
              Link to your social media profiles to show your active presence
              and credibility.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-gray-900 mb-2">
              Optimize for Search
            </h3>
            <p className="text-sm text-gray-900">
              Use relevant keywords naturally in your description to help
              families find you.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-gray-900 mb-2">Be Professional</h3>
            <p className="text-sm text-gray-900">
              Maintain a professional tone. Remember, parents are looking for
              trustworthy services.
            </p>
          </div>
        </div>
      </div>

      {/* Common Questions */}
      <div className="mb-12">
        <h2 className="bauhaus-heading text-3xl font-bold text-paper mb-6">
          Common Questions
        </h2>
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-bold text-gray-900 mb-2">
              How long does approval take?
            </h3>
            <p className="text-gray-900 text-sm">
              Most edits are reviewed and approved within 24-48 hours. You'll
              receive an email notification once your changes go live.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-bold text-gray-900 mb-2">
              Can I edit my listing multiple times?
            </h3>
            <p className="text-gray-900 text-sm">
              Yes! You can edit your listing as many times as needed. Each edit
              will go through the approval process.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-bold text-gray-900 mb-2">
              What if my edits are rejected?
            </h3>
            <p className="text-gray-900 text-sm">
              If edits are rejected, you'll receive an email explaining why and
              what needs to be changed. You can then make adjustments and
              resubmit.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-bold text-gray-900 mb-2">
              Can I preview my changes before they go live?
            </h3>
            <p className="text-gray-900 text-sm">
              Currently, previews aren't available. Your current listing remains
              visible until edits are approved. We recommend double-checking all
              information before submitting.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-bold text-gray-900 mb-2">
              How do I upgrade my plan to add more features?
            </h3>
            <p className="text-gray-900 text-sm mb-2">
              You can upgrade anytime from your dashboard. Changes take effect
              immediately, and you'll have access to all premium features.
            </p>
            <Link
              href="/help/pricing-plans"
              className="text-brand-blue hover:text-brand-blue/80 underline text-sm"
            >
              Compare plans →
            </Link>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-brand-blue to-brand-navy text-white rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-3">
          Ready to Update Your Listing?
        </h2>
        <p className="text-lg mb-6 opacity-90">
          Keep your business information current and make the most of your
          listing.
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-white text-brand-blue font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>

      {/* Related Articles */}
      <div className="mt-12">
        <h3 className="bauhaus-heading text-xl font-bold text-paper mb-4">
          Related Articles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/help/image-guidelines"
            className="border border-gray-200 rounded-lg p-4 hover:border-brand-blue transition-colors"
          >
            <h4 className="font-semibold text-gray-900 mb-2">
              Image Guidelines
            </h4>
            <p className="text-sm text-gray-900">
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
            <p className="text-sm text-gray-900">
              Compare plans and unlock premium features
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
