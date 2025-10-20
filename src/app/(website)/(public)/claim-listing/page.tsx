import Container from "@/components/container";
import { HeaderSection } from "@/components/shared/header-section";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Shield, Users } from "lucide-react";

export const metadata = {
  title: "Claim Your Listing - Child Actor 101 Directory",
  description:
    "Learn how to claim and manage your business listing in our directory",
};

export default function ClaimListingPage() {
  return (
    <div className="mb-16">
      <div className="mt-8">
        <div className="w-full flex flex-col items-center justify-center gap-8">
          <HeaderSection
            labelAs="h1"
            label="Claim Your Listing"
            titleAs="h2"
            title="Take control of your business listing"
            subtitle="Claim your listing to manage your information, respond to reviews, and showcase your services to families."
          />
        </div>
      </div>

      <Container className="mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* How it works */}
          <div className="bg-surface rounded-lg p-6 shadow-lg">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#1E1F23] flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5" />
                How It Works
              </h3>
              <p className="text-[#1E1F23]/70">
                Simple steps to claim your listing
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
                <Badge
                  variant="outline"
                  className="w-8 h-8 rounded-full flex items-center justify-center p-0"
                >
                  1
                </Badge>
                <div>
                  <h4 className="font-medium text-[#1E1F23]">Find Your Listing</h4>
                  <p className="text-sm text-[#1E1F23]">
                    Search our directory to find your business listing
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Badge
                  variant="outline"
                  className="w-8 h-8 rounded-full flex items-center justify-center p-0"
                >
                  2
                </Badge>
                <div>
                  <h4 className="font-medium text-[#1E1F23]">Click "Claim This Listing"</h4>
                  <p className="text-sm text-[#1E1F23]">
                    On your listing page, click the claim button
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Badge
                  variant="outline"
                  className="w-8 h-8 rounded-full flex items-center justify-center p-0"
                >
                  3
                </Badge>
                <div>
                  <h4 className="font-medium text-[#1E1F23]">Submit Your Claim</h4>
                  <p className="text-sm text-[#1E1F23]">
                    Provide proof of ownership and business details
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Badge
                  variant="outline"
                  className="w-8 h-8 rounded-full flex items-center justify-center p-0"
                >
                  4
                </Badge>
                <div>
                  <h4 className="font-medium text-[#1E1F23]">Get Approved</h4>
                  <p className="text-sm text-[#1E1F23]">
                    Our team reviews and approves your claim
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-bauhaus-blue rounded-lg p-6 shadow-lg">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#1E1F23] flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5" />
                Benefits of Claiming
              </h3>
              <p className="text-[#1E1F23]/70">
                What you get when you claim your listing
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
                <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-[#1E1F23]">Full Control</h4>
                  <p className="text-sm text-[#1E1F23]">
                    Update your business information, photos, and services
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-[#1E1F23]">Respond to Reviews</h4>
                  <p className="text-sm text-[#1E1F23]">
                    Engage with families and build your reputation
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-brand-blue mt-0.5" />
                <div>
                  <h4 className="font-medium text-[#1E1F23]">Verified Badge</h4>
                  <p className="text-sm text-[#1E1F23]">
                    Show families that you're a verified business owner
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-bauhaus-orange rounded-lg p-6 shadow-lg mt-8">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-[#1E1F23] mb-2">Requirements</h3>
            <p className="text-[#1E1F23]/70">
              What you need to claim your listing
            </p>
          </div>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-[#1E1F23] mb-2">Business Information</h4>
                <ul className="text-sm text-[#1E1F23] space-y-1">
                  <li>• Valid business license or permit</li>
                  <li>• Proof of business ownership</li>
                  <li>• Current contact information</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-[#1E1F23] mb-2">Account Requirements</h4>
                <ul className="text-sm text-[#1E1F23] space-y-1">
                  <li>• Free account registration</li>
                  <li>• Email verification</li>
                  <li>• Business email address</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <h3 className="text-2xl font-bold text-paper mb-4">
            Ready to Claim Your Listing?
          </h3>
          <p className="text-paper mb-6">
            Search our directory to find your business and start the claim
            process
          </p>
          <a
            href="/directory"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-bauhaus-mustard text-[#1E1F23] hover:bg-bauhaus-mustard/90 h-10 px-4 py-2"
          >
            Browse Directory
          </a>
        </div>
      </Container>
    </div>
  );
}
