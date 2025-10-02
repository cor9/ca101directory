import Container from "@/components/container";
import { HeaderSection } from "@/components/shared/header-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Clock, Shield, Star, Users } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Claim & Upgrade Your Listing - Child Actor 101 Directory",
  description:
    "Claim your business listing and upgrade to a paid plan for full control",
};

export default function ClaimUpgradePage() {
  return (
    <div className="mb-16">
      <div className="mt-8">
        <div className="w-full flex flex-col items-center justify-center gap-8">
          <HeaderSection
            labelAs="h1"
            label="Claim & Upgrade"
            titleAs="h2"
            title="Take control of your business listing"
            subtitle="Claim your listing and upgrade to a paid plan for full editing control, review management, and premium features."
          />
        </div>
      </div>

      <Container className="mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* How it works */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                How It Works
              </CardTitle>
              <CardDescription>
                Simple steps to claim and upgrade your listing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Badge
                  variant="outline"
                  className="w-8 h-8 rounded-full flex items-center justify-center p-0"
                >
                  1
                </Badge>
                <div>
                  <h4 className="font-medium">Find Your Listing</h4>
                  <p className="text-sm text-muted-foreground">
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
                  <h4 className="font-medium">Click "Claim This Listing"</h4>
                  <p className="text-sm text-muted-foreground">
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
                  <h4 className="font-medium">Choose Your Plan</h4>
                  <p className="text-sm text-muted-foreground">
                    Select Standard or Pro plan and complete payment
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
                  <h4 className="font-medium">Get Approved</h4>
                  <p className="text-sm text-muted-foreground">
                    Our team reviews and approves your claim
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Benefits of Upgrading
              </CardTitle>
              <CardDescription>
                What you get when you claim and upgrade your listing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Full Control</h4>
                  <p className="text-sm text-muted-foreground">
                    Update your business information, photos, and services
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Respond to Reviews</h4>
                  <p className="text-sm text-muted-foreground">
                    Engage with families and build your reputation
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Star className="h-5 w-5 text-brand-blue mt-0.5" />
                <div>
                  <h4 className="font-medium">Premium Features</h4>
                  <p className="text-sm text-muted-foreground">
                    Featured placement, analytics, and priority support
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Plan Comparison */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Choose Your Plan</CardTitle>
            <CardDescription>
              Both plans include full listing control and review management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">Standard</h3>
                <div className="text-3xl font-bold mb-4">
                  $25
                  <span className="text-lg text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-2 text-sm mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Full listing control
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Edit business information
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Upload photos & logo
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Respond to reviews
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Basic analytics
                  </li>
                </ul>
              </div>
              <div className="border rounded-lg p-6 border-primary">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold">Pro</h3>
                  <Badge className="bg-primary text-primary-foreground">
                    <Star className="w-3 h-3 mr-1" />
                    Popular
                  </Badge>
                </div>
                <div className="text-3xl font-bold mb-4">
                  $50
                  <span className="text-lg text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-2 text-sm mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Everything in Standard
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Featured placement
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Priority support
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Advanced analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    101 Approved Badge
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center mt-8">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Claim Your Listing?
          </h3>
          <p className="text-muted-foreground mb-6">
            Search our directory to find your business and start the claim
            process
          </p>
          <Button asChild size="lg">
            <Link href="/directory">Browse Directory</Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
