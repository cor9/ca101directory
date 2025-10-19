import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Shield,
  Star,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "101 Approved Badge | Child Actor 101 Directory Help",
  description:
    "Learn how to qualify for the 101 Approved badge—our official mark of trust for vetted child-acting professionals.",
};

export default function Help101ApprovedPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <Link
        href="/help"
        className="inline-flex items-center gap-2 text-brand-blue hover:text-brand-blue/80 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Help Center
      </Link>

      {/* Badge Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Image
              src="/101approvedbadge.png"
              alt="101 Approved Badge"
              width={160}
              height={160}
              className="rounded-full shadow-lg"
            />
          </div>
        </div>
        <h1 className="bauhaus-heading text-4xl font-bold text-paper mb-4">
          🎖️ 101 Approved Badge
        </h1>
        <p className="bauhaus-body text-xl text-paper">
          The highest mark of trust for verified professionals serving child and
          teen actors
        </p>
      </div>

      {/* What is the 101 Approved Badge */}
      <div className="bg-blue-50 border-l-4 border-brand-blue rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-ink mb-4 flex items-center gap-2">
          <Award className="w-6 h-6 text-brand-blue" />
          What is the 101 Approved Badge?
        </h2>
        <p className="text-ink mb-4">
          The 101 Approved Badge is our official verification mark for
          professionals who have demonstrated exceptional standards in serving
          child and teen actors. It represents our highest level of trust and
          quality assurance.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-bold text-ink mb-1">Verified Quality</h3>
            <p className="text-sm text-ink">
              Thoroughly vetted professionals with proven track records
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-bold text-ink mb-1">Parent Trust</h3>
            <p className="text-sm text-ink">
              Testimonials from families who have worked with you
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <h3 className="font-bold text-ink mb-1">
              Industry Recognition
            </h3>
            <p className="text-sm text-ink">
              References from peers and industry professionals
            </p>
          </div>
        </div>
      </div>

      {/* Qualification Requirements */}
      <div className="mb-12">
        <h2 className="bauhaus-heading text-3xl font-bold text-paper mb-6">
          How to Qualify for the 101 Approved Badge
        </h2>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-ink mb-3">
                  Active Pro Listing Required
                </h3>
                <p className="text-ink mb-4">
                  You must have an active Pro ($50/month) listing on the Child
                  Actor 101 Directory. Free and Standard plans are not eligible.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-ink">
                    <strong>Note:</strong> Your listing must be live and in good
                    standing for at least 30 days before applying.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-ink mb-3">
                  Parent Testimonials
                </h3>
                <p className="text-ink mb-4">
                  Provide at least 3 testimonials from families who have worked
                  with you or your business. These should demonstrate your
                  professionalism, expertise, and positive impact on young
                  performers.
                </p>
                <ul className="space-y-2 text-sm text-ink">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>
                      Testimonials should include parent/guardian name and
                      contact info
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>
                      Include specific examples of your work and results
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>
                      Upload as PDF or images (screenshots of emails/texts are
                      acceptable)
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-ink mb-3">
                  Industry References
                </h3>
                <p className="text-ink mb-4">
                  Submit references from at least 2 industry professionals who
                  can vouch for your work and character. These should be peers,
                  colleagues, or industry contacts who have direct knowledge of
                  your professional capabilities.
                </p>
                <ul className="space-y-2 text-sm text-ink">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>
                      References should include name, title, company, and
                      contact info
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>
                      Preferably from casting directors, agents, managers, or
                      other coaches
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>
                      Should speak to your professionalism and expertise
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-ink mb-3">
                  Optional Credentials
                </h3>
                <p className="text-ink mb-4">
                  While not required, relevant certifications, degrees, or
                  professional credentials can strengthen your application and
                  demonstrate your commitment to ongoing education and
                  professional development.
                </p>
                <ul className="space-y-2 text-sm text-ink">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Acting coaching certifications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Photography or videography credentials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Child development or psychology education</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Industry association memberships</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Process */}
      <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-ink mb-4">
          Application Process
        </h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-ink">
                Complete Application Form
              </p>
              <p className="text-sm text-ink">
                Fill out the detailed application with all required information
                and uploads
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-ink">Save as Draft</p>
              <p className="text-sm text-ink">
                You can save your progress and return to complete the
                application later
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-ink">Submit for Review</p>
              <p className="text-sm text-ink">
                Our team will review your application within 5-7 business days
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-ink">Receive Decision</p>
              <p className="text-sm text-ink">
                You'll be notified of approval, rejection, or if additional
                information is needed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Child Actor 101 Code of Ethics */}
      <div className="mb-12">
        <h2 className="bauhaus-heading text-3xl font-bold text-paper mb-6">
          🧡 Child Actor 101 Code of Ethics
        </h2>
        <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
          <p className="text-ink mb-6">
            All vendors listed on Child Actor 101 — and especially those
            carrying the 101 Approved badge — agree to uphold the following
            principles in their work with minors and families:
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-ink mb-3">
                1. Safety First
              </h3>
              <ul className="space-y-2 text-ink">
                <li className="flex items-start gap-2">
                  <span className="text-brand-blue mt-1">•</span>
                  <span>
                    Provide a physically and emotionally safe environment for
                    all minors
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-blue mt-1">•</span>
                  <span>
                    Never engage in, condone, or ignore harassment,
                    exploitation, or inappropriate conduct
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-blue mt-1">•</span>
                  <span>
                    Maintain proper supervision and compliance with
                    child-protection laws and regulations
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-ink mb-3">
                2. Professional Integrity
              </h3>
              <ul className="space-y-2 text-ink">
                <li className="flex items-start gap-2">
                  <span className="text-brand-blue mt-1">•</span>
                  <span>
                    Represent services, pricing, and qualifications truthfully
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-blue mt-1">•</span>
                  <span>
                    Honor commitments, respect confidentiality, and conduct
                    business transparently
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-blue mt-1">•</span>
                  <span>
                    Avoid conflicts of interest or misleading claims about
                    industry access or guarantees
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-ink mb-3">
                3. Respect for Minors and Families
              </h3>
              <ul className="space-y-2 text-ink">
                <li className="flex items-start gap-2">
                  <span className="text-brand-blue mt-1">•</span>
                  <span>
                    Treat every young performer with dignity, empathy, and
                    patience
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-blue mt-1">•</span>
                  <span>
                    Communicate clearly and respectfully with parents or
                    guardians at every step
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-blue mt-1">•</span>
                  <span>
                    Protect children's boundaries—physical, emotional, and
                    digital
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-ink mb-3">
                4. Inclusivity & Representation
              </h3>
              <ul className="space-y-2 text-ink">
                <li className="flex items-start gap-2">
                  <span className="text-brand-blue mt-1">•</span>
                  <span>
                    Welcome families of all backgrounds, abilities, and
                    identities
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-blue mt-1">•</span>
                  <span>
                    Avoid discrimination in casting, training, or professional
                    treatment
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-blue mt-1">•</span>
                  <span>
                    Encourage diverse representation in media and education
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-ink mb-3">
                5. Accountability & Compliance
              </h3>
              <ul className="space-y-2 text-ink">
                <li className="flex items-start gap-2">
                  <span className="text-brand-blue mt-1">•</span>
                  <span>
                    Adhere to local and state performer-permit and child-labor
                    laws
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-blue mt-1">•</span>
                  <span>
                    Maintain all necessary business licenses, bonds, and
                    insurance
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-blue mt-1">•</span>
                  <span>
                    Cooperate fully with CA101 admin reviews or investigations
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-ink mb-3">
                6. Continuous Growth
              </h3>
              <ul className="space-y-2 text-ink">
                <li className="flex items-start gap-2">
                  <span className="text-brand-blue mt-1">•</span>
                  <span>
                    Commit to professional development, current industry
                    standards, and constructive feedback
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-blue mt-1">•</span>
                  <span>
                    Encourage ethical collaboration and mentorship within the
                    youth-acting community
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="mb-12">
        <h2 className="bauhaus-heading text-3xl font-bold text-paper mb-6">
          Benefits of the 101 Approved Badge
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-ink mb-3">
              Enhanced Trust
            </h3>
            <p className="text-ink">
              The badge signals to families that you've been thoroughly vetted
              and meet our highest standards for working with young performers.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-ink mb-3">
              Priority Placement
            </h3>
            <p className="text-ink">
              101 Approved listings appear first in search results and are
              highlighted throughout the directory.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-ink mb-3">
              Marketing Support
            </h3>
            <p className="text-ink">
              Use the badge in your marketing materials to demonstrate your
              verified status and commitment to excellence.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-ink mb-3">
              Community Access
            </h3>
            <p className="text-ink">
              Join our exclusive network of verified professionals and access
              special events, resources, and networking opportunities.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-brand-blue to-brand-navy text-white rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-3">Ready to Apply?</h2>
        <p className="text-lg mb-6 opacity-90">
          Join the elite group of 101 Approved professionals and demonstrate
          your commitment to excellence in serving young performers.
        </p>
        <Link
          href="/dashboard/vendor/badge-application"
          className="inline-block bg-white text-brand-blue font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Start Your Application
        </Link>
      </div>

      {/* Related Articles */}
      <div className="mt-12">
        <h3 className="bauhaus-heading text-xl font-bold text-paper mb-4">
          Related Articles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/help/pricing-plans"
            className="bauhaus-card bg-surface border border-secondary-denim/20 rounded-lg p-4 hover:border-bauhaus-blue transition-colors"
          >
            <h4 className="font-semibold text-ink mb-2">
              Pricing & Plans
            </h4>
            <p className="bauhaus-body text-sm text-surface">
              Upgrade to Pro to become eligible for the 101 Approved badge
            </p>
          </Link>
          <Link
            href="/help/getting-started"
            className="bauhaus-card bg-surface border border-secondary-denim/20 rounded-lg p-4 hover:border-bauhaus-blue transition-colors"
          >
            <h4 className="font-semibold text-ink mb-2">
              Getting Started
            </h4>
            <p className="bauhaus-body text-sm text-surface">
              Learn how to create your first listing and begin your journey
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
