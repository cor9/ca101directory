import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Image Guidelines | Child Actor 101 Directory",
  description: "Professional image upload guidelines for your Pro listing on Child Actor 101 Directory",
};

export default function ImageGuidelinesPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-brand-blue hover:text-brand-blue/80 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 border-b-4 border-brand-blue pb-4">
          Image Guidelines for Your Pro Listing
        </h1>

        {/* Profile Image Section */}
        <div className="bg-gray-50 border-l-4 border-brand-blue rounded-lg p-8 my-8">
          <h2 className="text-2xl font-bold text-brand-navy mt-0">
            Profile Image (Your Logo/Main Photo)
          </h2>
          <p className="text-gray-900">
            <strong>What it is:</strong> The primary image that represents your
            business - typically your logo or main branded photo.
          </p>

          <div className="bg-white rounded-lg p-6 my-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mt-0">
              Specifications:
            </h3>
            <ul className="space-y-2 text-gray-900 leading-relaxed">
              <li>
                <strong>Recommended size:</strong> 400px × 400px (square)
              </li>
              <li>
                <strong>Minimum size:</strong> 200px × 200px
              </li>
              <li>
                <strong>Maximum file size:</strong> 5MB
              </li>
              <li>
                <strong>Format:</strong> JPEG, PNG, or WebP
              </li>
              <li>
                <strong>Best practice:</strong> Use a square image with your
                logo centered for best results
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-6 my-6">
            <p className="m-0">
              <strong className="text-yellow-700">Pro tip:</strong> Keep file
              sizes under 200KB for faster page loading - this helps with SEO
              and user experience.
            </p>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-12 border-t-2 border-gray-200" />

        {/* Gallery Images Section */}
        <div className="bg-gray-50 border-l-4 border-brand-blue rounded-lg p-8 my-8">
          <h2 className="text-2xl font-bold text-brand-navy mt-0">
            Gallery Images (Your Photo Gallery)
          </h2>
          <p className="text-gray-900">
            <strong>What it is:</strong> Up to 4 additional images showcasing
            your business, facility, team, or work samples.
          </p>

          <div className="bg-white rounded-lg p-6 my-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mt-0">
              Specifications:
            </h3>
            <ul className="space-y-2 text-gray-900 leading-relaxed">
              <li>
                <strong>Recommended size:</strong> 1200px wide × 800px tall
                (landscape orientation works best)
              </li>
              <li>
                <strong>Minimum size:</strong> 800px wide
              </li>
              <li>
                <strong>Maximum file size:</strong> 5MB per image
              </li>
              <li>
                <strong>Format:</strong> JPEG, PNG, or WebP
              </li>
              <li>
                <strong>Quantity:</strong> Up to 4 images (included with your
                Pro plan)
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-6 my-6">
            <p className="m-0">
              <strong className="text-yellow-700">Pro tip:</strong> Use
              high-quality, professional photos that showcase what makes your
              business special. Images display in a 2-column grid on desktop and
              single column on mobile.
            </p>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-12 border-t-2 border-gray-200" />

        {/* Quick Checklist */}
       <div className="rounded-xl bg-[#e6f3ff] border border-blue-200 p-6 shadow-sm">
  <h3 className="text-lg font-semibold text-blue-900 mb-3">
    Quick Checklist Before Uploading:
  </h3>
  <ul className="space-y-2 text-blue-900">
    <li>✅ Images are clear and professional quality</li>
    <li>✅ Profile image is square (or will be cropped to square)</li>
    <li>✅ Gallery images are landscape orientation for best display</li>
    <li>✅ Each file is under 5MB</li>
    <li>✅ Files are JPEG, PNG, or WebP format</li>
    <li>✅ Images represent your business accurately</li>
  </ul>
</div>

        {/* Help Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
          <p className="text-paper m-0">
            <strong>Need help?</strong> If your images are too large, use a free
            compression tool like{" "}
            <a
              href="https://tinypng.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-brand-blue/80 underline"
            >
              TinyPNG
            </a>{" "}
            or{" "}
            <a
              href="https://squoosh.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-blue hover:text-brand-blue/80 underline"
            >
              Squoosh
            </a>{" "}
            to reduce file size while maintaining quality.
          </p>
        </div>

        {/* Back to Dashboard Button */}
        <div className="mt-12 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-brand-blue hover:text-white/90 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

