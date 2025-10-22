import {
  Award,
  ClipboardCheckIcon,
  CreditCardIcon,
  EditIcon,
  HelpCircleIcon,
  ImageIcon,
  MailIcon,
  RocketIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Help Center | Child Actor 101 Directory",
  description:
    "Find answers and guides to help you get the most out of your Child Actor 101 Directory listing",
};

const helpTopics = [
  {
    title: "Image Guidelines",
    description:
      "Learn the best image sizes, formats, and practices for your profile and gallery images",
    icon: ImageIcon,
    href: "/help/image-guidelines",
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Getting Started",
    description:
      "New to the directory? Learn how to create and optimize your listing",
    icon: RocketIcon,
    href: "/help/getting-started",
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Claim Your Listing",
    description:
      "Already listed? Learn how to claim and take control of your existing listing",
    icon: ClipboardCheckIcon,
    href: "/help/claim-listing",
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Pricing & Plans",
    description:
      "Understand our pricing tiers and choose the right plan for your business",
    icon: CreditCardIcon,
    href: "/help/pricing-plans",
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    title: "Editing Your Listing",
    description:
      "Step-by-step guide to updating your profile, images, and business information",
    icon: EditIcon,
    href: "/help/editing-listing",
    color: "bg-pink-100 text-pink-600",
  },
  {
    title: "Frequently Asked Questions",
    description:
      "Quick answers to common questions about the directory and your listing",
    icon: HelpCircleIcon,
    href: "/help/faq",
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    title: "101 Approved Badge",
    description:
      "Learn how to qualify for our highest mark of trust for verified professionals",
    icon: Award,
    href: "/help/101-approved",
    color: "bg-orange-100 text-orange-600",
  },
];

export default function HelpCenterPage() {
  return (
    <div className="container max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Help Center</h1>
        <p className="text-xl text-gray-900 max-w-2xl mx-auto">
          Everything you need to know about creating and managing your listing
          on Child Actor 101 Directory
        </p>
      </div>

      {/* Help Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {helpTopics.map((topic) => (
          <Link
            key={topic.href}
            href={topic.href}
            className="group bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-brand-blue hover:shadow-lg transition-all duration-200"
          >
            <div
              className={`inline-flex p-3 rounded-lg ${topic.color} mb-4 group-hover:scale-110 transition-transform duration-200`}
            >
              <topic.icon className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-blue transition-colors">
              {topic.title}
            </h2>
            <p className="text-gray-900 text-sm">{topic.description}</p>
          </Link>
        ))}
      </div>

      {/* Contact Support Section */}
      <div className="bg-gradient-to-r from-brand-blue to-brand-navy text-white rounded-lg p-8 text-center">
        <div className="inline-flex p-4 bg-white/10 rounded-full mb-4">
          <MailIcon className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Still Need Help?</h2>
        <p className="text-lg mb-6 opacity-90">
          Can't find what you're looking for? Our support team is here to help.
        </p>
       <a
  href="mailto:hello@childactor101.com"
  class="inline-block bg-white text-black font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
>
  Contact Support
</a>

      </div>

      {/* Quick Links */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          Quick Links
        </h3>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/submit"
            className="text-brand-blue hover:text-brand-blue/80 underline"
          >
            Submit New Listing
          </Link>
          <span className="text-gray-900">•</span>
          <Link
            href="/claim-listing"
            className="text-brand-blue hover:text-brand-blue/80 underline"
          >
            Claim Existing Listing
          </Link>
          <span className="text-gray-900">•</span>
          <Link
            href="/pricing"
            className="text-brand-blue hover:text-brand-blue/80 underline"
          >
            View Pricing
          </Link>
          <span className="text-gray-900">•</span>
          <Link
            href="/dashboard"
            className="text-brand-blue hover:text-brand-blue/80 underline"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
