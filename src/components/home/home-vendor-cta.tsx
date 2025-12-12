import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircleIcon,
  EyeIcon,
  StarIcon,
  TrendingUpIcon,
} from "lucide-react";
import Link from "next/link";

export default function HomeVendorCta() {
  return (
    <section className="py-16 bg-gradient-to-r from-accent-blue/5 via-accent-salmon/5 to-accent-lemon/5">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-secondary mb-4">
            Ready to List Your Business?
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Join our trusted directory of child actor professionals. Get
            discovered by families looking for quality services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardHeader>
              <EyeIcon className="h-8 w-8 text-accent-blue mx-auto mb-2" />
              <CardTitle className="text-lg">Get Discovered</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary">
                Reach thousands of families actively searching for quality
                professionals.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CheckCircleIcon className="h-8 w-8 text-accent-salmon mx-auto mb-2" />
              <CardTitle className="text-lg">Build Trust</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary">
                Showcase your credentials and get verified by our team.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <TrendingUpIcon className="h-8 w-8 text-accent-lemon mx-auto mb-2" />
              <CardTitle className="text-lg">Grow Your Business</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary">
                Access premium features and analytics to expand your reach.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button size="lg" asChild className="mr-4">
            <Link href="/submit">Submit Your Listing</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/pricing">View Pricing Plans</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
