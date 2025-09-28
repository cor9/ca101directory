import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircleIcon, MailIcon, ShieldIcon, AlertCircleIcon } from "lucide-react";
import { claimListing } from "@/actions/claim-listing";

interface ClaimListingPageProps {
  params: { slug: string };
}

export default async function ClaimListingPage({ params }: ClaimListingPageProps) {
  const listingSlug = params.slug;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center w-16 h-16 bg-brand-blue/10 rounded-full mx-auto mb-4">
          <ShieldIcon className="w-8 h-8 text-brand-blue" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Claim Your Listing
        </h1>
        <p className="text-muted-foreground">
          Verify ownership and gain control of your listing
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MailIcon className="w-5 h-5 text-brand-blue" />
            Email Verification Required
          </CardTitle>
          <CardDescription>
            We'll send a verification link to confirm you own this listing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={claimListing} className="space-y-6">
            <input type="hidden" name="listingSlug" value={listingSlug} />
            
            <div className="space-y-2">
              <Label htmlFor="email">Your Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                required
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                This should match the email associated with your business
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                name="businessName"
                placeholder="Your Business Name"
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="verificationMessage">Verification Message (Optional)</Label>
              <Textarea
                id="verificationMessage"
                name="verificationMessage"
                placeholder="Tell us why you should own this listing..."
                rows={3}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Help us verify your ownership with additional details
              </p>
            </div>

            <Alert>
              <AlertCircleIcon className="h-4 w-4" />
              <AlertDescription>
                <strong>What happens next?</strong>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• We'll send a verification email to your address</li>
                  <li>• Click the link in the email to confirm ownership</li>
                  <li>• Once verified, you'll get full control of your listing</li>
                  <li>• You can then edit details and upgrade to paid plans</li>
                </ul>
              </AlertDescription>
            </Alert>

            <Button type="submit" className="w-full bg-brand-orange hover:bg-brand-orange-dark">
              <MailIcon className="w-4 h-4 mr-2" />
              Send Verification Email
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Benefits of Claiming Your Listing
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-4 bg-brand-blue/5 rounded-lg">
            <CheckCircleIcon className="w-8 h-8 text-brand-blue mb-2" />
            <h4 className="font-semibold text-brand-blue">Full Control</h4>
            <p className="text-sm text-muted-foreground text-center">
              Edit your listing details, contact info, and description
            </p>
          </div>
          <div className="flex flex-col items-center p-4 bg-brand-orange/5 rounded-lg">
            <CheckCircleIcon className="w-8 h-8 text-brand-orange mb-2" />
            <h4 className="font-semibold text-brand-orange">Upgrade Options</h4>
            <p className="text-sm text-muted-foreground text-center">
              Access to Pro and Premium plans for better visibility
            </p>
          </div>
          <div className="flex flex-col items-center p-4 bg-brand-blue/5 rounded-lg">
            <CheckCircleIcon className="w-8 h-8 text-brand-blue mb-2" />
            <h4 className="font-semibold text-brand-blue">Analytics</h4>
            <p className="text-sm text-muted-foreground text-center">
              Track views, clicks, and performance metrics
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
