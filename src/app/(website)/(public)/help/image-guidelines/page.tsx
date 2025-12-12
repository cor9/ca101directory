import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Image Guidelines | Child Actor 101 Directory",
  description:
    "Professional image upload guidelines for your Pro listing on Child Actor 101 Directory",
};

export default function ImageGuidelinesPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-[#1E1F23] hover:text-[#1E1F23]/80 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold text-paper mb-2 border-b-4 border-brand-blue pb-4">
          Image Guidelines for Your Pro Listing
        </h1>

        {/* Profile Image Section */}
        <div className="bg-surface border-l-4 border-brand-blue rounded-lg p-8 my-8">
          <h2 className="text-2xl font-bold text-brand-navy mt-0">
            Profile Image (Your Logo/Main Photo)
          </h2>
          <p className="text-[#1E1F23]">
            <strong>What it is:</strong> The primary image that represents your
            business - typically your logo or main branded photo.
          </p>

          <div className="bg-surface rounded-lg p-6 shadow-lg my-6 shadow-sm">
            <h3 className="text-xl font-semibold text-[#1E1F23] mt-0">
              Specifications:
            </h3>
            <ul className="space-y-2 text-[#1E1F23] leading-relaxed">
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

          <div className="bg-bauhaus-mustard/20  rounded-lg p-6 my-6">
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
        <div className="bg-surface border-l-4 border-brand-blue rounded-lg p-8 my-8">
          <h2 className="text-2xl font-bold text-brand-navy mt-0">
            Gallery Images (Your Photo Gallery)
          </h2>
          <p className="text-[#1E1F23]">
            <strong>What it is:</strong> Up to 12 gallery images showcasing your
            business, facility, team, or work samples. Pro plan also includes
            YouTube/Vimeo embed.
          </p>

          <div className="bg-bauhaus-blue rounded-lg p-6 shadow-lg my-6 shadow-sm">
            <h3 className="text-xl font-semibold text-[#1E1F23] mt-0">
              Specifications:
            </h3>
            <ul className="space-y-2 text-[#1E1F23] leading-relaxed">
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

          <div className="bg-bauhaus-mustard/20  rounded-lg p-6 my-6">
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
        <div className="bg-bauhaus-mustard/20  rounded-lg p-8 my-8">
          <h2 className="text-2xl font-bold text-green-900 mt-0">
            Quick Checklist Before Uploading:
          </h2>
          <ul className="space-y-3 list-none pl-0">
            <li className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <span>Images are clear and professional quality</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <span>
                Profile image is square (or will be cropped to square)
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <span>
                Gallery images are landscape orientation for best display
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <span>Each file is under 5MB</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <span>Files are JPEG, PNG, or WebP format</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <span>Images represent your business accurately</span>
            </li>
          </ul>
        </div>

        {/* Help Section */}
        <div className="bg-bauhaus-blue/20 border-0 rounded-lg p-6 my-8">
          <p className="text-[#1E1F23] m-0">
            <strong>Need help?</strong> If your images are too large, use a free
            compression tool like{" "}
            <a
              href="https://tinypng.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1E1F23] hover:text-[#1E1F23]/80 underline"
            >
              TinyPNG
            </a>{" "}
            or{" "}
            <a
              href="https://squoosh.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1E1F23] hover:text-[#1E1F23]/80 underline"
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
            className="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-blue/90 text-[#1E1F23] font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
